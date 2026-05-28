import "@material/web/icon/icon.js";
import "@material/web/divider/divider.js";
import "@material/web/chips/chip-set.js";
import "@material/web/chips/filter-chip.js";
import { MiniCalendar } from "./MiniCalendar";
import { useCalendar } from "./CalendarContext";
import { Calendar } from "../../types/calendar";

interface SidebarProps {
  onCreateEvent: () => void;
  isOverlay?: boolean;
  onClose?: () => void;
}

function CalendarChips({
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
          padding: "8px 16px 2px",
        }}
      >
        {label}
      </div>
      <md-chip-set
        aria-label={label}
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "4px 12px 6px",
          gap: 0,
        } as React.CSSProperties}
      >
        {calendars.map((cal) => {
          const isOn = calOn[cal.id] ?? true;
          return (
            <md-filter-chip
              key={cal.id}
              selected={isOn ? true : undefined}
              onClick={() => toggleCal(cal.id)}
              style={{ margin: "3px 3px" }}
            >
              {/* Color dot shown when chip is not selected */}
              <div
                slot="icon"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: cal.color,
                  flexShrink: 0,
                }}
              />
              {cal.name}
            </md-filter-chip>
          );
        })}
      </md-chip-set>
    </div>
  );
}

export function Sidebar({ onCreateEvent, isOverlay = false, onClose }: SidebarProps) {
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
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
        overflowY: "auto",
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
      </div>

      {/* Mini calendar */}
      <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <md-divider style={{ margin: "8px 0" }} />

      {/* My Calendars */}
      <CalendarChips
        label="My calendars"
        calendars={mine}
        calOn={calOn}
        toggleCal={toggleCal}
      />

      <md-divider style={{ margin: "8px 0" }} />

      {/* Other Calendars */}
      <CalendarChips
        label="Other calendars"
        calendars={other}
        calOn={calOn}
        toggleCal={toggleCal}
      />
    </div>
  );
}
