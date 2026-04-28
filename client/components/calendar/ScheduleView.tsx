import "@material/web/icon/icon.js";
import { addDays, format, isSameDay, isToday, startOfDay } from "date-fns";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface ScheduleViewProps {
  currentDate: Date;
  onEventClick: (event: CalendarEvent, anchor: { x: number; y: number }) => void;
}

function fmtTime(hhmm: string, use24h: boolean): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (use24h) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function ScheduleView({ currentDate, onEventClick }: ScheduleViewProps) {
  const { filteredEvents, getCalendar, use24h } = useCalendar();
  const isMobile = useIsMobile();

  // Show 30 days from currentDate
  const days = Array.from({ length: 30 }, (_, i) => addDays(startOfDay(currentDate), i));

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayStr = format(day, "yyyy-MM-dd");
    return filteredEvents
      .filter((e) => e.date === dayStr)
      .sort((a, b) => (a.allDay ? -1 : b.allDay ? 1 : a.startTime.localeCompare(b.startTime)));
  };

  const daysWithEvents = days.filter((d) => getEventsForDay(d).length > 0);

  if (daysWithEvents.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
        }}
      >
        <md-icon style={{ fontSize: "48px", opacity: 0.4 }}>event_busy</md-icon>
        <span style={{ fontSize: 16 }}>No upcoming events</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 0 24px" }}>
      {daysWithEvents.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayEvents = getEventsForDay(day);
        const isDayToday = isToday(day);

        return (
          <div key={dayStr} style={{ display: "flex", gap: 0 }}>
            {/* Date column */}
            <div
              style={{
                width: isMobile ? 64 : 100,
                flexShrink: 0,
                padding: isMobile ? "12px 8px 0 8px" : "16px 16px 0 24px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: isDayToday
                    ? "hsl(var(--md-sys-color-primary))"
                    : "hsl(var(--md-sys-color-on-surface-variant))",
                }}
              >
                {format(day, "EEE")}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: isDayToday
                    ? "hsl(var(--md-sys-color-primary))"
                    : "transparent",
                  color: isDayToday
                    ? "hsl(var(--md-sys-color-on-primary))"
                    : "hsl(var(--md-sys-color-on-surface))",
                  fontSize: 22,
                  fontWeight: isDayToday ? 600 : 400,
                }}
              >
                {format(day, "d")}
              </div>
            </div>

            {/* Events column */}
            <div
              style={{
                flex: 1,
                borderLeft: "1px solid hsl(var(--md-sys-color-outline-variant))",
                padding: isMobile ? "8px 8px 0 10px" : "12px 24px 0 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {dayEvents.map((ev) => {
                const cal = getCalendar(ev.cal);
                const color = cal?.color ?? "#0B57D0";
                return (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onEventClick(ev, { x: rect.right + 8, y: rect.top });
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: 0,
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      fontFamily: "inherit",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "hsl(var(--md-sys-color-surface-container))";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Color bar */}
                    <span
                      style={{
                        width: 4,
                        alignSelf: "stretch",
                        borderRadius: 2,
                        backgroundColor: color,
                        flexShrink: 0,
                        minHeight: 36,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "hsl(var(--md-sys-color-on-surface))",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                          marginTop: 2,
                        }}
                      >
                        {ev.allDay
                          ? "All day"
                          : `${fmtTime(ev.startTime, use24h)} – ${fmtTime(ev.endTime, use24h)}`}
                        {ev.loc && ` · ${ev.loc}`}
                      </div>
                    </div>
                    {ev.attendees && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                          flexShrink: 0,
                        }}
                      >
                        <md-icon style={{ fontSize: "16px" }}>people</md-icon>
                        <span style={{ fontSize: 12 }}>{ev.attendees}</span>
                      </div>
                    )}
                  </button>
                );
              })}
              <div style={{ height: 8 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
