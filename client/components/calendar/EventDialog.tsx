import { useEffect, useState } from "react";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface EventDialogProps {
  open: boolean;
  event?: CalendarEvent | null;
  defaultDate?: string;
  defaultStartTime?: string;
  onSave: (event: Omit<CalendarEvent, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function EventDialog({
  open,
  event,
  defaultDate,
  defaultStartTime,
  onSave,
  onDelete,
  onClose,
}: EventDialogProps) {
  const { calendars } = useCalendar();
  const isMobile = useIsMobile();
  const isEditing = !!event;
  const today = new Date(2026, 3, 28).toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cal, setCal] = useState(calendars[0]?.id ?? "me");

  useEffect(() => {
    if (open) {
      if (event) {
        setTitle(event.title);
        setDate(event.date);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setCal(event.cal);
      } else {
        setTitle("");
        setDate(defaultDate ?? today);
        setStartTime(defaultStartTime ?? "09:00");
        const [h, m] = (defaultStartTime ?? "09:00").split(":").map(Number);
        setEndTime(
          `${String(Math.min(h + 1, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
        setCal(calendars.find((c) => c.kind === "mine")?.id ?? "me");
      }
    }
  }, [open, event, defaultDate, defaultStartTime]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: event?.id, title: title.trim(), date, startTime, endTime, cal });
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) { onDelete(event.id); onClose(); }
  };

  if (!open) return null;

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: 0,
    backgroundColor: "var(--neu-base)",
    color: "var(--neu-text)",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "var(--neu-inset)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 400,
    color: "hsl(var(--md-sys-color-on-surface-variant))",
    marginBottom: 8,
    display: "block",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  };

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.18)",
          zIndex: 900,
        }}
      />

      {/* Dialog panel */}
      <div
        style={{
          position: "fixed",
          zIndex: 901,
          backgroundColor: "var(--neu-base)",
          boxShadow: "var(--neu-raised)",
          display: "flex",
          flexDirection: "column",
          ...(isMobile
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: "24px 24px 0 0",
                maxHeight: "92vh",
                overflowY: "auto",
              }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 420,
                maxWidth: "calc(100vw - 32px)",
                borderRadius: 24,
                maxHeight: "90vh",
                overflowY: "auto",
              }),
        }}
      >
        {/* Drag handle (mobile) */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
                boxShadow: "var(--neu-inset-sm)",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "8px 16px 4px" : "20px 24px 8px",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "var(--neu-text)",
              letterSpacing: 0.3,
            }}
          >
            {isEditing ? "Edit Event" : "New Event"}
          </span>
          <md-icon-button onClick={onClose} aria-label="Close">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {/* Form content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: isMobile ? "8px 16px 16px" : "8px 24px 16px",
          }}
        >
          <div>
            <label style={labelStyle}>Event title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="Add title"
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fieldStyle} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={fieldStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>End</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Calendar</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {calendars.filter((c) => c.kind === "mine").map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCal(c.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px 7px 12px",
                    borderRadius: 20,
                    border: 0,
                    backgroundColor: "var(--neu-base)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: cal === c.id ? 400 : 300,
                    color: "var(--neu-text)",
                    fontFamily: "inherit",
                    letterSpacing: 0.2,
                    boxShadow: cal === c.id ? "var(--neu-inset-sm)" : "var(--neu-raised-sm)",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: c.color,
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "12px 16px 28px" : "12px 24px 20px",
            gap: 8,
          }}
        >
          <div>
            {isEditing && onDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "9px 18px",
                  border: 0,
                  borderRadius: 20,
                  backgroundColor: "var(--neu-base)",
                  color: "hsl(var(--md-sys-color-error))",
                  fontSize: 13,
                  fontWeight: 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "var(--neu-raised-sm)",
                  letterSpacing: 0.2,
                }}
              >
                Delete
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px",
                border: 0,
                borderRadius: 20,
                backgroundColor: "var(--neu-base)",
                color: "var(--neu-text)",
                fontSize: 13,
                fontWeight: 300,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "var(--neu-raised-sm)",
                letterSpacing: 0.2,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              style={{
                padding: "9px 24px",
                border: 0,
                borderRadius: 20,
                backgroundColor: "var(--neu-base)",
                color: title.trim()
                  ? "hsl(var(--md-sys-color-primary))"
                  : "hsl(var(--md-sys-color-on-surface-variant))",
                fontSize: 13,
                fontWeight: 400,
                cursor: title.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                letterSpacing: 0.2,
                boxShadow: title.trim() ? "var(--neu-raised-sm)" : "var(--neu-inset-sm)",
                transition: "box-shadow 0.2s",
                opacity: title.trim() ? 1 : 0.6,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
