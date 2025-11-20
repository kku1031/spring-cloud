# Zustand 슬라이스 패턴 마이그레이션 가이드

## 📋 개요

이 문서는 프로젝트의 상태 관리 시스템을 React `useState`에서 **Zustand 슬라이스 패턴**으로 마이그레이션한 과정과 이유를 상세히 설명합니다.

**마이그레이션 일자**: 2024년  
**대상**: `frontend/src/store/` 및 관련 컴포넌트들

---

## 🎯 마이그레이션 목적

### 문제점 분석

#### 이전 구조의 문제점
1. **Props Drilling 심화**
   - `useHomePage` → `HomePage` → `MainLayout` → 각 View 컴포넌트
   - 20개 이상의 props가 중간 레이어를 거쳐 전달됨
   - 코드 유지보수성 저하

2. **상태 관리의 분산**
   - 모든 상태가 `useHomePage` 훅에 집중
   - 도메인별 상태가 혼재되어 있음
   - 확장성 부족 (12개 서비스 확장 계획)

3. **성능 최적화 제한**
   - 불필요한 리렌더링 발생 가능
   - 상태 변경 시 전체 훅이 재실행됨
   - 선택적 구독 불가능

4. **테스트 어려움**
   - 훅 전체를 모킹해야 함
   - 독립적인 상태 테스트 불가

### 해결 목표

✅ **Props Drilling 제거**: 필요한 상태는 직접 구독  
✅ **도메인별 상태 분리**: 관심사 분리 원칙 적용  
✅ **성능 최적화**: 선택적 구독으로 불필요한 리렌더링 방지  
✅ **확장성**: 슬라이스 패턴으로 서비스 추가 용이  
✅ **테스트 용이성**: 슬라이스별 독립 테스트 가능

---

## 🏗️ 아키텍처 변경

### 이전 구조

```
useHomePage (React useState)
    ↓
HomePage (props destructuring)
    ↓
MainLayout (props 전달)
    ↓
각 View 컴포넌트 (props 받음)
```

**문제점:**
- Props drilling 3-4단계
- 모든 상태가 한 곳에 집중
- 선택적 구독 불가

### 변경 후 구조

```
Zustand Store (슬라이스 패턴)
├── uiSlice (UI 상태)
├── chatSlice (채팅 상태)
├── calendarSlice (캘린더 상태)
└── ... (확장 가능)

각 컴포넌트
├── 직접 구독 (공통 UI 상태, 도메인 상태)
└── Props 전달 (복잡한 로직)
```

**장점:**
- Props drilling 최소화
- 도메인별 상태 분리
- 선택적 구독 가능
- 확장성 확보

---

## 📁 새로운 디렉토리 구조

### 변경 전

```
store/
├── useAppStore.ts    (빈 스토어, TODO만 존재)
├── types.ts          (타입만 정의, TODO)
└── README.md         (문서만 존재)
```

### 변경 후

```
store/
├── useAppStore.ts          ✅ 슬라이스 통합 완료
├── types.ts                ✅ 타입 정의 업데이트
├── slices/                 ✅ 새로 생성
│   ├── uiSlice.ts          ✅ UI 상태 슬라이스
│   ├── chatSlice.ts        ✅ 채팅 관련 슬라이스
│   └── calendarSlice.ts    ✅ 캘린더 관련 슬라이스
└── README.md
```

---

## 📝 상세 변경 내역

### 1. Zustand 슬라이스 생성

#### 1.1 `uiSlice.ts` 생성

**위치**: `frontend/src/store/slices/uiSlice.ts`

**관리하는 상태:**
- `sidebarOpen`: 사이드바 열림/닫힘 상태
- `darkMode`: 다크 모드 상태
- `currentCategory`: 현재 선택된 카테고리
- `isDragging`: 사이드바 드래그 상태
- 각 카테고리별 뷰 상태: `diaryView`, `accountView`, `cultureView`, `healthView`, `pathfinderView`

**생성 이유:**
- UI 관련 상태를 한 곳에서 관리
- 모든 컴포넌트에서 공통으로 사용되는 상태 (`darkMode` 등)
- 카테고리별 뷰 상태 통합 관리

