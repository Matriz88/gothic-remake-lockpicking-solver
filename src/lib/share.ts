import type { DecodeResult, EffectValue, Effects } from "../types";

const MAGIC = "G1L1";

const EFFECT_TO_CHAR: Record<EffectValue, string> = {
  [-1]: "L",
  0: "-",
  1: "R",
};

const CHAR_TO_EFFECT: Record<string, EffectValue> = {
  L: -1,
  "-": 0,
  R: 1,
};

function expectedEffectsLength(numLocks: number): number {
  return numLocks * (numLocks - 1);
}

export function encodeConfig(
  numLocks: number,
  pinPositions: number[],
  effects: Effects,
): string {
  const pins = pinPositions.join("");
  let eff = "";
  for (let i = 0; i < numLocks; i++) {
    for (let j = 0; j < numLocks; j++) {
      if (i === j) continue;
      eff += EFFECT_TO_CHAR[effects[i][j]];
    }
  }
  return `${MAGIC}.${numLocks}.${pins}.${eff}`;
}

function normaliseCodeInput(raw: string): string {
  let s = raw.trim();
  if (!s) return s;

  const codeMatch = s.match(/[?&]code=([^&#]+)/i);
  if (codeMatch) {
    try {
      return decodeURIComponent(codeMatch[1].trim());
    } catch {
      return codeMatch[1].trim();
    }
  }

  if (s.startsWith("?code=")) {
    s = s.slice(6);
    try {
      return decodeURIComponent(s.trim());
    } catch {
      return s.trim();
    }
  }

  return s;
}

export function decodeConfig(raw: string): DecodeResult {
  const code = normaliseCodeInput(raw);
  if (!code) {
    return { error: "No code provided." };
  }

  const parts = code.split(".");
  if (parts.length !== 4) {
    return {
      error: "Invalid code format. Expected G1L1.{locks}.{pins}.{effects}",
    };
  }

  const [magic, nStr, pinsStr, effStr] = parts;
  if (magic !== MAGIC) {
    return { error: "Unrecognised code version. Expected a G1L1 code." };
  }

  const numLocks = parseInt(nStr, 10);
  if (!Number.isInteger(numLocks) || numLocks < 3 || numLocks > 7) {
    return { error: "Lock count must be between 3 and 7." };
  }

  if (pinsStr.length !== numLocks) {
    return { error: `Pin positions must be exactly ${numLocks} digits.` };
  }

  const pinPositions: number[] = [];
  for (let k = 0; k < pinsStr.length; k++) {
    const pos = parseInt(pinsStr[k], 10);
    if (!Number.isInteger(pos) || pos < 1 || pos > 7) {
      return {
        error: `Invalid pin position "${pinsStr[k]}" at lock ${k + 1}. Each must be 1–7.`,
      };
    }
    pinPositions.push(pos);
  }

  const expectedLen = expectedEffectsLength(numLocks);
  if (effStr.length !== expectedLen) {
    return {
      error: `Effects string must be exactly ${expectedLen} characters.`,
    };
  }

  for (let c = 0; c < effStr.length; c++) {
    if (!(effStr[c] in CHAR_TO_EFFECT)) {
      return {
        error: `Invalid effect character "${effStr[c]}" at position ${c + 1}. Use L, -, or R.`,
      };
    }
  }

  const effects: Effects = [];
  let idx = 0;
  for (let i = 0; i < numLocks; i++) {
    effects[i] = [];
    for (let j = 0; j < numLocks; j++) {
      if (i === j) {
        effects[i][j] = 0;
      } else {
        effects[i][j] = CHAR_TO_EFFECT[effStr[idx++]];
      }
    }
  }

  return { numLocks, pinPositions, effects };
}
