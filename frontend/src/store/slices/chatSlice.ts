import { StateCreator } from "zustand";
import { AppStore } from "../types";
import { Interaction } from "@/components/types";

export interface ChatState {
  inputText: string;
  loading: boolean;
  avatarMode: boolean;
  isListening: boolean;
  micAvailable: boolean;
  interactions: Interaction[];
}

export interface ChatActions {
  setInputText: (text: string) => void;
  setLoading: (loading: boolean) => void;
  setAvatarMode: (mode: boolean) => void;
  setIsListening: (listening: boolean) => void;
  setMicAvailable: (available: boolean) => void;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (interaction: Interaction) => void;
  clearInputText: () => void;
}

export interface ChatSlice extends ChatState, ChatActions {}

export const createChatSlice: StateCreator<
  AppStore,
  [],
  [],
  ChatSlice
> = (set) => ({
  // 초기 상태
  inputText: '',
  loading: false,
  avatarMode: false,
  isListening: false,
  micAvailable: false,
  interactions: [],

  // Actions
  setInputText: (text) => set((state) => ({
    chat: { ...state.chat, inputText: text }
  })),
  setLoading: (loading) => set((state) => ({
    chat: { ...state.chat, loading }
  })),
  setAvatarMode: (mode) => set((state) => ({
    chat: { ...state.chat, avatarMode: mode }
  })),
  setIsListening: (listening) => set((state) => ({
    chat: { ...state.chat, isListening: listening }
  })),
  setMicAvailable: (available) => set((state) => ({
    chat: { ...state.chat, micAvailable: available }
  })),
  setInteractions: (interactions) => set((state) => ({
    chat: { ...state.chat, interactions }
  })),
  addInteraction: (interaction) => set((state) => ({
    chat: {
      ...state.chat,
      interactions: [...state.chat.interactions, interaction]
    }
  })),
  clearInputText: () => set((state) => ({
    chat: { ...state.chat, inputText: '' }
  })),
});

