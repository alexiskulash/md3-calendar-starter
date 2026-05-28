import { useEffect, useRef } from "react";
import "@material/web/labs/navigationbar/navigation-bar.js";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/icon/icon.js";
import { ViewMode } from "../../types/calendar";

const TABS: { id: ViewMode; label: string; icon: string }[] = [
  { id: "month",    label: "Month",    icon: "calendar_view_month" },
  { id: "week",     label: "Week",     icon: "view_week" },
  { id: "day",      label: "Day",      icon: "today" },
  { id: "schedule", label: "Schedule", icon: "view_agenda" },
];

interface MobileNavBarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export function MobileNavBar({ viewMode, onViewChange }: MobileNavBarProps) {
  const navBarRef = useRef<HTMLElement>(null);
  const activeIndex = TABS.findIndex((t) => t.id === viewMode);

  // Sync active index when viewMode changes externally (e.g. from TopBar dropdown)
  useEffect(() => {
    const el = navBarRef.current as any;
    if (el && el.activeIndex !== activeIndex) {
      el.activeIndex = activeIndex;
    }
  }, [activeIndex]);

  // Listen for user tab selection
  useEffect(() => {
    const el = navBarRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<{ activeIndex: number }>).detail.activeIndex;
      if (TABS[idx]) onViewChange(TABS[idx].id);
    };
    el.addEventListener("navigation-bar-activated", handler);
    return () => el.removeEventListener("navigation-bar-activated", handler);
  }, [onViewChange]);

  return (
    <md-navigation-bar
      ref={navBarRef}
      aria-label="Calendar view navigation"
      style={{
        // Respect iOS home indicator
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map((tab) => (
        <md-navigation-tab key={tab.id} label={tab.label}>
          <md-icon slot="active-icon">{tab.icon}</md-icon>
          <md-icon slot="inactive-icon">{tab.icon}</md-icon>
        </md-navigation-tab>
      ))}
    </md-navigation-bar>
  );
}
