import { useEffect, useMemo, useRef, useState } from "react";
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
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function fmtHour(h: number, use24h: boolean): string {
  if (h === 0) return "";
  if (use24h) return `${String(h).padStart(2, "0")}:00`;
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function fmtDropTime(minutes: number, use24h: boolean): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (use24h) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
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

// ─── WeekView component ───────────────────────────────────────────────────────

export function WeekView({ currentDate, days = 7, onEventClick, onCreateEvent }: WeekViewProps) {
  const { filteredEvents, getCalendar, use24h, weekStartsMonday, updateEvent } = useCalendar();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const HOUR_HEIGHT = isMobile ? 44 : 48;
  const TIME_COL_WIDTH = isMobile ? 44 : 56;
  const DAY_CIRCLE = isMobile ? 32 : 40;

  // ── Drag state ──────────────────────────────────────────────────────────────
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropInfo, setDropInfo] = useState<{ dayStr: string; minutes: number } | null>(null);
  const draggedEventRef = useRef<CalendarEvent | null>(null);
  const dragOffsetMinutesRef = useRef(0);

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

  // ── Drag helpers ────────────────────────────────────────────────────────────

  function calcDropMinutes(clientY: number, columnEl: HTMLElement): number {
    const rect = columnEl.getBoundingClientRect();
    const y = clientY - rect.top;
    const raw = (y / HOUR_HEIGHT) * 60 - dragOffsetMinutesRef.current;
    const snapped = Math.round(raw / 15) * 15;
    return Math.max(0, Math.min(snapped, 23 * 60));
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, dayStr: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const minutes = calcDropMinutes(e.clientY, e.currentTarget);
    setDropInfo({ dayStr, minutes });
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dayStr: string) {
    e.preventDefault();
    const ev = draggedEventRef.current;
    if (!ev) return;

    const startMinutes = calcDropMinutes(e.clientY, e.currentTarget);
    const duration = timeToMinutes(ev.endTime) - timeToMinutes(ev.startTime);
    const endMinutes = Math.min(startMinutes + duration, 24 * 60 - 1);

    updateEvent({
      ...ev,
      date: dayStr,
      startTime: minutesToTime(startMinutes),
      endTime: minutesToTime(endMinutes),
    });

    draggedEventRef.current = null;
    setDraggingId(null);
    setDropInfo(null);
  }

  function handleDragEnd() {
    draggedEventRef.current = null;
    setDraggingId(null);
    setDropInfo(null);
  }

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
                    fontWeight: isCurrentDay ? 500 : 300,
                  boxShadow: isCurrentDay ? "var(--neu-raised-sm)" : "none",
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
                const isDropTarget = dropInfo?.dayStr === dayStr;

                return (
                  <div
                    key={dayStr}
                    style={{
                      flex: 1,
                      minWidth: isMobile && days > 1 ? MIN_DAY_WIDTH : undefined,
                      position: "relative",
                      backgroundColor: isDropTarget
                        ? "rgba(0,0,0,0.03)"
                        : undefined,
                      transition: "background-color 0.1s",
                    }}
                    onDragOver={(e) => handleDragOver(e, dayStr)}
                    onDragLeave={(e) => {
                      // only clear if leaving the column entirely (not entering a child)
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDropInfo(null);
                      }
                    }}
                    onDrop={(e) => handleDrop(e, dayStr)}
                  >
                    {/* Hour rows */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        onClick={() => onCreateEvent(dayStr, `${String(h).padStart(2, "0")}:00`)}
                        style={{
                          height: HOUR_HEIGHT,
                          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant) / 0.5)",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={(e) => {
                          if (!draggingId) {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(0,0,0,0.03)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                        }}
                      />
                    ))}

                    {/* Drop indicator */}
                    {isDropTarget && dropInfo && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: (dropInfo.minutes / 60) * HOUR_HEIGHT - 1,
                            left: 0,
                            right: 0,
                            height: 2,
                            backgroundColor: "hsl(var(--md-sys-color-primary))",
                            zIndex: 10,
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
                              backgroundColor: "hsl(var(--md-sys-color-primary))",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: (dropInfo.minutes / 60) * HOUR_HEIGHT + 4,
                            left: 8,
                            fontSize: 10,
                            fontWeight: 600,
                            color: "hsl(var(--md-sys-color-primary))",
                            pointerEvents: "none",
                            zIndex: 10,
                            backgroundColor: "var(--neu-base)",
                            padding: "2px 6px",
                            borderRadius: 8,
                            boxShadow: "var(--neu-raised-sm)",
                          }}
                        >
                          {fmtDropTime(dropInfo.minutes, use24h)}
                        </div>
                      </>
                    )}

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
                      const isDragging = draggingId === ev.id;

                      return (
                        <button
                          key={ev.id}
                          draggable
                          onDragStart={(e) => {
                            draggedEventRef.current = ev;
                            setDraggingId(ev.id);
                            dragOffsetMinutesRef.current = Math.max(
                              0,
                              (e.nativeEvent.offsetY / HOUR_HEIGHT) * 60
                            );
                            e.dataTransfer.effectAllowed = "move";
                            // transparent drag ghost
                            const ghost = document.createElement("div");
                            ghost.style.position = "fixed";
                            ghost.style.top = "-1000px";
                            document.body.appendChild(ghost);
                            e.dataTransfer.setDragImage(ghost, 0, 0);
                            setTimeout(() => document.body.removeChild(ghost), 0);
                          }}
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
                            backgroundColor: "var(--neu-base)",
                            color: "var(--neu-text)",
                            border: 0,
                            borderRadius: 12,
                            padding: isShort ? "2px 4px 2px 10px" : "5px 6px 5px 10px",
                            textAlign: "left",
                            cursor: isDragging ? "grabbing" : "grab",
                            overflow: "hidden",
                            boxShadow: isDragging ? "var(--neu-inset-sm)" : "var(--neu-raised-sm)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            lineHeight: 1.3,
                            zIndex: isDragging ? 0 : 1,
                            fontFamily: "inherit",
                            opacity: isDragging ? 0.5 : 1,
                            transition: "opacity 0.1s, box-shadow 0.15s",
                          }}
                        >
                          {/* Left accent strip */}
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              backgroundColor: color,
                              borderRadius: "12px 0 0 12px",
                              opacity: 0.55,
                            }}
                          />
                          <div
                            style={{
                              fontSize: isMobile ? 11 : 12,
                              fontWeight: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              letterSpacing: 0.1,
                            }}
                          >
                            {ev.title}
                          </div>
                          {!isShort && (
                            <div
                              style={{
                                fontSize: 10,
                              fontWeight: 300,
                              opacity: 0.75,
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
                          backgroundColor: "hsl(var(--md-sys-color-error))",
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
                            backgroundColor: "hsl(var(--md-sys-color-error))",
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
