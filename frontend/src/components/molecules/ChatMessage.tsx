import React, { memo } from 'react';
import { CategoryBadge } from './CategoryBadge';
import { Interaction } from '../types';

interface ChatMessageProps {
  interaction: Interaction;
  darkMode?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = memo(({
  interaction,
  darkMode = false,
}) => {
  return (
    <div className="space-y-2">
      {/* 사용자 메시지 (오른쪽 정렬) */}
      <div className="flex justify-end">
        <div className="max-w-[70%]">
          <div
            className={`rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-[#8B7355] text-white'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {interaction.userInput}
            </p>
          </div>
          <CategoryBadge categories={interaction.categories} darkMode={darkMode} />
        </div>
      </div>

      {/* AI 응답 (왼쪽 정렬) */}
      <div className="flex items-start gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            darkMode
              ? 'bg-gradient-to-br from-gray-700 to-gray-600'
              : 'bg-gradient-to-br from-[#8B7355] to-[#c4a57b]'
          }`}
        >
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <div className="max-w-[70%]">
          <div
            className={`rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm ${
              darkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-[#d4cdc0]'
            }`}
          >
            <p className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {interaction.aiResponse}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

