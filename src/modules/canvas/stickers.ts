// ─────────────────────────────────────────
// Sticker Renderer
// Draws emoji stickers onto the strip canvas
// ─────────────────────────────────────────

import type { PlacedSticker } from "./canvas.types";

/**
 * Renders all placed stickers onto the canvas.
 * x/y are normalized (0–1) relative to canvas dimensions.
 */
export function drawStickers(
  ctx:      CanvasRenderingContext2D,
  stickers: PlacedSticker[],
  width:    number,
  height:   number,
  scale = 1
): void {
  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign    = "center";

  for (const sticker of stickers) {
    const px   = sticker.x * width;
    const py   = sticker.y * height;
    const size = sticker.size * scale;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${size}px serif`;
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Hit-tests a point against placed stickers.
 * Returns the sticker id if hit, null otherwise.
 * Used for drag interaction in the result UI.
 */
export function hitTestSticker(
  stickers:   PlacedSticker[],
  nx:         number, // normalized x
  ny:         number, // normalized y
  canvasW:    number,
  canvasH:    number
): string | null {
  // Iterate in reverse so top-most sticker wins
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s  = stickers[i];
    const px = s.x * canvasW;
    const py = s.y * canvasH;
    const px2 = nx * canvasW;
    const py2 = ny * canvasH;
    const dist = Math.sqrt((px2 - px) ** 2 + (py2 - py) ** 2);
    if (dist < s.size / 2) return s.id;
  }
  return null;
}

/**
 * Creates a new PlacedSticker with a random slight rotation
 */
export function createSticker(
  emoji: string,
  nx = 0.5,
  ny = 0.5,
  size = 48
): PlacedSticker {
  return {
    id:       crypto.randomUUID(),
    emoji,
    x:        nx,
    y:        ny,
    size,
    rotation: (Math.random() - 0.5) * 20, // -10 to +10 deg
  };
}
