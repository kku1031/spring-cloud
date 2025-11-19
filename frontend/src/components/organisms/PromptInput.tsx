import React, { useRef, useEffect, memo } from 'react';
import { Input } from '../atoms';
import { Icon } from '../atoms';

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

export const PromptInput: React.FC<PromptInputProps> = memo(({
  inputText,
  setInputText,
  loading,
  avatarMode,
  micAvailable,
  onMicClick,
  onSubmit,
  darkMode = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !avatarMode && inputRef.current) {
      const timer1 = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      const timer2 = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      const timer3 = setTimeout(() => {
        inputRef.current?.focus();
      }, 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [loading, avatarMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5000) {
      setInputText(value);
    }
  };

  return (
    <div
      className={`border-t p-4 ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-[#d4cdc0] bg-[#f5f1e8]'
      }`}
    >
      <div className="pl-6 pr-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading && inputText.trim()) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                }
              }}
              onBlur={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!loading && !avatarMode && !relatedTarget?.closest('button')) {
                  setTimeout(() => {
                    if (inputRef.current && document.activeElement !== inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 0);
                }
              }}
              autoFocus
              placeholder="프롬프트를 입력하세요. (최대 5000자)"
              readOnly={loading || avatarMode}
              maxLength={5000}
              className={`w-full px-4 py-3 pr-16 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 placeholder-gray-400'
                  : 'bg-white border-[#d4cdc0] focus:ring-[#8B7355]'
              }`}
            />
            {inputText.length > 0 && (
              <span
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {inputText.length}/5000
              </span>
            )}
          </div>
          {/* Microphone Button */}
          <button
            onClick={onMicClick}
            disabled={!micAvailable}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              avatarMode
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : micAvailable
                ? darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-[#d4cdc0] hover:bg-[#c4bdb0] text-gray-700'
                : darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-[#e8dcc8] text-gray-400 cursor-not-allowed'
            }`}
            title={avatarMode ? '대화 종료' : '마이크 아이콘'}
          >
            <Icon name="mic" />
          </button>
          {/* Send Button */}
          {!avatarMode && (
            <button
              onClick={onSubmit}
              disabled={loading || !inputText.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#8B7355] hover:bg-[#6d5943]'
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Icon name="send" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

