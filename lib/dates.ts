// lib/dates.ts
//
// The only place that knows how calendar days map onto the curriculum's
// Monday–Sunday day numbers (1–7).

export function dayNumber(date: Date = new Date()): number {
  return ((date.getDay() + 6) % 7) + 1;
}

const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEEKDAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function weekdayName(day: number): string {
  return WEEKDAY_NAMES[day - 1];
}

export function weekdayShort(day: number): string {
  return WEEKDAY_SHORT[day - 1];
}
