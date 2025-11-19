import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Interaction,
  Category,
  SpeechRecognition,
  DiaryView as DiaryViewType,
  AccountView as AccountViewType,
  CultureView as CultureViewType,
  HealthView as HealthViewType,
  PathfinderView as PathfinderViewType,
  Event,
  Task,
} from '../../components/types';
import { getLocalDateStr, extractCategories } from '../../lib';

export const useHomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarMode, setAvatarMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>('home');

  // 카테고리별 뷰 상태
  const [diaryView, setDiaryView] = useState<DiaryViewType>('home');
  const [accountView, setAccountView] = useState<AccountViewType>('home');
  const [cultureView, setCultureView] = useState<CultureViewType>('home');
  const [healthView, setHealthView] = useState<HealthViewType>('home');
  const [pathfinderView, setPathfinderView] = useState<PathfinderViewType>('home');

  // Calendar 관련 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

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
      setMicAvailable(true);
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      setMicAvailable(true);
    }
  }, []);

  // 음성 인식 초기화
  useEffect(() => {
    if (avatarMode && micAvailable) {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);

          setTimeout(() => {
            handleSubmit(transcript);
          }, 500);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            if (inputText.trim()) {
              handleSubmit(inputText);
            }
            setIsListening(false);
          }, 3000);
        };

        recognition.onend = () => {
          setIsListening(false);
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
  }, [avatarMode, micAvailable]);

  // 아바타 모드에서 자동으로 음성 인식 시작
  useEffect(() => {
    if (avatarMode && micAvailable && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            const currentText = inputText;
            if (currentText.trim()) {
              handleSubmit(currentText);
            } else {
              handleSubmit('');
            }
            setIsListening(false);
          }
        }, 3000);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarMode]);

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
    if (avatarMode) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsListening(false);
      setAvatarMode(false);
    } else {
      setAvatarMode(true);
    }
  }, [avatarMode]);

  const handleSubmit = useCallback((text?: string) => {
    const submitText = text || inputText;
    if (!submitText.trim() && !text) {
      return;
    }

    setLoading(true);
    setInputText('');

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

      setInteractions(prev => [...prev, newInteraction]);
      setLoading(false);

      if (avatarMode) {
        speakResponse(newInteraction.aiResponse);
      }
    }, 1000);
  }, [inputText, avatarMode, interactions]);

  // 카테고리 변경 시 뷰 리셋
  useEffect(() => {
    setDiaryView('home');
    setAccountView('home');
    setCultureView('home');
    setHealthView('home');
    setPathfinderView('home');
  }, [currentCategory]);

  return {
    // State
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    setDarkMode,
    inputText,
    setInputText,
    loading,
    avatarMode,
    isListening,
    micAvailable,
    interactions,
    isDragging,
    setIsDragging,
    currentCategory,
    setCurrentCategory,
    menuItems,

    // 카테고리별 뷰 상태
    diaryView,
    setDiaryView,
    accountView,
    setAccountView,
    cultureView,
    setCultureView,
    healthView,
    setHealthView,
    pathfinderView,
    setPathfinderView,

    // Calendar 상태
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    events,
    setEvents,
    todayTasks,
    setTodayTasks,

    // Handlers
    handleMicClick,
    handleSubmit,
  };
};

