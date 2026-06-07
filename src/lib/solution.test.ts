import { describe, expect, it } from "vitest";
import { collapseConsecutiveSteps, hasConsecutiveRepeats } from "./solution";
import type { SolveStep } from "../types";

function step(lock: number, direction: "left" | "right", state: number[]): SolveStep {
  return { lock, direction, state };
}

describe("collapseConsecutiveSteps", () => {
  it("returns empty array for empty input", () => {
    expect(collapseConsecutiveSteps([])).toEqual([]);
  });

  it("returns a single step unchanged", () => {
    const steps = [step(0, "left", [4, 4, 4])];
    expect(collapseConsecutiveSteps(steps)).toEqual([
      { lock: 0, direction: "left", state: [4, 4, 4], count: 1 },
    ]);
  });

  it("groups consecutive identical moves with final state and count", () => {
    const steps = [
      step(1, "right", [4, 5, 4]),
      step(1, "right", [4, 6, 4]),
      step(1, "right", [4, 7, 4]),
    ];
    expect(collapseConsecutiveSteps(steps)).toEqual([
      { lock: 1, direction: "right", state: [4, 7, 4], count: 3 },
    ]);
  });
});

describe("hasConsecutiveRepeats", () => {
  it("returns false when directions alternate", () => {
    const steps = [
      step(0, "left", [4, 4, 4]),
      step(0, "right", [3, 4, 4]),
      step(1, "left", [3, 5, 4]),
    ];
    expect(hasConsecutiveRepeats(steps)).toBe(false);
  });

  it("returns true when same lock and direction repeat", () => {
    const steps = [step(0, "left", [4, 4, 4]), step(0, "left", [5, 4, 4])];
    expect(hasConsecutiveRepeats(steps)).toBe(true);
  });
});
