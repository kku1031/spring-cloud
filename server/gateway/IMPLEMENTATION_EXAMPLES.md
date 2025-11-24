# Gateway WebFlux 구현 예시 코드

## 📁 파일 구조

```
server/gateway/src/main/java/site/aiion/api/gateway/
├── GatewayApplication.java
├── config/
│   ├── CorsConfig.java (이미 있음)
│   ├── RedisReactiveConfig.java (새로 추가)
│   └── GatewayConfig.java (새로 추가)
├── filter/
│   ├── ReactiveAuthFilter.java (새로 추가)
│   ├── ReactiveRateLimitFilter.java (새로 추가)
│   └── ReactiveLoggingFilter.java (새로 추가)
└── exception/
    └── ReactiveExceptionHandler.java (새로 추가)
```

---

## 1. Redis Reactive 설정

### RedisReactiveConfig.java
```java
package site.aiion.api.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis Reactive 설정
 * 
 * 논블로킹 I/O를 위한 Lettuce 클라이언트 사용
 * 모든 Redis 작업이 Mono/Flux로 반환됨
 */
@Configuration
public class RedisReactiveConfig {

    @Bean
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setHostName("redis");
        factory.setPort(6379);
        // Lettuce는 기본적으로 논블로킹
        return factory;
    }

    @Bean
    public ReactiveRedisTemplate<String, Object> reactiveRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        
        RedisSerializationContext<String, Object> serializationContext = 
            RedisSerializationContext.<String, Object>newSerializationContext()
                .key(RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
                .value(RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()))
                .hashKey(RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
                .hashValue(RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()))
                .build();
        
        return new ReactiveRedisTemplate<>(factory, serializationContext);
    }
}
```

---

## 2. Gateway 필터 설정

### GatewayConfig.java
```java
package site.aiion.api.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import site.aiion.api.gateway.filter.ReactiveAuthFilter;
import site.aiion.api.gateway.filter.ReactiveRateLimitFilter;
import site.aiion.api.gateway.filter.ReactiveLoggingFilter;

/**
 * Gateway 라우팅 및 필터 설정
 * 
 * Java DSL 방식으로 라우팅 규칙 정의
 * 필터를 체이닝하여 적용
 */
@Configuration
public class GatewayConfig {

    private final ReactiveAuthFilter authFilter;
    private final ReactiveRateLimitFilter rateLimitFilter;
    private final ReactiveLoggingFilter loggingFilter;

    public GatewayConfig(
            ReactiveAuthFilter authFilter,
            ReactiveRateLimitFilter rateLimitFilter,
            ReactiveLoggingFilter loggingFilter) {
        this.authFilter = authFilter;
        this.rateLimitFilter = rateLimitFilter;
        this.loggingFilter = loggingFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // User Service
            .route("user-service", r -> r
                .path("/user/**")
                .filters(f -> f
                    .filter(loggingFilter)      // 1. 로깅
                    .filter(rateLimitFilter)     // 2. Rate Limiting
                    .filter(authFilter)          // 3. 인증
                    .stripPrefix(0))
                .uri("lb://user-service"))
            
            // Soccer Service
            .route("soccer-service", r -> r
                .path("/soccer/**")
                .filters(f -> f
                    .filter(loggingFilter)
                    .filter(rateLimitFilter)
                    .uri("lb://soccer-service"))
            
            // Diary Service
            .route("diary-service", r -> r
                .path("/diary/**")
                .filters(f -> f
                    .filter(loggingFilter)
                    .filter(rateLimitFilter)
                    .filter(authFilter)
                    .stripPrefix(1))
                .uri("lb://diary-service"))
            
            .build();
    }
}
```

---

## 3. Reactive 필터 구현

### ReactiveAuthFilter.java
```java
package site.aiion.api.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Objects;

/**
 * 인증 필터 (Reactive)
 * 
 * Redis에서 토큰을 논블로킹 방식으로 검증
 */
@Component
public class ReactiveAuthFilter extends AbstractGatewayFilterFactory<ReactiveAuthFilter.Config> 
        implements GatewayFilter, Ordered {

    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    public ReactiveAuthFilter(ReactiveRedisTemplate<String, Object> redisTemplate) {
        super(Config.class);
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // 헤더에서 토큰 추출
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return handleUnauthorized(exchange, "Missing or invalid Authorization header");
        }
        
        String token = authHeader.substring(7);
        
        // Redis에서 토큰 검증 (논블로킹)
        return redisTemplate.opsForValue()
            .get("token:" + token)
            .map(Objects::nonNull)
            .defaultIfEmpty(false)
            .flatMap(isValid -> {
                if (isValid) {
                    // 토큰이 유효하면 요청에 사용자 정보 추가
                    ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", extractUserId(token))
                        .build();
                    return chain.filter(exchange.mutate().request(modifiedRequest).build());
                } else {
                    return handleUnauthorized(exchange, "Invalid token");
                }
            })
            .onErrorResume(error -> {
                // 에러 발생 시에도 논블로킹 처리
                return handleUnauthorized(exchange, "Authentication error: " + error.getMessage());
            });
    }

    private Mono<Void> handleUnauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        
        String body = String.format("{\"error\":\"%s\"}", message);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    private String extractUserId(String token) {
        // JWT 토큰에서 사용자 ID 추출 (간단한 예시)
        // 실제로는 JWT 라이브러리 사용 권장
        return "user-id-from-token";
    }

    @Override
    public int getOrder() {
        return -100;  // 높은 우선순위
    }

    public static class Config {
        // 필터 설정 (필요시 추가)
    }
}
```

