package site.aiion.api.common.config;

import org.springframework.context.annotation.Configuration;

/**
 * 웹 설정 클래스
 * 
 * 주의: CORS 설정은 API Gateway (server/discovery)에서만 처리합니다.
 * 각 마이크로서비스는 Gateway를 통해서만 접근되므로 개별 CORS 설정이 필요하지 않습니다.
 * 
 * Gateway 설정 위치: server/discovery/src/main/resources/application.yaml
 * Gateway CORS 설정: server/discovery/src/main/java/.../config/CorsConfig.java
 */
@Configuration
public class WebConfig {
    // CORS 설정 제거됨 - API Gateway에서 통합 관리
    // 모든 클라이언트 요청은 Gateway(8080)를 통해 라우팅됩니다.
}
