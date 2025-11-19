import React from 'react';
import { Button, Input } from '../atoms';
import { Event, Task } from '../types';
import { getLocalDateStr } from '../../lib';

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  todayTasks: Task[];
  setTodayTasks: (tasks: Task[]) => void;
  darkMode?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  events,
  setEvents,
  todayTasks,
  setTodayTasks,
  darkMode = false,
}) => {
  return (
    <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-[#e8e2d5]'}`}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
              }
              variant="ghost"
            >
              ←
            </Button>
            <h2 className="text-xl font-bold text-gray-900">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </h2>
            <Button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
              }
              variant="ghost"
            >
              →
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className={`text-center text-base font-semibold py-3 ${day === '일' ? 'text-red-500' : 'text-gray-600'}`}>
                {day}
              </div>
            ))}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-4"></div>
            ))}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, index) => {
              const day = index + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dateStr = getLocalDateStr(date);
              const todayStr = getLocalDateStr(new Date());
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === getLocalDateStr(selectedDate);
              const hasEvents = events.some((e) => e.date === dateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`p-4 rounded-lg text-base font-medium transition-colors min-h-[60px] flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#8B7355] text-white'
                      : isToday
                      ? 'bg-[#d4cdc0] text-gray-900 font-bold'
                      : 'hover:bg-[#f5f1e8]'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            일정 목록 - {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
          </h3>
          <div className="space-y-2">
            {events
              .filter((e) => e.date === getLocalDateStr(selectedDate))
              .map((event) => (
                <div key={event.id} className="p-3 bg-[#f5f1e8] rounded-lg">
                  <div className="font-medium text-gray-900">{event.text}</div>
                  <div className="text-sm text-gray-500">
                    {event.isAllDay ? '하루종일' : event.time}
                  </div>
                </div>
              ))}
            {events.filter((e) => e.date === getLocalDateStr(selectedDate)).length === 0 && (
              <p className="text-gray-500 text-center py-4">일정이 없습니다</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

