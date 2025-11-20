"use client";

import React, { useMemo } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { useHomePage } from '@/app/hooks/useHomePage';
import { DiaryView } from '@/components/organisms/DiaryView';
import { CalendarView } from '@/components/organisms/CalendarView';
import { AccountView } from '@/components/organisms/AccountView';
import { CultureView } from '@/components/organisms/CultureView';
import { HealthView } from '@/components/organisms/HealthView';
import { PathfinderView } from '@/components/organisms/PathfinderView';
import { useAppStore } from '@/store/useAppStore';

export const HomePage: React.FC = () => {
  const hookData = useHomePage();
  const { handleMicClick, handleSubmit, menuItems } = hookData;

  // Zustand 스토어에서 직접 구독
  const currentCategory = useAppStore((state) => state.ui.currentCategory);

  // 카테고리별 컴포넌트 렌더링 (props drilling 제거)
  const categoryContent = useMemo(() => {
    switch (currentCategory) {
      case 'diary':
        return <DiaryView />;
      case 'calendar':
        return <CalendarView />;
      case 'account':
        return <AccountView />;
      case 'culture':
        return <CultureView />;
      case 'health':
        return <HealthView />;
      case 'path':
        return <PathfinderView />;
      default:
        return null;
    }
  }, [currentCategory]);

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

