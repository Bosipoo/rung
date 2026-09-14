import { describe, expect, it } from "vitest";
import { getTasks, getWeek, getWeeks } from "./queries";

const totalWeeks = getWeeks().length;
const weekNumbers = Array.from({ length: totalWeeks }, (_, i) => i + 1);

describe("getWeek / getTasks", () => {
  it.each(weekNumbers)("week %i: getWeek and getTasks succeed and are well-shaped", (n) => {
    const week = getWeek(n);
    expect(week).toBeDefined();
    expect(week!.number).toBe(n);

    const tasks = getTasks(n);
    expect(tasks).toHaveLength(7);
    expect(tasks.map((task) => task.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
