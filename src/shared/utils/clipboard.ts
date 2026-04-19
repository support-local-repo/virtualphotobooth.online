// ─────────────────────────────────────────
// Clipboard Utility
// Copies canvas blob to clipboard as PNG
// ─────────────────────────────────────────

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<{ success: boolean; error?: string }> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (!blob) return { success: false, error: "Failed to generate image blob" };

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Clipboard not supported";
    return { success: false, error: message };
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
