export type EffectValue = -1 | 0 | 1;

export type Effects = EffectValue[][];

export type MoveDirection = "left" | "right";

export type SolveStep = {
  lock: number;
  direction: MoveDirection;
  state: number[];
};

export type SolveResult = { steps: SolveStep[] } | { error: string };

export type DecodedConfig = {
  numLocks: number;
  pinPositions: number[];
  effects: Effects;
};

export type DecodeResult = DecodedConfig | { error: string };
