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
        padding: "7px 16px",
        cursor: "pointer",
        borderRadius: 12,
        margin: "0 8px",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--neu-inset-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 5,
          backgroundColor: on ? cal.color : "transparent",
          boxShadow: on ? "none" : "var(--neu-inset-sm)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        {on && (
          <md-icon
            style={{
              fontSize: "11px",
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
          fontSize: 13,
          fontWeight: 300,
          color: "var(--neu-text)",
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
    <div style={{ padding: "4px 0" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          letterSpacing: "1px",
          textTransform: "uppercase",
          padding: "8px 24px 4px",
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
