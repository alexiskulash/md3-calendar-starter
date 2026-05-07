import { CalendarEvent } from "../../types/calendar";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

const COLOR_STYLES: Record<
  NonNullable<CalendarEvent["color"]>,
  { bg: string; text: string }
> = {
  primary: {
    bg: "hsl(var(--md-sys-color-primary-container))",
    text: "hsl(var(--md-sys-color-on-primary-container))",
  },
  secondary: {
    bg: "hsl(var(--md-sys-color-secondary-container))",
    text: "hsl(var(--md-sys-color-on-secondary-container))",
  },
  tertiary: {
    bg: "hsl(var(--md-sys-color-tertiary-container))",
    text: "hsl(var(--md-sys-color-on-tertiary-container))",
  },
};

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const colors = COLOR_STYLES[event.color || "primary"];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
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
