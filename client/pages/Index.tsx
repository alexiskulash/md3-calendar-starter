import { useCallback, useState } from "react";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/divider/divider.js";
import { useIsMobile } from "../hooks/useIsMobile";

import { CalendarLayout } from "../components/calendar/CalendarLayout";
import { useCalendar } from "../components/calendar/CalendarContext";
import { TopBar } from "../components/calendar/TopBar";
import { Sidebar } from "../components/calendar/Sidebar";
import { MonthView } from "../components/calendar/MonthView";
import { WeekView } from "../components/calendar/WeekView";
import { DayView } from "../components/calendar/DayView";
import { ScheduleView } from "../components/calendar/ScheduleView";
import { EventDialog } from "../components/calendar/EventDialog";
import { EventPopover } from "../components/calendar/EventPopover";
import { UnhingedProvider, useUnhinged } from "../components/calendar/UnhingedContext";
import { CalendarEvent } from "../types/calendar";
import { format } from "date-fns";

// ─── Dialog state ─────────────────────────────────────────────────────────────

interface DialogState {
  open: boolean;
  event?: CalendarEvent | null;
  defaultDate?: string;
  defaultStartTime?: string;
}

interface PopoverState {
  event: CalendarEvent;
  anchor: { x: number; y: number };
}

// ─── Main calendar app (inside context) ──────────────────────────────────────

function CalendarApp() {
  const {
    selectedDate,
    viewMode,
    setSelectedDate,
    setViewMode,
    goNext,
    goPrev,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendar();

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? false : true
  );
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [popover, setPopover] = useState<PopoverState | null>(null);

  const { aggressiveTimeBoxing, ghostMode } = useUnhinged();

  // ── Event handlers ────────────────────────────────────────────────────────

  const openCreateDialog = useCallback((date?: string, time?: string) => {
    setDialog({ open: true, event: null, defaultDate: date, defaultStartTime: time });
    setPopover(null);
  }, []);

  const openEditDialog = useCallback((event: CalendarEvent) => {
    setDialog({ open: true, event });
    setPopover(null);
  }, []);

  const closeDialog = useCallback(() =>
    setDialog((prev) => ({ ...prev, open: false })), []);

  const handleSave = useCallback(
    (data: Omit<CalendarEvent, "id"> & { id?: string }) => {
      if (data.id) updateEvent(data as CalendarEvent);
      else { const { id: _, ...rest } = data as any; addEvent(rest); }
    },
    [addEvent, updateEvent]
  );

  const openPopover = useCallback(
    (event: CalendarEvent, anchor: { x: number; y: number }) => {
      setPopover({ event, anchor });
    },
    []
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setViewMode("day");
    },
    [setSelectedDate, setViewMode]
  );

  // ── Header label ──────────────────────────────────────────────────────────

  const headerLabel = (() => {
    if (viewMode === "month") return format(selectedDate, "MMMM yyyy");
    if (viewMode === "day") return format(selectedDate, "EEEE, MMMM d, yyyy");
    if (viewMode === "schedule") return format(selectedDate, "MMMM yyyy");
    if (viewMode === "3day") {
      const d = new Date(selectedDate);
      const end = new Date(selectedDate);
      end.setDate(d.getDate() + 2);
      if (d.getMonth() === end.getMonth())
        return `${format(d, "MMM d")} – ${format(end, "d, yyyy")}`;
      if (d.getFullYear() === end.getFullYear())
        return `${format(d, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
      return `${format(d, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
    }
    // week
    const d = new Date(selectedDate);
    const day = d.getDay();
    const sun = new Date(d); sun.setDate(d.getDate() - day);
    const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
    if (sun.getMonth() === sat.getMonth())
      return `${format(sun, "MMMM d")} – ${format(sat, "d, yyyy")}`;
    if (sun.getFullYear() === sat.getFullYear())
      return `${format(sun, "MMM d")} – ${format(sat, "MMM d, yyyy")}`;
    return `${format(sun, "MMM d, yyyy")} – ${format(sat, "MMM d, yyyy")}`;
  })();

  // ── View renderer ─────────────────────────────────────────────────────────

  const renderView = () => {
    if (viewMode === "month")
      return (
        <MonthView
          currentDate={selectedDate}
          onDayClick={handleDayClick}
          onEventClick={openPopover}
          onCreateEvent={(date) => openCreateDialog(date)}
        />
      );
    if (viewMode === "3day")
      return (
        <WeekView
          currentDate={selectedDate}
          days={3}
          onEventClick={openPopover}
          onCreateEvent={openCreateDialog}
        />
      );
    if (viewMode === "week")
      return (
        <WeekView
          currentDate={selectedDate}
          onEventClick={openPopover}
          onCreateEvent={openCreateDialog}
        />
      );
    if (viewMode === "day")
      return (
        <DayView
          currentDate={selectedDate}
          onEventClick={openPopover}
          onCreateEvent={openCreateDialog}
        />
      );
    return (
      <ScheduleView
        currentDate={selectedDate}
        onEventClick={openPopover}
      />
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "hsl(var(--md-sys-color-background))",
        overflow: "hidden",
      }}
    >
      {aggressiveTimeBoxing && (
        <div style={{
          backgroundColor: "red",
          color: "white",
          fontWeight: "bold",
          fontSize: "24px",
          textAlign: "center",
          padding: "10px",
          animation: "blink 1s infinite"
        }}>
          🚨 TIME-BOXING ENFORCED. OVERRUN MEETINGS WILL BE TERMINATED WITH PREJUDICE. 🚨
          <style>{`
            @keyframes blink { 50% { opacity: 0; } }
          `}</style>
        </div>
      )}
      {/* Top bar */}
      <TopBar
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        headerLabel={headerLabel}
      />

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Scrim for mobile drawer */}
        {isMobile && sidebarOpen && !ghostMode && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.32)",
              zIndex: 199,
            }}
          />
        )}

        {/* Sidebar — inline on desktop, overlay on mobile */}
        {sidebarOpen && !ghostMode && (
          <Sidebar
            onCreateEvent={() => openCreateDialog()}
            isOverlay={isMobile}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!ghostMode ? renderView() : (
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              opacity: 0.5,
            }}>
              <span style={{ fontSize: "120px", marginBottom: "16px" }}>👻</span>
              <h2>You have transcended the corporate plane.</h2>
              <p>There are no meetings here. Only peace.</p>
            </div>
          )}
        </main>
      </div>

      {/* Event create/edit dialog */}
      <EventDialog
        open={dialog.open}
        event={dialog.event}
        defaultDate={dialog.defaultDate}
        defaultStartTime={dialog.defaultStartTime}
        onSave={handleSave}
        onDelete={deleteEvent}
        onClose={closeDialog}
      />

      {/* Event detail popover */}
      {popover && (
        <EventPopover
          event={popover.event}
          anchor={popover.anchor}
          onClose={() => setPopover(null)}
          onEdit={openEditDialog}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <UnhingedProvider>
      <CalendarLayout>
        <CalendarApp />
      </CalendarLayout>
    </UnhingedProvider>
  );
}
