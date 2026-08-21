// lib/dayNav.ts
//
// Pure day-to-day stepping across week boundaries (day 7 of week N → day 1 of
// week N+1). Every week runs a fixed 1–7 day range.

export interface DayRef {
  week: number;
  day: number;
}

export function nextDay(ref: DayRef, totalWeeks: number): DayRef | undefined {
  if (ref.day < 7) return { week: ref.week, day: ref.day + 1 };
  if (ref.week < totalWeeks) return { week: ref.week + 1, day: 1 };
  return undefined;
}

export function previousDay(ref: DayRef): DayRef | undefined {
  if (ref.day > 1) return { week: ref.week, day: ref.day - 1 };
  if (ref.week > 1) return { week: ref.week - 1, day: 7 };
  return undefined;
}
