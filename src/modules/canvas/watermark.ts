// ─────────────────────────────────────────
// Watermark Renderer
// Draws subtle site watermark on the strip canvas
// ─────────────────────────────────────────

const WATERMARK_TEXT = "virtualphotobooth.online";
const WATERMARK_FONT_SIZE = 11;

/**
 * Draws a subtle watermark at the bottom of the canvas.
 * Only called when showWatermark is true.
 */
export function drawWatermark(
  ctx:    CanvasRenderingContext2D,
  width:  number,
  height: number,
  scale = 1
): void {
  const fontSize   = WATERMARK_FONT_SIZE * scale;
  const paddingX   = 10 * scale;
  const paddingY   = 8  * scale;

  ctx.save();

  // Pill background
  const text       = WATERMARK_TEXT;
  ctx.font         = `${fontSize}px "DM Sans", sans-serif`;
  const metrics    = ctx.measureText(text);
  const textW      = metrics.width;
  const pillW      = textW + paddingX * 2;
  const pillH      = fontSize + paddingY;
  const pillX      = width - pillW - 8 * scale;
  const pillY      = height - pillH - 8 * scale;
  const radius     = pillH / 2;

  ctx.globalAlpha  = 0.55;
  ctx.fillStyle    = "rgba(255, 255, 255, 0.70)";

  ctx.beginPath();
  ctx.moveTo(pillX + radius, pillY);
  ctx.lineTo(pillX + pillW - radius, pillY);
  ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, radius);
  ctx.lineTo(pillX + pillW, pillY + pillH - radius);
  ctx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - radius, pillY + pillH, radius);
  ctx.lineTo(pillX + radius, pillY + pillH);
  ctx.arcTo(pillX, pillY + pillH, pillX, pillY + pillH - radius, radius);
  ctx.lineTo(pillX, pillY + radius);
  ctx.arcTo(pillX, pillY, pillX + radius, pillY, radius);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.globalAlpha  = 0.80;
  ctx.fillStyle    = "#7a5068";
  ctx.textBaseline = "middle";
  ctx.fillText(text, pillX + paddingX, pillY + pillH / 2);

  ctx.restore();
}
