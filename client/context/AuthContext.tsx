import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { format } from "date-fns";
import { Account } from "../types/auth";
import { CalendarEvent } from "../types/calendar";

// ─── Accounts ─────────────────────────────────────────────────────────────────

export const ACCOUNTS: Account[] = [
  { id: "alex",  name: "Alex Chen",   email: "alex.chen@gmail.com",  initials: "AC", color: "#0B57D0" },
  { id: "priya", name: "Priya Patel", email: "priya.patel@work.com", initials: "PP", color: "#33B679" },
  { id: "sam",   name: "Sam Kim",     email: "sam.kim@gmail.com",    initials: "SK", color: "#8E24AA" },
];

// ─── Seed event generators ────────────────────────────────────────────────────

function d(month0: number, day: number): string {
  return format(new Date(2026, month0, day), "yyyy-MM-dd");
}

function t(h: number, m = 0): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function generateAlexEvents(): CalendarEvent[] {
  return [
    // Monday Apr 27
    { id: "a-e1",  cal: "work",      title: "Team standup",             date: d(3,27), startTime: t(9),     endTime: t(9,30),  loc: "Zoom",          attendees: 8 },
    { id: "a-e2",  cal: "work",      title: "Q2 roadmap review",        date: d(3,27), startTime: t(10),    endTime: t(11,30), loc: "Mission room",  attendees: 12, desc: "Walk through Q2 commitments." },
    { id: "a-e3",  cal: "me",        title: "Lunch w/ Priya",           date: d(3,27), startTime: t(12,30), endTime: t(13,30), loc: "Souvla",        attendees: 2 },
    { id: "a-e4",  cal: "work",      title: "Design crit",              date: d(3,27), startTime: t(14),    endTime: t(15),    loc: "Studio A",      attendees: 6 },
    { id: "a-e5",  cal: "family",    title: "Pickup Maya",              date: d(3,27), startTime: t(16,30), endTime: t(17) },
    // Tuesday Apr 28
    { id: "a-e6",  cal: "work",      title: "Team standup",             date: d(3,28), startTime: t(9),     endTime: t(9,30) },
    { id: "a-e7",  cal: "work",      title: "1:1 with Marcus",          date: d(3,28), startTime: t(10),    endTime: t(10,45), loc: "Coffee bar" },
    { id: "a-e8",  cal: "work",      title: "Calendar redesign review", date: d(3,28), startTime: t(11),    endTime: t(12),    loc: "Maps room",     attendees: 5 },
    { id: "a-e9",  cal: "me",        title: "Yoga",                     date: d(3,28), startTime: t(12,15), endTime: t(13,15), loc: "Glow Studio" },
    { id: "a-e10", cal: "work",      title: "Customer interview",       date: d(3,28), startTime: t(14),    endTime: t(15),    loc: "Zoom",          attendees: 3 },
    { id: "a-e11", cal: "work",      title: "Eng sync",                 date: d(3,28), startTime: t(15,30), endTime: t(16,30), loc: "Pluto" },
    { id: "a-e12", cal: "family",    title: "Soccer practice",          date: d(3,28), startTime: t(17,30), endTime: t(19),    loc: "Crocker field" },
    // Wednesday Apr 29
    { id: "a-e13", cal: "work",      title: "Team standup",             date: d(3,29), startTime: t(9),     endTime: t(9,30) },
    { id: "a-e14", cal: "work",      title: "Focus time",               date: d(3,29), startTime: t(9,30),  endTime: t(12) },
    { id: "a-e15", cal: "me",        title: "Dentist",                  date: d(3,29), startTime: t(13),    endTime: t(14),    loc: "450 Sutter" },
    { id: "a-e16", cal: "work",      title: "All hands",                date: d(3,29), startTime: t(15),    endTime: t(16),    loc: "Auditorium" },
    { id: "a-e17", cal: "me",        title: "Run w/ Jamie",             date: d(3,29), startTime: t(18),    endTime: t(19),    loc: "Embarcadero" },
    // Thursday Apr 30
    { id: "a-e18", cal: "work",      title: "Team standup",             date: d(3,30), startTime: t(9),     endTime: t(9,30) },
    { id: "a-e19", cal: "work",      title: "Design system WG",         date: d(3,30), startTime: t(10),    endTime: t(11) },
    { id: "a-e20", cal: "work",      title: "Spec review: motion",      date: d(3,30), startTime: t(11),    endTime: t(12),    loc: "Saturn" },
    { id: "a-e21", cal: "me",        title: "Lunch",                    date: d(3,30), startTime: t(12,30), endTime: t(13,30) },
    { id: "a-e22", cal: "work",      title: "Roadmap planning",         date: d(3,30), startTime: t(13,30), endTime: t(15,30), loc: "Mission room",  attendees: 10 },
    { id: "a-e23", cal: "work",      title: "1:1 with Sam",             date: d(3,30), startTime: t(16),    endTime: t(16,30) },
    // Friday May 1
    { id: "a-e24", cal: "work",      title: "Team standup",             date: d(4,1),  startTime: t(9),     endTime: t(9,30) },
    { id: "a-e25", cal: "work",      title: "Sprint demo",              date: d(4,1),  startTime: t(10),    endTime: t(11),    loc: "Auditorium",    attendees: 24 },
    { id: "a-e26", cal: "work",      title: "Retro",                    date: d(4,1),  startTime: t(11),    endTime: t(12) },
    { id: "a-e27", cal: "family",    title: "Movie night",              date: d(4,1),  startTime: t(19),    endTime: t(21,30), loc: "Home" },
    { id: "a-e28", cal: "work",      title: "Focus: writing",           date: d(4,1),  startTime: t(14),    endTime: t(16,30) },
    // Weekend
    { id: "a-e29", cal: "family",    title: "Farmers market",           date: d(4,2),  startTime: t(9,30),  endTime: t(11) },
    { id: "a-e30", cal: "sf-giants", title: "Giants vs Dodgers",        date: d(4,2),  startTime: t(13,5),  endTime: t(16),    loc: "Oracle Park" },
    { id: "a-e31", cal: "me",        title: "Dinner at Nopa",           date: d(4,2),  startTime: t(19),    endTime: t(21),    loc: "Nopa",          attendees: 4 },
    { id: "a-e32", cal: "family",    title: "Brunch w/ parents",        date: d(4,3),  startTime: t(10),    endTime: t(12),    loc: "Foreign Cinema" },
    { id: "a-e33", cal: "me",        title: "Hike - Marin",             date: d(4,3),  startTime: t(13),    endTime: t(16),    loc: "Tennessee Valley" },
  ];
}

