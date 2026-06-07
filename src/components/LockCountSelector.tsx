const LOCK_COUNTS = [3, 4, 5, 6, 7] as const;

type LockCountSelectorProps = {
  numLocks: number;
  onChange: (count: number) => void;
};

export function LockCountSelector({ numLocks, onChange }: LockCountSelectorProps) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-hi"
      aria-labelledby="step1-title"
    >
      <div className="relative flex items-center gap-4 border-b border-border bg-surface-2 px-7 py-[1.1rem] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-gold-dim before:to-transparent before:opacity-60 max-[680px]:px-5 max-[680px]:py-[0.95rem]">
        <div
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gold font-display text-[0.95rem] font-bold text-[#1a1000] shadow-[0_0_14px_rgba(201,168,76,0.35)]"
          aria-hidden="true"
        >
          1
        </div>
        <h2
          className="font-display text-[1.05rem] font-semibold tracking-wide text-text"
          id="step1-title"
        >
          Number of Locks
        </h2>
      </div>
      <div className="p-7 max-[680px]:p-5">
        <p className="mb-5 text-base italic text-text-hint">
          How many locks does this mechanism have?
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Select number of locks"
        >
          {LOCK_COUNTS.map((count) => {
            const active = count === numLocks;
            return (
              <button
                key={count}
                type="button"
                className={`size-14 rounded-base border bg-surface-3 font-display text-xl font-semibold tracking-wide transition-all duration-150 max-[420px]:size-12 max-[420px]:text-lg ${
                  active
                    ? "border-gold bg-gold-glow text-gold shadow-[0_0_12px_rgba(201,168,76,0.15),inset_0_1px_0_rgba(201,168,76,0.1)]"
                    : "border-border-hi text-text-muted hover:border-gold-dim hover:bg-gold-glow2 hover:text-gold"
                }`}
                aria-pressed={active}
                onClick={() => onChange(count)}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
