import { lockLabel } from "../lib/defaults";

const POSITIONS = [1, 2, 3, 4, 5, 6, 7] as const;

type PinPositionSelectorProps = {
  numLocks: number;
  pinPositions: number[];
  onChange: (lockIndex: number, position: number) => void;
};

export function PinPositionSelector({
  numLocks,
  pinPositions,
  onChange,
}: PinPositionSelectorProps) {
  const lockIndices = Array.from({ length: numLocks }, (_, i) => numLocks - 1 - i);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-hi"
      aria-labelledby="step2-title"
    >
      <div className="relative flex items-center gap-4 border-b border-border bg-surface-2 px-7 py-[1.1rem] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-gold-dim before:to-transparent before:opacity-60 max-[680px]:px-5 max-[680px]:py-[0.95rem]">
        <div
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gold font-display text-[0.95rem] font-bold text-[#1a1000] shadow-[0_0_14px_rgba(201,168,76,0.35)]"
          aria-hidden="true"
        >
          2
        </div>
        <h2
          className="font-display text-[1.05rem] font-semibold tracking-wide text-text"
          id="step2-title"
        >
          Initial Pin Positions
        </h2>
      </div>
      <div className="p-7 max-[680px]:p-5">
        <div className="grid grid-cols-2 items-start gap-6 max-[680px]:grid-cols-1">
          <div className="min-w-0">
            <p className="mb-4 text-base italic text-text-hint [&_strong]:font-semibold [&_strong]:not-italic [&_strong]:text-gold">
              Click each lock&apos;s current position (1–7). The goal is always{" "}
              <strong>position 4</strong> (centre).
            </p>
            <div id="pin-positions-container">
              {lockIndices.map((lockIndex) => (
                <div
                  key={lockIndex}
                  className="flex items-center gap-4 py-[0.7rem] [&+&]:border-t [&+&]:border-border"
                >
                  <div className="w-[26px] shrink-0 text-right font-mono text-[1.05rem] font-semibold text-gold">
                    {lockLabel(lockIndex)}
                  </div>
                  <div className="flex flex-1 gap-1">
                    {POSITIONS.map((position) => {
                      const isActive = pinPositions[lockIndex] === position;
                      const isTarget = position === 4;
                      return (
                        <button
                          key={position}
                          type="button"
                          className={`h-[46px] min-w-0 flex-1 rounded-base border font-mono text-base font-semibold transition-all duration-120 max-[680px]:h-10 max-[680px]:text-sm max-[420px]:h-9 max-[420px]:text-[0.82rem] ${
                            isActive && isTarget
                              ? "border-success bg-success-bg text-success"
                              : isActive
                                ? "border-gold bg-gold-glow text-gold"
                                : isTarget
                                  ? "border-success-dim bg-surface-3 text-text-muted hover:border-border-hi hover:text-text"
                                  : "border-border bg-surface-3 text-text-muted hover:border-border-hi hover:text-text"
                          }`}
                          aria-label={`Lock ${lockLabel(lockIndex)} position ${position}`}
                          onClick={() => onChange(lockIndex, position)}
                        >
                          {position}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="m-0 min-w-0 w-full overflow-hidden rounded-lg border border-border bg-surface-3 p-4.5">
            <img
              src={`${import.meta.env.BASE_URL}images/lockpick.png`}
              alt="In-game lock view with locks numbered 1 (front) to 5 (back)"
              width={640}
              height={360}
              loading="lazy"
              className="block h-auto w-full"
            />
            <figcaption className="mt-3 border-t border-border pt-[0.65rem] text-center text-[0.9rem] italic text-text-hint [&_strong]:font-semibold [&_strong]:not-italic [&_strong]:text-gold">
              Locks are numbered <strong>1 (front)</strong> to <strong>N (back)</strong>,
              matching the in-game layout.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