function generatePriyaEvents(): CalendarEvent[] {
  return [
    { id: "p-e1",  cal: "work",   title: "Sprint planning",       date: d(3,27), startTime: t(9),     endTime: t(10,30), loc: "Zoom",           attendees: 7 },
    { id: "p-e2",  cal: "work",   title: "Code review",           date: d(3,27), startTime: t(11),    endTime: t(12) },
    { id: "p-e3",  cal: "me",     title: "Lunch w/ Alex",         date: d(3,27), startTime: t(12,30), endTime: t(13,30), loc: "Souvla" },
    { id: "p-e4",  cal: "work",   title: "Feature demo",          date: d(3,27), startTime: t(15),    endTime: t(16),    loc: "Main stage",     attendees: 20 },
    { id: "p-e5",  cal: "work",   title: "Standup",               date: d(3,28), startTime: t(9,30),  endTime: t(10) },
    { id: "p-e6",  cal: "work",   title: "Architecture review",   date: d(3,28), startTime: t(11),    endTime: t(12,30), loc: "Room B",         attendees: 4 },
    { id: "p-e7",  cal: "me",     title: "Coffee w/ mentor",      date: d(3,28), startTime: t(14),    endTime: t(15),    loc: "Blue Bottle" },
    { id: "p-e8",  cal: "work",   title: "Standup",               date: d(3,29), startTime: t(9,30),  endTime: t(10) },
    { id: "p-e9",  cal: "work",   title: "Product sync",          date: d(3,29), startTime: t(13),    endTime: t(14),    loc: "Zoom",           attendees: 8 },
    { id: "p-e10", cal: "family", title: "Team dinner",           date: d(3,29), startTime: t(18,30), endTime: t(21),    loc: "Wayfare Tavern" },
    { id: "p-e11", cal: "work",   title: "Standup",               date: d(3,30), startTime: t(9,30),  endTime: t(10) },
    { id: "p-e12", cal: "work",   title: "Q2 planning session",   date: d(3,30), startTime: t(10,30), endTime: t(12),    loc: "Conf room 3",    attendees: 6 },
    { id: "p-e13", cal: "me",     title: "Gym",                   date: d(3,30), startTime: t(17,30), endTime: t(18,30), loc: "Equinox" },
    { id: "p-e14", cal: "work",   title: "Sprint demo",           date: d(4,1),  startTime: t(10),    endTime: t(11),    loc: "Auditorium",     attendees: 24 },
    { id: "p-e15", cal: "family", title: "Weekend brunch",        date: d(4,2),  startTime: t(10,30), endTime: t(12) },
  ];
}

