import { useEffect, useRef, useCallback } from 'react';
import {
  Interaction,
  SpeechRecognition,
} from '@/components/types';
import { getLocalDateStr, extractCategories } from '@/lib';
import { useAppStore } from '@/store/useAppStore';

export const useHomePage = () => {
  // Zustand 스토어에서 상태 가져오기 (선택적 구독)
  const chatState = useAppStore((state) => state.chat);
  const uiState = useAppStore((state) => state.ui);

  // Zustand 스토어에서 액션 가져오기
  const chatActions = useAppStore((state) => ({
    setInputText: state.chat.setInputText,
    setLoading: state.chat.setLoading,
    setAvatarMode: state.chat.setAvatarMode,
    setIsListening: state.chat.setIsListening,
    setMicAvailable: state.chat.setMicAvailable,
    addInteraction: state.chat.addInteraction,
    clearInputText: state.chat.clearInputText,
  }));

  const uiActions = useAppStore((state) => ({
    setCurrentCategory: state.ui.setCurrentCategory,
    resetCategoryViews: state.ui.resetCategoryViews,
  }));

  // 음성 인식 관련 ref (로직은 훅에 유지)
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'diary', label: 'Diary', icon: '📔' },
    { id: 'health', label: 'Health Care', icon: '🏥' },
    { id: 'culture', label: 'Culture', icon: '🎭' },
    { id: 'account', label: 'Account', icon: '💰' },
    { id: 'path', label: 'Path Finder', icon: '🗺️' },
  ];

  // 마이크 권한 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      chatActions.setMicAvailable(true);
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      chatActions.setMicAvailable(true);
    }
  }, [chatActions]);

  // 음성 인식 초기화
  useEffect(() => {
    if (chatState.avatarMode && chatState.micAvailable) {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          chatActions.setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          chatActions.setInputText(transcript);
          chatActions.setIsListening(false);

          setTimeout(() => {
            handleSubmit(transcript);
          }, 500);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          chatActions.setIsListening(false);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            if (chatState.inputText.trim()) {
              handleSubmit(chatState.inputText);
            }
            chatActions.setIsListening(false);
          }, 3000);
        };

        recognition.onend = () => {
          chatActions.setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [chatState.avatarMode, chatState.micAvailable, chatState.inputText, chatActions]);

  // 아바타 모드에서 자동으로 음성 인식 시작
  useEffect(() => {
    if (chatState.avatarMode && chatState.micAvailable && recognitionRef.current && !chatState.isListening) {
      try {
        recognitionRef.current.start();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            const currentText = chatState.inputText;
            if (currentText.trim()) {
              handleSubmit(currentText);
            } else {
              handleSubmit('');
            }
            chatActions.setIsListening(false);
          }
        }, 3000);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.avatarMode]);

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = useCallback(() => {
    if (chatState.avatarMode) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      chatActions.setIsListening(false);
      chatActions.setAvatarMode(false);
    } else {
      chatActions.setAvatarMode(true);
    }
  }, [chatState.avatarMode, chatActions]);

  const handleSubmit = useCallback((text?: string) => {
    const submitText = text || chatState.inputText;
    if (!submitText.trim() && !text) {
      return;
    }

    chatActions.setLoading(true);
    chatActions.clearInputText();

    setTimeout(() => {
      const today = new Date();
      const dateStr = getLocalDateStr(today);
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = dayNames[today.getDay()];

      const categories = extractCategories(submitText);

      const newInteraction: Interaction = {
        id: Date.now().toString(),
        date: dateStr,
        dayOfWeek: dayOfWeek,
        userInput: submitText,
        categories: categories.length > 0 ? categories : ['일기'],
        aiResponse: categories.length > 0
          ? '호현님의 입력을 각 카테고리에 맞게 파싱 및 저장했습니다.'
          : '입력을 저장했습니다.',
      };

      chatActions.addInteraction(newInteraction);
      chatActions.setLoading(false);

      if (chatState.avatarMode) {
        speakResponse(newInteraction.aiResponse);
      }
    }, 1000);
  }, [chatState.inputText, chatState.avatarMode, chatActions]);

  // 카테고리 변경 시 뷰 리셋
  useEffect(() => {
    uiActions.resetCategoryViews();
  }, [uiState.currentCategory, uiActions]);

  return {
    // Handlers (복잡한 로직)
    handleMicClick,
    handleSubmit,

    // 상수 데이터
    menuItems,
  };
};

