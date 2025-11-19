import React, { useEffect, useRef, memo } from 'react';
import { ChatMessage } from '../molecules';
import { Interaction } from '../types';

interface ChatContainerProps {
  interactions: Interaction[];
  darkMode?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = memo(({
  interactions,
  darkMode = false,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [interactions]);

  return (
    <div
      ref={chatContainerRef}
      className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}
    >
      <div className="pl-4 pr-4 py-4 space-y-3">
        {interactions.map((interaction) => (
          <ChatMessage
            key={interaction.id}
            interaction={interaction}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
});