### ReactiveRateLimitFilter.java
```java
package site.aiion.api.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;

/**
 * Rate Limiting 필터 (Reactive)
 * 
 * Redis를 사용한 분산 Rate Limiting
 * 논블로킹 방식으로 처리
 */
@Component
public class ReactiveRateLimitFilter extends AbstractGatewayFilterFactory<ReactiveRateLimitFilter.Config> 
        implements GatewayFilter, Ordered {

    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    private static final int MAX_REQUESTS = 100;  // 분당 최대 요청 수
    private static final Duration TIME_WINDOW = Duration.ofMinutes(1);

    public ReactiveRateLimitFilter(ReactiveRedisTemplate<String, Object> redisTemplate) {
        super(Config.class);
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String clientId = getClientId(request);
        String key = "ratelimit:" + clientId + ":" + getCurrentMinute();

        // Redis에서 카운트 조회 및 증가 (원자적 연산)
        return redisTemplate.opsForValue()
            .increment(key)
            .flatMap(count -> {
                if (count == 1) {
                    // 첫 요청이면 TTL 설정
                    return redisTemplate.expire(key, TIME_WINDOW)
                        .then(Mono.just(count));
                }
                return Mono.just(count);
            })
            .flatMap(count -> {
                if (count > MAX_REQUESTS) {
                    return handleRateLimitExceeded(exchange);
                }
                
                // Rate limit 헤더 추가
                ServerHttpResponse response = exchange.getResponse();
                response.getHeaders().add("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS));
                response.getHeaders().add("X-RateLimit-Remaining", 
                    String.valueOf(Math.max(0, MAX_REQUESTS - count.intValue())));
                
                return chain.filter(exchange);
            })
            .onErrorResume(error -> {
                // Redis 에러 시 요청은 통과 (fail-open)
                return chain.filter(exchange);
            });
    }

    private String getClientId(ServerHttpRequest request) {
        // IP 주소 또는 사용자 ID 사용
        String ip = request.getRemoteAddress() != null 
            ? request.getRemoteAddress().getAddress().getHostAddress() 
            : "unknown";
        return ip;
    }

    private String getCurrentMinute() {
        // 현재 분 단위로 키 생성
        return String.valueOf(System.currentTimeMillis() / 60000);
    }

    private Mono<Void> handleRateLimitExceeded(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        response.getHeaders().add("Content-Type", "application/json");
        response.getHeaders().add("Retry-After", "60");
        
        String body = "{\"error\":\"Rate limit exceeded\"}";
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    @Override
    public int getOrder() {
        return -50;  // 인증 필터 다음
    }

    public static class Config {
        private int maxRequests = 100;
        private Duration timeWindow = Duration.ofMinutes(1);
        
        // getter/setter
    }
}
```

### ReactiveLoggingFilter.java
```java
package site.aiion.api.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

/**
 * 로깅 필터 (Reactive)
 * 
 * 요청/응답 로깅을 논블로킹 방식으로 처리
 */
@Component
public class ReactiveLoggingFilter extends AbstractGatewayFilterFactory<ReactiveLoggingFilter.Config> 
        implements GatewayFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        Instant startTime = Instant.now();
        
        String method = request.getMethod().toString();
        String path = request.getURI().getPath();
        String clientIp = getClientIp(request);
        
        // 요청 로깅
        logRequest(method, path, clientIp);
        
        return chain.filter(exchange)
            .doOnSuccess(v -> {
                // 성공 로깅
                Duration duration = Duration.between(startTime, Instant.now());
                logSuccess(method, path, duration.toMillis());
            })
            .doOnError(error -> {
                // 에러 로깅
                Duration duration = Duration.between(startTime, Instant.now());
                logError(method, path, error, duration.toMillis());
            });
    }

    private String getClientIp(ServerHttpRequest request) {
        String xForwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddress() != null 
            ? request.getRemoteAddress().getAddress().getHostAddress() 
            : "unknown";
    }

    private void logRequest(String method, String path, String clientIp) {
        System.out.println(String.format(
            "[REQUEST] %s %s from %s", method, path, clientIp));
    }

    private void logSuccess(String method, String path, long durationMs) {
        System.out.println(String.format(
            "[SUCCESS] %s %s completed in %dms", method, path, durationMs));
    }

    private void logError(String method, String path, Throwable error, long durationMs) {
        System.err.println(String.format(
            "[ERROR] %s %s failed in %dms: %s", 
            method, path, durationMs, error.getMessage()));
    }

    @Override
    public int getOrder() {
        return -200;  // 가장 먼저 실행
    }

    public static class Config {
        // 필터 설정
    }
}
```

