import React, { useRef, memo } from 'react';
import { Icon } from '../atoms';
import { Toggle } from '../atoms';
import { MenuItem, Category } from '../types';

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
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  currentCategory,
  setCurrentCategory,
  menuItems,
  isDragging,
  setIsDragging,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSidebarDrag = (e: React.MouseEvent) => {
    if (!sidebarOpen) return;

    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = sidebarRef.current?.offsetWidth || 256;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(64, Math.min(400, startWidth + diff));
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-[#f5f1e8] border-r border-[#d4cdc0] transition-all duration-300 flex flex-col relative`}
    >
      {/* Sidebar Handle */}
      <div
        onMouseDown={handleSidebarDrag}
        className={`absolute ${sidebarOpen ? 'left-full' : 'left-0'} top-0 bottom-0 w-1 bg-[#d4cdc0] hover:bg-[#8B7355] cursor-col-resize z-10 transition-colors`}
        title="사이드바 손잡이"
      />

      {/* Menu Header */}
      <div className="p-4 border-b border-[#d4cdc0]">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
            <img
              src="/aiionlogo.png"
              alt="Aiion Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <div className="mb-2">
          {sidebarOpen && (
            <p className="text-xs text-gray-500 uppercase px-3 py-2 font-semibold">menu</p>
          )}
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentCategory(item.id as Category)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              currentCategory === item.id
                ? 'bg-[#d4cdc0] text-gray-900 font-semibold'
                : 'hover:bg-[#e8e2d5] text-gray-700'
            }`}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="p-2 border-t border-[#d4cdc0]">
        <Toggle
          checked={darkMode}
          onChange={setDarkMode}
          label={sidebarOpen ? '다크 모드' : undefined}
        />
      </div>

      {/* Sidebar Toggle */}
      <div className="p-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e8e2d5] transition-colors"
        >
          <Icon name={sidebarOpen ? 'arrowLeft' : 'arrowRight'} />
          {sidebarOpen && <span className="text-gray-700 font-medium">접기</span>}
        </button>
      </div>
    </div>
  );
});

