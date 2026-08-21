import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addJournalEntry,
  deleteJournalEntry,
  getCurrentWeek,
  getJournalEntries,
  isTaskComplete,
  setCurrentWeek,
  setTaskComplete,
} from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("current week", () => {
  it("is null before anything is set", () => {
    expect(getCurrentWeek()).toBeNull();
  });

  it("round-trips the value that was set", () => {
    setCurrentWeek(5);
    expect(getCurrentWeek()).toBe(5);
  });
});

describe("task completion", () => {
  it("is false before anything is set", () => {
    expect(isTaskComplete(1, 1)).toBe(false);
  });

  it("round-trips completion per week/day", () => {
    setTaskComplete(2, 3, true);
    expect(isTaskComplete(2, 3)).toBe(true);
    expect(isTaskComplete(2, 4)).toBe(false);
    expect(isTaskComplete(3, 3)).toBe(false);
  });

  it("can be unset again", () => {
    setTaskComplete(1, 1, true);
    setTaskComplete(1, 1, false);
    expect(isTaskComplete(1, 1)).toBe(false);
  });
});

describe("journal", () => {
  it("is empty before anything is added", () => {
    expect(getJournalEntries()).toEqual([]);
  });

  it("adds an entry with a generated id and timestamp", () => {
    const entry = addJournalEntry({ week: 1, day: 2, text: "off by one bug" });
    expect(entry.id).toBeTruthy();
    expect(entry.createdAt).toBeTruthy();
    expect(getJournalEntries()).toEqual([entry]);
  });

  it("appends rather than overwrites", () => {
    addJournalEntry({ week: 1, day: 1, text: "first" });
    addJournalEntry({ week: 1, day: 2, text: "second" });
    expect(getJournalEntries().map((e) => e.text)).toEqual(["first", "second"]);
  });

  it("deletes an entry by id", () => {
    const first = addJournalEntry({ week: 1, day: 1, text: "keep me" });
    const second = addJournalEntry({ week: 1, day: 2, text: "delete me" });
    deleteJournalEntry(second.id);
    expect(getJournalEntries()).toEqual([first]);
  });
});

describe("resilience", () => {
  it("never throws when localStorage is unavailable", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(() => getCurrentWeek()).not.toThrow();
    expect(() => setCurrentWeek(1)).not.toThrow();
    expect(() => isTaskComplete(1, 1)).not.toThrow();
    expect(() => setTaskComplete(1, 1, true)).not.toThrow();
    expect(() => getJournalEntries()).not.toThrow();
    expect(() => addJournalEntry({ week: 1, day: 1, text: "x" })).not.toThrow();

    getItem.mockRestore();
    setItem.mockRestore();
  });
});
