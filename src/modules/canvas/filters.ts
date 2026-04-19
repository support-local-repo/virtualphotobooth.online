// ─────────────────────────────────────────
// Canvas Filters
// Applied post-capture via ImageData manipulation
// These run on the composited canvas, not the live video
// ─────────────────────────────────────────

/**
 * Applies a grayscale filter to canvas ImageData
 */
export function applyGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
}

/**
 * Applies a sepia filter
 */
export function applySepia(data: Uint8ClampedArray, intensity = 0.8): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const sr = Math.min(255, r * (1 - 0.607 * intensity) + g * (0.769 * intensity) + b * (0.189 * intensity));
    const sg = Math.min(255, r * (0.349 * intensity) + g * (1 - 0.314 * intensity) + b * (0.168 * intensity));
    const sb = Math.min(255, r * (0.272 * intensity) + g * (0.534 * intensity) + b * (1 - 0.869 * intensity));
    data[i] = sr; data[i + 1] = sg; data[i + 2] = sb;
  }
}

/**
 * Lo-Fi: saturate + contrast + slight darkening
 */
export function applyLoFi(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    // Boost contrast
    data[i]     = Math.min(255, ((data[i]     - 128) * 1.15) + 128);
    data[i + 1] = Math.min(255, ((data[i + 1] - 128) * 1.15) + 128);
    data[i + 2] = Math.min(255, ((data[i + 2] - 128) * 1.15) + 128);
    // Slight darken
    data[i]     = Math.max(0, data[i]     * 0.92);
    data[i + 1] = Math.max(0, data[i + 1] * 0.92);
    data[i + 2] = Math.max(0, data[i + 2] * 0.92);
  }
}

/**
 * Faded: desaturate + brighten + lower contrast
 */
export function applyFaded(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const avg = 0.299 * r + 0.587 * g + 0.114 * b;
    // Blend toward gray (70% original, 30% gray)
    data[i]     = r * 0.7 + avg * 0.3 + 18;
    data[i + 1] = g * 0.7 + avg * 0.3 + 18;
    data[i + 2] = b * 0.7 + avg * 0.3 + 18;
  }
}

/**
 * Film Burn: sepia + warm red cast + slight contrast
 */
export function applyFilmBurn(data: Uint8ClampedArray): void {
  applySepia(data, 0.4);
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i]     * 1.12 + 8);  // red up
    data[i + 2] = Math.max(0,   data[i + 2] * 0.88);      // blue down
  }
}

/**
 * Vignette: darkens edges toward center using radial gradient
 * Applied directly to the canvas context (not ImageData)
 */
export function applyVignette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.75);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

/**
 * Hearts overlay — draws floating hearts on the canvas
 * Signature feature matching photobooth-io.cc's viral "MacBook hearts"
 */
export function applyHeartsOverlay(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hearts = ["🩷", "💗", "💕", "❤️", "💖", "🩷"];
  const count = 12;
  ctx.font = "28px serif";
  ctx.globalAlpha = 0.75;

  // Seeded positions for consistency (same result every render)
  for (let i = 0; i < count; i++) {
    const x = ((i * 137.508) % 1) * w;       // golden ratio scatter
    const y = ((i * 97.333)  % 1) * h;
    const emoji = hearts[i % hearts.length];
    ctx.fillText(emoji, x, y);
  }

  ctx.globalAlpha = 1;
}

/**
 * Warm: red/yellow push
 */
export function applyWarm(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i]     * 1.08 + 6); // red
    data[i + 1] = Math.min(255, data[i + 1] * 1.03);     // green slight
    data[i + 2] = Math.max(0,   data[i + 2] * 0.90);     // blue down
  }
}

/**
 * Cool: blue push
 */
export function applyCool(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.max(0,   data[i]     * 0.93);     // red down
    data[i + 2] = Math.min(255, data[i + 2] * 1.10 + 8); // blue up
  }
}

/**
 * Master filter dispatcher — applies filter by ID to canvas ImageData
 */
export function applyFilterById(
  filterId:  string,
  ctx:       CanvasRenderingContext2D,
  w:         number,
  h:         number
): void {
  if (filterId === "normal") return;
  if (filterId === "vignette") { applyVignette(ctx, w, h); return; }
  if (filterId === "hearts")   { applyHeartsOverlay(ctx, w, h); return; }

  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  switch (filterId) {
    case "bw":       applyGrayscale(d); break;
    case "sepia":    applySepia(d);     break;
    case "warm":     applyWarm(d);      break;
    case "cool":     applyCool(d);      break;
    case "lofi":     applyLoFi(d);      break;
    case "faded":    applyFaded(d);     break;
    case "filmburn": applyFilmBurn(d);  break;
  }

  ctx.putImageData(imageData, 0, 0);
}
