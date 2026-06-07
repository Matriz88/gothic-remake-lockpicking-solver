type SolveButtonProps = {
  solving: boolean;
  onSolve: () => void;
};

export function SolveButton({ solving, onSolve }: SolveButtonProps) {
  return (
    <>
      <div className="flex justify-center py-3">
        <button
          type="button"
          disabled={solving}
          onClick={onSolve}
          className="group relative cursor-pointer overflow-hidden rounded-lg border-none bg-linear-to-br from-gold-dim from-0% via-gold via-55% to-gold-hi to-100% px-15 py-[1.1rem] font-display text-[1.1rem] font-bold tracking-widest text-[#18100a] shadow-[0_2px_24px_rgba(201,168,76,0.2),0_0_0_1px_rgba(201,168,76,0.2)] transition-all duration-250 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_6px_32px_rgba(201,168,76,0.35),0_0_0_1px_var(--color-gold-dim)] enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/18 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <span className="relative">{solving ? "Solving…" : "Solve"}</span>
        </button>
      </div>
      <div
        className={`mx-auto mt-[0.4rem] h-[3px] w-full max-w-[320px] overflow-hidden rounded-[2px] bg-surface-3 transition-opacity duration-150 ${solving ? "opacity-100" : "opacity-0"}`}
        id="solve-progress"
        aria-hidden="true"
      >
        <div className="h-full w-[45%] animate-solve-shimmer bg-[linear-gradient(90deg,transparent,var(--color-gold),var(--color-gold-hi),transparent)]" />
      </div>
    </>
  );
}
