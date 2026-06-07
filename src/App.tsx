import { useCallback, useEffect, useState } from "react";
import { ImportDialog } from "./components/ImportDialog";
import { InteractionsTable } from "./components/InteractionsTable";
import { LockCountSelector } from "./components/LockCountSelector";
import { PinPositionSelector } from "./components/PinPositionSelector";
import { ShareBar } from "./components/ShareBar";
import { SolutionPanel } from "./components/SolutionPanel";
import { SolveButton } from "./components/SolveButton";
import { createEffects, createPinPositions } from "./lib/defaults";
import { decodeConfig } from "./lib/share";
import { solve } from "./lib/solver";
import type { EffectValue, Effects, SolveResult } from "./types";

const DEFAULT_LOCKS = 3;

type AppState = {
  numLocks: number;
  pinPositions: number[];
  effects: Effects;
  result: SolveResult | null;
  solvingPositions: number[] | null;
  urlImportError: string | null;
};

function createDefaultState(): AppState {
  return {
    numLocks: DEFAULT_LOCKS,
    pinPositions: createPinPositions(DEFAULT_LOCKS),
    effects: createEffects(DEFAULT_LOCKS),
    result: null,
    solvingPositions: null,
    urlImportError: null,
  };
}

function createInitialState(): AppState {
  const code = new URLSearchParams(location.search).get("code");
  if (!code) return createDefaultState();

  const decoded = decodeConfig(code);
  if ("error" in decoded) {
    return { ...createDefaultState(), urlImportError: decoded.error };
  }

  return {
    numLocks: decoded.numLocks,
    pinPositions: decoded.pinPositions.slice(),
    effects: decoded.effects.map((row) => row.slice() as Effects[number]),
    result: solve(decoded.pinPositions, decoded.numLocks, decoded.effects),
    solvingPositions: decoded.pinPositions.slice(),
    urlImportError: null,
  };
}

function runSolveWithDelay(
  positions: number[],
  numLocks: number,
  effects: Effects,
  setResult: (result: SolveResult) => void,
  setSolving: (solving: boolean) => void,
  setSolvingPositions: (positions: number[]) => void,
) {
  setSolving(true);
  setSolvingPositions(positions.slice());
  window.setTimeout(() => {
    setResult(solve(positions, numLocks, effects));
    setSolving(false);
  }, 40);
}

function App() {
  const [initial] = useState(createInitialState);
  const [numLocks, setNumLocks] = useState(initial.numLocks);
  const [pinPositions, setPinPositions] = useState(initial.pinPositions);
  const [effects, setEffects] = useState(initial.effects);
  const [result, setResult] = useState<SolveResult | null>(initial.result);
  const [solvingPositions, setSolvingPositions] = useState<number[] | null>(
    initial.solvingPositions,
  );
  const [solving, setSolving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [urlImportError, setUrlImportError] = useState<string | null>(
    initial.urlImportError,
  );

  const applyConfiguration = useCallback(
    (newNumLocks: number, newPinPositions: number[], newEffects: Effects) => {
      setNumLocks(newNumLocks);
      setPinPositions(newPinPositions.slice());
      setEffects(newEffects.map((row) => row.slice() as Effects[number]));
      setResult(null);
    },
    [],
  );

  const runSolve = useCallback(() => {
    runSolveWithDelay(
      pinPositions,
      numLocks,
      effects,
      setResult,
      setSolving,
      setSolvingPositions,
    );
  }, [effects, numLocks, pinPositions]);

  const importFromCode = useCallback(
    (raw: string): string | null => {
      const decoded = decodeConfig(raw);
      if ("error" in decoded) return decoded.error;

      applyConfiguration(decoded.numLocks, decoded.pinPositions, decoded.effects);
      runSolveWithDelay(
        decoded.pinPositions,
        decoded.numLocks,
        decoded.effects,
        setResult,
        setSolving,
        setSolvingPositions,
      );
      return null;
    },
    [applyConfiguration],
  );

  const handleReset = useCallback(() => {
    setNumLocks(DEFAULT_LOCKS);
    setPinPositions(createPinPositions(DEFAULT_LOCKS));
    setEffects(createEffects(DEFAULT_LOCKS));
    setResult(null);
    setUrlImportError(null);

    const url = new URL(location.href);
    if (url.searchParams.has("code")) {
      url.searchParams.delete("code");
      history.replaceState(null, "", url.toString());
    }
  }, []);

  const handleLockCountChange = useCallback((count: number) => {
    setNumLocks(count);
    setPinPositions((current) => createPinPositions(count, current));
    setEffects((current) => createEffects(count, current));
    setResult(null);
  }, []);

  const handlePinChange = useCallback((lockIndex: number, position: number) => {
    setPinPositions((current) => {
      const next = current.slice();
      next[lockIndex] = position;
      return next;
    });
  }, []);

  const handleEffectChange = useCallback(
    (source: number, target: number, value: EffectValue) => {
      setEffects((current) => {
        const next = current.map((row) => row.slice() as Effects[number]);
        next[source][target] = value;
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (!urlImportError) return;
    const id = window.setTimeout(() => setUrlImportError(null), 8000);
    return () => window.clearTimeout(id);
  }, [urlImportError]);

  return (
    <>
      <ShareBar
        numLocks={numLocks}
        pinPositions={pinPositions}
        effects={effects}
        onImport={() => setImportOpen(true)}
        onReset={handleReset}
      />

      <div id="app" className="mx-auto max-w-[1280px] px-8 max-[680px]:px-4">
        <header className="px-8 py-16 pb-14 text-center">
          <div
            className="mb-[0.8rem] block text-[2.8rem] leading-none"
            aria-hidden="true"
          >
            ⚙
          </div>
          <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold tracking-wider leading-tight text-gold max-[680px]:tracking-wide">
            Gothic 1 Remake
            <span className="mt-[0.4rem] block font-display text-[clamp(0.9rem,2vw,1.05rem)] font-normal tracking-[0.12em] text-text-muted uppercase">
              Lockpicking Solver
            </span>
          </h1>
        </header>

        <main className="flex flex-col gap-6 py-8 pb-24">
          {urlImportError && (
            <div
              className="flex items-start gap-[0.6rem] rounded-base border border-error bg-error-bg px-[1.1rem] py-[0.85rem] text-[0.95rem] leading-snug text-error"
              role="alert"
            >
              <span className="shrink-0 text-[1.2rem] leading-normal">⚠</span>
              <span>{urlImportError}</span>
            </div>
          )}

          <LockCountSelector numLocks={numLocks} onChange={handleLockCountChange} />
          <PinPositionSelector
            numLocks={numLocks}
            pinPositions={pinPositions}
            onChange={handlePinChange}
          />
          <InteractionsTable
            numLocks={numLocks}
            effects={effects}
            onChange={handleEffectChange}
          />
          <SolveButton solving={solving} onSolve={runSolve} />
          <SolutionPanel
            result={result}
            initialPositions={solvingPositions ?? pinPositions}
          />
        </main>

        <footer className="border-t border-border px-4 py-8 pb-12 text-center font-display text-[0.8rem] tracking-wider text-text-dim">
          <p>
            Gothic 1 Remake Lockpicking Solver. Not affiliated with THQ Nordic or Alkimia
            Interactive
          </p>
        </footer>
      </div>

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importFromCode}
      />
    </>
  );
}

export default App;
