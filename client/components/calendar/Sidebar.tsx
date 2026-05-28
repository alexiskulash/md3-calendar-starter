import "@material/web/icon/icon.js";
import { MiniCalendar } from "./MiniCalendar";
import { useCalendar } from "./CalendarContext";
import { Calendar } from "../../types/calendar";

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
        padding: "9px 14px",
        cursor: "pointer",
        borderRadius: 14,
        margin: "3px 12px",
        backgroundColor: "var(--neu-base)",
        boxShadow: on ? "var(--neu-raised-sm)" : "var(--neu-inset-sm)",
        opacity: on ? 1 : 0.55,
        transition: "box-shadow 0.2s, opacity 0.2s",
      }}
    >
      {/* Soft color dot — identity marker */}
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: cal.color,
          flexShrink: 0,
          opacity: 0.65,
          boxShadow: on ? "2px 2px 4px rgba(0,0,0,0.15), -2px -2px 4px rgba(255,255,255,0.8)" : "none",
          transition: "box-shadow 0.2s",
        }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: on ? 400 : 300,
          color: "var(--neu-text)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          letterSpacing: 0.2,
          transition: "font-weight 0.15s",
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
    <div style={{ padding: "4px 0" }}>
      <div
        style={{
          fontSize: 9,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              padding: "12px 26px 6px",
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

export function Sidebar({ onCreateEvent, isOverlay = false, onClose: _onClose }: SidebarProps) {
  const { selectedDate, setSelectedDate, calendars, calOn, toggleCal } = useCalendar();

  const mine = calendars.filter((c) => c.kind === "mine");
  const other = calendars.filter((c) => c.kind === "other");

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--neu-base)",
        overflowY: "auto",
        ...(isOverlay
          ? {
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 200,
              boxShadow: "var(--neu-raised)",
            }
          : {}),
      }}
    >
      {/* Create button — raised FAB style */}
      <div style={{ padding: "16px 20px 8px" }}>
        <button
          onClick={onCreateEvent}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 20px 0 16px",
            height: 52,
            backgroundColor: "var(--neu-base)",
            border: 0,
            borderRadius: 26,
            cursor: "pointer",
            width: "100%",
            fontSize: 13,
            fontWeight: 400,
            color: "var(--neu-text)",
            boxShadow: "var(--neu-raised)",
            transition: "box-shadow 0.2s",
            fontFamily: "inherit",
            letterSpacing: 0.3,
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-inset)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-raised)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--neu-raised)";
          }}
        >
          <md-icon
            style={{
              color: "hsl(var(--md-sys-color-primary))",
              fontSize: "22px",
            }}
          >
            add
          </md-icon>
          Create
        </button>
      </div>

      {/* Mini calendar */}
      <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div style={{ height: 16 }} />

      {/* My Calendars */}
      <SidebarSection label="My calendars" calendars={mine} calOn={calOn} toggleCal={toggleCal} />

      <div style={{ height: 8 }} />

      {/* Other Calendars */}
      <SidebarSection label="Other calendars" calendars={other} calOn={calOn} toggleCal={toggleCal} />
    </div>
  );
}
