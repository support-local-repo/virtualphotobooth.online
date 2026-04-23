// ─────────────────────────────────────────
// Strip Layout Engine
// Computes canvas dimensions and photo slot rects
// for all layout types
// ─────────────────────────────────────────

import {
  STRIP_WIDTH_PX,
  PHOTO_HEIGHT_PX,
  EXPORT_SCALE,
} from "@/core/theme";

import type { LayoutOption, StripTheme } from "@/core/theme";

export type SlotRect = {
  x:      number;
  y:      number;
  width:  number;
  height: number;
};

export type StripDimensions = {
  canvasWidth:  number;
  canvasHeight: number;
  slots:        SlotRect[];
  borderWidth:  number;
};

/**
 * Computes the canvas dimensions and individual photo slot rects
 * for a given layout + border width.
 * All values are in logical px (multiply by EXPORT_SCALE for retina).
 */
export function computeStripLayout(
  layout:      LayoutOption,
  borderWidth: number
): StripDimensions {
  const bw = borderWidth; // alias

  if (layout.id === "wide" || layout.id === "wide2") {
    // Horizontal strip — photos side by side, canvas is WIDE not tall
    const count   = layout.count; // 2 or 3
    const totalW  = STRIP_WIDTH_PX * (count === 2 ? 1.6 : 2.2);
    const photoW  = Math.floor((totalW - bw * (count + 1)) / count);
    const photoH  = Math.floor(photoW * 0.75); // 4:3
    const totalH  = photoH + bw * 2;

    return {
      canvasWidth:  Math.floor(totalW),
      canvasHeight: totalH,
      borderWidth:  bw,
      slots: Array.from({ length: count }, (_, i) => ({
        x:      bw + i * (photoW + bw),
        y:      bw,
        width:  photoW,
        height: photoH,
      })),
    };
  }

  if (layout.id === "6") {
    // 2×3 grid
    const cols    = 2;
    const rows    = 3;
    const photoW  = Math.floor((STRIP_WIDTH_PX - bw * (cols + 1)) / cols);
    const photoH  = Math.floor(photoW * 0.75);
    const totalW  = STRIP_WIDTH_PX;
    const totalH  = photoH * rows + bw * (rows + 1);

    const slots: SlotRect[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        slots.push({
          x:      bw + c * (photoW + bw),
          y:      bw + r * (photoH + bw),
          width:  photoW,
          height: photoH,
        });
      }
    }

    return { canvasWidth: totalW, canvasHeight: totalH, borderWidth: bw, slots };
  }

  if (layout.id === "outofframe") {
    // No border — photos bleed edge to edge, only thin gap between
    const gap     = 3;
    const photoW  = STRIP_WIDTH_PX;
    const photoH  = PHOTO_HEIGHT_PX;
    const count   = layout.count;
    const totalH  = photoH * count + gap * (count - 1);

    return {
      canvasWidth:  photoW,
      canvasHeight: totalH,
      borderWidth:  0,
      slots: Array.from({ length: count }, (_, i) => ({
        x:      0,
        y:      i * (photoH + gap),
        width:  photoW,
        height: photoH,
      })),
    };
  }

  // Default: vertical strip (1 / 2 / 3 / 4 photos)
  const photoW = STRIP_WIDTH_PX - bw * 2;
  const photoH = Math.floor(photoW * 0.75); // 4:3
  const count  = layout.count;
  const totalH = photoH * count + bw * (count + 1);

  return {
    canvasWidth:  STRIP_WIDTH_PX,
    canvasHeight: totalH,
    borderWidth:  bw,
    slots: Array.from({ length: count }, (_, i) => ({
      x:      bw,
      y:      bw + i * (photoH + bw),
      width:  photoW,
      height: photoH,
    })),
  };
}

/**
 * Scales a SlotRect up by EXPORT_SCALE for retina output
 */
export function scaleRect(rect: SlotRect, scale = EXPORT_SCALE): SlotRect {
  return {
    x:      rect.x * scale,
    y:      rect.y * scale,
    width:  rect.width  * scale,
    height: rect.height * scale,
  };
}
