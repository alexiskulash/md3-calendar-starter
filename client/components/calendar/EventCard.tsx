import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const { getCalendar } = useCalendar();
  const cal = getCalendar(event.cal);
  const color = cal?.color || "hsl(var(--md-sys-color-primary-container))";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      style={{
        backgroundColor: color + "33", // slightly transparent background
        color: "hsl(var(--md-sys-color-on-surface))",
        borderLeft: `3px solid ${color}`,
        borderRadius: "4px",
        padding: compact ? "1px 4px" : "2px 6px",
        fontSize: compact ? "11px" : "12px",
        fontWeight: "500",
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        lineHeight: "1.4",
        userSelect: "none",
      }}
      title={`${event.title} (${event.startTime}–${event.endTime})`}
    >
      {!compact && (
        <span style={{ marginRight: "4px", opacity: 0.8 }}>
          {event.startTime}
        </span>
      )}
      {event.title}
    </div>
  );
}
