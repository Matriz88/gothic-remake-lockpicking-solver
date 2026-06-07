import { useState } from "react";
import { copyTextToClipboard } from "../lib/clipboard";
import { encodeConfig } from "../lib/share";
import type { Effects } from "../types";

type ShareBarProps = {
  numLocks: number;
  pinPositions: number[];
  effects: Effects;
  onImport: () => void;
  onReset: () => void;
};

type CopyButton = "code" | "link";

const shareBtnBase =
  "cursor-pointer rounded-base border border-border-hi bg-transparent px-[1.35rem] py-[0.65rem] font-display text-[0.88rem] font-semibold tracking-wider text-text-2 transition-all duration-150 max-[680px]:px-[0.95rem] max-[680px]:py-[0.55rem] max-[680px]:text-[0.82rem]";

function buildShareLink(
  numLocks: number,
  pinPositions: number[],
  effects: Effects,
): string {
  const code = encodeConfig(numLocks, pinPositions, effects);
  const url = new URL(location.href);
  url.searchParams.set("code", code);
  return url.toString();
}

export function ShareBar({
  numLocks,
  pinPositions,
  effects,
  onImport,
  onReset,
}: ShareBarProps) {
  const [copied, setCopied] = useState<CopyButton | null>(null);

  async function handleCopy(which: CopyButton) {
    const text =
      which === "code"
        ? encodeConfig(numLocks, pinPositions, effects)
        : buildShareLink(numLocks, pinPositions, effects);
    await copyTextToClipboard(text);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <nav
      className="sticky top-0 z-200 w-full border-b border-[rgba(34,34,58,0.85)] bg-[rgba(6,6,14,0.78)] shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-md"
      aria-label="Share configuration"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-8 py-[0.7rem] max-[680px]:gap-2 max-[680px]:px-4 max-[680px]:py-[0.65rem]">
        <div className="w-7 shrink-0" aria-hidden="true" />
        <div className="flex flex-1 flex-wrap items-center justify-center gap-3 max-[680px]:gap-2">
          <button
            id="copy-code-btn"
            type="button"
            className={`${shareBtnBase} ${
              copied === "code"
                ? "border-success bg-success-bg text-success"
                : "hover:border-gold-dim hover:bg-gold-glow2 hover:text-gold"
            }`}
            onClick={() => handleCopy("code")}
          >
            {copied === "code" ? "Copied!" : "Copy Code"}
          </button>
          <button
            id="copy-link-btn"
            type="button"
            className={`${shareBtnBase} ${
              copied === "link"
                ? "border-success bg-success-bg text-success"
                : "hover:border-gold-dim hover:bg-gold-glow2 hover:text-gold"
            }`}
            onClick={() => handleCopy("link")}
          >
            {copied === "link" ? "Copied!" : "Copy Link"}
          </button>
          <button
            id="import-code-btn"
            type="button"
            className={`${shareBtnBase} hover:border-gold-dim hover:bg-gold-glow2 hover:text-gold`}
            onClick={onImport}
          >
            Import Code
          </button>
          <button
            id="reset-btn"
            type="button"
            className={`${shareBtnBase} hover:border-error hover:bg-error-bg hover:text-error`}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
        <a
          className="flex w-7 shrink-0 items-center justify-end text-text-muted transition-colors duration-150 hover:text-gold [&_svg]:block [&_svg]:fill-current"
          href="https://github.com/Matriz88/gothic-remake-lockpicking-solver"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