**주요 기능:**
```typescript
export interface UiSlice extends UiState, UiActions {}

// Actions
- setSidebarOpen: (open: boolean) => void
- setDarkMode: (dark: boolean) => void
- setCurrentCategory: (category: Category) => void
- resetCategoryViews: () => void  // 카테고리 변경 시 모든 뷰 리셋
```

#### 1.2 `chatSlice.ts` 생성

**위치**: `frontend/src/store/slices/chatSlice.ts`

**관리하는 상태:**
- `inputText`: 프롬프트 입력 텍스트
- `loading`: 로딩 상태
- `avatarMode`: 아바타 모드 활성화 여부
- `isListening`: 음성 인식 중 여부
- `micAvailable`: 마이크 사용 가능 여부
- `interactions`: 채팅 상호작용 배열

**생성 이유:**
- 채팅 관련 상태를 독립적으로 관리
- 음성 인식과 텍스트 입력 상태 통합
- 채팅 히스토리 관리

**주요 기능:**
```typescript
export interface ChatSlice extends ChatState, ChatActions {}

// Actions
- setInputText: (text: string) => void
- addInteraction: (interaction: Interaction) => void
- clearInputText: () => void
- setAvatarMode: (mode: boolean) => void
```

#### 1.3 `calendarSlice.ts` 생성

**위치**: `frontend/src/store/slices/calendarSlice.ts`

**관리하는 상태:**
- `selectedDate`: 선택된 날짜
- `currentMonth`: 현재 보이는 월
- `events`: 일정 배열
- `todayTasks`: 오늘 할 일 목록

**생성 이유:**
- 캘린더 도메인 상태 분리
- 일정 관리 로직 통합
- 확장 가능한 구조 (알림, 반복 일정 등 추가 가능)

**주요 기능:**
```typescript
export interface CalendarSlice extends CalendarState, CalendarActions {}

// Actions
- addEvent: (event: Event) => void
- updateEvent: (id: string, event: Partial<Event>) => void
- removeEvent: (id: string) => void
- addTask: (task: Task) => void
- removeTask: (id: string) => void
```

### 2. 타입 정의 업데이트

#### `types.ts` 수정

**변경 전:**
```typescript
export interface AppStore extends AppConfig {
  // TODO: AI 에이전트 슬라이스들 (5개)
  // agent1: Agent1Slice;
  // ...
}
```

**변경 후:**
```typescript
import { UiSlice } from "./slices/uiSlice";
import { ChatSlice } from "./slices/chatSlice";
import { CalendarSlice } from "./slices/calendarSlice";

export interface AppStore extends AppConfig {
  // UI 상태 슬라이스
  ui: UiSlice;
  
  // 채팅 관련 슬라이스
  chat: ChatSlice;
  
  // 캘린더 관련 슬라이스
  calendar: CalendarSlice;
  
  // TODO: AI 에이전트 슬라이스들 (5개)
  // ...
}
```

**변경 이유:**
- 실제 슬라이스를 타입에 반영
- 타입 안정성 보장
- 자동완성 지원

### 3. `useAppStore.ts` 업데이트

**변경 전:**
```typescript
export const useAppStore = create<AppStore>()((set, get) => ({
  // TODO: 모든 슬라이스가 주석 처리됨
}));
```

**변경 후:**
```typescript
export const useAppStore = create<AppStore>()((...a) => ({
  // UI 상태 슬라이스
  ui: createUiSlice(...a),
  
  // 채팅 관련 슬라이스
  chat: createChatSlice(...a),
  
  // 캘린더 관련 슬라이스
  calendar: createCalendarSlice(...a),
  
  // TODO: 확장 가능한 구조
}));
```

**변경 이유:**
- 실제 슬라이스 통합
- 확장 가능한 구조 준비
- 타입 안정성 확보

### 4. `useHomePage` 훅 마이그레이션

**위치**: `frontend/src/app/hooks/useHomePage.ts`

#### 변경 전
```typescript
export const useHomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [inputText, setInputText] = useState('');
  // ... 20개 이상의 useState
  
  return {
    sidebarOpen, setSidebarOpen,
    darkMode, setDarkMode,
    // ... 모든 상태 반환
  };
};
```

