import { StateCreator } from "zustand";
import { AppStore } from "../types";
import { Event, Task } from "@/components/types";

export interface CalendarState {
  selectedDate: Date;
  currentMonth: Date;
  events: Event[];
  todayTasks: Task[];
}

export interface CalendarActions {
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (month: Date) => void;
  setEvents: (events: Event[]) => void;
  setTodayTasks: (tasks: Task[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
}

export interface CalendarSlice extends CalendarState, CalendarActions {}

export const createCalendarSlice: StateCreator<
  AppStore,
  [],
  [],
  CalendarSlice
> = (set) => ({
  // 초기 상태
  selectedDate: new Date(),
  currentMonth: new Date(),
  events: [],
  todayTasks: [],

  // Actions
  setSelectedDate: (date) => set((state) => ({
    calendar: { ...state.calendar, selectedDate: date }
  })),
  setCurrentMonth: (month) => set((state) => ({
    calendar: { ...state.calendar, currentMonth: month }
  })),
  setEvents: (events) => set((state) => ({
    calendar: { ...state.calendar, events }
  })),
  setTodayTasks: (tasks) => set((state) => ({
    calendar: { ...state.calendar, todayTasks: tasks }
  })),
  addEvent: (event) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: [...state.calendar.events, event]
    }
  })),
  updateEvent: (id, partialEvent) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: state.calendar.events.map(e =>
        e.id === id ? { ...e, ...partialEvent } : e
      )
    }
  })),
  removeEvent: (id) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: state.calendar.events.filter(e => e.id !== id)
    }
  })),
  addTask: (task) => set((state) => ({
    calendar: {
      ...state.calendar,
      todayTasks: [...state.calendar.todayTasks, task]
    }
  })),
  removeTask: (id) => set((state) => ({
    calendar: {
      ...state.calendar,
      todayTasks: state.calendar.todayTasks.filter(t => t.id !== id)
    }
  })),
});

