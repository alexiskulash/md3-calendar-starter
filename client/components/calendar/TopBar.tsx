import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ViewMode } from "../../types/calendar";
import { useCalendar } from "./CalendarContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAuth } from "../../contexts/AuthContext";

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
  const { selectedDate, viewMode, setViewMode, goNext, goPrev, goToday, search, setSearch,
    use24h, setUse24h, weekStartsMonday, setWeekStartsMonday } = useCalendar();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Auth state
  const { activeAccount, accounts, switchAccount, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

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

      {/* View switcher — custom dropdown */}
      <div
        ref={viewDropdownRef}
        style={{ position: "relative", marginLeft: isMobile ? 0 : 4, flexShrink: 0 }}
      >
        {/* Trigger button */}
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

        {/* Dropdown menu */}
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

      {/* Avatar Menu Container */}
      <div style={{ position: "relative" }} ref={profileRef}>
        <div
          onClick={() => setProfileOpen((prev) => !prev)}
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
            outline: profileOpen ? "2px solid hsl(var(--md-sys-color-primary))" : "none",
            outlineOffset: 2,
          }}
          title={activeAccount?.name ?? "Account"}
          aria-label="Account"
        >
          {activeAccount?.initials ?? "?"}
        </div>

        {/* Profile Dropdown Menu */}
        {profileOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              width: 360,
              backgroundColor: "hsl(var(--md-sys-color-surface-container-high))",
              borderRadius: 20,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Section 1: Current User */}
            <div style={{ padding: "20px 16px 16px", textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: activeAccount?.color ?? "gray",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 500,
                  margin: "0 auto 12px",
                }}
              >
                {activeAccount?.initials}
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface))" }}>
                {activeAccount?.name}
              </div>
              <div style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface-variant))", marginBottom: 16 }}>
                {activeAccount?.email}
              </div>
              <button
                style={{
                  padding: "8px 24px",
                  borderRadius: 100,
                  border: "1px solid hsl(var(--md-sys-color-outline))",
                  backgroundColor: "transparent",
                  color: "hsl(var(--md-sys-color-primary))",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Manage your Google Account
              </button>
            </div>

            <md-divider></md-divider>

            {/* Section 2: Other Accounts */}
            {accounts.filter((a) => a.id !== activeAccount?.id).length > 0 && (
              <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                  Other accounts
                </div>
                {accounts
                  .filter((a) => a.id !== activeAccount?.id)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        switchAccount(acc.id);
                        setProfileOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "8px 16px",
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "hsl(var(--md-sys-color-surface-container-highest))";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: acc.color,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        {acc.initials}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface))" }}>
                          {acc.name}
                        </div>
                        <div style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                          {acc.email}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            <md-divider></md-divider>

            {/* Section 3: Actions */}
            <div style={{ padding: "8px 0" }}>
              <button
                onClick={() => { setSettingsOpen(true); setProfileOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(var(--md-sys-color-surface-container-highest))"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}>settings</md-icon>
                Settings
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  signOut();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(var(--md-sys-color-surface-container-highest))"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}>logout</md-icon>
                Sign out
              </button>
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "center", gap: 16, backgroundColor: "hsl(var(--md-sys-color-surface-container-low))" }}>
              <a href="#" style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }} onClick={e => e.preventDefault()}>Privacy Policy</a>
              <a href="#" style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }} onClick={e => e.preventDefault()}>Terms of Service</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
