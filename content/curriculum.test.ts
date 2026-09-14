import { describe, expect, it } from "vitest";
import { curriculum, taskUnits, weekTasks } from "./curriculum";
import { taskUnitRefs } from "@/lib/units";
import { KATAS, kataFor } from "./katas";

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

describe("resource links", () => {
  it.each(curriculum.weeks)("week $number: every lesson resource is a well-formed https URL", (week) => {
    for (const task of weekTasks(week)) {
      for (const resource of task.lesson ?? []) {
        expect(resource.url.startsWith("https://")).toBe(true);
        expect(() => new URL(resource.url)).not.toThrow();
      }
    }
  });
});

describe("challenge-day katas", () => {
  const pythonWeeks = curriculum.weeks.filter((week) => week.number >= 1 && week.number <= 11);
  const javascriptWeeksWithKatas = curriculum.weeks.filter(
    (week) => week.stage === "javascript" && week.number in KATAS,
  );

  it.each([...pythonWeeks, ...javascriptWeeksWithKatas])(
    "week $number resolves to at least one kata resource, all https",
    (week) => {
      const katas = kataFor(week.number);
      expect(katas.length).toBeGreaterThan(0);
      for (const resource of katas) {
        expect(resource.url.startsWith("https://")).toBe(true);
      }
    },
  );

  it.each([28, 29, 30, 31, 34, 35, 36])("week %i has no kata — its challenge is a lab or a build", (weekNumber) => {
    expect(kataFor(weekNumber)).toEqual([]);
  });
});
