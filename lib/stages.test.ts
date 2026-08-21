import { describe, expect, it } from "vitest";
import { curriculum } from "@/content/curriculum";
import { isWeekLocked } from "./stages";

const week1 = curriculum.weeks.find((week) => week.number === 1)!;
const week12 = curriculum.weeks.find((week) => week.number === 12)!;
const week26 = curriculum.weeks.find((week) => week.number === 26)!;

describe("isWeekLocked", () => {
  it("is false for weeks in the current or an earlier stage", () => {
    expect(isWeekLocked(week1, week1)).toBe(false);
    expect(isWeekLocked(week1, week26)).toBe(false);
  });

  it("is true for weeks in a later stage than the current week", () => {
    expect(isWeekLocked(week12, week1)).toBe(true);
    expect(isWeekLocked(week26, week1)).toBe(true);
  });
});
