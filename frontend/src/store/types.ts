/**
 * 전체 스토어 타입 정의
 * 
 * 12개 서비스 (AI 에이전트 5개 + MS 7개)를 위한 확장 가능한 타입 구조
 * 
 * 구조:
 * - 각 서비스별로 독립적인 슬라이스
 * - 도메인별 그룹핑 가능
 * - 타입 안정성 보장
 */

// 공통 설정 타입
export interface AppConfig {
  // TODO: 공통 설정 추가
}

// 전체 스토어 타입 (모든 슬라이스 통합)
export interface AppStore extends AppConfig {
  // TODO: AI 에이전트 슬라이스들 (5개)
  // agent1: Agent1Slice;
  // agent2: Agent2Slice;
  // agent3: Agent3Slice;
  // agent4: Agent4Slice;
  // agent5: Agent5Slice;
  
  // TODO: 마이크로서비스 슬라이스들 (7개)
  // service1: Service1Slice;
  // service2: Service2Slice;
  // service3: Service3Slice;
  // service4: Service4Slice;
  // service5: Service5Slice;
  // service6: Service6Slice;
  // service7: Service7Slice;
  
  // TODO: UI 상태 슬라이스 (필요시)
  // ui: UiSlice;
}
