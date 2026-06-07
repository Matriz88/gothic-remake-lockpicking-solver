import { lockLabel } from "../lib/defaults";
import type { EffectValue, Effects } from "../types";

const TOGGLE_OPTIONS = [
  { val: -1 as const, label: "←", selected: "bg-left-bg border-left text-left" },
  {
    val: 0 as const,
    label: "–",
    selected: "bg-surface-4 border-border-hi text-text-muted",
  },
  { val: 1 as const, label: "→", selected: "bg-right-bg border-right text-right" },
];

type InteractionsTableProps = {
  numLocks: number;
  effects: Effects;
  onChange: (source: number, target: number, value: EffectValue) => void;
};

function EffectToggle({
  source,
  target,
  value,
  onChange,
}: {
  source: number;
  target: number;
  value: EffectValue;
  onChange: (value: EffectValue) => void;
}) {
  return (
    <div
      className="flex justify-center gap-[3px]"
      role="group"
      aria-label={`Effect on Lock ${lockLabel(target)} when Lock ${lockLabel(source)} moves left`}
    >
      {TOGGLE_OPTIONS.map((option) => (
        <button
          key={option.val}
          type="button"
          className={`flex size-[34px] items-center justify-center rounded-[5px] border bg-surface-3 p-0 text-[0.95rem] font-semibold leading-none transition-all duration-100 max-[680px]:size-[30px] max-[680px]:text-[0.88rem] ${
            value === option.val
              ? option.selected
              : "border-border text-text-dim hover:border-border-hi hover:text-text-muted"
          }`}
          title={`Lock ${lockLabel(target)} ${option.val === -1 ? "moves LEFT" : option.val === 1 ? "moves RIGHT" : "stays still"}`}
          onClick={() => onChange(option.val)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function InteractionsTable({
  numLocks,
  effects,
  onChange,
}: InteractionsTableProps) {
  const rowIndices = Array.from({ length: numLocks }, (_, i) => numLocks - 1 - i);
  const colIndices = Array.from({ length: numLocks }, (_, i) => i);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-hi"
      aria-labelledby="step3-title"
    >
      <div className="relative flex items-center gap-4 border-b border-border bg-surface-2 px-7 py-[1.1rem] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-gold-dim before:to-transparent before:opacity-60 max-[680px]:px-5 max-[680px]:py-[0.95rem]">
        <div
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gold font-display text-[0.95rem] font-bold text-[#1a1000] shadow-[0_0_14px_rgba(201,168,76,0.35)]"
          aria-hidden="true"
        >
          3
        </div>
        <h2
          className="font-display text-[1.05rem] font-semibold tracking-wide text-text"
          id="step3-title"
        >
          Lock Interactions
        </h2>
      </div>
      <div className="p-7 max-[680px]:p-5">
        <p className="mb-5 text-base italic text-text-hint">Default is no effect.</p>
        <div id="interactions-container">
          <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[300px] border-collapse" role="grid">
              <caption className="caption-top pb-3 text-left text-[0.9rem] italic text-text-hint">
                When a lock moves ← left, choose what happens to each affected lock.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" />
                  <th
                    scope="colgroup"
                    colSpan={numLocks}
                    className="px-[0.55rem] py-2 font-display text-[0.78rem] font-semibold tracking-wider whitespace-nowrap text-text-2 uppercase"
                  >
                    Affected locks →
                  </th>
                </tr>
                <tr className="border-b border-border-hi">
                  <th scope="col" className="align-bottom">
                    <span className="font-display text-[0.72rem] tracking-wider whitespace-nowrap text-text-2 uppercase leading-snug">
                      Locks ↓
                      <br />
                      <span className="font-body text-[0.85rem] font-normal tracking-normal normal-case italic">
                        moves ← left
                      </span>
                    </span>
                  </th>
                  {colIndices.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-[0.55rem] py-[0.65rem] text-center align-middle"
                      aria-label={`Lock ${lockLabel(col)} (affected)`}
                    >
                      <span className="inline-block min-w-[3.5em] whitespace-nowrap text-center font-mono text-[0.95rem] font-semibold text-gold">
                        Lock {lockLabel(col)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowIndices.map((row) => (
                  <tr key={row} className="[&+&]:border-t [&+&]:border-border">
                    <th
                      scope="row"
                      className="px-[0.55rem] py-[0.65rem] text-center align-middle"
                      aria-label={`Lock ${lockLabel(row)} (moves left)`}
                    >
                      <span className="inline-block min-w-[3.5em] whitespace-nowrap text-center font-mono text-base font-semibold text-gold">
                        Lock {lockLabel(row)}
                      </span>
                    </th>
                    {colIndices.map((col) => (
                      <td
                        key={col}
                        className={`px-[0.55rem] py-[0.65rem] text-center align-middle ${
                          row === col
                            ? "bg-surface-2 text-base text-text-dim"
                            : "px-[0.35rem] py-[0.4rem]"
                        }`}
                      >
                        {row === col ? (
                          <span aria-hidden="true">╳</span>
                        ) : (
                          <EffectToggle
                            source={row}
                            target={col}
                            value={effects[row][col]}
                            onChange={(value) => onChange(row, col, value)}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
