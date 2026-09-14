import { describe, expect, it } from "vitest";
import { curriculum, weekTasks } from "@/content/curriculum";
import { taskUnitRefs, unitKey } from "@/lib/units";
import { firstIncompleteWeek } from "./currentWeek";

const weeks = curriculum.weeks.slice(0, 4); // weeks 1–4 is enough surface, and cheap

function completedKeys(weekNumbers: number[]): Set<string> {
  const keys = new Set<string>();
  for (const number of weekNumbers) {
    const week = curriculum.weeks.find((w) => w.number === number)!;
    for (const task of weekTasks(week)) {
      if (task.kind === "rest") continue;
      for (const ref of taskUnitRefs(week.number, task)) keys.add(unitKey(ref));
    }
  }
  return keys;
}

describe("firstIncompleteWeek", () => {
  it("is week 1 when nothing is done", () => {
    expect(firstIncompleteWeek(weeks, () => false)).toBe(1);
  });

  it("moves to week 2 once week 1 is fully done", () => {
    const done = completedKeys([1]);
    expect(firstIncompleteWeek(weeks, (key) => done.has(key))).toBe(2);
  });

  it("stays on week 1 when it's only partially done", () => {
    const week1 = curriculum.weeks[0];
    const firstTask = weekTasks(week1).find((task) => task.kind !== "rest")!;
    const oneUnit = unitKey(taskUnitRefs(week1.number, firstTask)[0]);
    expect(firstIncompleteWeek(weeks, (key) => key === oneUnit)).toBe(1);
  });

  it("stays on week 1 when there's a gap (week 3 done, week 1 not)", () => {
    const done = completedKeys([3]);
    expect(firstIncompleteWeek(weeks, (key) => done.has(key))).toBe(1);
  });

  it("returns the last week when everything is done", () => {
    const done = completedKeys(weeks.map((week) => week.number));
    expect(firstIncompleteWeek(weeks, (key) => done.has(key))).toBe(weeks[weeks.length - 1].number);
  });
});