---

## 4. 에러 처리

### ReactiveExceptionHandler.java
```java
package site.aiion.api.gateway.exception;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * 전역 에러 핸들러 (Reactive)
 * 
 * 모든 예외를 논블로킹 방식으로 처리
 */
@Component
@Order(-2)  // DefaultErrorWebExceptionHandler보다 우선순위 높게
public class ReactiveExceptionHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        
        HttpStatus status = determineHttpStatus(ex);
        String message = determineMessage(ex);
        
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("error", message);
        errorBody.put("status", status.value());
        errorBody.put("path", exchange.getRequest().getPath().value());
        
        String json = convertToJson(errorBody);
        DataBuffer buffer = response.bufferFactory().wrap(json.getBytes(StandardCharsets.UTF_8));
        
        return response.writeWith(Mono.just(buffer));
    }

    private HttpStatus determineHttpStatus(Throwable ex) {
        if (ex instanceof ResponseStatusException) {
            return ((ResponseStatusException) ex).getStatusCode();
        }
        // 타임아웃
        if (ex instanceof java.util.concurrent.TimeoutException) {
            return HttpStatus.REQUEST_TIMEOUT;
        }
        // 서비스 불가
        if (ex instanceof org.springframework.cloud.gateway.support.NotFoundException) {
            return HttpStatus.NOT_FOUND;
        }
        // 기본값
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private String determineMessage(Throwable ex) {
        if (ex.getMessage() != null) {
            return ex.getMessage();
        }
        return "An error occurred";
    }

    private String convertToJson(Map<String, Object> map) {
        // 간단한 JSON 변환 (실제로는 Jackson 사용 권장)
        return String.format("{\"error\":\"%s\",\"status\":%d,\"path\":\"%s\"}",
            map.get("error"), map.get("status"), map.get("path"));
    }
}
```

---

## 5. 사용 예시

### Service 클래스에서 Redis 사용
```java
@Service
public class CacheService {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    
    public CacheService(ReactiveRedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    // 논블로킹 캐시 조회
    public Mono<Object> get(String key) {
        return redisTemplate.opsForValue()
            .get(key)
            .timeout(Duration.ofSeconds(1))  // 타임아웃 설정
            .onErrorReturn(null);  // 에러 시 null 반환
    }
    
    // 논블로킹 캐시 저장
    public Mono<Boolean> set(String key, Object value, Duration timeout) {
        return redisTemplate.opsForValue()
            .set(key, value, timeout)
            .timeout(Duration.ofSeconds(1));
    }
    
    // 여러 키 조회 (Flux 사용)
    public Flux<Object> getMultiple(String... keys) {
        return Flux.fromArray(keys)
            .flatMap(key -> redisTemplate.opsForValue().get(key))
            .filter(Objects::nonNull);
    }
}
```

---

## 6. 테스트 예시

### GatewayFilterTest.java
```java
package site.aiion.api.gateway.filter;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.*;

class ReactiveAuthFilterTest {

    @Test
    void testValidToken() {
        // Given
        ReactiveAuthFilter filter = new ReactiveAuthFilter(mockRedisTemplate());
        MockServerHttpRequest request = MockServerHttpRequest.get("/user/123")
            .header("Authorization", "Bearer valid-token")
            .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        when(chain.filter(any())).thenReturn(Mono.empty());

        // When & Then
        StepVerifier.create(filter.filter(exchange, chain))
            .verifyComplete();
    }

    @Test
    void testInvalidToken() {
        // Given
        ReactiveAuthFilter filter = new ReactiveAuthFilter(mockRedisTemplate());
        MockServerHttpRequest request = MockServerHttpRequest.get("/user/123")
            .header("Authorization", "Bearer invalid-token")
            .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);

        // When & Then
        StepVerifier.create(filter.filter(exchange, chain))
            .expectError()
            .verify();
    }
}
```

---

## 📝 요약

1. **모든 작업은 Mono/Flux로 반환**
2. **블로킹 코드 절대 사용 금지**
3. **에러는 onErrorResume으로 처리**
4. **Redis는 ReactiveRedisTemplate 사용**
5. **필터는 GatewayFilter 인터페이스 구현**

이 구조로 완전한 논블로킹, 비동기 Gateway를 구축할 수 있습니다!

