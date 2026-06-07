import type { Effects } from "../types";

export function createEffects(numLocks: number, prev: Effects = []): Effects {
  const effects: Effects = [];
  for (let i = 0; i < numLocks; i++) {
    effects[i] = [];
    for (let j = 0; j < numLocks; j++) {
      effects[i][j] = i < prev.length && j < prev.length ? prev[i][j] : 0;
    }
  }
  return effects;
}

export function createPinPositions(numLocks: number, prev: number[] = []): number[] {
  const pinPositions: number[] = [];
  for (let i = 0; i < numLocks; i++) {
    pinPositions[i] = prev[i] !== undefined ? prev[i] : 4;
  }
  return pinPositions;
}

export function lockLabel(index: number): string {
  return (index + 1).toString();
}
