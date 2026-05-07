import { useCallback, useMemo, useState } from "react";
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { Calendar, CalendarEvent, ViewMode } from "../../types/calendar";
import { CalendarContext } from "./CalendarContext";

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

// ─── Seed data ────────────────────────────────────────────────────────────────

function d(month0: number, day: number, h: number, m: number = 0): string {
  // Returns YYYY-MM-DD string. month0 is 0-based (3=April)
  const year = 2026;
  const date = new Date(year, month0, day);
  return format(date, "yyyy-MM-dd");
}

function t(h: number, m: number = 0): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function generateSeedEvents(): CalendarEvent[] {
  return [
    // ── Monday Apr 27
    { id: "e1",  cal: "work",   title: "Team standup",        date: d(3,27,9),   startTime: t(9),     endTime: t(9,30),  loc: "Zoom",          attendees: 8 },
    { id: "e2",  cal: "work",   title: "Q2 roadmap review",   date: d(3,27,10),  startTime: t(10),    endTime: t(11,30), loc: "Mission room",  attendees: 12, desc: "Walk through Q2 commitments and stretch goals." },
    { id: "e3",  cal: "me",     title: "Lunch w/ Priya",      date: d(3,27,12),  startTime: t(12,30), endTime: t(13,30), loc: "Souvla",        attendees: 2 },
    { id: "e4",  cal: "work",   title: "Design crit",         date: d(3,27,14),  startTime: t(14),    endTime: t(15),    loc: "Studio A",      attendees: 6 },
    { id: "e5",  cal: "family", title: "Pickup Maya",         date: d(3,27,16),  startTime: t(16,30), endTime: t(17) },

    // ── Tuesday Apr 28 (today)
    { id: "e6",  cal: "work",   title: "Team standup",        date: d(3,28,9),   startTime: t(9),     endTime: t(9,30) },
    { id: "e7",  cal: "work",   title: "1:1 with Marcus",     date: d(3,28,10),  startTime: t(10),    endTime: t(10,45), loc: "Coffee bar" },
    { id: "e8",  cal: "work",   title: "Calendar redesign review", date: d(3,28,11), startTime: t(11), endTime: t(12),  loc: "Maps room",     attendees: 5, desc: "Review hi-fi mocks, decide on view-switcher pattern." },
    { id: "e9",  cal: "me",     title: "Yoga",                date: d(3,28,12),  startTime: t(12,15), endTime: t(13,15), loc: "Glow Studio" },
    { id: "e10", cal: "work",   title: "Customer interview",  date: d(3,28,14),  startTime: t(14),    endTime: t(15),    loc: "Zoom",          attendees: 3 },
    { id: "e11", cal: "work",   title: "Eng sync",            date: d(3,28,15),  startTime: t(15,30), endTime: t(16,30), loc: "Pluto" },
    { id: "e12", cal: "family", title: "Soccer practice",     date: d(3,28,17),  startTime: t(17,30), endTime: t(19),    loc: "Crocker field" },

    // ── Wednesday Apr 29
    { id: "e13", cal: "work",   title: "Team standup",        date: d(3,29,9),   startTime: t(9),     endTime: t(9,30) },
    { id: "e14", cal: "work",   title: "Focus time",          date: d(3,29,9),   startTime: t(9,30),  endTime: t(12) },
    { id: "e15", cal: "me",     title: "Dentist",             date: d(3,29,13),  startTime: t(13),    endTime: t(14),    loc: "450 Sutter" },
    { id: "e16", cal: "work",   title: "All hands",           date: d(3,29,15),  startTime: t(15),    endTime: t(16),    loc: "Auditorium" },
    { id: "e17", cal: "me",     title: "Run w/ Jamie",        date: d(3,29,18),  startTime: t(18),    endTime: t(19),    loc: "Embarcadero" },

    // ── Thursday Apr 30
    { id: "e18", cal: "work",   title: "Team standup",        date: d(3,30,9),   startTime: t(9),     endTime: t(9,30) },
    { id: "e19", cal: "work",   title: "Design system WG",    date: d(3,30,10),  startTime: t(10),    endTime: t(11) },
    { id: "e20", cal: "work",   title: "Spec review: motion", date: d(3,30,11),  startTime: t(11),    endTime: t(12),    loc: "Saturn" },
    { id: "e21", cal: "me",     title: "Lunch",               date: d(3,30,12),  startTime: t(12,30), endTime: t(13,30) },
    { id: "e22", cal: "work",   title: "Roadmap planning",    date: d(3,30,13),  startTime: t(13,30), endTime: t(15,30), loc: "Mission room",  attendees: 10 },
    { id: "e23", cal: "work",   title: "1:1 with Sam",        date: d(3,30,16),  startTime: t(16),    endTime: t(16,30) },

    // ── Friday May 1
    { id: "e24", cal: "work",   title: "Team standup",        date: d(4,1,9),    startTime: t(9),     endTime: t(9,30) },
    { id: "e25", cal: "work",   title: "Sprint demo",         date: d(4,1,10),   startTime: t(10),    endTime: t(11),    loc: "Auditorium",    attendees: 24 },
    { id: "e26", cal: "work",   title: "Retro",               date: d(4,1,11),   startTime: t(11),    endTime: t(12) },
    { id: "e27", cal: "family", title: "Movie night",         date: d(4,1,19),   startTime: t(19),    endTime: t(21,30), loc: "Home" },
    { id: "e28", cal: "work",   title: "Focus: writing",      date: d(4,1,14),   startTime: t(14),    endTime: t(16,30) },

    // ── Saturday May 2
    { id: "e29", cal: "family", title: "Farmers market",      date: d(4,2,9),    startTime: t(9,30),  endTime: t(11) },
    { id: "e30", cal: "sf-giants", title: "Giants vs Dodgers",date: d(4,2,13),   startTime: t(13,5),  endTime: t(16),    loc: "Oracle Park" },
    { id: "e31", cal: "me",     title: "Dinner at Nopa",      date: d(4,2,19),   startTime: t(19),    endTime: t(21),    loc: "Nopa", attendees: 4 },

    // ── Sunday May 3
    { id: "e32", cal: "family", title: "Brunch w/ parents",   date: d(4,3,10),   startTime: t(10),    endTime: t(12),    loc: "Foreign Cinema" },
    { id: "e33", cal: "me",     title: "Hike - Marin",        date: d(4,3,13),   startTime: t(13),    endTime: t(16),    loc: "Tennessee Valley" },
  ];
}

