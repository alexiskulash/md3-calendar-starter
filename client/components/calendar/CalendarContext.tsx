import { createContext, useContext } from "react";
import { Calendar, CalendarEvent, ViewMode } from "../../types/calendar";

export interface CalendarContextValue {
  selectedDate: Date;
  viewMode: ViewMode;
  events: CalendarEvent[];
  calendars: Calendar[];
  calOn: Record<string, boolean>;
  search: string;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearch: (s: string) => void;
  toggleCal: (id: string) => void;
  goNext: () => void;
  goPrev: () => void;
  goToday: () => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  getCalendar: (id: string) => Calendar | undefined;
  filteredEvents: CalendarEvent[];
  use24h: boolean;
  weekStartsMonday: boolean;
  darkMode: boolean;
  setUse24h: (v: boolean) => void;
  setWeekStartsMonday: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
}

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarLayout");
  return ctx;
}
