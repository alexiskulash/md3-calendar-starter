import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ViewMode } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useUnhinged } from "./UnhingedContext";

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "3day", label: "3 Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "schedule", label: "Schedule" },
];

interface TopBarProps {
  onToggleSidebar: () => void;
  headerLabel: string;
}

export function TopBar({ onToggleSidebar, headerLabel }: TopBarProps) {
  const { selectedDate, viewMode, setViewMode, goNext, goPrev, goToday, search, setSearch,
    use24h, setUse24h, weekStartsMonday, setWeekStartsMonday } = useCalendar();
  const { jargonMode, setJargonMode, ghostMode, setGhostMode, aggressiveTimeBoxing, setAggressiveTimeBoxing, showModal, theme, setTheme } = useUnhinged();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target as Node)) {
        setViewDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [viewDropdownOpen]);

  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  const openSearch = () => {
    setSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchExpanded(false);
    setSearch("");
  };

  return (
    <header
      style={{
        height: isMobile ? 56 : 64,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 2 : 4,
        padding: isMobile ? "0 4px 0 2px" : "0 8px 0 4px",
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        position: "relative",
        zIndex: 10,
      }}
    >
      <md-icon-button onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <md-icon>menu</md-icon>
      </md-icon-button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 4px",
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "2px solid hsl(var(--md-sys-color-outline-variant))",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 600,
            color: "hsl(var(--md-sys-color-on-surface))",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -2,
              left: 0,
              right: 0,
              height: 5,
              backgroundColor: "hsl(var(--md-sys-color-primary))",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          />
          {selectedDate.getDate()}
        </div>
        {!isMobile && (
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface))",
              letterSpacing: 0,
              whiteSpace: "nowrap",
            }}
          >
            Calendar
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: isMobile ? 2 : 8 }}>
        {!isMobile && (
          <button
            onClick={goToday}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: 4,
              border: "1px solid hsl(var(--md-sys-color-outline))",
              backgroundColor: "transparent",
              color: "hsl(var(--md-sys-color-on-surface))",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Today
          </button>
        )}
        <md-icon-button onClick={goPrev} aria-label="Previous">
          <md-icon>chevron_left</md-icon>
        </md-icon-button>
        <md-icon-button onClick={goNext} aria-label="Next">
          <md-icon>chevron_right</md-icon>
        </md-icon-button>
      </div>

      <span
        style={{
          fontSize: isMobile ? 14 : 22,
          fontWeight: 400,
          color: "hsl(var(--md-sys-color-on-surface))",
          marginLeft: isMobile ? 2 : 8,
          letterSpacing: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: isMobile ? 1 : undefined,
          minWidth: 0,
        }}
      >
        {headerLabel}
      </span>

      {!isMobile && <div style={{ flex: 1 }} />}

      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {searchExpanded && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 36,
                backgroundColor: "hsl(var(--md-sys-color-surface-container))",
                borderRadius: 18,
                padding: "0 8px 0 16px",
                gap: 4,
                width: 240,
              }}
            >
              <md-icon
                style={{
                  fontSize: "18px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  flexShrink: 0,
                }}
              >
                search
              </md-icon>
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events"
                onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
                style={{
                  flex: 1,
                  border: 0,
                  background: "transparent",
                  fontSize: 14,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  outline: "none",
                  fontFamily: "inherit",
                  minWidth: 0,
                }}
              />
              <md-icon-button
                aria-label="Clear search"
                onClick={closeSearch}
                style={{ "--md-icon-button-icon-size": "18px" } as React.CSSProperties}
              >
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
          )}
          {!searchExpanded && (
            <md-icon-button aria-label="Search" onClick={openSearch}>
              <md-icon>search</md-icon>
            </md-icon-button>
          )}
        </div>
      )}

      {!isMobile && (
        <div ref={settingsRef} style={{ position: "relative", flexShrink: 0 }}>
          <md-icon-button
            aria-label="Settings"
            onClick={() => setSettingsOpen((v) => !v)}
          >
            <md-icon>settings</md-icon>
          </md-icon-button>

          {settingsOpen && (
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

              {/* Theme Selector */}
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
                  Theme
                </span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  style={{
                    backgroundColor: "hsl(var(--md-sys-color-surface-container-high))",
                    color: "hsl(var(--md-sys-color-on-surface))",
                    border: "1px solid hsl(var(--md-sys-color-outline-variant))",
                    borderRadius: 4,
                    padding: "4px 8px",
                    fontSize: 14,
                    outline: "none",
                  }}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="90s">Radical 90s</option>
                  <option value="70s">Groovy 70s</option>
                </select>
              </div>

              {/* Time format toggle */}
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
                <button
                  onClick={() => setUse24h(!use24h)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 12,
                    border: 0,
                    backgroundColor: use24h
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
                      left: use24h ? 18 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* Week starts on toggle */}
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
                  Week starts Monday
                </span>
                <button
                  onClick={() => setWeekStartsMonday(!weekStartsMonday)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 12,
                    border: 0,
                    backgroundColor: weekStartsMonday
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
                      left: weekStartsMonday ? 18 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* Aggressive Time-Boxing */}
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
                  Aggressive Time-Boxing
                </span>
                <button
                  onClick={() => setAggressiveTimeBoxing((v) => !v)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 12,
                    border: 0,
                    backgroundColor: aggressiveTimeBoxing
                      ? "hsl(var(--md-sys-color-error))"
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
                      left: aggressiveTimeBoxing ? 18 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* Jargon Translator */}
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
                  Jargon Translator
                </span>
                <button
                  onClick={() => setJargonMode((v) => !v)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 12,
                    border: 0,
                    backgroundColor: jargonMode
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
                      left: jargonMode ? 18 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* Ghost Mode Panic Button */}
              <div
                style={{
                  padding: "12px 16px",
                }}
              >
                <button
                  onClick={async () => {
                    const nextGhostMode = !ghostMode;
                    setGhostMode(nextGhostMode);
                    if (nextGhostMode) {
                      await showModal("TRANSCENDENCE", "GHOST MODE ACTIVATED. YOU HAVE TRANSCENDED THE CORPORATE PLANE.", "alert");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 8,
                    border: 0,
                    backgroundColor: ghostMode ? "#555" : "#D32F2F",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {ghostMode ? "Disable Ghost Mode" : "🚨 PANIC BUTTON 🚨"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View switcher — custom dropdown */}
      <div
        ref={viewDropdownRef}
        style={{ position: "relative", marginLeft: isMobile ? 0 : 4, flexShrink: 0 }}
      >
        <button
          onClick={() => setViewDropdownOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            height: 36,
            padding: isMobile ? "0 8px 0 10px" : "0 10px 0 14px",
            borderRadius: 4,
            border: "1px solid hsl(var(--md-sys-color-outline))",
            backgroundColor: "transparent",
            color: "hsl(var(--md-sys-color-on-surface))",
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          {VIEWS.find((v) => v.id === viewMode)?.label ?? "Week"}
          <span style={{ fontSize: 18, lineHeight: 1, color: "hsl(var(--md-sys-color-on-surface-variant))", marginRight: -2 }}>▾</span>
        </button>

        {viewDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              minWidth: 120,
              backgroundColor: "hsl(var(--md-sys-color-surface-container))",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
              zIndex: 200,
              overflow: "hidden",
            }}
          >
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => { setViewMode(v.id); setViewDropdownOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  border: 0,
                  textAlign: "left",
                  backgroundColor:
                    viewMode === v.id
                      ? "hsl(var(--md-sys-color-secondary-container))"
                      : "transparent",
                  color:
                    viewMode === v.id
                      ? "hsl(var(--md-sys-color-on-secondary-container))"
                      : "hsl(var(--md-sys-color-on-surface))",
                  fontSize: 14,
                  fontWeight: viewMode === v.id ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== v.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "hsl(var(--md-sys-color-surface-container-high))";
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== v.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: ghostMode ? "#333" : "hsl(var(--md-sys-color-primary))",
          color: "hsl(var(--md-sys-color-on-primary))",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          marginLeft: isMobile ? 2 : 4,
          flexShrink: 0,
          cursor: "pointer",
        }}
        title="Alex Chen"
      >
        {ghostMode ? "👻" : "AC"}
      </div>
    </header>
  );
}
