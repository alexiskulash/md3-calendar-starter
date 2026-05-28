import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import { useEffect, useRef, useState } from "react";
import { ViewMode } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useAuth } from "../../contexts/AuthContext";
import { ProfileMenu } from "../auth/ProfileMenu";
import { SettingsPanel } from "../auth/SettingsPanel";
import { useIsMobile } from "../../hooks/useIsMobile";

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "schedule", label: "Schedule" },
];

interface TopBarProps {
  onToggleSidebar: () => void;
  headerLabel: string;
}

export function TopBar({ onToggleSidebar, headerLabel }: TopBarProps) {
  const {
    selectedDate,
    viewMode,
    setViewMode,
    goNext,
    goPrev,
    goToday,
    search,
    setSearch,
  } = useCalendar();
  const { activeAccount } = useAuth();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const avatarAreaRef = useRef<HTMLDivElement>(null);

  // Close settings panel on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (avatarAreaRef.current && !avatarAreaRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  // Sync tab change events → viewMode
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const idx: number =
        (e as CustomEvent).detail?.index ?? (el as any).activeTabIndex ?? 0;
      const view = VIEWS[idx];
      if (view) setViewMode(view.id);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [setViewMode]);

  const openSearch = () => {
    setSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchExpanded(false);
    setSearch("");
  };

  const activeTabIndex = VIEWS.findIndex((v) => v.id === viewMode);

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
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeSearch();
                  }}
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

        {/* Avatar + menus */}
        <div ref={avatarAreaRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            aria-label="Account"
            onClick={() => {
              setProfileMenuOpen((v) => !v);
              setSettingsOpen(false);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: activeAccount?.color ?? "hsl(var(--md-sys-color-primary))",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              marginLeft: isMobile ? 2 : 4,
              flexShrink: 0,
              cursor: "pointer",
              border: profileMenuOpen
                ? "2px solid hsl(var(--md-sys-color-primary))"
                : "2px solid transparent",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
          >
            {activeAccount?.initials ?? "?"}
          </button>

          {profileMenuOpen && (
            <ProfileMenu
              onClose={() => setProfileMenuOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}

          {settingsOpen && (
            <SettingsPanel onClose={() => setSettingsOpen(false)} />
          )}
        </div>
      </header>

      {/* Tabs view switcher — full-width row below the nav bar */}
      <div
        style={{
          backgroundColor: "hsl(var(--md-sys-color-surface))",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
          flexShrink: 0,
        }}
      >
        <md-tabs
          ref={tabsRef as React.RefObject<HTMLElement>}
          activeTabIndex={activeTabIndex}
          style={{ width: "100%" }}
        >
          {VIEWS.map((v) => (
            <md-primary-tab key={v.id}>{v.label}</md-primary-tab>
          ))}
        </md-tabs>
      </div>
    </>
  );
}
