import { describe, expect, it } from "vitest";
import { decodeConfig, encodeConfig } from "./share";
import type { Effects } from "../types";

function sampleEffects(): Effects {
  return [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 0],
  ];
}

describe("encodeConfig / decodeConfig", () => {
  it("round-trips a configuration", () => {
    const numLocks = 3;
    const pinPositions = [3, 4, 5];
    const effects = sampleEffects();
    const code = encodeConfig(numLocks, pinPositions, effects);
    const decoded = decodeConfig(code);

    expect(decoded).toEqual({ numLocks, pinPositions, effects });
  });

  it("produces the expected string format", () => {
    expect(encodeConfig(3, [3, 4, 5], sampleEffects())).toBe("G1L1.3.345.L-R---");
  });

  it("extracts code from a full URL", () => {
    const code = encodeConfig(3, [4, 4, 4], sampleEffects());
    const decoded = decodeConfig(
      `https://example.com/page?code=${encodeURIComponent(code)}`,
    );

    expect(decoded).toEqual({
      numLocks: 3,
      pinPositions: [4, 4, 4],
      effects: sampleEffects(),
    });
  });

  it("extracts code from a ?code= prefix", () => {
    const code = encodeConfig(3, [4, 4, 4], sampleEffects());
    expect(decodeConfig(`?code=${code}`)).toEqual({
      numLocks: 3,
      pinPositions: [4, 4, 4],
      effects: sampleEffects(),
    });
  });

  it("round-trips a 7-lock configuration", () => {
    const numLocks = 7;
    const pinPositions = [1, 2, 3, 4, 5, 6, 7];
    const effects = Array.from({ length: numLocks }, () =>
      Array.from({ length: numLocks }, () => 0 as const),
    );
    const code = encodeConfig(numLocks, pinPositions, effects);
    expect(decodeConfig(code)).toEqual({ numLocks, pinPositions, effects });
  });

  it("rejects empty input", () => {
    expect(decodeConfig("   ")).toEqual({ error: "No code provided." });
  });

  it("rejects invalid format", () => {
    expect(decodeConfig("bad-code")).toEqual({
      error: "Invalid code format. Expected G1L1.{locks}.{pins}.{effects}",
    });
  });

  it("rejects wrong magic version", () => {
    expect(decodeConfig("G1L2.3.444.------")).toEqual({
      error: "Unrecognised code version. Expected a G1L1 code.",
    });
  });

  it("rejects invalid lock count", () => {
    expect(decodeConfig("G1L1.2.44.--")).toEqual({
      error: "Lock count must be between 3 and 7.",
    });
  });

  it("rejects pin count mismatch", () => {
    expect(decodeConfig("G1L1.3.44.------")).toEqual({
      error: "Pin positions must be exactly 3 digits.",
    });
  });

  it("rejects invalid pin digits", () => {
    expect(decodeConfig("G1L1.3.484.------")).toEqual({
      error: 'Invalid pin position "8" at lock 2. Each must be 1–7.',
    });
  });

  it("rejects effects length mismatch", () => {
    expect(decodeConfig("G1L1.3.444.---")).toEqual({
      error: "Effects string must be exactly 6 characters.",
    });
  });

  it("rejects invalid effect characters", () => {
    expect(decodeConfig("G1L1.3.444.X-----")).toEqual({
      error: 'Invalid effect character "X" at position 1. Use L, -, or R.',
    });
  });
});
