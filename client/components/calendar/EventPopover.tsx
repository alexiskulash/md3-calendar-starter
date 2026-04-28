import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { useEffect, useRef } from "react";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface EventPopoverProps {
  event: CalendarEvent | null;
  anchor: { x: number; y: number } | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

function fmtTime(hhmm: string, use24h: boolean): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (use24h) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtDate(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, mo - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function EventPopover({ event, anchor, onClose, onEdit, onDelete }: EventPopoverProps) {
  const { getCalendar, use24h } = useCalendar();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!event) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [event, onClose]);

  if (!event || !anchor) return null;

  const cal = getCalendar(event.cal);
  const color = cal?.color ?? "#0B57D0";

  // Desktop: floating popover anchored to click position
  const popW = 400;
  const popH = 300;
  let left = anchor.x;
  let top = anchor.y;
  if (!isMobile && typeof window !== "undefined") {
    left = Math.min(window.innerWidth - popW - 16, Math.max(16, left));
    top = Math.min(window.innerHeight - popH - 16, Math.max(64, top));
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        pointerEvents: "none",
        // Scrim for mobile bottom sheet
        ...(isMobile ? { backgroundColor: "rgba(0,0,0,0.32)", pointerEvents: "all" } : {}),
      }}
      onClick={isMobile ? onClose : undefined}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...(isMobile
            ? {
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: "16px 16px 0 0",
                maxHeight: "80vh",
                overflowY: "auto",
              }
            : {
                position: "absolute",
                left,
                top,
                width: popW,
                borderRadius: 8,
              }),
          backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)",
          overflow: "hidden",
          pointerEvents: "all",
        }}
      >
        {/* Action icons row */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "6px 6px 0",
            gap: 2,
          }}
        >
          <md-icon-button
            onClick={() => { onEdit(event); onClose(); }}
            aria-label="Edit event"
          >
            <md-icon>edit</md-icon>
          </md-icon-button>
          <md-icon-button
            onClick={() => { onDelete(event.id); onClose(); }}
            aria-label="Delete event"
          >
            <md-icon>delete</md-icon>
          </md-icon-button>
          <md-icon-button onClick={onClose} aria-label="Close">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "4px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Title row with color swatch */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: color,
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  marginBottom: 4,
                  lineHeight: 1.3,
                }}
              >
                {event.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                }}
              >
                {event.allDay
                  ? `${fmtDate(event.date)} · All day`
                  : `${fmtDate(event.date)} · ${fmtTime(event.startTime, use24h)} – ${fmtTime(event.endTime, use24h)}`}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.loc && (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", fontSize: "20px" }}>
                location_on
              </md-icon>
              <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
                {event.loc}
              </span>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", fontSize: "20px", marginTop: 2 }}>
                people
              </md-icon>
              <div>
                <div style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
                  {event.attendees} guests
                </div>
                <div style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                  {Math.max(1, event.attendees - 1)} yes, 1 awaiting
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.desc && (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", fontSize: "20px", marginTop: 2 }}>
                notes
              </md-icon>
              <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
                {event.desc}
              </span>
            </div>
          )}

          {/* Calendar name */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", fontSize: "20px" }}>
              calendar_today
            </md-icon>
            <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
              {cal?.name ?? "Calendar"}
            </span>
          </div>

          {/* RSVP */}
          <div
            style={{
              borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-surface))",
                marginRight: 8,
              }}
            >
              Going?
            </span>
            {["Yes", "No", "Maybe"].map((label) => (
              <button
                key={label}
                style={{
                  padding: "6px 12px",
                  border: 0,
                  borderRadius: 20,
                  backgroundColor: "transparent",
                  color: "hsl(var(--md-sys-color-primary))",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "hsl(var(--md-sys-color-primary-container) / 0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
