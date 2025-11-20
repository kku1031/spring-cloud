import { StateCreator } from "zustand";
import { AppStore } from "../types";
import { Category, DiaryView, AccountView, CultureView, HealthView, PathfinderView } from "@/components/types";

export interface UiState {
  sidebarOpen: boolean;
  darkMode: boolean;
  currentCategory: Category;
  isDragging: boolean;
  diaryView: DiaryView;
  accountView: AccountView;
  cultureView: CultureView;
  healthView: HealthView;
  pathfinderView: PathfinderView;
}

export interface UiActions {
  setSidebarOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  setCurrentCategory: (category: Category) => void;
  setIsDragging: (dragging: boolean) => void;
  setDiaryView: (view: DiaryView) => void;
  setAccountView: (view: AccountView) => void;
  setCultureView: (view: CultureView) => void;
  setHealthView: (view: HealthView) => void;
  setPathfinderView: (view: PathfinderView) => void;
  resetCategoryViews: () => void;
}

export interface UiSlice extends UiState, UiActions {}

export const createUiSlice: StateCreator<
  AppStore,
  [],
  [],
  UiSlice
> = (set) => ({
  // 초기 상태
  sidebarOpen: true,
  darkMode: false,
  currentCategory: 'home',
  isDragging: false,
  diaryView: 'home',
  accountView: 'home',
  cultureView: 'home',
  healthView: 'home',
  pathfinderView: 'home',

  // Actions
  setSidebarOpen: (open) => set((state) => ({
    ui: { ...state.ui, sidebarOpen: open }
  })),
  setDarkMode: (dark) => set((state) => ({
    ui: { ...state.ui, darkMode: dark }
  })),
  setCurrentCategory: (category) => set((state) => ({
    ui: { ...state.ui, currentCategory: category }
  })),
  setIsDragging: (dragging) => set((state) => ({
    ui: { ...state.ui, isDragging: dragging }
  })),
  setDiaryView: (view) => set((state) => ({
    ui: { ...state.ui, diaryView: view }
  })),
  setAccountView: (view) => set((state) => ({
    ui: { ...state.ui, accountView: view }
  })),
  setCultureView: (view) => set((state) => ({
    ui: { ...state.ui, cultureView: view }
  })),
  setHealthView: (view) => set((state) => ({
    ui: { ...state.ui, healthView: view }
  })),
  setPathfinderView: (view) => set((state) => ({
    ui: { ...state.ui, pathfinderView: view }
  })),
  resetCategoryViews: () => set((state) => ({
    ui: {
      ...state.ui,
      diaryView: 'home',
      accountView: 'home',
      cultureView: 'home',
      healthView: 'home',
      pathfinderView: 'home',
    }
  })),
});