#### 변경 후
```typescript
export const useHomePage = () => {
  // Zustand 스토어에서 상태 가져오기 (선택적 구독)
  const uiState = useAppStore((state) => state.ui);
  const chatState = useAppStore((state) => state.chat);
  const calendarState = useAppStore((state) => state.calendar);

  // Zustand 스토어에서 액션 가져오기
  const uiActions = useAppStore((state) => ({
    setSidebarOpen: state.ui.setSidebarOpen,
    setDarkMode: state.ui.setDarkMode,
    // ...
  }));

  // 복잡한 로직은 훅에 유지 (음성 인식, handleSubmit 등)
  const handleSubmit = useCallback((text?: string) => {
    // ... 로직
  }, [chatState.inputText, chatState.avatarMode, chatActions]);

  return {
    // 상태와 액션을 래핑하여 반환 (하위 호환성)
    // ...
  };
};
```

**변경 이유:**
- 상태는 Zustand에서 관리, 로직은 훅에 유지
- 선택적 구독으로 성능 최적화
- 하위 호환성 유지 (기존 코드와의 호환)

**유지한 것들:**
- `handleSubmit`: 복잡한 비즈니스 로직
- `handleMicClick`: 음성 인식 제어 로직
- `useEffect` 훅들: 음성 인식 초기화 로직
- `speakResponse`: 음성 출력 로직

### 5. 컴포넌트별 마이그레이션

#### 5.1 `Sidebar` 컴포넌트

**위치**: `frontend/src/components/organisms/Sidebar.tsx`

**변경 전:**
```typescript
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentCategory: Category;
  setCurrentCategory: (category: Category) => void;
  menuItems: MenuItem[];
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = memo(({
  sidebarOpen, setSidebarOpen,
  darkMode, setDarkMode,
  // ... 8개의 props
}) => {
```

**변경 후:**
```typescript
interface SidebarProps {
  menuItems: MenuItem[];  // 상수만 props로 받음
}

export const Sidebar: React.FC<SidebarProps> = memo(({
  menuItems,
}) => {
  // Zustand 스토어에서 직접 구독
  const sidebarOpen = useAppStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.ui.setSidebarOpen);
  const darkMode = useAppStore((state) => state.ui.darkMode);
  const setDarkMode = useAppStore((state) => state.ui.setDarkMode);
  const currentCategory = useAppStore((state) => state.ui.currentCategory);
  const setCurrentCategory = useAppStore((state) => state.ui.setCurrentCategory);
  const isDragging = useAppStore((state) => state.ui.isDragging);
  const setIsDragging = useAppStore((state) => state.ui.setIsDragging);
```

**변경 이유:**
- Props drilling 제거
- 필요한 상태만 선택적 구독
- 코드 간결성 향상

#### 5.2 `ChatContainer` 컴포넌트

**위치**: `frontend/src/components/organisms/ChatContainer.tsx`

**변경 전:**
```typescript
interface ChatContainerProps {
  interactions: Interaction[];
  darkMode?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = memo(({
  interactions,
  darkMode = false,
}) => {
```

**변경 후:**
```typescript
export const ChatContainer: React.FC = memo(() => {
  // Zustand 스토어에서 직접 구독
  const interactions = useAppStore((state) => state.chat.interactions);
  const darkMode = useAppStore((state) => state.ui.darkMode);
```

**변경 이유:**
- Props 완전 제거
- 내부에서 필요한 상태 직접 구독
- 컴포넌트 독립성 향상

#### 5.3 `PromptInput` 컴포넌트

**위치**: `frontend/src/components/organisms/PromptInput.tsx`

**변경 전:**
```typescript
interface PromptInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  loading: boolean;
  avatarMode: boolean;
  micAvailable: boolean;
  onMicClick: () => void;
  onSubmit: () => void;
  darkMode?: boolean;
}
```

**변경 후:**
```typescript
interface PromptInputProps {
  onMicClick: () => void;  // 복잡한 로직은 props로 유지
  onSubmit: () => void;    // 복잡한 로직은 props로 유지
}

export const PromptInput: React.FC<PromptInputProps> = memo(({
  onMicClick,
  onSubmit,
}) => {
  // 상태는 스토어에서 직접 구독
  const inputText = useAppStore((state) => state.chat.inputText);
  const setInputText = useAppStore((state) => state.chat.setInputText);
  const loading = useAppStore((state) => state.chat.loading);
  const avatarMode = useAppStore((state) => state.chat.avatarMode);
  const micAvailable = useAppStore((state) => state.chat.micAvailable);
  const darkMode = useAppStore((state) => state.ui.darkMode);
```

