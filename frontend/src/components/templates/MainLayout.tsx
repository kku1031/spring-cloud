import React, { memo } from 'react';
import { Sidebar, ChatContainer, PromptInput, AvatarMode } from '../organisms';
import { MenuItem } from '../types';
import { useAppStore } from '@/store/useAppStore';

interface MainLayoutProps {
  menuItems: MenuItem[];
  handleMicClick: () => void;
  handleSubmit: () => void;
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = memo(({
  menuItems,
  handleMicClick,
  handleSubmit,
  children,
}) => {
  // Zustand 스토어에서 직접 구독
  const avatarMode = useAppStore((state) => state.chat.avatarMode);
  const currentCategory = useAppStore((state) => state.ui.currentCategory);
  const darkMode = useAppStore((state) => state.ui.darkMode);
  return (
    <div className="flex h-screen bg-[#e8e2d5] overflow-hidden">
      <Sidebar menuItems={menuItems} />

      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : ''}`}>
        {avatarMode ? (
          <AvatarMode />
        ) : currentCategory === 'home' ? (
          <>
            <ChatContainer />
            <PromptInput
              onMicClick={handleMicClick}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <>
            {children}
          </>
        )}
      </div>
    </div>
  );
});

