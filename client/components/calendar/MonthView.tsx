import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface MonthViewProps {
  currentDate: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, anchor: { x: number; y: number }) => void;
  onCreateEvent: (date: string) => void;
}

const DAY_HEADERS_SUN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_HEADERS_MON = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MAX_VISIBLE = 3;

export function MonthView({ currentDate, onDayClick, onEventClick, onCreateEvent }: MonthViewProps) {
  const { filteredEvents, getCalendar, weekStartsMonday } = useCalendar();
  const isMobile = useIsMobile();
  const weekOpts = { weekStartsOn: (weekStartsMonday ? 1 : 0) as 0 | 1 };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), weekOpts),
    end: endOfWeek(endOfMonth(currentDate), weekOpts),
  });

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayStr = format(day, "yyyy-MM-dd");
    return filteredEvents
      .filter((e) => !e.allDay && e.date === dayStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Day-of-week headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        {(weekStartsMonday ? DAY_HEADERS_MON : DAY_HEADERS_SUN).map((d) => (
          <div
            key={d}
            style={{
              padding: isMobile ? "6px 4px" : "8px 12px",
              fontSize: isMobile ? 10 : 11,
              fontWeight: 500,
              letterSpacing: "0.8px",
              textAlign: isMobile ? "center" : undefined,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            {isMobile ? d.slice(0, 1) : d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridAutoRows: "1fr",
          flex: 1,
          overflow: "auto",
        }}
      >
        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const dayEvents = getEventsForDay(day);
          const visible = dayEvents.slice(0, MAX_VISIBLE);
          const overflow = dayEvents.length - visible.length;
          const inMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={dayStr}
              onClick={() => {
                onCreateEvent(dayStr);
                onDayClick(day);
              }}
              style={{
                borderLeft: "1px solid hsl(var(--md-sys-color-outline-variant))",
                borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
                padding: isMobile ? "2px 3px" : "4px 6px",
                minHeight: isMobile ? 64 : 96,
                cursor: "pointer",
                backgroundColor: inMonth
                  ? "transparent"
                  : "hsl(var(--md-sys-color-surface-container-low))",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = inMonth
                  ? "transparent"
                  : "hsl(var(--md-sys-color-surface-container-low))";
              }}
            >
              {/* Date number */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: isMobile ? 20 : 24,
                    height: isMobile ? 20 : 24,
                    padding: "0 4px",
                    borderRadius: 12,
                    fontSize: isMobile ? 11 : 12,
                    fontWeight: isDayToday ? 600 : 500,
                    backgroundColor: isDayToday
                      ? "hsl(var(--md-sys-color-primary))"
                      : "transparent",
                    color: isDayToday
                      ? "hsl(var(--md-sys-color-on-primary))"
                      : inMonth
                      ? "hsl(var(--md-sys-color-on-surface))"
                      : "hsl(var(--md-sys-color-outline))",
                  }}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Events */}
              {visible.map((ev) => {
                const cal = getCalendar(ev.cal);
                const color = cal?.color ?? "#0B57D0";
                return (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      onEventClick(ev, { x: rect.right + 8, y: rect.top });
                    }}
                    style={{
                      border: 0,
                      padding: isMobile ? "1px 3px" : "2px 6px",
                      borderRadius: 4,
                      textAlign: "left",
                      backgroundColor: "transparent",
                      color: "hsl(var(--md-sys-color-on-surface))",
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "inherit",
                      width: "100%",
                    }}
                  >
                    {/* Color dot */}
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                        marginRight: 2,
                        fontSize: 11,
                        flexShrink: 0,
                      }}
                    >
                      {ev.startTime.replace(/^0/, "")}
                    </span>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.title}
                    </span>
                  </button>
                );
              })}

              {/* Overflow */}
              {overflow > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: "hsl(var(--md-sys-color-on-surface-variant))",
                    padding: "0 6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDayClick(day);
                  }}
                >
                  {overflow} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
