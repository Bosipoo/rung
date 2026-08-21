import { describe, expect, it } from "vitest";
import { curriculum, weekTasks } from "./curriculum";

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
