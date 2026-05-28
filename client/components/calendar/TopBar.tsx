import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ViewMode } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";

const VIEWS: { id: ViewMode; label: string; icon: string }[] = [
  { id: "day",      label: "Day",      icon: "calendar_view_day" },
  { id: "week",     label: "Week",     icon: "calendar_view_week" },
  { id: "month",    label: "Month",    icon: "calendar_view_month" },
  { id: "schedule", label: "Schedule", icon: "view_agenda" },
];

interface TopBarProps {
  onToggleSidebar: () => void;
  headerLabel: string;
}

export function TopBar({ onToggleSidebar, headerLabel }: TopBarProps) {
  const { selectedDate, viewMode, setViewMode, goNext, goPrev, goToday, search, setSearch,
    use24h, setUse24h, weekStartsMonday, setWeekStartsMonday } = useCalendar();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Sync md-tabs activeTabIndex when viewMode changes externally
  useEffect(() => {
    const el = tabsRef.current as any;
    if (!el) return;
    const idx = VIEWS.findIndex((v) => v.id === viewMode);
    if (idx !== -1 && el.activeTabIndex !== idx) el.activeTabIndex = idx;
  }, [viewMode]);

  // Listen for tab change events
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const idx = (e.target as any).activeTabIndex as number;
      setViewMode(VIEWS[idx].id);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [setViewMode]);

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
    // Focus after the expand transition starts
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchExpanded(false);
    setSearch("");
  };

  return (
  <>
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
      {/* Hamburger */}
      <md-icon-button onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <md-icon>menu</md-icon>
      </md-icon-button>

      {/* Logo: calendar icon with date + "Calendar" wordmark */}
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

      {/* Today + Prev/Next */}
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

      {/* Date label */}
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

      {/* Search — hidden on mobile */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Expanded search field */}
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
              {/* Clear / close */}
              <md-icon-button
                aria-label="Clear search"
                onClick={closeSearch}
                style={{ "--md-icon-button-icon-size": "18px" } as React.CSSProperties}
              >
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
          )}

          {/* Search icon button — shown when collapsed */}
          {!searchExpanded && (
            <md-icon-button aria-label="Search" onClick={openSearch}>
              <md-icon>search</md-icon>
            </md-icon-button>
          )}
        </div>
      )}

      {/* Settings — hidden on mobile */}
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
              {/* Header */}
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
                  onClick={() => setUse24h((v) => !v)}
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
                }}
              >
                <span style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface))" }}>
                  Week starts Monday
                </span>
                <button
                  onClick={() => setWeekStartsMonday((v) => !v)}
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
            </div>
          )}
        </div>
      )}

      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "hsl(var(--md-sys-color-primary))",
          color: "hsl(var(--md-sys-color-on-primary))",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 600,
          marginLeft: isMobile ? 2 : 4,
          flexShrink: 0,
          cursor: "pointer",
        }}
        title="Alex Chen"
      >
        AC
      </div>
    </header>

    {/* View tabs strip */}
    <div style={{ flexShrink: 0, backgroundColor: "hsl(var(--md-sys-color-surface))" }}>
      <md-tabs
        ref={tabsRef as React.RefObject<HTMLElement>}
        aria-label="Calendar view"
        style={{ width: "100%" }}
      >
        {VIEWS.map((v) => (
          <md-primary-tab
            key={v.id}
            inline-icon
            aria-label={isMobile ? v.label : undefined}
          >
            <md-icon slot="icon">{v.icon}</md-icon>
            {!isMobile && v.label}
          </md-primary-tab>
        ))}
      </md-tabs>
    </div>
  </>
  );
}
