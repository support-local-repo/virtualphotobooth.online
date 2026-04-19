"use client";

// ─────────────────────────────────────────
// useCanvas — Strip Compositing Hook
// Assembles photos + theme + filter + stickers + watermark
// into a single exportable canvas
// ─────────────────────────────────────────

import { useRef, useCallback } from "react";
import { EXPORT_SCALE } from "@/core/theme";
import { computeStripLayout, scaleRect } from "./layouts";
import { applyFilterById } from "./filters";
import { drawStickers } from "./stickers";
import { drawWatermark } from "./watermark";
import { formatStripDate, generateStripFilename } from "@/shared/utils/format";
import type { StripConfig, CapturedPhoto, ExportFormat } from "./canvas.types";

export type UseCanvasReturn = {
  canvasRef:   React.RefObject<HTMLCanvasElement>;
  renderStrip: (photos: CapturedPhoto[], config: StripConfig) => Promise<void>;
  exportStrip: (format: ExportFormat, config: StripConfig) => Promise<void>;
  getBlob:     (format?: "png" | "jpg") => Promise<Blob | null>;
  getDataUrl:  (format?: "png" | "jpg") => string | null;
};

export function useCanvas(): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Renders the complete strip onto the canvas.
   * Call whenever photos or config changes.
   */
  const renderStrip = useCallback(async (
    photos: CapturedPhoto[],
    config: StripConfig
  ): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dims = computeStripLayout(config.layout, config.borderWidth);
    const S    = EXPORT_SCALE;

    // Set canvas to retina resolution
    canvas.width  = dims.canvasWidth  * S;
    canvas.height = dims.canvasHeight * S;

    // 1. Fill strip background (theme color)
    ctx.fillStyle = config.theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw border (if not out-of-frame)
    if (config.layout.id !== "outofframe" && config.borderWidth > 0) {
      ctx.strokeStyle = config.theme.border;
      ctx.lineWidth   = dims.borderWidth * S;
    }

    // 3. Draw each photo into its slot
    for (let i = 0; i < dims.slots.length; i++) {
      const slot  = scaleRect(dims.slots[i], S);
      const photo = photos[i];

      if (!photo) {
        // Empty slot — placeholder
        ctx.fillStyle = "rgba(180, 120, 160, 0.10)";
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
        continue;
      }

      // Load image from dataUrl
      const img = await loadImage(photo.dataUrl);
      ctx.drawImage(img, slot.x, slot.y, slot.width, slot.height);

      // 4. Apply filter per photo slot
      ctx.save();
      ctx.beginPath();
      ctx.rect(slot.x, slot.y, slot.width, slot.height);
      ctx.clip();
      applyFilterById(config.filter.id, ctx, slot.x + slot.width, slot.y + slot.height);
      ctx.restore();
    }

    // 5. Date overlay
    if (config.showDate) {
      drawDateOverlay(ctx, canvas.width, canvas.height, config.theme.text, S);
    }

    // 6. Stickers
    if (config.stickers.length > 0) {
      drawStickers(ctx, config.stickers, canvas.width, canvas.height, S);
    }

    // 7. Text overlay
    if (config.textOverlay) {
      const t = config.textOverlay;
      ctx.save();
      ctx.font         = `${t.fontSize * S}px ${t.font}`;
      ctx.fillStyle    = t.color;
      ctx.textBaseline = "middle";
      ctx.textAlign    = "center";
      ctx.fillText(t.text, t.x * canvas.width, t.y * canvas.height);
      ctx.restore();
    }

    // 8. Watermark (last layer)
    if (config.showWatermark) {
      drawWatermark(ctx, canvas.width, canvas.height, S);
    }
  }, []);

  /**
   * Triggers a file download of the strip.
   */
  const exportStrip = useCallback(async (
    format: ExportFormat,
    config: StripConfig
  ): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === "stories") {
      await exportAsStories(canvas, config);
      return;
    }

    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const quality  = format === "jpg" ? 0.92 : undefined;
    const dataUrl  = canvas.toDataURL(mimeType, quality);
    triggerDownload(dataUrl, generateStripFilename(format));
  }, []);

  const getBlob = useCallback(async (format: "png" | "jpg" = "png"): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return new Promise((resolve) =>
      canvas.toBlob(resolve, format === "jpg" ? "image/jpeg" : "image/png", 0.92)
    );
  }, []);

  const getDataUrl = useCallback((format: "png" | "jpg" = "png"): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.92);
  }, []);

  return { canvasRef, renderStrip, exportStrip, getBlob, getDataUrl };
}

// ─── Helpers ──────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

function drawDateOverlay(
  ctx:    CanvasRenderingContext2D,
  width:  number,
  height: number,
  color:  string,
  scale:  number
): void {
  const text     = formatStripDate();
  const fontSize = 10 * scale;
  ctx.save();
  ctx.font         = `${fontSize}px "DM Sans", sans-serif`;
  ctx.fillStyle    = color;
  ctx.globalAlpha  = 0.60;
  ctx.textBaseline = "bottom";
  ctx.textAlign    = "center";
  ctx.fillText(text, width / 2, height - 6 * scale);
  ctx.restore();
}

function triggerDownload(dataUrl: string, filename: string): void {
  const a      = document.createElement("a");
  a.href       = dataUrl;
  a.download   = filename;
  a.click();
  a.remove();
}

/**
 * Exports the strip centered on a 9:16 canvas for Instagram Stories
 */
async function exportAsStories(canvas: HTMLCanvasElement, _config: StripConfig): Promise<void> {
  const targetW = 1080;
  const targetH = 1920;
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width  = targetW;
  tmpCanvas.height = targetH;
  const tmpCtx = tmpCanvas.getContext("2d")!;

  // Soft gradient background
  const grad = tmpCtx.createLinearGradient(0, 0, targetW, targetH);
  grad.addColorStop(0,   "#ffd6e7");
  grad.addColorStop(0.5, "#e8d5f5");
  grad.addColorStop(1,   "#ffe8d6");
  tmpCtx.fillStyle = grad;
  tmpCtx.fillRect(0, 0, targetW, targetH);

  // Center the strip
  const scale = Math.min(targetW / canvas.width, (targetH * 0.75) / canvas.height);
  const dx    = (targetW - canvas.width  * scale) / 2;
  const dy    = (targetH - canvas.height * scale) / 2;
  tmpCtx.drawImage(canvas, dx, dy, canvas.width * scale, canvas.height * scale);

  const dataUrl = tmpCanvas.toDataURL("image/png");
  triggerDownload(dataUrl, generateStripFilename("png").replace(".png", "-stories.png"));
}
