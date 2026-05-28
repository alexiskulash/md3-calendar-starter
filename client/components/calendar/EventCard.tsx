import { CalendarEvent } from "../../types/calendar";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      style={{
        backgroundColor: "var(--neu-base)",
        color: "var(--neu-text)",
        borderRadius: compact ? 8 : 12,
        padding: compact ? "2px 6px" : "4px 8px",
        fontSize: compact ? 11 : 12,
        fontWeight: 300,
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        lineHeight: 1.5,
        userSelect: "none",
        boxShadow: "var(--neu-inset-sm)",
        transition: "box-shadow 0.15s",
        letterSpacing: 0.2,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-raised-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-inset-sm)";
      }}
      title={`${event.title} (${event.startTime}–${event.endTime})`}
    >
      {!compact && (
        <span style={{ marginRight: 4, opacity: 0.7 }}>
          {event.startTime}
        </span>
      )}
      {event.title}
    </div>
  );
}
