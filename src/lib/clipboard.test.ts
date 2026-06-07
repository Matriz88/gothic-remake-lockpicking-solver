// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "./clipboard";

describe("copyTextToClipboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses navigator.clipboard when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await copyTextToClipboard("G1L1.3.444.------");

    expect(writeText).toHaveBeenCalledWith("G1L1.3.444.------");
  });

  it("falls back to execCommand when clipboard API fails", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand as typeof document.execCommand;

    await copyTextToClipboard("fallback-text");

    expect(execCommand).toHaveBeenCalledWith("copy");
  });
});
