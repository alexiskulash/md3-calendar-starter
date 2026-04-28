import { useEffect, useRef, useMemo } from "react";
import { format, isToday } from "date-fns";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { WeekView } from "./WeekView";

// DayView wraps WeekView with days=1
interface DayViewProps {
  currentDate: Date;
  onEventClick: (event: CalendarEvent, anchor: { x: number; y: number }) => void;
  onCreateEvent: (date: string, time: string) => void;
}

export function DayView({ currentDate, onEventClick, onCreateEvent }: DayViewProps) {
  return (
    <WeekView
      currentDate={currentDate}
      days={1}
      onEventClick={onEventClick}
      onCreateEvent={onCreateEvent}
    />
  );
}