**변경 이유:**
- **하이브리드 접근**: 상태는 직접 구독, 로직은 props로 전달
- 복잡한 비즈니스 로직은 훅에 유지
- 단순 상태는 스토어에서 직접 접근

#### 5.4 View 컴포넌트들 (DiaryView, CalendarView 등)

**변경 전:**
```typescript
// HomePage.tsx
<DiaryView
  diaryView={diaryView}
  setDiaryView={setDiaryView}
  darkMode={darkMode}
/>

// DiaryView.tsx
interface DiaryViewProps {
  diaryView: DiaryViewType;
  setDiaryView: (view: DiaryViewType) => void;
  darkMode?: boolean;
}
```

**변경 후:**
```typescript
// HomePage.tsx
<DiaryView />  // Props 완전 제거

// DiaryView.tsx
export const DiaryView: React.FC = () => {
  // Zustand 스토어에서 직접 구독
  const diaryView = useAppStore((state) => state.ui.diaryView);
  const setDiaryView = useAppStore((state) => state.ui.setDiaryView);
  const darkMode = useAppStore((state) => state.ui.darkMode);
```

**변경 이유:**
- 각 View 컴포넌트가 자신이 필요한 상태만 직접 구독
- Props drilling 완전 제거
- 컴포넌트 독립성 향상

**변경된 View 컴포넌트:**
- ✅ `DiaryView`
- ✅ `CalendarView`
- ✅ `AccountView`
- ✅ `CultureView`
- ✅ `HealthView`
- ✅ `PathfinderView`
- ✅ `AvatarMode`

#### 5.5 `MainLayout` 컴포넌트

**위치**: `frontend/src/components/templates/MainLayout.tsx`

**변경 전:**
```typescript
interface MainLayoutProps {
  // Sidebar props
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentCategory: Category;
  setCurrentCategory: (category: Category) => void;
  menuItems: MenuItem[];
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;

  // Content props
  avatarMode: boolean;
  isListening: boolean;
  interactions: Interaction[];
  
  // Prompt input props
  inputText: string;
  setInputText: (text: string) => void;
  loading: boolean;
  micAvailable: boolean;
  handleMicClick: () => void;
  handleSubmit: () => void;

  children?: React.ReactNode;
}
```

**변경 후:**
```typescript
interface MainLayoutProps {
  menuItems: MenuItem[];           // 상수만 props로
  handleMicClick: () => void;      // 복잡한 로직은 props로
  handleSubmit: () => void;        // 복잡한 로직은 props로
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = memo(({
  menuItems,
  handleMicClick,
  handleSubmit,
  children,
}) => {
  // 필요한 상태만 직접 구독
  const avatarMode = useAppStore((state) => state.chat.avatarMode);
  const currentCategory = useAppStore((state) => state.ui.currentCategory);
  const darkMode = useAppStore((state) => state.ui.darkMode);
```

**변경 이유:**
- Props 수를 20개 이상 → 3개로 대폭 감소
- 상태는 직접 구독, 로직만 props로 전달
- 코드 간결성 및 가독성 향상

#### 5.6 `HomePage` 컴포넌트

**위치**: `frontend/src/app/pages/HomePage.tsx`

**변경 전:**
```typescript
export const HomePage: React.FC = () => {
  const hookData = useHomePage();

  const {
    currentCategory,
    diaryView, setDiaryView,
    accountView, setAccountView,
    // ... 20개 이상의 상태 destructuring
  } = hookData;

  const categoryContent = useMemo(() => {
    switch (currentCategory) {
      case 'diary':
        return (
          <DiaryView
            diaryView={diaryView}
            setDiaryView={setDiaryView}
            darkMode={darkMode}
          />
        );
      // ... 복잡한 props 전달
    }
  }, [
    currentCategory,
    diaryView, setDiaryView,
    // ... 긴 의존성 배열
  ]);

  return (
    <MainLayout {...hookData}>  // 모든 props 전달
      {categoryContent}
    </MainLayout>
  );
};
```

