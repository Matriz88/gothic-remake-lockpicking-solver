import type { Effects, MoveDirection, SolveResult, SolveStep } from "../types";

export function applyMove(
  state: number[],
  lockIndex: number,
  direction: -1 | 1,
  effects: Effects,
  numLocks: number,
): number[] | null {
  const next = state.slice();

  next[lockIndex] = state[lockIndex] - direction;
  if (next[lockIndex] < 1 || next[lockIndex] > 7) return null;

  for (let j = 0; j < numLocks; j++) {
    if (j === lockIndex) continue;
    next[j] = state[j] + effects[lockIndex][j] * direction;
    if (next[j] < 1 || next[j] > 7) return null;
  }

  return next;
}

export function solve(
  initialPositions: number[],
  numLocks: number,
  effects: Effects,
): SolveResult {
  const goalKey = Array(numLocks).fill(4).join(",");
  const startKey = initialPositions.join(",");

  if (startKey === goalKey) return { steps: [] };

  type VisitEntry = {
    parentKey: string | null;
    move: { lock: number; direction: MoveDirection } | null;
    state: number[];
  };

  const visited = new Map<string, VisitEntry>();
  visited.set(startKey, {
    parentKey: null,
    move: null,
    state: initialPositions.slice(),
  });

  const queue = [initialPositions.slice()];
  const MAX_STATES = 700_000;

  while (queue.length > 0) {
    if (visited.size > MAX_STATES) {
      return {
        error:
          "Search limit reached. The configuration may have no solution, or it requires an exceptionally long sequence of moves.",
      };
    }

    const state = queue.shift()!;
    const stateKey = state.join(",");

    for (let i = 0; i < numLocks; i++) {
      for (const dir of [-1, 1] as const) {
        if (dir === -1 && state[i] === 7) continue;
        if (dir === 1 && state[i] === 1) continue;

        const next = applyMove(state, i, dir, effects, numLocks);
        if (!next) continue;

        const nextKey = next.join(",");
        if (visited.has(nextKey)) continue;

        const move = { lock: i, direction: dir === -1 ? "left" : "right" } as const;
        visited.set(nextKey, { parentKey: stateKey, move, state: next });

        if (nextKey === goalKey) {
          const steps: SolveStep[] = [];
          let key = nextKey;
          while (visited.get(key)!.parentKey !== null) {
            const info = visited.get(key)!;
            steps.unshift({ ...info.move!, state: info.state });
            key = info.parentKey!;
          }
          return { steps };
        }

        queue.push(next);
      }
    }
  }

  return {
    error:
      "No solution exists for this configuration. Check that the interactions allow every lock to reach position 4.",
  };
}
