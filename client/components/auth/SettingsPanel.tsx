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
        top: "calc(100% + 10px)",
        right: 0,
        width: 256,
        backgroundColor: "var(--neu-base)",
        borderRadius: 20,
        boxShadow: "var(--neu-raised)",
        zIndex: 200,
        overflow: "hidden",
        padding: "8px 0 12px",
      }}
    >
      <div
        style={{
          padding: "10px 20px 8px",
          fontSize: 10,
          fontWeight: 400,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        Settings
      </div>

      <SettingRow
        label="24-hour time"
        checked={use24h}
        onChange={() => setUse24h(!use24h)}
      />
      <SettingRow
        label="Week starts Monday"
        checked={weekStartsMonday}
        onChange={() => setWeekStartsMonday(!weekStartsMonday)}
      />
    </div>
  );
}

function SettingRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 300, color: "var(--neu-text)", letterSpacing: 0.2 }}>
        {label}
      </span>
      <NeuToggle checked={checked} onChange={onChange} />
    </div>
  );
}

function NeuToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 0,
        backgroundColor: "var(--neu-base)",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        boxShadow: "var(--neu-inset-sm)",
        transition: "box-shadow 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: checked
            ? "hsl(var(--md-sys-color-primary))"
            : "hsl(var(--md-sys-color-on-surface-variant))",
          transition: "left 0.2s, background-color 0.2s",
          boxShadow: "var(--neu-raised-sm)",
          opacity: checked ? 1 : 0.5,
        }}
      />
    </button>
  );
}
