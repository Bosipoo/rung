import { describe, expect, it } from "vitest";
import { dayNumber, weekdayName, weekdayShort } from "./dates";

describe("dayNumber", () => {
  it("maps Monday through Sunday to 1 through 7", () => {
    expect(dayNumber(new Date("2026-08-17T12:00:00"))).toBe(1); // Monday
    expect(dayNumber(new Date("2026-08-18T12:00:00"))).toBe(2); // Tuesday
    expect(dayNumber(new Date("2026-08-19T12:00:00"))).toBe(3); // Wednesday
    expect(dayNumber(new Date("2026-08-20T12:00:00"))).toBe(4); // Thursday
    expect(dayNumber(new Date("2026-08-21T12:00:00"))).toBe(5); // Friday
    expect(dayNumber(new Date("2026-08-22T12:00:00"))).toBe(6); // Saturday
    expect(dayNumber(new Date("2026-08-23T12:00:00"))).toBe(7); // Sunday
  });
});

describe("weekdayName", () => {
  it("maps 1–7 to Monday–Sunday", () => {
    expect(weekdayName(1)).toBe("Monday");
    expect(weekdayName(5)).toBe("Friday");
    expect(weekdayName(7)).toBe("Sunday");
  });
});

describe("weekdayShort", () => {
  it("maps 1–7 to three-letter abbreviations", () => {
    expect(weekdayShort(1)).toBe("MON");
    expect(weekdayShort(6)).toBe("SAT");
    expect(weekdayShort(7)).toBe("SUN");
  });
});
