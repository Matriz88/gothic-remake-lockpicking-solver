import { describe, expect, it } from "vitest";
import { applyMove, solve } from "./solver";
import type { EffectValue, Effects } from "../types";

function emptyEffects(numLocks: number): Effects {
  return Array.from({ length: numLocks }, () =>
    Array.from({ length: numLocks }, () => 0 as const),
  );
}

function fullyCoupledEffects(numLocks: number): Effects {
  return Array.from({ length: numLocks }, (_, i) =>
    Array.from({ length: numLocks }, (_, j): EffectValue => (i === j ? 0 : -1)),
  );
}

describe("applyMove", () => {
  const effects = emptyEffects(3);

  it("moves a single lock left", () => {
    expect(applyMove([3, 4, 4], 0, -1, effects, 3)).toEqual([4, 4, 4]);
  });

  it("moves a single lock right", () => {
    expect(applyMove([5, 4, 4], 0, 1, effects, 3)).toEqual([4, 4, 4]);
  });

  it("returns null when pin would leave range", () => {
    expect(applyMove([1, 4, 4], 0, 1, effects, 3)).toBeNull();
    expect(applyMove([7, 4, 4], 0, -1, effects, 3)).toBeNull();
  });

  it("returns null when a coupled lock would leave range", () => {
    const coupled: Effects = [
      [0, -1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(applyMove([6, 7, 4], 0, -1, coupled, 3)).toBeNull();
  });

  it("applies coupled lock effects", () => {
    const coupled: Effects = [
      [0, -1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(applyMove([3, 3, 4], 0, -1, coupled, 3)).toEqual([4, 4, 4]);
  });

  it("moves right on independent locks", () => {
    expect(applyMove([4, 5, 6], 1, 1, effects, 3)).toEqual([4, 4, 6]);
  });
});

describe("solve", () => {
  it("returns empty steps when already solved", () => {
    const result = solve([4, 4, 4], 3, emptyEffects(3));
    expect(result).toEqual({ steps: [] });
  });

  it("finds a one-move solution", () => {
    const result = solve([3, 4, 4], 3, emptyEffects(3));
    expect(result).toMatchObject({
      steps: [expect.objectContaining({ lock: 0, direction: "left" })],
    });
  });

  it("finds shortest path with interactions", () => {
    const effects: Effects = [
      [0, -1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const result = solve([3, 3, 4], 3, effects);
    expect(result).toMatchObject({
      steps: expect.arrayContaining([
        expect.objectContaining({ state: expect.any(Array) }),
      ]),
    });
    expect((result as { steps: { state: number[] }[] }).steps.at(-1)?.state).toEqual([
      4, 4, 4,
    ]);
  });

  it("returns shortest path length for a multi-step puzzle", () => {
    const result = solve([3, 3, 4], 3, emptyEffects(3));
    expect((result as { steps: unknown[] }).steps).toHaveLength(2);
    expect((result as { steps: { state: number[] }[] }).steps.at(-1)?.state).toEqual([
      4, 4, 4,
    ]);
  });

  it("solves a 7-lock puzzle", () => {
    const numLocks = 7;
    const pinPositions = [3, 3, 3, 4, 4, 4, 4];
    const result = solve(pinPositions, numLocks, emptyEffects(numLocks));
    expect((result as { steps: unknown[] }).steps.length).toBeGreaterThan(0);
    expect((result as { steps: { state: number[] }[] }).steps.at(-1)?.state).toEqual(
      Array(numLocks).fill(4),
    );
  });

  it("reports no solution when sum invariant makes goal unreachable", () => {
    // Fully coupled 4-lock mechanism: every move changes all pin sums by ±4.
    const effects = fullyCoupledEffects(4);
    const result = solve([1, 1, 1, 2], 4, effects);
    expect(result).toEqual({
      error:
        "No solution exists for this configuration. Check that the interactions allow every lock to reach position 4.",
    });
  });
});