**변경 후:**
```typescript
export const HomePage: React.FC = () => {
  const hookData = useHomePage();
  const { handleMicClick, handleSubmit, menuItems } = hookData;
  
  // Zustand 스토어에서 직접 구독
  const currentCategory = useAppStore((state) => state.ui.currentCategory);

  // 카테고리별 컴포넌트 렌더링 (props drilling 제거)
  const categoryContent = useMemo(() => {
    switch (currentCategory) {
      case 'diary':
        return <DiaryView />;  // Props 없음
      case 'calendar':
        return <CalendarView />;  // Props 없음
      // ... 간결한 코드
    }
  }, [currentCategory]);  // 의존성 단순화

  return (
    <MainLayout
      menuItems={menuItems}
      handleMicClick={handleMicClick}
      handleSubmit={handleSubmit}
    >
      {categoryContent}
    </MainLayout>
  );
};
```

**변경 이유:**
- 코드 복잡도 대폭 감소
- Props drilling 제거
- 의존성 배열 단순화
- 가독성 향상

---

## 🎯 하이브리드 접근 방식

### 설계 철학

**"맥락에 따라 최적의 방법 선택"**

#### 직접 구독 (스토어에서 직접 접근)

✅ **적용 대상:**
1. **공통 UI 상태** - `darkMode`, `sidebarOpen`, `currentCategory`
   - 거의 모든 컴포넌트에서 사용
   - Props drilling이 심각한 경우

2. **도메인별 View 컴포넌트** - `DiaryView`, `CalendarView` 등
   - 자신이 관리하는 도메인 상태만 필요
   - 독립적인 컴포넌트

3. **단순 상태 표시 컴포넌트** - `ChatContainer`, `AvatarMode`
   - 상태만 표시하는 경우
   - 로직이 없는 경우

#### Props 전달 (복잡한 로직 유지)

✅ **적용 대상:**
1. **복잡한 비즈니스 로직** - `handleSubmit`, `handleMicClick`
   - 음성 인식, API 호출 등
   - 훅에서 관리하는 것이 적합

2. **재사용 가능한 컴포넌트** - Atoms, Molecules
   - 다양한 맥락에서 사용
   - 독립적인 테스트 필요

3. **상수 데이터** - `menuItems`
   - 변하지 않는 데이터
   - props로 전달하는 것이 명확

### 예시

```typescript
// ✅ 직접 구독 (상태만 필요한 경우)
const Sidebar = () => {
  const darkMode = useAppStore((state) => state.ui.darkMode);
  const setDarkMode = useAppStore((state) => state.ui.setDarkMode);
  // ...
}

// ✅ Props 전달 (복잡한 로직인 경우)
const PromptInput = ({ onMicClick, onSubmit }) => {
  const inputText = useAppStore((state) => state.chat.inputText);
  // 복잡한 로직은 props로 받음
  // ...
}

// ✅ 하이브리드 (상태 + 로직)
const MainLayout = ({ handleMicClick, handleSubmit, menuItems }) => {
  const avatarMode = useAppStore((state) => state.chat.avatarMode);
  const darkMode = useAppStore((state) => state.ui.darkMode);
  // 상태는 직접 구독, 로직은 props로 받음
  // ...
}
```

---

## 📊 변경 전후 비교

### Props Drilling 비교

| 레이어 | 변경 전 | 변경 후 | 감소율 |
|--------|---------|---------|--------|
| `HomePage` → `MainLayout` | 20+ props | 3 props | **85% ↓** |
| `MainLayout` → `Sidebar` | 8 props | 1 prop | **87.5% ↓** |
| `MainLayout` → `ChatContainer` | 2 props | 0 props | **100% ↓** |
| `MainLayout` → `PromptInput` | 8 props | 2 props | **75% ↓** |
| `HomePage` → View 컴포넌트들 | 3-9 props | 0 props | **100% ↓** |

### 코드 복잡도 비교

| 항목 | 변경 전 | 변경 후 | 개선 |
|------|---------|---------|------|
| `HomePage` 라인 수 | 129줄 | 52줄 | **60% 감소** |
| `MainLayout` props 수 | 20+ 개 | 3개 | **85% 감소** |
| 의존성 배열 | 20+ 개 | 1개 | **95% 감소** |
| Props destructuring | 복잡 | 간단 | **대폭 개선** |

