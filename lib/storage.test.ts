import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addJournalEntry,
  deleteJournalEntry,
  getCurrentWeek,
  getJournalEntries,
  isUnitComplete,
  setCurrentWeek,
  setUnitComplete,
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

describe("unit completion", () => {
  it("is false before anything is set", () => {
    expect(isUnitComplete("1:1:ex:0")).toBe(false);
  });

  it("round-trips completion per key", () => {
    setUnitComplete("2:3:ex:0", true);
    expect(isUnitComplete("2:3:ex:0")).toBe(true);
    expect(isUnitComplete("2:3:ex:1")).toBe(false);
    expect(isUnitComplete("2:4:ex:0")).toBe(false);
  });

  it("can be unset again", () => {
    setUnitComplete("1:1:prove", true);
    setUnitComplete("1:1:prove", false);
    expect(isUnitComplete("1:1:prove")).toBe(false);
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
    expect(() => isUnitComplete("1:1:ex:0")).not.toThrow();
    expect(() => setUnitComplete("1:1:ex:0", true)).not.toThrow();
    expect(() => getJournalEntries()).not.toThrow();
    expect(() => addJournalEntry({ week: 1, day: 1, text: "x" })).not.toThrow();

    getItem.mockRestore();
    setItem.mockRestore();
  });
});