function generateSamEvents(): CalendarEvent[] {
  return [
    { id: "s-e1",  cal: "me",        title: "Morning run",        date: d(3,27), startTime: t(7),     endTime: t(8) },
    { id: "s-e2",  cal: "work",      title: "1:1 with Alex",      date: d(3,27), startTime: t(10),    endTime: t(10,30) },
    { id: "s-e3",  cal: "me",        title: "Pilates",            date: d(3,28), startTime: t(7,30),  endTime: t(8,30),  loc: "Studiomix" },
    { id: "s-e4",  cal: "work",      title: "Weekly sync",        date: d(3,28), startTime: t(10),    endTime: t(11),    loc: "Zoom",          attendees: 5 },
    { id: "s-e5",  cal: "me",        title: "Lunch w/ Jordan",    date: d(3,28), startTime: t(12,30), endTime: t(13,30), loc: "Tartine" },
    { id: "s-e6",  cal: "work",      title: "Design review",      date: d(3,28), startTime: t(15),    endTime: t(16),    loc: "Studio A",      attendees: 4 },
    { id: "s-e7",  cal: "me",        title: "Morning run",        date: d(3,29), startTime: t(7),     endTime: t(8) },
    { id: "s-e8",  cal: "work",      title: "All hands",          date: d(3,29), startTime: t(15),    endTime: t(16),    loc: "Auditorium" },
    { id: "s-e9",  cal: "family",    title: "Book club",          date: d(3,29), startTime: t(19),    endTime: t(21),    loc: "Home" },
    { id: "s-e10", cal: "me",        title: "Gym",                date: d(3,30), startTime: t(7),     endTime: t(8),     loc: "Equinox" },
    { id: "s-e11", cal: "work",      title: "Sprint demo",        date: d(4,1),  startTime: t(10),    endTime: t(11),    loc: "Auditorium",    attendees: 24 },
    { id: "s-e12", cal: "sf-giants", title: "Giants vs Dodgers",  date: d(4,2),  startTime: t(13,5),  endTime: t(16),    loc: "Oracle Park" },
    { id: "s-e13", cal: "me",        title: "Dinner w/ friends",  date: d(4,2),  startTime: t(18,30), endTime: t(21),    loc: "Nopa" },
    { id: "s-e14", cal: "family",    title: "Sunday hike",        date: d(4,3),  startTime: t(9),     endTime: t(12),    loc: "Marin Headlands" },
  ];
}

function initAccountEvents(): Record<string, CalendarEvent[]> {
  return {
    alex: generateAlexEvents(),
    priya: generatePriyaEvents(),
    sam: generateSamEvents(),
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  activeAccountId: string | null;
  activeAccount: Account | null;
  accounts: Account[];
  events: CalendarEvent[];
  addEvent: (e: Omit<CalendarEvent, "id">) => void;
  updateEvent: (e: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  signIn: (accountId: string) => void;
  switchAccount: (accountId: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [accountEvents, setAccountEvents] = useState<Record<string, CalendarEvent[]>>(
    initAccountEvents
  );

  const activeAccount = useMemo(
    () => ACCOUNTS.find((a) => a.id === activeAccountId) ?? null,
    [activeAccountId]
  );

  const events = useMemo(
    () => (activeAccountId ? (accountEvents[activeAccountId] ?? []) : []),
    [activeAccountId, accountEvents]
  );

  const addEvent = useCallback(
    (event: Omit<CalendarEvent, "id">) => {
      if (!activeAccountId) return;
      const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setAccountEvents((prev) => ({
        ...prev,
        [activeAccountId]: [...(prev[activeAccountId] ?? []), { ...event, id }],
      }));
    },
    [activeAccountId]
  );

  const updateEvent = useCallback(
    (updated: CalendarEvent) => {
      if (!activeAccountId) return;
      setAccountEvents((prev) => ({
        ...prev,
        [activeAccountId]: (prev[activeAccountId] ?? []).map((e) =>
          e.id === updated.id ? updated : e
        ),
      }));
    },
    [activeAccountId]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      if (!activeAccountId) return;
      setAccountEvents((prev) => ({
        ...prev,
        [activeAccountId]: (prev[activeAccountId] ?? []).filter((e) => e.id !== id),
      }));
    },
    [activeAccountId]
  );

  const signIn = useCallback((accountId: string) => setActiveAccountId(accountId), []);
  const switchAccount = useCallback((accountId: string) => setActiveAccountId(accountId), []);
  const signOut = useCallback(() => setActiveAccountId(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      activeAccountId,
      activeAccount,
      accounts: ACCOUNTS,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      signIn,
      switchAccount,
      signOut,
    }),
    [activeAccountId, activeAccount, events, addEvent, updateEvent, deleteEvent, signIn, switchAccount, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
