# Gateway WebFlux 빠른 시작 가이드

## 🎯 목표
Gateway를 완전한 논블로킹, 비동기 구조로 변환하기

---

## 📖 기본 개념 (3분 이해)

### 블로킹 vs 논블로킹

**블로킹 (기존 방식)**
```
요청 → [대기] → [대기] → 응답
스레드가 계속 점유됨 → 동시 처리량 제한
```

**논블로킹 (WebFlux)**
```
요청 → [작업 시작] → 다른 일 처리 → [결과 받음] → 응답
스레드 점유 없음 → 동시 처리량 증가
```

### 핵심 키워드

- **Mono**: 0개 또는 1개의 결과를 비동기로 반환
- **Flux**: 0개 이상의 결과를 스트림으로 반환
- **Reactive**: 데이터가 준비되면 자동으로 다음 단계로 전달

---

## 🚀 5단계로 시작하기

### Step 1: build.gradle 확인 ✅
```gradle
dependencies {
    // 이미 있음
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway-server-webflux'
    implementation 'org.springframework.boot:spring-starter-data-redis-reactive'
}
```

### Step 2: Redis Reactive 설정 추가
`RedisReactiveConfig.java` 파일 생성 (IMPLEMENTATION_EXAMPLES.md 참고)

### Step 3: 필터를 Reactive로 변환
기존 필터가 있다면:
- `Mono<Void>` 반환하도록 변경
- `block()` 제거
- `onErrorResume()` 추가

### Step 4: 테스트
```bash
# 서비스 시작
docker compose up gateway

# 테스트
curl http://localhost:8080/user/123
```

### Step 5: 모니터링
```bash
# 메트릭 확인
curl http://localhost:8080/actuator/metrics
```

---

## ⚠️ 절대 하지 말아야 할 것

### ❌ 블로킹 코드 사용
```java
// 나쁜 예
String result = blockingService.getData();  // 블로킹!
return Mono.just(result);
```

### ❌ block() 사용
```java
// 나쁜 예
String result = mono.block();  // 블로킹!
```

### ✅ 올바른 방법
```java
// 좋은 예
return reactiveService.getData();  // 논블로킹
```

---

## 📋 체크리스트

변환 완료 후 확인:

- [ ] 모든 외부 호출이 Mono/Flux 반환
- [ ] Redis가 ReactiveRedisTemplate 사용
- [ ] 필터가 GatewayFilter 구현
- [ ] 에러 처리가 onErrorResume 사용
- [ ] block() 사용 없음
- [ ] 테스트 통과

---

## 🔍 문제 해결

### 문제: "block()/blockFirst()/blockLast() are blocking"
**해결**: block() 제거하고 Mono/Flux 체이닝 사용

### 문제: "ReactiveRedisTemplate이 작동 안 함"
**해결**: RedisReactiveConfig 확인, Lettuce 사용 확인

### 문제: "필터가 실행 안 됨"
**해결**: getOrder() 메서드 확인, 필터 순서 확인

---

## 📚 다음 단계

1. **WEBFLUX_MIGRATION_STRATEGY.md** - 상세 전략 읽기
2. **IMPLEMENTATION_EXAMPLES.md** - 코드 예시 참고
3. 단계별로 하나씩 구현
4. 테스트 작성 및 실행

---

## 💡 팁

- 작은 것부터 시작: 하나의 필터부터 변환
- 테스트 필수: StepVerifier로 검증
- 에러 처리: 모든 체인에 onErrorResume 추가
- 모니터링: 메트릭으로 성능 확인

---

**질문이 있으면 문서를 다시 읽어보세요!** 📖

