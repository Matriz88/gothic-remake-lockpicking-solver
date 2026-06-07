import { useEffect, useRef, useState } from "react";
import { lockLabel } from "../lib/defaults";
import {
  collapseConsecutiveSteps,
  hasConsecutiveRepeats,
  type DisplayStep,
} from "../lib/solution";
import type { SolveResult, SolveStep } from "../types";

type SolutionPanelProps = {
  result: SolveResult | null;
  initialPositions: number[];
};

type SolutionToggleProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

function SolutionToggle({ checked, label, onChange }: SolutionToggleProps) {
  return (
    <label className="group inline-flex cursor-pointer items-center gap-[0.7rem] select-none">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-6 w-10 shrink-0 rounded-xl border border-border-hi bg-surface-4 transition-all duration-200 after:absolute after:top-1 after:left-1 after:size-3.5 after:rounded-full after:bg-text-muted after:transition-all after:duration-200 after:content-[''] peer-checked:border-gold-dim peer-checked:bg-gold-glow peer-checked:after:left-5 peer-checked:after:bg-gold group-hover:border-gold-dim" />
      <span className="font-body text-[0.95rem] italic text-text-muted transition-colors duration-150 group-hover:text-text-2">
        {label}
      </span>
    </label>
  );
}

function StateVisual({
  state,
  movedLock,
  numLocks,
}: {
  state: number[];
  movedLock: number;
  numLocks: number;
}) {
  return (
    <div className="state-visual-scroll flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5">
      {Array.from({ length: numLocks }, (_, lockIndex) => {
        const position = state[lockIndex];
        const atGoal = position === 4;
        const isMoved = lockIndex === movedLock;

        return (
          <div
            key={lockIndex}
            className={`flex min-w-0 flex-1 flex-col items-center gap-[5px] rounded-base border px-[0.4rem] py-[0.6rem] pb-2 transition-all duration-150 ${
              isMoved && atGoal
                ? "border-success bg-success-bg"
                : isMoved
                  ? "border-gold bg-moved-bg shadow-[0_0_8px_rgba(201,168,76,0.12)]"
                  : atGoal
                    ? "border-success-dim bg-success-bg"
                    : "border-border bg-surface-3"
            }`}
          >
            <div
              className={`font-mono text-[0.82rem] font-semibold tracking-wide leading-none max-[680px]:text-xs ${
                isMoved ? "text-gold" : atGoal ? "text-success" : "text-text-muted"
              }`}
            >
              {lockLabel(lockIndex)}
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 7 }, (_, pipIndex) => {
                const pip = pipIndex + 1;
                const isHere = pip === position;
                const isTarget = pip === 4;
                return (
                  <div
                    key={pip}
                    className={`h-3.5 w-[9px] shrink-0 rounded-[3px] border transition-all duration-100 max-[680px]:w-2 max-[420px]:h-3 max-[420px]:w-[7px] ${
                      isHere && isTarget
                        ? "border-success bg-success shadow-[0_0_5px_rgba(92,175,126,0.4)]"
                        : isHere
                          ? "border-gold-hi bg-gold shadow-[0_0_5px_rgba(201,168,76,0.4)]"
                          : isTarget
                            ? "border-[rgba(92,175,126,0.45)] bg-transparent"
                            : "border-border bg-surface-4"
                    }`}
                  />
                );
              })}
            </div>
            <div
              className={`font-mono text-[0.82rem] font-semibold leading-none max-[680px]:text-xs ${atGoal ? "text-success" : "text-text-muted"}`}
            >
              {atGoal ? `${position}✓` : position}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepCard({
  step,
  state,
  movedLock,
  stepNum,
  count,
  showStepPreview,
}: {
  step: SolveStep | null;
  state: number[];
  movedLock: number;
  stepNum: number;
  count: number;
  showStepPreview: boolean;
}) {
  const [done, setDone] = useState(false);
  const isInitial = step === null;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-surface-2 transition-[border-color,transform,box-shadow] duration-150 ${
        isInitial
          ? "border-dashed cursor-default"
          : done
            ? "cursor-pointer border-border"
            : "cursor-pointer border-border hover:-translate-y-px hover:border-border-hi hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
      } ${!isInitial && !done ? "" : ""}`}
      onClick={!isInitial ? () => setDone((current) => !current) : undefined}
    >
      <div
        className={`flex items-stretch gap-0 transition-[opacity,filter] duration-250 ${done ? "pointer-events-none opacity-[0.18] grayscale" : ""}`}
      >
        <div
          className={`flex min-w-16 shrink-0 items-center justify-center border-r border-border px-[1.1rem] py-4 max-[680px]:min-w-[52px] max-[680px]:px-[0.8rem] max-[680px]:py-[0.85rem] ${
            isInitial ? "bg-surface-2" : "bg-surface-3"
          }`}
        >
          <div
            className={
              isInitial
                ? "font-display text-[0.85rem] font-semibold tracking-widest whitespace-nowrap text-gold uppercase [writing-mode:vertical-lr] rotate-180"
                : "font-display text-[1.3rem] font-bold tracking-wide leading-none text-gold-dim max-[680px]:text-[1.15rem]"
            }
          >
            {isInitial ? "Start" : String(stepNum).padStart(2, "0")}
          </div>
        </div>
        <div
          className={`min-w-0 flex-1 px-[1.4rem] py-[0.95rem] ${isInitial ? "opacity-65" : ""} ${!showStepPreview ? "py-3" : ""}`}
        >
          {step !== null && (
            <div
              className={`mb-[0.8rem] flex flex-wrap items-center gap-[0.55rem] text-[1.05rem] font-semibold text-text ${!showStepPreview ? "mb-0" : ""}`}
            >
              Move Lock{" "}
              <span className="font-mono text-[1.1rem] font-semibold text-gold">
                {lockLabel(step.lock)}
              </span>{" "}
              {step.direction === "left" ? (
                <span className="rounded border border-[rgba(168,148,232,0.35)] bg-left-bg px-[0.6rem] py-[0.2rem] font-mono text-[0.95rem] font-semibold whitespace-nowrap text-left">
                  ← LEFT
                </span>
              ) : (
                <span className="rounded border border-[rgba(98,212,164,0.35)] bg-right-bg px-[0.6rem] py-[0.2rem] font-mono text-[0.95rem] font-semibold whitespace-nowrap text-right">
                  → RIGHT
                </span>
              )}
              {count > 1 && (
                <span className="rounded border border-border-gold bg-gold-glow px-2 py-[0.15rem] font-mono text-[0.92rem] font-semibold tracking-wide text-gold">
                  &times;{count}
                </span>
              )}
            </div>
          )}
          {showStepPreview && (
            <StateVisual state={state} movedLock={movedLock} numLocks={state.length} />
          )}
        </div>
      </div>
    </div>
  );
}

function StepsList({
  steps,
  initialPositions,
  collapseSteps,
  showStepPreview,
}: {
  steps: SolveStep[];
  initialPositions: number[];
  collapseSteps: boolean;
  showStepPreview: boolean;
}) {
  const displaySteps: DisplayStep[] = collapseSteps
    ? collapseConsecutiveSteps(steps)
    : steps.map((step) => ({ ...step, count: 1 }));

  return (
    <div className="flex flex-col gap-px [&>*+*]:mt-[7px]">
      <p className="mb-4 border-l-2 border-border-hi py-[0.55rem] pl-[0.9rem] text-[0.88rem] leading-snug italic text-text-hint">
        Click any step to mark it as done and dim it. Click again to restore it.
      </p>
      {showStepPreview && (
        <StepCard
          step={null}
          state={initialPositions}
          movedLock={-1}
          stepNum={0}
          count={1}
          showStepPreview={showStepPreview}
        />
      )}
      {displaySteps.map((step, index) => (
        <StepCard
          key={`${step.lock}-${step.direction}-${index}`}
          step={step}
          state={step.state}
          movedLock={step.lock}
          stepNum={index + 1}
          count={step.count}
          showStepPreview={showStepPreview}
        />
      ))}
    </div>
  );
}

export function SolutionPanel({ result, initialPositions }: SolutionPanelProps) {
  const [collapseSteps, setCollapseSteps] = useState(true);
  const [showStepPreview, setShowStepPreview] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (result && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  if (!result) return null;

  return (
    <section
      ref={cardRef}
      id="results-card"
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-hi"
      aria-labelledby="results-title"
      aria-live="polite"
    >
      <div className="relative flex items-center gap-4 border-b border-border bg-surface-2 px-7 py-[1.1rem] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-gold-dim before:to-transparent before:opacity-60 max-[680px]:px-5 max-[680px]:py-[0.95rem]">
        <div
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-success font-display text-[0.95rem] font-bold text-[#1a1000] shadow-[0_0_14px_rgba(92,175,126,0.35)]"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2
          className="font-display text-[1.05rem] font-semibold tracking-wide text-text"
          id="results-title"
        >
          Solution
        </h2>
      </div>
      <div className="p-7 max-[680px]:p-5" id="results-body">
        {"error" in result ? (
          <div className="flex items-start gap-3 rounded-base border border-error bg-error-bg px-5 py-[1.1rem] text-[1.05rem] leading-snug text-error">
            <span className="shrink-0 text-[1.2rem] leading-normal">⚠</span>{" "}
            {result.error}
          </div>
        ) : result.steps.length === 0 ? (
          <div className="flex items-start gap-3 rounded-base border border-success bg-success-bg px-5 py-[1.1rem] text-[1.05rem] leading-snug text-success">
            <span className="shrink-0 text-[1.2rem] leading-normal">✓</span> All pins are
            already at position 4. The lock is open!
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-baseline gap-[0.6rem] rounded-base border border-border-hi bg-surface-2 px-[1.4rem] py-4">
              <span className="font-display text-[2.4rem] font-bold leading-none text-gold">
                {result.steps.length}
              </span>
              <span className="text-base italic text-text-muted">
                move{result.steps.length !== 1 ? "s" : ""} required (shortest possible
                path)
              </span>
            </div>
            <div className="mb-[1.1rem] flex flex-wrap items-center gap-x-7 gap-y-[0.85rem]">
              <SolutionToggle
                checked={showStepPreview}
                label="Show pin preview per step"
                onChange={setShowStepPreview}
              />
              {hasConsecutiveRepeats(result.steps) && (
                <SolutionToggle
                  checked={collapseSteps}
                  label="Group consecutive repeated moves"
                  onChange={setCollapseSteps}
                />
              )}
            </div>
            <div id="steps-container">
              <StepsList
                steps={result.steps}
                initialPositions={initialPositions}
                collapseSteps={collapseSteps}
                showStepPreview={showStepPreview}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
