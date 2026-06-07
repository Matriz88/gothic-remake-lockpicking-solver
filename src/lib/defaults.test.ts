import { describe, expect, it } from "vitest";
import { createEffects, createPinPositions } from "./defaults";
import type { Effects } from "../types";

describe("createPinPositions", () => {
  it("defaults all positions to 4 when no previous values", () => {
    expect(createPinPositions(3)).toEqual([4, 4, 4]);
  });

  it("preserves existing values when shrinking lock count", () => {
    expect(createPinPositions(2, [3, 5, 6])).toEqual([3, 5]);
  });

  it("preserves existing values and defaults new locks to 4", () => {
    expect(createPinPositions(4, [3, 5])).toEqual([3, 5, 4, 4]);
  });
});

describe("createEffects", () => {
  it("zero-fills when no previous matrix", () => {
    expect(createEffects(3)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("preserves overlapping values when lock count changes", () => {
    const prev: Effects = [
      [0, -1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(createEffects(2, prev)).toEqual([
      [0, -1],
      [1, 0],
    ]);
    expect(createEffects(4, prev)).toEqual([
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});
