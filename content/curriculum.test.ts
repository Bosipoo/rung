import { describe, expect, it } from "vitest";
import { curriculum, taskUnits, weekTasks } from "./curriculum";
import { taskUnitRefs } from "@/lib/units";

describe("weekTasks", () => {
  it.each(curriculum.weeks)(
    "week $number has 7 tasks, days 1–7 in order, with a code+solution debug drill on day 6",
    (week) => {
      const tasks = weekTasks(week);

      expect(tasks).toHaveLength(7);
      expect(tasks.map((task) => task.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);

      const challenge = tasks[5];
      expect(challenge.day).toBe(6);
      expect(challenge.code).toBeTruthy();
      expect(challenge.solution).toBeTruthy();
    },
  );
});

describe("taskUnits", () => {
  it("counts zero units for a rest day", () => {
    const rest = weekTasks(curriculum.weeks[0]).find((task) => task.kind === "rest")!;
    expect(taskUnits(rest)).toBe(0);
  });

  it("counts lesson + exercise + prove-it items for a non-rest day", () => {
    const learnDay = curriculum.weeks[0].days[0];
    expect(taskUnits(learnDay)).toBe(
      (learnDay.lesson?.length ?? 0) + (learnDay.exercises?.length ?? 0) + (learnDay.prove ? 1 : 0),
    );
  });

  it.each(curriculum.weeks)(
    "week $number: taskUnits() agrees with the number of units taskUnitRefs() enumerates",
    (week) => {
      for (const task of weekTasks(week)) {
        expect(taskUnitRefs(week.number, task)).toHaveLength(taskUnits(task));
      }
    },
  );
});

describe("challenge-day katas", () => {
  const pythonWeeks = curriculum.weeks.filter((week) => week.stage === "python");

  it.each(pythonWeeks)("week $number resolves to at least one kata resource, all https", (week) => {
    const challenge = weekTasks(week).find((task) => task.kind === "challenge")!;
    const katas = week.number >= 9 ? challenge.lesson!.slice(0, -1) : challenge.lesson!;

    expect(katas.length).toBeGreaterThan(0);
    for (const resource of katas) {
      expect(resource.url.startsWith("https://")).toBe(true);
    }
  });
});
