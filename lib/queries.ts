// lib/queries.ts
//
// Read-only access to curriculum content. Separate from progress storage
// (lib/storage.ts) per the architecture rule: curriculum is shared, progress
// is per-user.

import { curriculum, weekTasks, type Task, type Week } from "@/content/curriculum";

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

// Rest days aren't something to "complete", so they're excluded here — and
// must stay excluded from any completed-task count too.
export function getTotalTaskCount(): number {
  return curriculum.weeks.reduce(
    (total, week) => total + weekTasks(week).filter((task) => task.kind !== "rest").length,
    0,
  );
}
