import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
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
    <div style={{ padding: "8px 12px" }}>
      {/* Month nav header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
          }}
        >
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <div style={{ display: "flex", gap: "2px" }}>
          <md-icon-button
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            aria-label="Previous month"
            style={{ width: "32px", height: "32px" }}
          >
            <md-icon>chevron_left</md-icon>
          </md-icon-button>
          <md-icon-button
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            aria-label="Next month"
            style={{ width: "32px", height: "32px" }}
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
          marginBottom: "2px",
        }}
      >
        {DAY_HEADERS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              padding: "2px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const isDayToday = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          let bgColorClass = "bg-transparent";
          let textColorClass = isCurrentMonth
            ? "text-surface-foreground"
            : "text-surface-variant-foreground/40";

          if (isDayToday && !isSelected) {
            bgColorClass = "bg-primary-container";
            textColorClass = "text-primary-container-foreground";
          }
          if (isSelected) {
            bgColorClass = "bg-primary";
            textColorClass = "text-primary-foreground";
          }

          return (
            <button
              key={format(day, "yyyy-MM-dd")}
              onClick={() => {
                onDateSelect(day);
                if (!isSameMonth(day, viewMonth)) {
                  setViewMonth(new Date(day));
                }
              }}
              className={`${bgColorClass} ${textColorClass}`}
              style={{
                width: "100%",
                aspectRatio: "1",
                border: "none",
                borderRadius: "50%",
                fontSize: "12px",
                fontWeight: isSelected || isDayToday ? "600" : "400",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
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
