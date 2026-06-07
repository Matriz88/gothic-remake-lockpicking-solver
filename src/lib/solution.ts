import type { SolveStep } from "../types";

export type DisplayStep = SolveStep & { count: number };

export function collapseConsecutiveSteps(steps: SolveStep[]): DisplayStep[] {
  if (steps.length === 0) return [];

  const out: DisplayStep[] = [];
  let i = 0;

  while (i < steps.length) {
    let j = i + 1;
    while (
      j < steps.length &&
      steps[j].lock === steps[i].lock &&
      steps[j].direction === steps[i].direction
    ) {
      j++;
    }
    out.push({ ...steps[i], state: steps[j - 1].state, count: j - i });
    i = j;
  }

  return out;
}

export function hasConsecutiveRepeats(steps: SolveStep[]): boolean {
  return steps.some(
    (step, index) =>
      index > 0 &&
      step.lock === steps[index - 1].lock &&
      step.direction === steps[index - 1].direction,
  );
}