import { useAuth } from "../../contexts/AuthContext";

// ─── Provider component ───────────────────────────────────────────────────────

interface CalendarLayoutProps {
  children: React.ReactNode;
}

export function CalendarLayout({ children }: CalendarLayoutProps) {
  const { activeAccount } = useAuth();

  // "Today" is Apr 28 2026 to match the design data
  const today = useMemo(() => new Date(2026, 3, 28, 10, 24), []);

  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "day" : "week"
  );

  // Isolate events by active account
  const [allEvents, setAllEvents] = useState<Record<string, CalendarEvent[]>>({
    [activeAccount?.id || ""]: generateSeedEvents()
  });

  const events = useMemo(() => {
    if (!activeAccount) return [];
    return allEvents[activeAccount.id] || [];
  }, [allEvents, activeAccount]);

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

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    if (!activeAccount) return;
    const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setAllEvents((prev) => ({
      ...prev,
      [activeAccount.id]: [...(prev[activeAccount.id] || []), { ...event, id }]
    }));
  }, [activeAccount]);

  const updateEvent = useCallback((updated: CalendarEvent) => {
    if (!activeAccount) return;
    setAllEvents((prev) => ({
      ...prev,
      [activeAccount.id]: (prev[activeAccount.id] || []).map((e) => (e.id === updated.id ? updated : e))
    }));
  }, [activeAccount]);

  const deleteEvent = useCallback((id: string) => {
    if (!activeAccount) return;
    setAllEvents((prev) => ({
      ...prev,
      [activeAccount.id]: (prev[activeAccount.id] || []).filter((e) => e.id !== id)
    }));
  }, [activeAccount]);

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
