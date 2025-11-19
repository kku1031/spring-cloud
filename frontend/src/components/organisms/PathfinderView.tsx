import React, { useState } from 'react';
import { Button } from '../atoms';
import { PathfinderView as PathfinderViewType } from '../types';

interface PathfinderViewProps {
  pathfinderView: PathfinderViewType;
  setPathfinderView: (view: PathfinderViewType) => void;
  darkMode?: boolean;
}

export const PathfinderView: React.FC<PathfinderViewProps> = ({
  pathfinderView,
  setPathfinderView,
  darkMode = false,
}) => {
  // Home 뷰
  if (pathfinderView === 'home') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Path Finder</h1>
            <div className="grid grid-cols-2 gap-6">
              <Button
                onClick={() => setPathfinderView('learning')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📚</span>
                  <p className="text-xl font-bold text-gray-900">학습</p>
                </div>
              </Button>
              <Button
                onClick={() => setPathfinderView('new-learning')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">✨</span>
                  <p className="text-xl font-bold text-gray-900">새 학습</p>
                </div>
              </Button>
              <Button
                onClick={() => setPathfinderView('career')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">💼</span>
                  <p className="text-xl font-bold text-gray-900">커리어</p>
                </div>
              </Button>
              <Button
                onClick={() => setPathfinderView('roadmap')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">🗺️</span>
                  <p className="text-xl font-bold text-gray-900">로드맵</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Learning 뷰
  if (pathfinderView === 'learning') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">학습</h1>
              <Button onClick={() => setPathfinderView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <p className="text-center text-gray-500 py-8">학습 목록이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New-learning 뷰
  if (pathfinderView === 'new-learning') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">새 학습 시작</h1>
              <Button onClick={() => setPathfinderView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학습 주제
                  </label>
                  <input
                    type="text"
                    placeholder="학습하고 싶은 주제를 입력하세요"
                    className="w-full px-4 py-2 border-2 border-[#d4c4a8] rounded-lg focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표
                  </label>
                  <textarea
                    placeholder="학습 목표를 입력하세요"
                    rows={5}
                    className="w-full px-4 py-2 border-2 border-[#d4c4a8] rounded-lg focus:outline-none focus:border-[#8B7355] resize-none"
                  />
                </div>
                <Button className="w-full">학습 시작하기</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Career 뷰
  if (pathfinderView === 'career') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">커리어</h1>
              <Button onClick={() => setPathfinderView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <p className="text-center text-gray-500 py-8">커리어 정보가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Roadmap 뷰
  if (pathfinderView === 'roadmap') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">로드맵</h1>
              <Button onClick={() => setPathfinderView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <p className="text-center text-gray-500 py-8">로드맵이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
