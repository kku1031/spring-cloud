# API Gateway (Discovery Server)

## 개요

이 서비스는 **Spring Cloud Gateway**를 사용한 API Gateway입니다. 모든 클라이언트 요청을 중앙에서 관리하고 각 마이크로서비스로 라우팅합니다.

## 아키텍처

```
┌─────────────┐
│  Frontend   │
│  (3000)     │
└──────┬──────┘
       │
       │ HTTP 요청
       ▼
┌─────────────────────────────────────┐
│      API Gateway (8080)              │
│  - CORS 처리                         │
│  - 라우팅                            │
│  - 로드 밸런싱                       │
└──────┬───────────────────────────────┘
       │
       │ Service Discovery (Eureka)
       ▼
┌─────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐         │
│  │ soccer   │  │ common   │  ...    │
│  │ service  │  │ service  │         │
│  └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
```

## 주요 기능

### 1. 라우팅 규칙

| 경로 | 대상 서비스 | 설명 |
|------|------------|------|
| `/soccer/**` | `soccer-service` | 축구 관련 API |
| `/common/**` | `common-service` | 공통 기능 API |
| `/user/**` | `user-service` | 사용자 관리 API |
| `/diary/**` | `diary-service` | 일기 관리 API |
| `/calendar/**` | `calendar-service` | 캘린더 관리 API |

### 2. CORS 처리

**중요**: 모든 CORS 설정은 이 Gateway에서만 처리합니다.

- 설정 위치: `src/main/java/.../config/CorsConfig.java`
- 허용된 Origin:
  - `http://localhost:3000` (로컬 개발)
  - `http://frontend:3000` (Docker 네트워크)
  - `http://127.0.0.1:3000` (로컬호스팅)

### 3. Service Discovery

- Eureka를 통한 서비스 디스커버리
- Load Balancer (`lb://`)를 통한 로드 밸런싱
- 자동 서비스 등록 및 발견

## 설정 파일

- `application.yaml`: Gateway 라우팅 및 기본 설정
- `CorsConfig.java`: CORS 필터 설정

## 주의사항

⚠️ **각 마이크로서비스는 CORS 설정을 하지 마세요!**

- Gateway를 통해서만 접근되므로 개별 CORS 설정이 필요하지 않습니다.
- 중복 CORS 설정은 예상치 못한 동작을 일으킬 수 있습니다.

## 실행 방법

```bash
# Docker Compose로 실행
docker-compose up discovery

# 또는 직접 실행
./gradlew :server:discovery:bootRun
```

## 포트

- **8080**: Gateway 서비스 포트
- 모든 클라이언트는 이 포트로 요청을 보냅니다.

## 개발 가이드

### 새로운 서비스 추가

1. `application.yaml`의 `routes` 섹션에 새 라우팅 규칙 추가:
```yaml
- id: new-service
  uri: lb://new-service
  predicates:
    - Path=/new/**
```

2. 해당 서비스가 Eureka에 등록되어 있는지 확인

3. Frontend의 `endpoints.ts`에 엔드포인트 추가

### CORS 설정 변경

`CorsConfig.java` 파일을 수정하여 허용된 Origin, 메서드, 헤더를 변경할 수 있습니다.

