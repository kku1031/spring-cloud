package site.aiion.api.discovery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * API Gateway CORS 설정
 * 
 * 중요: 모든 CORS 설정은 이 Gateway에서만 처리합니다.
 * 각 마이크로서비스는 Gateway를 통해서만 접근되므로 개별 CORS 설정이 필요하지 않습니다.
 * 
 * 아키텍처:
 * Frontend -> API Gateway (8080) -> Microservices
 * 
 * 모든 클라이언트 요청은 Gateway를 통해 라우팅되며,
 * Gateway에서 CORS를 처리하여 각 서비스로 전달합니다.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // 허용된 Origin 목록
        corsConfig.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000", // 로컬 개발 환경
                "http://frontend:3000", // Docker 네트워크 내 프론트엔드
                "http://localhost:3001", // 추가 개발 포트
                "http://127.0.0.1:3000" // 로컬호스팅 대체 주소
        ));

        // 허용된 HTTP 메서드
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 허용된 헤더
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // 인증 정보 포함 허용
        corsConfig.setAllowCredentials(true);

        // 클라이언트에 노출할 헤더
        corsConfig.setExposedHeaders(Arrays.asList("Content-Type", "Authorization", "X-Total-Count"));

        // Preflight 요청 캐시 시간 (초)
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
