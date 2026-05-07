import "@material/web/icon/icon.js";
import "@material/web/divider/divider.js";
import { useState, useRef, useEffect } from "react";
import { MiniCalendar } from "./MiniCalendar";
import { useCalendar } from "./CalendarContext";
import { Calendar } from "../../types/calendar";
import { useUnhinged } from "./UnhingedContext";

interface SidebarProps {
  onCreateEvent: () => void;
  isOverlay?: boolean;
  onClose?: () => void;
}

function CalendarRow({ cal, on, onToggle }: { cal: Calendar; on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "6px 16px",
        cursor: "pointer",
        borderRadius: 4,
        transition: "background-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "hsl(var(--md-sys-color-surface-container))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Custom colored checkbox */}
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 3,
          border: `2px solid ${cal.color}`,
          backgroundColor: on ? cal.color : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 0.15s",
        }}
      >
        {on && (
          <md-icon
            style={{
              fontSize: "14px",
              color: "#fff",
              fontVariationSettings: "'FILL' 1, 'wght' 700",
            }}
          >
            check
          </md-icon>
        )}
      </span>
      <span
        style={{
          fontSize: 14,
          color: "hsl(var(--md-sys-color-on-surface))",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {cal.name}
      </span>
    </div>
  );
}

function SidebarSection({
  label,
  calendars,
  calOn,
  toggleCal,
}: {
  label: string;
  calendars: Calendar[];
  calOn: Record<string, boolean>;
  toggleCal: (id: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          padding: "8px 16px 4px",
        }}
      >
        {label}
      </div>
      {calendars.map((cal) => (
        <CalendarRow
          key={cal.id}
          cal={cal}
          on={calOn[cal.id] ?? true}
          onToggle={() => toggleCal(cal.id)}
        />
      ))}
    </div>
  );
}

export function Sidebar({ onCreateEvent, isOverlay = false, onClose }: SidebarProps) {
  const { selectedDate, setSelectedDate, calendars, calOn, toggleCal, addEvent } = useCalendar();
  const { showModal } = useUnhinged();
  const [width, setWidth] = useState(280);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(Math.max(e.clientX, 200), 400); // min 200px, max 400px
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSchrodinger = async () => {
    const isBoss = Math.random() > 0.5;
    addEvent({
      title: "???",
      date: selectedDate.toISOString().split("T")[0],
      startTime: "13:00",
      endTime: "14:00",
      cal: "me",
      desc: isBoss ? "1:1 with the CEO. Good luck." : "Mandatory HR Training. Bring coffee.",
    });
    await showModal("Added", "Schrödinger's Meeting added. You won't know what it is until you open it.", "alert");
  };

  const mine = calendars.filter((c) => c.kind === "mine");
  const other = calendars.filter((c) => c.kind === "other");

  return (
    <div
      style={{
        width,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
        position: "relative",
        ...(isOverlay
          ? {
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 200,
              boxShadow: "4px 0 16px rgba(0,0,0,0.18)",
            }
          : {}),
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Create button — extended FAB style */}
      <div style={{ padding: "12px 16px 8px" }}>
        <button
          onClick={onCreateEvent}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 20px 0 16px",
            height: 56,
            backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "hsl(var(--md-sys-color-on-surface))",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 8px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)";
          }}
        >
          <md-icon
            style={{
              color: "hsl(var(--md-sys-color-primary))",
              fontSize: "24px",
            }}
          >
            add
          </md-icon>
          Create
        </button>

        {/* Schrödinger's Meeting button */}
        <button
          onClick={handleSchrodinger}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
            padding: "0 20px 0 16px",
            height: 48,
            backgroundColor: "#2c3e50",
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
            width: "100%",
            fontSize: 13,
            fontWeight: 500,
            color: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: "20px" }}>📦</span>
          Add Schrödinger's Block
        </button>
      </div>

      {/* Mini calendar */}
      <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <md-divider style={{ margin: "8px 0" }} />

      {/* My Calendars */}
      <SidebarSection
        label="My calendars"
        calendars={mine}
        calOn={calOn}
        toggleCal={toggleCal}
      />

      <md-divider style={{ margin: "8px 0" }} />

      {/* Other Calendars */}
      <SidebarSection
        label="Other calendars"
        calendars={other}
        calOn={calOn}
        toggleCal={toggleCal}
      />
      </div>

      {/* Resize handle */}
      {!isOverlay && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            isResizing.current = true;
            document.body.style.cursor = 'col-resize';
          }}
          style={{
            position: "absolute",
            top: 0,
            right: -3,
            width: 6,
            height: "100%",
            cursor: "col-resize",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
