import { describe, expect, it } from "vitest";
import type { Task } from "@/content/curriculum";
import { isDayDone, taskUnitRefs, unitKey } from "./units";

const task: Task = {
  day: 2,
  kind: "learn",
  title: "Strings & variables",
  concept: "Text in quotes.",
  lesson: [
    { label: "A", url: "https://a" },
    { label: "B", url: "https://b" },
  ],
  exercises: ["Do X", "Do Y"],
  prove: "Prove it.",
};

const restTask: Task = {
  day: 7,
  kind: "rest",
  title: "Rest",
  concept: "Genuinely off.",
};

describe("taskUnitRefs", () => {
  it("enumerates lesson, exercise, and prove units in order", () => {
    const refs = taskUnitRefs(3, task);
    expect(refs).toEqual([
      { week: 3, day: 2, kind: "lesson", index: 0 },
      { week: 3, day: 2, kind: "lesson", index: 1 },
      { week: 3, day: 2, kind: "ex", index: 0 },
      { week: 3, day: 2, kind: "ex", index: 1 },
      { week: 3, day: 2, kind: "prove", index: 0 },
    ]);
  });

  it("is empty for a rest day", () => {
    expect(taskUnitRefs(3, restTask)).toEqual([]);
  });
});

describe("unitKey", () => {
  it("builds a stable, distinct key per unit", () => {
    expect(unitKey({ week: 3, day: 2, kind: "lesson", index: 0 })).toBe("3:2:lesson:0");
    expect(unitKey({ week: 3, day: 2, kind: "ex", index: 1 })).toBe("3:2:ex:1");
    expect(unitKey({ week: 3, day: 2, kind: "prove", index: 0 })).toBe("3:2:prove");
  });
});

describe("isDayDone", () => {
  it("is false when no units are complete", () => {
    expect(isDayDone(3, task, () => false)).toBe(false);
  });

  it("is false when only some units are complete", () => {
    const done = new Set([unitKey({ week: 3, day: 2, kind: "lesson", index: 0 })]);
    expect(isDayDone(3, task, (key) => done.has(key))).toBe(false);
  });

  it("is true only once every unit is complete", () => {
    expect(isDayDone(3, task, () => true)).toBe(true);
  });

  it("is false for a rest day, which has no units", () => {
    expect(isDayDone(3, restTask, () => true)).toBe(false);
  });
});
