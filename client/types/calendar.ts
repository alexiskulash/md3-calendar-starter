export type ViewMode = "month" | "week" | "day" | "schedule";

export interface Calendar {
  id: string;
  name: string;
  color: string; // hex color
  kind: "mine" | "other";
}

export interface CalendarEvent {
  id: string;
  cal: string; // calendar id
  title: string;
  date: string; // ISO date YYYY-MM-DD (for day-based storage)
  startTime: string; // HH:MM 24h
  endTime: string; // HH:MM 24h
  allDay?: boolean;
  loc?: string;
  attendees?: number;
  desc?: string;
  color?: "primary" | "secondary" | "tertiary";
}
