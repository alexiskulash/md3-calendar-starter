import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths,
  isSameMonth, isSameDay, isToday,
} from "date-fns";
import { useState } from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => new Date(selectedDate));

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <div style={{ padding: "8px 16px" }}>
      {/* Month nav header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "var(--neu-text)",
            letterSpacing: 0.3,
          }}
        >
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          <md-icon-button
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            aria-label="Previous month"
            style={{ width: "28px", height: "28px" }}
          >
            <md-icon>chevron_left</md-icon>
          </md-icon-button>
          <md-icon-button
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            aria-label="Next month"
            style={{ width: "28px", height: "28px" }}
          >
            <md-icon>chevron_right</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: 4,
        }}
      >
        {DAY_HEADERS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              padding: "2px 0",
              letterSpacing: "0.5px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const isDayToday = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          let shadow = "none";
          if (isSelected) shadow = "var(--neu-inset-sm)";
          else if (isDayToday) shadow = "var(--neu-raised-sm)";

          const textColor = isCurrentMonth
            ? isSelected || isDayToday
              ? "hsl(var(--md-sys-color-primary))"
              : "var(--neu-text)"
            : "hsl(var(--md-sys-color-on-surface-variant))";

          return (
            <button
              key={format(day, "yyyy-MM-dd")}
              onClick={() => {
                onDateSelect(day);
                if (!isSameMonth(day, viewMonth)) setViewMonth(new Date(day));
              }}
              style={{
                width: "100%",
                aspectRatio: "1",
                border: 0,
                borderRadius: "50%",
                backgroundColor: "var(--neu-base)",
                color: textColor,
                fontSize: 11,
                fontWeight: isSelected || isDayToday ? 500 : 300,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                boxShadow: shadow,
                transition: "box-shadow 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-raised-sm)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = shadow;
              }}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
