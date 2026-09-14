// lib/currentWeek.ts
//
// The frontier week — the lowest-numbered week that isn't fully done yet.
// This is the default "current week" before any forward-jump override.

import type { Week } from "@/content/curriculum";
import { isWeekDone } from "./units";

export function firstIncompleteWeek(weeks: Week[], isComplete: (key: string) => boolean): number {
  for (const week of weeks) {
    if (!isWeekDone(week, isComplete)) return week.number;
  }
  return weeks[weeks.length - 1].number;
}
