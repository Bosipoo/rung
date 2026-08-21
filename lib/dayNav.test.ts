import { describe, expect, it } from "vitest";
import { nextDay, previousDay } from "./dayNav";

describe("nextDay", () => {
  it("steps within a week", () => {
    expect(nextDay({ week: 3, day: 4 }, 26)).toEqual({ week: 3, day: 5 });
  });

  it("crosses into the next week after day 7", () => {
    expect(nextDay({ week: 3, day: 7 }, 26)).toEqual({ week: 4, day: 1 });
  });

  it("is undefined after the last day of the last week", () => {
    expect(nextDay({ week: 26, day: 7 }, 26)).toBeUndefined();
  });
});

describe("previousDay", () => {
  it("steps within a week", () => {
    expect(previousDay({ week: 3, day: 4 })).toEqual({ week: 3, day: 3 });
  });

  it("crosses into the previous week before day 1", () => {
    expect(previousDay({ week: 4, day: 1 })).toEqual({ week: 3, day: 7 });
  });

  it("is undefined before the first day of the first week", () => {
    expect(previousDay({ week: 1, day: 1 })).toBeUndefined();
  });
});
