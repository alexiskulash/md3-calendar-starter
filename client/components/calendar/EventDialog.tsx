import { useEffect, useRef, useState } from "react";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../theme/ThemeContext";

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
  const { isDark } = useTheme();
  const isEditing = !!event;
  const today = new Date().toISOString().split("T")[0];

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

  // Close on Escape
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

  // ── Shared field style ─────────────────────────────────────────────────────
  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid hsl(var(--md-sys-color-outline-variant))",
    backgroundColor: "hsl(var(--md-sys-color-surface-container-highest))",
    color: "hsl(var(--md-sys-color-on-surface))",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    colorScheme: isDark ? "dark" : "light",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: "hsl(var(--md-sys-color-on-surface-variant))",
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.3px",
  };

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.32)",
          zIndex: 900,
        }}
      />

      {/* Dialog panel */}
      <div
        style={{
          position: "fixed",
          zIndex: 901,
          backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          display: "flex",
          flexDirection: "column",
          ...(isMobile
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: "20px 20px 0 0",
                maxHeight: "92vh",
                overflowY: "auto",
              }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 420,
                maxWidth: "calc(100vw - 32px)",
                borderRadius: 16,
                maxHeight: "90vh",
                overflowY: "auto",
              }),
        }}
      >
        {/* Drag handle (mobile only) */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
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
            padding: isMobile ? "8px 16px 4px" : "16px 20px 8px",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "hsl(var(--md-sys-color-on-surface))",
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
            gap: 16,
            padding: isMobile ? "8px 16px 16px" : "8px 24px 16px",
          }}
        >
          {/* Title */}
          <div>
            <label style={labelStyle}>Event title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="Add title"
              style={{ ...fieldStyle, fontSize: 16 }}
            />
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Time row */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={fieldStyle}
              />
            </div>
          </div>

          {/* Calendar picker */}
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
                    padding: "6px 14px 6px 10px",
                    borderRadius: 20,
                    border:
                      cal === c.id
                        ? `2px solid ${c.color}`
                        : "2px solid hsl(var(--md-sys-color-outline-variant))",
                    backgroundColor: cal === c.id ? `${c.color}18` : "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: cal === c.id ? 600 : 400,
                    color: "hsl(var(--md-sys-color-on-surface))",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: c.color,
                      flexShrink: 0,
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
            padding: isMobile ? "8px 16px 24px" : "8px 20px 16px",
            borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
            gap: 8,
          }}
        >
          {/* Delete (edit mode only) */}
          <div>
            {isEditing && onDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "8px 16px",
                  border: 0,
                  borderRadius: 20,
                  backgroundColor: "transparent",
                  color: "hsl(var(--md-sys-color-error))",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 20px",
                border: 0,
                borderRadius: 20,
                backgroundColor: "transparent",
                color: "hsl(var(--md-sys-color-primary))",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              style={{
                padding: "8px 24px",
                border: 0,
                borderRadius: 20,
                backgroundColor: title.trim()
                  ? "hsl(var(--md-sys-color-primary))"
                  : "hsl(var(--md-sys-color-outline-variant))",
                color: title.trim()
                  ? "hsl(var(--md-sys-color-on-primary))"
                  : "hsl(var(--md-sys-color-on-surface-variant))",
                fontSize: 14,
                fontWeight: 500,
                cursor: title.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                transition: "background-color 0.15s",
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
