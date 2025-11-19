import React, { useState } from 'react';
import { Button } from '../atoms';
import { AccountView as AccountViewType, Transaction } from '../types';
import { getLocalDateStr } from '../../lib';

interface AccountViewProps {
  accountView: AccountViewType;
  setAccountView: (view: AccountViewType) => void;
  darkMode?: boolean;
}

export const AccountView: React.FC<AccountViewProps> = ({
  accountView,
  setAccountView,
  darkMode = false,
}) => {
  const [transactions] = useState<Transaction[]>([]);
  const [dailySelectedDate, setDailySelectedDate] = useState(new Date());
  const [monthlySelectedMonth, setMonthlySelectedMonth] = useState(new Date());

  // Home 뷰
  if (accountView === 'home') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">💰 안녕하세요, Aiion님</h1>
            <div className="grid grid-cols-2 gap-6">
              <Button
                onClick={() => setAccountView('data')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-8 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📊</span>
                  <p className="text-xl font-bold text-gray-900">데이터 관리</p>
                </div>
              </Button>
              <Button
                onClick={() => setAccountView('daily')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-8 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📅</span>
                  <p className="text-xl font-bold text-gray-900">날짜별 지출</p>
                </div>
              </Button>
              <Button
                onClick={() => setAccountView('monthly')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-8 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">📈</span>
                  <p className="text-xl font-bold text-gray-900">월별 지출</p>
                </div>
              </Button>
              <Button
                onClick={() => setAccountView('income')}
                className="bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-8 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">💵</span>
                  <p className="text-xl font-bold text-gray-900">수익 관리</p>
                </div>
              </Button>
            </div>
            <Button
              onClick={() => setAccountView('tax')}
              className="w-full mt-6 bg-gradient-to-br from-white to-[#f5f0e8] rounded-2xl border-2 border-[#8B7355] p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl">📋</span>
                <p className="text-lg font-bold text-gray-900">세금 관리</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data 뷰
  if (accountView === 'data') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">데이터 관리</h1>
            <Button onClick={() => setAccountView('home')} variant="ghost">
              ← 돌아가기
            </Button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">거래 내역이 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{transaction.title}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {transaction.totalAmount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Daily 뷰
  if (accountView === 'daily') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">날짜별 지출</h1>
            <Button onClick={() => setAccountView('home')} variant="ghost">
              ← 돌아가기
            </Button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">
                {dailySelectedDate.getFullYear()}년 {dailySelectedDate.getMonth() + 1}월 {dailySelectedDate.getDate()}일
              </p>
            </div>
            <p className="text-center text-gray-500 py-8">해당 날짜의 지출 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // Monthly 뷰
  if (accountView === 'monthly') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">월별 지출</h1>
            <Button onClick={() => setAccountView('home')} variant="ghost">
              ← 돌아가기
            </Button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">
                {monthlySelectedMonth.getFullYear()}년 {monthlySelectedMonth.getMonth() + 1}월
              </p>
            </div>
            <p className="text-center text-gray-500 py-8">해당 월의 지출 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // Income 뷰
  if (accountView === 'income') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">수익 관리</h1>
            <Button onClick={() => setAccountView('home')} variant="ghost">
              ← 돌아가기
            </Button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">0원</p>
                <p className="text-gray-500">이번 달 수익</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f5f1e8] rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">저축</p>
                  <p className="text-xl font-bold text-gray-900">0원</p>
                </div>
                <div className="bg-[#f5f1e8] rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">투자</p>
                  <p className="text-xl font-bold text-gray-900">0원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tax 뷰
  if (accountView === 'tax') {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">세금 관리</h1>
            <Button onClick={() => setAccountView('home')} variant="ghost">
              ← 돌아가기
            </Button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#8B7355] p-8 shadow-lg">
            <p className="text-center text-gray-500 py-8">세금 정보가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
