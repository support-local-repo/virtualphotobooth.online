// ─────────────────────────────────────────
// Booth Module Types
// ─────────────────────────────────────────

export type BoothStep = "menu" | "camera" | "upload" | "result";

export type CaptureMode = "camera" | "upload";

export type CountdownState = {
  isActive:   boolean;
  remaining:  number;   // seconds
  shotIndex:  number;   // which photo is next (0-based)
};
