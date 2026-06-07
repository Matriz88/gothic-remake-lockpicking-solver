import { useEffect, useRef, useState, type FormEvent } from "react";

type ImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onImport: (raw: string) => string | null;
};

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setInput("");
      setError(null);
      dialog.showModal();
      window.setTimeout(() => {
        dialog.querySelector<HTMLTextAreaElement>("#import-code-input")?.focus();
      }, 0);
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const importError = onImport(input);
    if (importError) {
      setError(importError);
      return;
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      id="import-dialog"
      aria-labelledby="import-dialog-title"
      onClose={onClose}
      className="fixed top-1/2 left-1/2 m-0 w-[min(520px,calc(100vw-2rem))] max-w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border-hi bg-surface p-0 text-text shadow-[0_8px_48px_rgba(0,0,0,0.6)]"
    >
      <form
        method="dialog"
        id="import-form"
        onSubmit={handleSubmit}
        className="px-7 pt-6 pb-[1.35rem]"
      >
        <h2
          id="import-dialog-title"
          className="mb-2 font-display text-[1.05rem] font-semibold tracking-wide text-gold"
        >
          Import Code
        </h2>
        <p className="mb-4 text-[0.92rem] leading-normal italic text-text-hint [&_code]:font-mono [&_code]:text-[0.82rem] [&_code]:text-text-hint">
          Paste a share code or a link containing <code>?code=...</code>
        </p>
        <textarea
          id="import-code-input"
          rows={3}
          spellCheck={false}
          autoComplete="off"
          aria-label="Share code"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError(null);
          }}
          className="min-h-18 w-full resize-y rounded-base border border-border-hi bg-surface-3 px-[0.85rem] py-3 font-mono text-[0.88rem] leading-normal text-text focus:border-gold-dim focus:shadow-[0_0_0_2px_var(--color-gold-glow)] focus:outline-none"
        />
        {error && (
          <p
            id="import-error"
            className="mt-3 rounded-base border border-error bg-error-bg px-[0.85rem] py-[0.65rem] text-[0.92rem] leading-snug text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-[0.6rem]">
          <button
            type="button"
            id="import-cancel-btn"
            className="cursor-pointer rounded-base border border-border-hi bg-transparent px-[1.1rem] py-[0.6rem] font-display text-[0.85rem] font-semibold tracking-wider text-text-muted transition-all duration-150 hover:border-border-hi hover:bg-surface-3 hover:text-text"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="import-confirm-btn"
            className="cursor-pointer rounded-base border border-gold-dim bg-gold-glow px-[1.1rem] py-[0.6rem] font-display text-[0.85rem] font-semibold tracking-wider text-gold transition-all duration-150 hover:border-gold hover:bg-gold-glow hover:text-gold-hi"
          >
            Import &amp; Solve
          </button>
        </div>
      </form>
    </dialog>
  );
}
