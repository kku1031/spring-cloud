import React, { useState } from 'react';
import { Button } from '../atoms';
import { HealthView as HealthViewType } from '../types';

interface HealthViewProps {
  healthView: HealthViewType;
  setHealthView: (view: HealthViewType) => void;
  darkMode?: boolean;
}

export const HealthView: React.FC<HealthViewProps> = ({
  healthView,
  setHealthView,
  darkMode = false,
}) => {
  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState('');

  // Home 뷰
  if (healthView === 'home') {
  return (
    <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">헬스케어</h1>
            <div className="grid grid-cols-2 gap-6">
              <Button
                onClick={() => setHealthView('exercise')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">💪</span>
                  <p className="text-xl font-bold text-gray-900">운동</p>
                </div>
              </Button>
              <Button
                onClick={() => setHealthView('health')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">🏥</span>
                  <p className="text-xl font-bold text-gray-900">건강</p>
                </div>
              </Button>
              <Button
                onClick={() => setHealthView('records')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📊</span>
                  <p className="text-xl font-bold text-gray-900">기록</p>
                </div>
              </Button>
              <Button
                onClick={() => setHealthView('scan')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-12 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📷</span>
                  <p className="text-xl font-bold text-gray-900">스캔</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exercise 뷰
  if (healthView === 'exercise') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">운동</h1>
              <Button onClick={() => setHealthView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {['유산소', '근력', '요가', '필라테스', '수영'].map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedExerciseCategory(category)}
                      variant={selectedExerciseCategory === category ? 'primary' : 'ghost'}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-center text-gray-500 py-8">운동 기록이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Health 뷰
  if (healthView === 'health') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">건강 관리</h1>
              <Button onClick={() => setHealthView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5f1e8] rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">체중</p>
                    <p className="text-xl font-bold text-gray-900">- kg</p>
                  </div>
                  <div className="bg-[#f5f1e8] rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">혈압</p>
                    <p className="text-xl font-bold text-gray-900">- / -</p>
                  </div>
                </div>
                <p className="text-center text-gray-500 py-4">건강 정보가 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Records 뷰
  if (healthView === 'records') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">건강 기록</h1>
              <Button onClick={() => setHealthView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <p className="text-center text-gray-500 py-8">기록이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scan 뷰
  if (healthView === 'scan') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">스캔</h1>
              <Button onClick={() => setHealthView('home')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">건강 검진 결과를 스캔하여 저장할 수 있습니다.</p>
                <Button>스캔하기</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exercise-detail 뷰
  if (healthView === 'exercise-detail') {
    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">운동 상세</h1>
              <Button onClick={() => setHealthView('exercise')} variant="ghost">
                ← 돌아가기
              </Button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
              <p className="text-center text-gray-500 py-8">운동 상세 정보가 없습니다.</p>
            </div>
        </div>
      </div>
    </div>
  );
  }

  return null;
};
