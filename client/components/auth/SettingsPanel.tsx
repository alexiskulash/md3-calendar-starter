import { useCalendar } from "../calendar/CalendarContext";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose: _onClose }: SettingsPanelProps) {
  const { use24h, setUse24h, weekStartsMonday, setWeekStartsMonday } = useCalendar();

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        right: 0,
        width: 240,
        backgroundColor: "hsl(var(--md-sys-color-surface-container))",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px 8px",
          fontSize: 13,
          fontWeight: 600,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        Settings
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
          24-hour time
        </span>
        <Toggle checked={use24h} onChange={() => setUse24h(!use24h)} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
          Week starts Monday
        </span>
        <Toggle checked={weekStartsMonday} onChange={() => setWeekStartsMonday(!weekStartsMonday)} />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        border: 0,
        backgroundColor: checked
          ? "hsl(var(--md-sys-color-primary))"
          : "hsl(var(--md-sys-color-outline-variant))",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}
