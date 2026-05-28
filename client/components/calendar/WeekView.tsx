import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from "date-fns";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface WeekViewProps {
  currentDate: Date;
  days?: number; // 7 for week, 1 for day
  onEventClick: (event: CalendarEvent, anchor: { x: number; y: number }) => void;
  onCreateEvent: (date: string, time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(minutes, 23 * 60 + 59));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(clamped % 60).padStart(2, "0")}`;
}

function fmtHour(h: number, use24h: boolean): string {
  if (h === 0) return "";
  if (use24h) return `${String(h).padStart(2, "0")}:00`;
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

// ─── Overlap layout algorithm ─────────────────────────────────────────────────

interface LayoutEvent extends CalendarEvent {
  col: number;
  cols: number;
}

function layoutDayEvents(events: CalendarEvent[]): LayoutEvent[] {
  const sorted = [...events].sort(
    (a, b) =>
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime) ||
      timeToMinutes(b.endTime) - timeToMinutes(a.endTime)
  );
  const result: LayoutEvent[] = [];
  let cluster: CalendarEvent[] = [];
  let clusterEnd = 0;

  const flushCluster = () => {
    if (!cluster.length) return;
    const cols: CalendarEvent[][] = [];
    cluster.forEach((ev) => {
      let placed = false;
      for (let i = 0; i < cols.length; i++) {
        const last = cols[i][cols[i].length - 1];
        if (timeToMinutes(last.endTime) <= timeToMinutes(ev.startTime)) {
          cols[i].push(ev);
          (ev as any)._col = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        cols.push([ev]);
        (ev as any)._col = cols.length - 1;
      }
    });
    const total = cols.length;
    cluster.forEach((ev) => result.push({ ...ev, col: (ev as any)._col, cols: total }));
    cluster = [];
  };

  sorted.forEach((ev) => {
    const start = timeToMinutes(ev.startTime);
    if (cluster.length && start >= clusterEnd) flushCluster();
    cluster.push(ev);
    clusterEnd = Math.max(clusterEnd, timeToMinutes(ev.endTime));
  });
  flushCluster();
  return result;
}

// ─── Drag state ───────────────────────────────────────────────────────────────

interface DragState {
  eventId: string;
  offsetMinutes: number; // minutes from event start to where user grabbed
}

interface DragOver {
  dayStr: string;
  startMinutes: number;
}

// ─── WeekView component ───────────────────────────────────────────────────────

export function WeekView({ currentDate, days = 7, onEventClick, onCreateEvent }: WeekViewProps) {
  const { filteredEvents, events, getCalendar, updateEvent, use24h, weekStartsMonday } = useCalendar();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const HOUR_HEIGHT = isMobile ? 44 : 48;
  const TIME_COL_WIDTH = isMobile ? 44 : 56;
  const DAY_CIRCLE = isMobile ? 32 : 40;

  // ─── Drag and drop state ───────────────────────────────────────────────────
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [dragOver, setDragOver] = useState<DragOver | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, ev: CalendarEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetPx = e.clientY - rect.top;
    const offsetMinutes = Math.round((offsetPx / HOUR_HEIGHT) * 60);
    setDragging({ eventId: ev.id, offsetMinutes });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ev.id);
    // Delay opacity change so ghost image captures original appearance
    setTimeout(() => {
      setDragging((prev) => prev);
    }, 0);
  }, [HOUR_HEIGHT]);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDragOver(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, dayStr: string) => {
    e.preventDefault();
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const rawMinutes = (relY / HOUR_HEIGHT) * 60 - dragging.offsetMinutes;
    const snapped = Math.round(rawMinutes / 15) * 15;
    const startMinutes = Math.max(0, Math.min(snapped, 23 * 60));
    setDragOver((prev) =>
      prev?.dayStr === dayStr && prev?.startMinutes === startMinutes
        ? prev
        : { dayStr, startMinutes }
    );
  }, [dragging, HOUR_HEIGHT]);

  const handleDrop = useCallback((e: React.DragEvent, dayStr: string) => {
    e.preventDefault();
    if (!dragging) return;
    const originalEvent = events.find((ev) => ev.id === dragging.eventId);
    if (!originalEvent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const rawMinutes = (relY / HOUR_HEIGHT) * 60 - dragging.offsetMinutes;
    const snapped = Math.round(rawMinutes / 15) * 15;
    const newStartMinutes = Math.max(0, Math.min(snapped, 23 * 60));
    const duration = timeToMinutes(originalEvent.endTime) - timeToMinutes(originalEvent.startTime);
    const newEndMinutes = Math.min(newStartMinutes + duration, 24 * 60 - 1);

    updateEvent({
      ...originalEvent,
      date: dayStr,
      startTime: minutesToTime(newStartMinutes),
      endTime: minutesToTime(newEndMinutes),
    });

    setDragging(null);
    setDragOver(null);
  }, [dragging, events, updateEvent, HOUR_HEIGHT]);

  // ─── Week setup ────────────────────────────────────────────────────────────
  const weekOpts = useMemo(
    () => ({ weekStartsOn: (weekStartsMonday ? 1 : 0) as 0 | 1 }),
    [weekStartsMonday]
  );
  const weekStart = useMemo(() => startOfWeek(currentDate, weekOpts), [currentDate, weekOpts]);
  const dayList = useMemo(() => {
    if (days === 1) return [currentDate];
    return eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, weekOpts) });
  }, [weekStart, currentDate, days, weekOpts]);

  // Scroll to 7 AM on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT * 7;
    }
  }, []);

  // Current time
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = (nowMinutes / 60) * HOUR_HEIGHT;

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayStr = format(day, "yyyy-MM-dd");
    return filteredEvents.filter((e) => !e.allDay && e.date === dayStr);
  };

  const MIN_DAY_WIDTH = 64;
  const minGridWidth = isMobile && days > 1
    ? TIME_COL_WIDTH + days * MIN_DAY_WIDTH
    : undefined;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        overflowX: isMobile && days > 1 ? "auto" : undefined,
      }}
    >
      {/* Inner wrapper enforces min-width for horizontal scroll */}
      <div style={{ minWidth: minGridWidth, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

        {/* Day header row */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
            paddingRight: isMobile && days > 1 ? 0 : 8,
            flexShrink: 0,
          }}
        >
          <div style={{ width: TIME_COL_WIDTH, flexShrink: 0 }} />
          {dayList.map((day) => {
            const isCurrentDay = isToday(day);
            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                style={{
                  flex: 1,
                  minWidth: isMobile && days > 1 ? MIN_DAY_WIDTH : undefined,
                  padding: isMobile ? "6px 0 4px" : "8px 0 6px",
                  textAlign: "center",
                  borderLeft: "1px solid hsl(var(--md-sys-color-outline-variant))",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 10 : 11,
                    fontWeight: 500,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: isCurrentDay
                      ? "hsl(var(--md-sys-color-primary))"
                      : "hsl(var(--md-sys-color-on-surface-variant))",
                  }}
                >
                  {format(day, isMobile && days > 1 ? "EEEEE" : "EEE")}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: DAY_CIRCLE,
                    height: DAY_CIRCLE,
                    borderRadius: "50%",
                    marginTop: 2,
                    backgroundColor: isCurrentDay
                      ? "hsl(var(--md-sys-color-primary))"
                      : "transparent",
                    color: isCurrentDay
                      ? "hsl(var(--md-sys-color-on-primary))"
                      : "hsl(var(--md-sys-color-on-surface))",
                    fontSize: isMobile ? 16 : 22,
                    fontWeight: isCurrentDay ? 600 : 400,
                  }}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrollable time grid */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <div style={{ display: "flex" }}>
            {/* Time gutter */}
            <div style={{ width: TIME_COL_WIDTH, flexShrink: 0 }}>
              {HOURS.map((h) => (
                <div
                  key={h}
                  style={{
                    height: HOUR_HEIGHT,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    paddingRight: isMobile ? 4 : 8,
                    paddingTop: 4,
                  }}
                >
                  {h > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {fmtHour(h, use24h)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div style={{ flex: 1, display: "flex" }}>
              {dayList.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const dayEvents = getEventsForDay(day);
                const laid = layoutDayEvents(dayEvents);
                const isDayToday = isToday(day);
                const isDropTarget = dragOver?.dayStr === dayStr;

                // Ghost preview for this column
                const ghostEvent = isDropTarget && dragging
                  ? events.find((e) => e.id === dragging.eventId)
                  : null;

                return (
                  <div
                    key={dayStr}
                    onDragOver={(e) => handleDragOver(e, dayStr)}
                    onDrop={(e) => handleDrop(e, dayStr)}
                    onDragLeave={(e) => {
                      // Only clear if leaving the column entirely (not entering a child)
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDragOver(null);
                      }
                    }}
                    style={{
                      flex: 1,
                      minWidth: isMobile && days > 1 ? MIN_DAY_WIDTH : undefined,
                      position: "relative",
                      borderLeft: "1px solid hsl(var(--md-sys-color-outline-variant))",
                      backgroundColor: isDropTarget
                        ? "hsl(var(--md-sys-color-primary) / 0.05)"
                        : undefined,
                      transition: "background-color 0.1s",
                    }}
                  >
                    {/* Hour rows */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        onClick={() => !dragging && onCreateEvent(dayStr, `${String(h).padStart(2, "0")}:00`)}
                        style={{
                          height: HOUR_HEIGHT,
                          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant) / 0.5)",
                          cursor: dragging ? "copy" : "pointer",
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={(e) => {
                          if (!dragging)
                            (e.currentTarget as HTMLDivElement).style.backgroundColor =
                              "hsl(var(--md-sys-color-surface-container) / 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                        }}
                      />
                    ))}

                    {/* Drop ghost preview */}
                    {ghostEvent && dragOver && (() => {
                      const duration =
                        timeToMinutes(ghostEvent.endTime) - timeToMinutes(ghostEvent.startTime);
                      const top = (dragOver.startMinutes / 60) * HOUR_HEIGHT;
                      const height = Math.max((duration / 60) * HOUR_HEIGHT - 2, 18);
                      const cal = getCalendar(ghostEvent.cal);
                      const color = cal?.color ?? "#0B57D0";
                      return (
                        <div
                          style={{
                            position: "absolute",
                            top: top + 1,
                            height,
                            left: 2,
                            right: 4,
                            backgroundColor: color,
                            opacity: 0.35,
                            borderRadius: 6,
                            border: `2px dashed ${color}`,
                            pointerEvents: "none",
                            zIndex: 10,
                          }}
                        />
                      );
                    })()}

                    {/* Events */}
                    {laid.map((ev) => {
                      const cal = getCalendar(ev.cal);
                      const color = cal?.color ?? "#0B57D0";
                      const startMin = timeToMinutes(ev.startTime);
                      const endMin = timeToMinutes(ev.endTime);
                      const top = (startMin / 60) * HOUR_HEIGHT;
                      const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT - 2, 18);
                      const leftPct = (ev.col / ev.cols) * 100;
                      const widthPct = (1 / ev.cols) * 100;
                      const isShort = height < 30;
                      const isDraggingThis = dragging?.eventId === ev.id;

                      return (
                        <button
                          key={ev.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, ev)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            onEventClick(ev, { x: rect.right + 8, y: rect.top });
                          }}
                          style={{
                            position: "absolute",
                            top: top + 1,
                            height,
                            left: `calc(${leftPct}% + 2px)`,
                            width: `calc(${widthPct}% - 4px)`,
                            backgroundColor: color,
                            color: "#fff",
                            border: 0,
                            borderRadius: 6,
                            padding: isShort ? "2px 4px" : "4px 6px",
                            textAlign: "left",
                            cursor: isDraggingThis ? "grabbing" : "grab",
                            overflow: "hidden",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            lineHeight: 1.2,
                            zIndex: isDraggingThis ? 0 : 1,
                            fontFamily: "inherit",
                            opacity: isDraggingThis ? 0.3 : 1,
                            transition: "opacity 0.1s",
                          }}
                        >
                          <div
                            style={{
                              fontSize: isMobile ? 11 : 12,
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ev.title}
                          </div>
                          {!isShort && (
                            <div
                              style={{
                                fontSize: 11,
                                opacity: 0.9,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ev.startTime}
                              {ev.loc ? ` · ${ev.loc}` : ""}
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {/* Now line */}
                    {isDayToday && (
                      <div
                        style={{
                          position: "absolute",
                          top: nowTop,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: "#EA4335",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: -4,
                            top: -4,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#EA4335",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