### 성능 최적화

#### 변경 전
```typescript
// 모든 상태가 변경되면 전체 컴포넌트 재렌더링
const hookData = useHomePage();  // 모든 상태 구독
const { sidebarOpen, darkMode, ... } = hookData;
```

#### 변경 후
```typescript
// 필요한 상태만 선택적 구독
const sidebarOpen = useAppStore((state) => state.ui.sidebarOpen);
const darkMode = useAppStore((state) => state.ui.darkMode);
// 다른 상태 변경 시 재렌더링 안 됨
```

**효과:**
- ✅ 불필요한 리렌더링 방지
- ✅ 성능 최적화
- ✅ 메모리 효율성 향상

---

## 🚀 개선 효과

### 1. Props Drilling 제거

**변경 전:**
```
useHomePage → HomePage → MainLayout → Sidebar
   (20+)       (20+)       (8)        (props 받음)
```

**변경 후:**
```
Zustand Store → Sidebar (직접 구독)
     ↓
   HomePage (핸들러만 전달)
```

**효과:**
- Props 전달 단계 3-4단계 → 0-1단계
- 코드 복잡도 대폭 감소
- 유지보수성 향상

### 2. 도메인별 상태 분리

**변경 전:**
```typescript
// 모든 상태가 한 곳에
useHomePage: {
  sidebarOpen, darkMode, inputText, interactions,
  events, tasks, diaryView, accountView, ...
}
```

**변경 후:**
```typescript
// 도메인별로 분리
uiSlice: { sidebarOpen, darkMode, currentCategory, ... }
chatSlice: { inputText, interactions, avatarMode, ... }
calendarSlice: { events, tasks, selectedDate, ... }
```

**효과:**
- 관심사 분리 원칙 적용
- 독립적인 테스트 가능
- 확장성 향상

### 3. 성능 최적화

**선택적 구독:**
```typescript
// ✅ 좋은 예: 필요한 상태만 구독
const darkMode = useAppStore((state) => state.ui.darkMode);
const sidebarOpen = useAppStore((state) => state.ui.sidebarOpen);

// ❌ 나쁜 예: 전체 스토어 구독
const store = useAppStore();  // 모든 변경에 반응
```

**효과:**
- 불필요한 리렌더링 방지
- 메모리 효율성 향상
- 애플리케이션 성능 개선

### 4. 확장성 확보

**확장 가능한 구조:**
```typescript
// 새로운 슬라이스 추가가 용이
export const useAppStore = create<AppStore>()((...a) => ({
  ui: createUiSlice(...a),
  chat: createChatSlice(...a),
  calendar: createCalendarSlice(...a),
  
  // 새로운 슬라이스 추가
  diary: createDiarySlice(...a),      // ✨ 추가
  health: createHealthSlice(...a),    // ✨ 추가
  // ...
}));
```

**효과:**
- 12개 서비스 확장 계획에 대응 가능
- 슬라이스별 독립적 관리
- 점진적 확장 가능

### 5. 테스트 용이성

**독립적인 슬라이스 테스트:**
```typescript
// 각 슬라이스를 독립적으로 테스트 가능
describe('uiSlice', () => {
  it('should toggle dark mode', () => {
    // 테스트 코드
  });
});

describe('chatSlice', () => {
  it('should add interaction', () => {
    // 테스트 코드
  });
});
```

**효과:**
- 단위 테스트 작성 용이
- 통합 테스트 간소화
- 버그 발견 및 수정 용이

---

## 🔧 사용 가이드

### 기본 사용법

#### 상태 구독
```typescript
// 단일 상태 구독
const darkMode = useAppStore((state) => state.ui.darkMode);

// 여러 상태 구독
const { darkMode, sidebarOpen } = useAppStore((state) => ({
  darkMode: state.ui.darkMode,
  sidebarOpen: state.ui.sidebarOpen,
}));

// 액션만 구독 (변경되지 않으므로 안전)
const setDarkMode = useAppStore((state) => state.ui.setDarkMode);
```

#### 상태 업데이트
```typescript
// 직접 액션 호출
const setDarkMode = useAppStore((state) => state.ui.setDarkMode);
setDarkMode(true);

// 또는 스토어에서 직접 가져오기
useAppStore.getState().ui.setDarkMode(true);
```

