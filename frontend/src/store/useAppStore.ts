import { create } from "zustand";
import { AppStore } from "./types";
import { createUiSlice } from "./slices/uiSlice";
import { createChatSlice } from "./slices/chatSlice";
import { createCalendarSlice } from "./slices/calendarSlice";

/**
 * 단일 Zustand 스토어 (슬라이스 패턴 적용)
 * 
 * 12개 서비스 (AI 에이전트 5개 + MS 7개)를 위한 확장 가능한 구조
 * 
 * 사용법:
 * - 각 서비스별로 독립적인 슬라이스 생성
 * - 모든 슬라이스를 여기에 통합
 * - 컴포넌트에서 선택적 구독으로 사용
 * 
 * 예시:
 * const sidebarOpen = useAppStore((state) => state.ui.sidebarOpen);
 * const setSidebarOpen = useAppStore((state) => state.ui.setSidebarOpen);
 * const interactions = useAppStore((state) => state.chat.interactions);
 */
export const useAppStore = create<AppStore>()((...a) => ({
  // UI 상태 슬라이스
  ui: createUiSlice(...a),

  // 채팅 관련 슬라이스
  chat: createChatSlice(...a),

  // 캘린더 관련 슬라이스
  calendar: createCalendarSlice(...a),

  // TODO: AI 에이전트 슬라이스들 (5개)
  // agent1: createAgent1Slice(...a),
  // agent2: createAgent2Slice(...a),
  // agent3: createAgent3Slice(...a),
  // agent4: createAgent4Slice(...a),
  // agent5: createAgent5Slice(...a),

  // TODO: 마이크로서비스 슬라이스들 (7개)
  // service1: createService1Slice(...a),
  // service2: createService2Slice(...a),
  // service3: createService3Slice(...a),
  // service4: createService4Slice(...a),
  // service5: createService5Slice(...a),
  // service6: createService6Slice(...a),
  // service7: createService7Slice(...a),
}));
