import { useCallback, useMemo, useState } from "react";
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { Calendar, ViewMode } from "../../types/calendar";
import { CalendarContext } from "./CalendarContext";
import { useAuth } from "../../context/AuthContext";

// ─── Static calendars ─────────────────────────────────────────────────────────

const CALENDARS: Calendar[] = [
  { id: "me",         name: "Alex Chen",        color: "#0B57D0", kind: "mine" },
  { id: "work",       name: "Work",              color: "#33B679", kind: "mine" },
  { id: "family",     name: "Family",            color: "#8E24AA", kind: "mine" },
  { id: "tasks",      name: "Tasks",             color: "#039BE5", kind: "mine" },
  { id: "birthdays",  name: "Birthdays",         color: "#E67C73", kind: "other" },
  { id: "holidays",   name: "Holidays in US",    color: "#616161", kind: "other" },
  { id: "sf-giants",  name: "SF Giants",         color: "#F4511E", kind: "other" },
];

// ─── Provider component ───────────────────────────────────────────────────────

interface CalendarLayoutProps {
  children: React.ReactNode;
}

export function CalendarLayout({ children }: CalendarLayoutProps) {
  // "Today" is Apr 28 2026 to match the design data
  const today = useMemo(() => new Date(2026, 3, 28, 10, 24), []);

  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "day" : "week"
  );
  const { events, addEvent, updateEvent, deleteEvent } = useAuth();
  const [search, setSearch] = useState("");
  const [use24h, setUse24h] = useState(false);
  const [weekStartsMonday, setWeekStartsMonday] = useState(false);

  const initialCalOn = useMemo<Record<string, boolean>>(() => {
    const on: Record<string, boolean> = {};
    CALENDARS.forEach((c) => (on[c.id] = true));
    return on;
  }, []);
  const [calOn, setCalOn] = useState(initialCalOn);

  const toggleCal = useCallback((id: string) => {
    setCalOn((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const getCalendar = useCallback(
    (id: string) => CALENDARS.find((c) => c.id === id),
    []
  );

  const filteredEvents = useMemo(() => {
    let result = events.filter((e) => calOn[e.cal]);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.loc ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, calOn, search]);

  const goNext = useCallback(() => {
    setSelectedDate((prev) => {
      if (viewMode === "day") return addDays(prev, 1);
      if (viewMode === "week") return addWeeks(prev, 1);
      if (viewMode === "schedule") return addDays(prev, 7);
      return addMonths(prev, 1);
    });
  }, [viewMode]);

  const goPrev = useCallback(() => {
    setSelectedDate((prev) => {
      if (viewMode === "day") return subDays(prev, 1);
      if (viewMode === "week") return subWeeks(prev, 1);
      if (viewMode === "schedule") return subDays(prev, 7);
      return subMonths(prev, 1);
    });
  }, [viewMode]);

  const goToday = useCallback(() => setSelectedDate(today), [today]);

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        viewMode,
        events,
        calendars: CALENDARS,
        calOn,
        search,
        filteredEvents,
        setSelectedDate,
        setViewMode,
        setSearch,
        toggleCal,
        goNext,
        goPrev,
        goToday,
        addEvent,
        updateEvent,
        deleteEvent,
        getCalendar,
        use24h,
        weekStartsMonday,
        setUse24h,
        setWeekStartsMonday,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