#### 슬라이스 추가 방법

1. **새 슬라이스 파일 생성**
```typescript
// store/slices/diarySlice.ts
export const createDiarySlice: StateCreator<...> = (set) => ({
  // 상태와 액션 정의
});
```

2. **타입 추가**
```typescript
// store/types.ts
export interface AppStore extends AppConfig {
  diary: DiarySlice;  // 추가
}
```

3. **스토어에 통합**
```typescript
// store/useAppStore.ts
export const useAppStore = create<AppStore>()((...a) => ({
  diary: createDiarySlice(...a),  // 추가
}));
```

---

## ⚠️ 주의사항

### 1. 순환 참조 방지

```typescript
// ❌ 나쁜 예: 슬라이스 간 직접 참조
const createSliceA = (set, get) => ({
  useSliceB: () => get().sliceB,  // 순환 참조 위험
});

// ✅ 좋은 예: 독립적인 슬라이스
const createSliceA = (set, get) => ({
  // 자신의 상태만 관리
});
```

### 2. 선택적 구독 사용

```typescript
// ❌ 나쁜 예: 전체 스토어 구독
const store = useAppStore();

// ✅ 좋은 예: 필요한 부분만 구독
const darkMode = useAppStore((state) => state.ui.darkMode);
```

### 3. 타입 안정성

```typescript
// ✅ 타입을 명시적으로 지정
const darkMode: boolean = useAppStore((state) => state.ui.darkMode);

// ✅ 타입 추론 활용
const darkMode = useAppStore((state) => state.ui.darkMode);  // 자동 추론
```

---

## 📈 향후 계획

### 추가 예정 슬라이스

1. **AI 에이전트 슬라이스들 (5개)**
   - `agent1Slice` - 감정 분석 에이전트
   - `agent2Slice` - 성격 분석 에이전트 (MBTI/Big Five)
   - `agent3Slice` - 건강 데이터 분석 에이전트
   - `agent4Slice` - 가계/재정 분석 에이전트
   - `agent5Slice` - 문화 추천 에이전트

2. **마이크로서비스 슬라이스들 (7개)**
   - `diaryServiceSlice` - 일기 서비스
   - `calendarServiceSlice` - 캘린더 서비스
   - `accountServiceSlice` - 가계부 서비스
   - `healthServiceSlice` - 건강 서비스
   - `cultureServiceSlice` - 문화 서비스
   - `pathfinderServiceSlice` - 자기개발 서비스
   - `userServiceSlice` - 사용자 서비스

### 확장 전략

1. **점진적 확장**: 필요할 때마다 슬라이스 추가
2. **독립적 개발**: 각 슬라이스를 독립적으로 개발 및 테스트
3. **타입 안정성**: 모든 슬라이스에 타입 정의 필수

---

## 📚 참고 자료

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [Zustand 슬라이스 패턴 가이드](https://github.com/pmndrs/zustand#slicing-pattern)
- 프로젝트 내 문서: `frontend/src/store/README.md`

---

## ✅ 마이그레이션 체크리스트

- [x] Zustand 슬라이스 패턴 구조 생성
- [x] `uiSlice` 생성 및 구현
- [x] `chatSlice` 생성 및 구현
- [x] `calendarSlice` 생성 및 구현
- [x] 타입 정의 업데이트
- [x] `useAppStore` 슬라이스 통합
- [x] `useHomePage` 훅 마이그레이션
- [x] `Sidebar` 컴포넌트 마이그레이션
- [x] `ChatContainer` 컴포넌트 마이그레이션
- [x] `PromptInput` 컴포넌트 마이그레이션
- [x] `MainLayout` 컴포넌트 마이그레이션
- [x] View 컴포넌트들 마이그레이션
- [x] `HomePage` 컴포넌트 마이그레이션
- [x] `AvatarMode` 컴포넌트 마이그레이션
- [x] 린터 오류 확인 및 수정
- [x] 문서화 완료

---

**작성 일자**: 2024년  
**최종 업데이트**: Zustand 슬라이스 패턴 마이그레이션 완료  
**다음 단계**: AI 에이전트 및 마이크로서비스 슬라이스 추가

