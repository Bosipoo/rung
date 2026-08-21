// lib/units.ts
//
// A day's tickable units, derived from its own fields (lesson items,
// exercises, the prove-it capstone) — nothing is stored beyond per-unit
// completion, so "day done" and "week done" are always computed, never a
// separate flag.

import type { Task } from "@/content/curriculum";

export type UnitKind = "lesson" | "ex" | "prove";

export interface UnitRef {
  week: number;
  day: number;
  kind: UnitKind;
  index: number;
}

export function unitKey(ref: UnitRef): string {
  return ref.kind === "prove" ? `${ref.week}:${ref.day}:prove` : `${ref.week}:${ref.day}:${ref.kind}:${ref.index}`;
}

export function taskUnitRefs(week: number, task: Task): UnitRef[] {
  const refs: UnitRef[] = [];
  (task.lesson ?? []).forEach((_, index) => refs.push({ week, day: task.day, kind: "lesson", index }));
  (task.exercises ?? []).forEach((_, index) => refs.push({ week, day: task.day, kind: "ex", index }));
  if (task.prove) refs.push({ week, day: task.day, kind: "prove", index: 0 });
  return refs;
}

// A day is done when it has at least one unit and every unit is ticked.
// isComplete is injected so this stays pure and testable without storage.
export function isDayDone(week: number, task: Task, isComplete: (key: string) => boolean): boolean {
  const refs = taskUnitRefs(week, task);
  return refs.length > 0 && refs.every((ref) => isComplete(unitKey(ref)));
}
