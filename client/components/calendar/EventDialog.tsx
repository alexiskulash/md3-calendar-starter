import { useEffect, useRef, useState, useMemo } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";

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
  const isEditing = !!event;
  const today = new Date().toISOString().split("T")[0]; // Using current date or can use the seeded one

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cal, setCal] = useState(calendars[0]?.id ?? "me");

  const dialogRef = useRef<any>(null);

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
        // When not defined, default to the current seed's 2026 start to match dummy data
        const fallbackDate = new Date(2026, 3, 28).toISOString().split("T")[0];
        setDate(defaultDate ?? fallbackDate);
        setStartTime(defaultStartTime ?? "09:00");
        const [h, m] = (defaultStartTime ?? "09:00").split(":").map(Number);
        setEndTime(
          `${String(Math.min(h + 1, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
        setCal(calendars.find((c) => c.kind === "mine")?.id ?? "me");
      }
    }
  }, [open, event, defaultDate, defaultStartTime, calendars]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.show();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClosed = () => {
      onClose();
    };

    dialog.addEventListener("closed", handleClosed);
    return () => dialog.removeEventListener("closed", handleClosed);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: event?.id, title: title.trim(), date, startTime, endTime, cal });
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const isFormValid = useMemo(() => {
    return !!title.trim();
  }, [title]);

  return (
    <md-dialog ref={dialogRef}>
      <div slot="headline" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        {isEditing ? "Edit Event" : "New Event"}
        <md-icon-button onClick={onClose} aria-label="Close">
          <md-icon>close</md-icon>
        </md-icon-button>
      </div>

      <form slot="content" id="event-form" method="dialog" style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px", width: "360px", maxWidth: "100%" }}>
        <md-filled-text-field
          label="Event title *"
          value={title}
          onInput={(e: any) => setTitle(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" && isFormValid) { e.preventDefault(); handleSave(); } }}
          autoFocus
        ></md-filled-text-field>

        <md-filled-text-field
          label="Date"
          type="text"
          placeholder="YYYY-MM-DD"
          value={date}
          onInput={(e: any) => setDate(e.target.value)}
        ></md-filled-text-field>

        <div style={{ display: "flex", gap: "12px" }}>
          <md-filled-text-field
            label="Start time"
            type="text"
            placeholder="HH:MM"
            value={startTime}
            onInput={(e: any) => setStartTime(e.target.value)}
            style={{ flex: 1 }}
          ></md-filled-text-field>
          <md-filled-text-field
            label="End time"
            type="text"
            placeholder="HH:MM"
            value={endTime}
            onInput={(e: any) => setEndTime(e.target.value)}
            style={{ flex: 1 }}
          ></md-filled-text-field>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface-variant))", marginBottom: 6, display: "block" }}>Calendar</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {calendars.filter((c) => c.kind === "mine").map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCal(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px 6px 10px",
                  borderRadius: 20,
                  border: cal === c.id ? `2px solid ${c.color}` : "2px solid hsl(var(--md-sys-color-outline-variant))",
                  backgroundColor: cal === c.id ? `${c.color}18` : "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: cal === c.id ? 600 : 400,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
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
      </form>

      <div slot="actions" style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <div>
          {isEditing && onDelete && (
            <md-text-button type="button" onClick={handleDelete} style={{ "--md-sys-color-primary": "var(--md-sys-color-error)" } as any}>
              Delete
            </md-text-button>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <md-text-button type="button" onClick={onClose}>Cancel</md-text-button>
          <md-filled-button type="button" onClick={handleSave} disabled={!isFormValid ? true : undefined}>Save</md-filled-button>
        </div>
      </div>
    </md-dialog>
  );
}
