"use client";

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

    canvas.width  = dims.canvasWidth  * S;
    canvas.height = dims.canvasHeight * S;

    const _tplType = sessionStorage.getItem("vpb_template_type");
    const _tplSrc  = sessionStorage.getItem("vpb_template");

    // Fill background only when no custom frame
    if (_tplType !== "background") {
      ctx.fillStyle = config.theme.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw custom background frame FIRST (behind photos)
    if (_tplSrc && _tplType === "background") {
      const fScale = parseFloat(sessionStorage.getItem("vpb_frame_scale") ?? "1");
      await new Promise<void>((resolve) => {
        const bg = new Image();
        bg.onload = () => {
          const fw = canvas.width  * fScale;
          const fh = canvas.height * fScale;
          const fx = (canvas.width  - fw) / 2;
          const fy = (canvas.height - fh) / 2;
          ctx.drawImage(bg, fx, fy, fw, fh);
          resolve();
        };
        bg.onerror = () => resolve();
        bg.src = _tplSrc;
      });
    }

    if (config.layout.id !== "outofframe" && config.borderWidth > 0) {
      ctx.strokeStyle = config.theme.border;
      ctx.lineWidth   = dims.borderWidth * S;
    }

    // When custom background frame is active, inset photos so frame border is visible
    const frameInset = (_tplType === "background" && _tplSrc) ? Math.round(canvas.width * 0.08) : 0;

    for (let i = 0; i < dims.slots.length; i++) {
      const rawSlot = scaleRect(dims.slots[i], S);
      const slot = frameInset > 0 ? {
        x:      rawSlot.x      + frameInset,
        y:      rawSlot.y      + frameInset,
        width:  rawSlot.width  - frameInset * 2,
        height: rawSlot.height - frameInset * 2,
      } : rawSlot;
      const photo = photos[i];

      if (!photo) {
        ctx.fillStyle = "rgba(180, 120, 160, 0.10)";
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
        continue;
      }

      const img = await loadImage(photo.dataUrl);

      ctx.save();
      ctx.beginPath();
      ctx.rect(slot.x, slot.y, slot.width, slot.height);
      ctx.clip();

      drawImageCover(ctx, img, slot.x, slot.y, slot.width, slot.height);
      applyFilterById(config.filter.id, ctx, slot.x + slot.width, slot.y + slot.height);

      ctx.restore();
    }

    if (config.showDate) {
      // Force visible color regardless of theme
      drawDateOverlay(ctx, canvas.width, canvas.height, "#2d1a26", S);
    }

    if (config.stickers.length > 0) {
      drawStickers(ctx, config.stickers, canvas.width, canvas.height, S);
    }

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

    if (config.showWatermark) {
      drawWatermark(ctx, canvas.width, canvas.height, S);
    }

    // 9. Template overlay — preset frames with transparent centers only
    const tplSrcOv = sessionStorage.getItem("vpb_template");
    const tplTypeOv = sessionStorage.getItem("vpb_template_type");
    if (tplSrcOv && tplTypeOv === "overlay") {
      await new Promise<void>((resolve) => {
        const tplImg = new Image();
        tplImg.onload = () => { ctx.drawImage(tplImg, 0, 0, canvas.width, canvas.height); resolve(); };
        tplImg.onerror = () => resolve();
        tplImg.src = tplSrcOv;
      });
    }
  }, []);

  const exportStrip = useCallback(async (
    format: ExportFormat,
    config: StripConfig
  ): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (format === "stories") { await exportAsStories(canvas, config); return; }
    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const quality  = format === "jpg" ? 0.92 : undefined;
    triggerDownload(canvas.toDataURL(mimeType, quality), generateStripFilename(format));
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number,
  dw: number, dh: number
): void {
  const imgAspect  = img.naturalWidth  / img.naturalHeight;
  const slotAspect = dw / dh;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgAspect > slotAspect) {
    sw = img.naturalHeight * slotAspect;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / slotAspect;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawDateOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, color: string, scale: number): void {
  ctx.save();
  ctx.font         = `${10 * scale}px "DM Sans", sans-serif`;
  ctx.fillStyle    = color;
  ctx.globalAlpha  = 0.60;
  ctx.textBaseline = "bottom";
  ctx.textAlign    = "center";
  ctx.fillText(formatStripDate(), width / 2, height - 6 * scale);
  ctx.restore();
}

function triggerDownload(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl; a.download = filename; a.click(); a.remove();
}

async function exportAsStories(canvas: HTMLCanvasElement, _config: StripConfig): Promise<void> {
  const [targetW, targetH] = [1080, 1920];
  const tmp = document.createElement("canvas");
  tmp.width = targetW; tmp.height = targetH;
  const tc = tmp.getContext("2d")!;
  const grad = tc.createLinearGradient(0, 0, targetW, targetH);
  grad.addColorStop(0, "#ffd6e7"); grad.addColorStop(0.5, "#e8d5f5"); grad.addColorStop(1, "#ffe8d6");
  tc.fillStyle = grad; tc.fillRect(0, 0, targetW, targetH);
  const scale = Math.min(targetW / canvas.width, (targetH * 0.75) / canvas.height);
  tc.drawImage(canvas, (targetW - canvas.width * scale) / 2, (targetH - canvas.height * scale) / 2, canvas.width * scale, canvas.height * scale);
  triggerDownload(tmp.toDataURL("image/png"), generateStripFilename("png").replace(".png", "-stories.png"));
}
