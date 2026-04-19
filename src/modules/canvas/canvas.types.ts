// ─────────────────────────────────────────
// Canvas Module Types
// ─────────────────────────────────────────

import type { FilterOption, LayoutOption, StripTheme } from "@/core/theme";

export type CapturedPhoto = {
  id:        string;      // uuid per slot
  dataUrl:   string;      // base64 PNG from canvas
  slotIndex: number;      // 0-based position in the strip
};

export type PlacedSticker = {
  id:    string;
  emoji: string;
  x:     number;          // canvas x (0–1 normalized)
  y:     number;          // canvas y (0–1 normalized)
  size:  number;          // px
  rotation: number;       // degrees
};

export type TextOverlay = {
  text:     string;
  x:        number;       // normalized
  y:        number;       // normalized
  fontSize: number;
  color:    string;
  font:     string;
};

export type StripConfig = {
  layout:       LayoutOption;
  theme:        StripTheme;
  filter:       FilterOption;
  borderWidth:  number;           // px
  showDate:     boolean;
  showWatermark:boolean;
  stickers:     PlacedSticker[];
  textOverlay:  TextOverlay | null;
};

export type ExportFormat = "png" | "jpg" | "stories"; // stories = 9:16

export type BoothState = {
  step:        "menu" | "camera" | "upload" | "result";
  photos:      CapturedPhoto[];
  config:      StripConfig;
};
