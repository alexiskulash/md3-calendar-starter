import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import "@material/web/labs/card/filled-card.js";
import "@material/web/labs/card/elevated-card.js";
import "@material/web/chips/assist-chip.js";
import "@material/web/icon/icon.js";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const { getCalendar } = useCalendar();
  const cal = getCalendar(event.cal);
  const color = cal?.color ?? "#0B57D0"; // Default primary color

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(event);
        }}
        style={{
          backgroundColor: color,
          color: "#fff",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "11px",
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
        {event.title}
      </div>
    );
  }

  // Expanded (Day/Week view)
  return (
    <md-filled-card
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(event);
      }}
      style={{
        "--md-filled-card-container-color": color,
        "--md-filled-card-container-shape": "6px",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        padding: "4px 8px",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        color: "#ffffff",
        borderLeft: "3px solid rgba(255, 255, 255, 0.4)",
      } as React.CSSProperties}
      title={`${event.title} (${event.startTime}–${event.endTime})`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
        <div style={{ fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
          {event.title}
        </div>
        <div style={{ fontSize: "11px", opacity: 0.9, whiteSpace: "nowrap" }}>
          {event.startTime} - {event.endTime}
        </div>
      </div>
      
      {/* Show tags/chips if there is space. We use flex-wrap in case it's a wide card, 
          but hide it with flex properties so it doesn't break small cards. */}
      {(event.loc || event.attendees) && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "auto", overflow: "hidden", flexShrink: 0 }}>
          {event.loc && (
             <md-assist-chip 
               label={event.loc} 
               style={{ 
                 "--md-assist-chip-container-height": "20px",
                 "--md-assist-chip-label-text-size": "10px",
                 "--md-assist-chip-label-text-color": "#ffffff",
                 "--md-assist-chip-outline-color": "rgba(255,255,255,0.4)",
                 "--md-assist-chip-icon-size": "12px",
                 "--md-assist-chip-icon-color": "#ffffff"
               } as React.CSSProperties}
             >
               <md-icon slot="icon" style={{ fontSize: "12px" }}>location_on</md-icon>
             </md-assist-chip>
          )}
          {event.attendees && (
            <md-assist-chip 
              label={`${event.attendees}`}
              style={{ 
                "--md-assist-chip-container-height": "20px",
                "--md-assist-chip-label-text-size": "10px",
                "--md-assist-chip-label-text-color": "#ffffff",
                "--md-assist-chip-outline-color": "rgba(255,255,255,0.4)",
                "--md-assist-chip-icon-size": "12px",
                "--md-assist-chip-icon-color": "#ffffff"
              } as React.CSSProperties}
            >
              <md-icon slot="icon" style={{ fontSize: "12px" }}>group</md-icon>
            </md-assist-chip>
          )}
        </div>
      )}
    </md-filled-card>
  );
}
