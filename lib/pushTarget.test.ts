import { describe, expect, it } from "vitest";
import { parsePushTarget } from "./pushTarget";

describe("parsePushTarget", () => {
  it("extracts a filename push target", () => {
    expect(parsePushTarget("Do the thing. Push to week-01/day-05-madlibs.py.")).toBe(
      "week-01/day-05-madlibs.py",
    );
  });

  it("extracts a folder-only push target", () => {
    expect(parsePushTarget("Do the thing. Push to week-09/.")).toBe("week-09/");
  });

  it("returns undefined when there's no push target", () => {
    expect(parsePushTarget("Genuinely off.")).toBeUndefined();
  });

  it("doesn't false-positive on unrelated uses of 'push'", () => {
    expect(parsePushTarget("Pushing to saved doesn't change todos.")).toBeUndefined();
  });
});
