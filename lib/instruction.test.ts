import { describe, expect, it } from "vitest";
import { splitInstruction } from "./instruction";

describe("splitInstruction", () => {
  it("splits body and prove-it callout on the marker", () => {
    const result = splitInstruction("Learn X and Y. Prove it: build a thing that does Z.");
    expect(result.body).toBe("Learn X and Y.");
    expect(result.proveIt).toBe("build a thing that does Z.");
  });

  it("returns the whole instruction as body when there's no marker", () => {
    const result = splitInstruction("Just do the thing.");
    expect(result.body).toBe("Just do the thing.");
    expect(result.proveIt).toBeUndefined();
  });
});
