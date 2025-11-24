# Gateway WebFlux 전환 전략 가이드

## 📚 목차
1. [현재 상태 분석](#현재-상태-분석)
2. [WebFlux란? (초보자용 설명)](#webflux란-초보자용-설명)
3. [전환 전략 (단계별)](#전환-전략-단계별)
4. [핵심 변경사항](#핵심-변경사항)
5. [성능 최적화](#성능-최적화)

---

## 현재 상태 분석

### ✅ 이미 완료된 것
- `spring-cloud-starter-gateway-server-webflux` 사용 중
- `web-application-type: reactive` 설정 완료
- `spring-boot-starter-data-redis-reactive` 포함
- `CorsWebFilter` (Reactive) 사용 중

### ⚠️ 개선이 필요한 부분
1. **논블로킹 I/O 보장**: 모든 외부 호출이 논블로킹인지 확인
2. **Reactive Redis 설정**: Redis 연결이 완전히 Reactive인지 확인
3. **커스텀 필터**: 추가 필터가 있다면 Reactive로 변환
4. **에러 처리**: Reactive 스트림 기반 에러 핸들링
5. **모니터링**: Reactive 메트릭 수집

---

## WebFlux란? (초보자용 설명)

### 🔄 블로킹 vs 논블로킹

#### 블로킹 방식 (기존 Servlet 방식)
```
요청 1 → [대기] → [대기] → [대기] → 응답
요청 2 → [대기] → [대기] → [대기] → 응답
요청 3 → [대기] → [대기] → [대기] → 응답

문제점: 한 요청이 끝날 때까지 스레드를 점유
       → 동시 처리량이 제한됨
```

#### 논블로킹 방식 (WebFlux)
```
요청 1 → [작업 시작] → 다른 일 처리 → [결과 받음] → 응답
요청 2 → [작업 시작] → 다른 일 처리 → [결과 받음] → 응답
요청 3 → [작업 시작] → 다른 일 처리 → [결과 받음] → 응답

장점: 스레드를 점유하지 않고 다른 요청 처리 가능
      → 동시 처리량이 크게 증가
```

### 📦 핵심 개념

#### 1. **Mono** (0 또는 1개의 결과)
```java
// 기존 방식 (블로킹)
String result = userService.getUser(id);  // 결과를 기다림

// WebFlux 방식 (논블로킹)
Mono<String> result = userService.getUser(id);  // 나중에 결과가 올 것
result.subscribe(data -> System.out.println(data));  // 결과가 오면 처리
```

#### 2. **Flux** (0개 이상의 결과 스트림)
```java
// 여러 개의 데이터를 스트림으로 받음
Flux<User> users = userService.getAllUsers();
users.subscribe(user -> System.out.println(user.getName()));
```

#### 3. **Reactive Streams**
- 데이터가 준비되면 자동으로 다음 단계로 전달
- 백프레셔(Backpressure): 처리 속도 조절
- 비동기, 논블로킹 처리

---

## 전환 전략 (단계별)

### 🎯 Phase 1: 기본 설정 확인 및 강화

#### 1.1 build.gradle 확인
```gradle
dependencies {
    // ✅ 이미 있음
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway-server-webflux'
    implementation 'org.springframework.boot:spring-starter-data-redis-reactive'
    
    // ✅ 추가 권장
    implementation 'io.projectreactor:reactor-core'  // Reactor 핵심
    implementation 'io.projectreactor.addons:reactor-extra'  // 추가 유틸리티
}
```

#### 1.2 application.yaml 최적화
```yaml
spring:
  main:
    web-application-type: reactive  # ✅ 이미 있음
    
  # Reactor 설정 (성능 최적화)
  reactor:
    debug: false  # 프로덕션에서는 false
    buffers:
      small: 256
      default: 256
```

### 🎯 Phase 2: Redis Reactive 설정

#### 2.1 Redis Reactive Configuration
```java
@Configuration
@EnableReactiveRedisRepositories
public class RedisReactiveConfig {
    
    @Bean
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setHostName("redis");
        factory.setPort(6379);
        // 논블로킹 I/O를 위한 Lettuce 사용
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

#### 2.2 Redis 사용 예시 (Reactive)
```java
@Service
public class CacheService {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    
    // 논블로킹 캐시 조회
    public Mono<Object> get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
    
    // 논블로킹 캐시 저장
    public Mono<Boolean> set(String key, Object value, Duration timeout) {
        return redisTemplate.opsForValue()
            .set(key, value, timeout);
    }
}
```

### 🎯 Phase 3: Gateway 필터 최적화

#### 3.1 커스텀 필터 (Reactive)
```java
@Component
public class ReactiveAuthFilter implements GatewayFilter, Ordered {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // 논블로킹 방식으로 토큰 검증
        return getTokenFromRequest(request)
            .flatMap(token -> validateToken(token))  // Mono 반환
            .flatMap(isValid -> {
                if (isValid) {
                    return chain.filter(exchange);  // 다음 필터로
                } else {
                    return handleUnauthorized(exchange);  // 에러 처리
                }
            })
            .onErrorResume(error -> handleError(exchange, error));  // 에러 처리
    }
    
    private Mono<String> getTokenFromRequest(ServerHttpRequest request) {
        // 헤더에서 토큰 추출 (논블로킹)
        return Mono.justOrEmpty(request.getHeaders().getFirst("Authorization"));
    }
    
    private Mono<Boolean> validateToken(String token) {
        // Redis에서 토큰 검증 (논블로킹)
        return redisTemplate.opsForValue()
            .get("token:" + token)
            .map(Objects::nonNull)
            .defaultIfEmpty(false);
    }
    
    @Override
    public int getOrder() {
        return -100;  // 필터 실행 순서
    }
}
```

#### 3.2 Rate Limiting (Reactive)
```java
@Component
public class ReactiveRateLimitFilter implements GatewayFilter {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientId = getClientId(exchange);
        String key = "ratelimit:" + clientId;
        
        // Redis에서 카운트 조회 및 증가 (원자적 연산)
        return redisTemplate.opsForValue()
            .increment(key)
            .flatMap(count -> {
                if (count == 1) {
                    // 첫 요청이면 TTL 설정
                    return redisTemplate.expire(key, Duration.ofMinutes(1))
                        .then(Mono.just(count));
                }
                return Mono.just(count);
            })
            .flatMap(count -> {
                if (count > 100) {  // 분당 100회 제한
                    return handleRateLimitExceeded(exchange);
                }
                return chain.filter(exchange);
            });
    }
}
```

### 🎯 Phase 4: 에러 처리 (Reactive)

#### 4.1 Global Error Handler
```java
@Configuration
public class ReactiveErrorConfig {
    
    @Bean
    public ErrorWebExceptionHandler errorWebExceptionHandler() {
        return new DefaultErrorWebExceptionHandler(
            new DefaultErrorAttributes(),
            new ResourceProperties(),
            new ApplicationContext(),
            new ServerCodecConfigurer() {
                // ...
            }
        ) {
            @Override
            protected RouterFunction<ServerResponse> getRoutingFunction(
                    ErrorAttributes errorAttributes) {
                return RouterFunctions.route(
                    RequestPredicates.all(),
                    this::renderErrorResponse
                );
            }
            
            private Mono<ServerResponse> renderErrorResponse(
                    ServerRequest request) {
                Map<String, Object> error = getErrorAttributes(request, 
                    ErrorAttributeOptions.defaults());
                
                return ServerResponse
                    .status(getHttpStatus(error))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(error));
            }
        };
    }
}
```

#### 4.2 커스텀 에러 처리
```java
@Component
public class ReactiveExceptionHandler {
    
    public Mono<ServerResponse> handleException(
            Throwable error, ServerWebExchange exchange) {
        
        if (error instanceof TimeoutException) {
            return ServerResponse
                .status(HttpStatus.REQUEST_TIMEOUT)
                .bodyValue(Map.of("error", "Request timeout"));
        }
        
        if (error instanceof ServiceUnavailableException) {
            return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .bodyValue(Map.of("error", "Service unavailable"));
        }
        
        return ServerResponse
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .bodyValue(Map.of("error", "Internal server error"));
    }
}
```

### 🎯 Phase 5: 모니터링 및 메트릭

#### 5.1 Reactive Metrics
```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
  endpoint:
    metrics:
      enabled: true
```

#### 5.2 커스텀 메트릭
```java
@Component
public class ReactiveMetricsFilter implements GatewayFilter {
    
    private final MeterRegistry meterRegistry;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String routeId = exchange.getAttribute(GATEWAY_ROUTE_ATTR).getId();
        Timer.Sample sample = Timer.start(meterRegistry);
        
        return chain.filter(exchange)
            .doOnSuccess(v -> {
                sample.stop(meterRegistry.timer("gateway.request.duration", 
                    "route", routeId, "status", "success"));
            })
            .doOnError(error -> {
                sample.stop(meterRegistry.timer("gateway.request.duration", 
                    "route", routeId, "status", "error"));
            });
    }
}
```

---

## 핵심 변경사항

### ✅ 반드시 지켜야 할 규칙

#### 1. **절대 블로킹 코드 사용 금지**
```java
// ❌ 나쉬운 예
public Mono<String> badExample() {
    String result = blockingService.getData();  // 블로킹!
    return Mono.just(result);
}

// ✅ 좋은 예
public Mono<String> goodExample() {
    return reactiveService.getData();  // 논블로킹
}
```

#### 2. **Mono/Flux 체이닝 사용**
```java
// ✅ 체이닝으로 연결
return getUser(id)
    .flatMap(user -> getProfile(user.getId()))
    .flatMap(profile -> saveProfile(profile))
    .onErrorResume(error -> handleError(error));
```

#### 3. **에러는 onErrorResume으로 처리**
```java
return someOperation()
    .onErrorResume(TimeoutException.class, e -> 
        Mono.just(defaultValue))
    .onErrorResume(Exception.class, e -> 
        Mono.error(new CustomException(e)));
```

### 📋 체크리스트

- [ ] 모든 외부 호출이 Mono/Flux 반환
- [ ] Redis 연결이 ReactiveRedisTemplate 사용
- [ ] 커스텀 필터가 GatewayFilter 인터페이스 구현
- [ ] 에러 처리가 onErrorResume 사용
- [ ] 블로킹 코드가 없음 (block(), toFuture() 등 사용 금지)
- [ ] 테스트가 StepVerifier 사용

---

## 성능 최적화

### 1. **Connection Pool 설정**
```yaml
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 20
          max-idle: 10
          min-idle: 5
```

### 2. **Reactor 버퍼 크기 조정**
```java
@PostConstruct
public void configureReactor() {
    Hooks.onOperatorDebug();  // 개발 환경에서만
    // 프로덕션에서는 제거
}
```

### 3. **Backpressure 처리**
```java
Flux.range(1, 1000000)
    .limitRate(100)  // 초당 100개씩만 처리
    .subscribe();
```

---

## 테스트 방법

### 1. **단위 테스트 (StepVerifier)**
```java
@Test
public void testReactiveOperation() {
    Mono<String> result = service.getData();
    
    StepVerifier.create(result)
        .expectNext("expected value")
        .verifyComplete();
}
```

### 2. **통합 테스트**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class GatewayIntegrationTest {
    
    @Autowired
    private WebTestClient webTestClient;
    
    @Test
    void testGatewayRoute() {
        webTestClient.get()
            .uri("/user/123")
            .exchange()
            .expectStatus().isOk();
    }
}
```

---

## 마이그레이션 순서 (우선순위)

1. **1단계**: Redis Reactive 설정 (가장 중요)
2. **2단계**: 커스텀 필터 Reactive 변환
3. **3단계**: 에러 처리 개선
4. **4단계**: 모니터링 추가
5. **5단계**: 성능 최적화

---

## 주의사항 ⚠️

1. **블로킹 코드는 절대 사용하지 마세요**
   - `block()`, `toFuture()`, `get()` 등은 사용 금지
   
2. **서브스크립션 관리**
   - 모든 Mono/Flux는 반드시 subscribe되거나 반환되어야 함
   
3. **에러 처리 필수**
   - 모든 Reactive 체인에 에러 처리를 추가하세요

4. **테스트 필수**
   - Reactive 코드는 반드시 StepVerifier로 테스트하세요

---

## 참고 자료

- [Spring WebFlux 공식 문서](https://docs.spring.io/spring-framework/reference/web/webflux.html)
- [Project Reactor 가이드](https://projectreactor.io/docs/core/release/reference/)
- [Spring Cloud Gateway 문서](https://spring.io/projects/spring-cloud-gateway)

