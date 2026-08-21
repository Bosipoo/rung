// lib/queries.ts
//
// Read-only access to curriculum content. Separate from progress storage
// (lib/storage.ts) per the architecture rule: curriculum is shared, progress
// is per-user.

import { curriculum, taskUnits, weekTasks, type Task, type Week } from "@/content/curriculum";

export function getWeeks(): Week[] {
  return curriculum.weeks;
}

export function getWeek(n: number): Week | undefined {
  return curriculum.weeks.find((week) => week.number === n);
}

export function getTasks(weekId: number): Task[] {
  const week = getWeek(weekId);
  return week ? weekTasks(week) : [];
}

// Progress counts tickable units (lesson items, exercises, prove-it), not
// tasks — taskUnits() already returns 0 for rest days.
export function getTotalUnitCount(): number {
  return curriculum.weeks.reduce(
    (total, week) => total + weekTasks(week).reduce((sum, task) => sum + taskUnits(task), 0),
    0,
  );
}
