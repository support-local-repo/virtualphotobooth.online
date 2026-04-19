// ─────────────────────────────────────────
// Virtual Photo Booth — Design Tokens
// Single source of truth for all visual constants
// Mirrors tailwind.config.ts for use in canvas/JS contexts
// ─────────────────────────────────────────

export const COLORS = {
  bg:          "#fdf4f9",
  surface:     "#fff8fc",
  surface2:    "#ffeef7",
  border:      "rgba(220, 120, 180, 0.15)",
  border2:     "rgba(220, 120, 180, 0.28)",
  text:        "#2d1a26",
  text2:       "#7a5068",
  text3:       "#b08898",
  primary:     "#e8399a",
  primaryDim:  "rgba(232, 57, 154, 0.12)",
  primaryBdr:  "rgba(232, 57, 154, 0.30)",
  success:     "#3db87a",
  warn:        "#f0a020",
  error:       "#e05858",
} as const;

// Gradient stops for animated background
export const GRADIENT_STOPS = [
  "#ffd6e7", // pink
  "#e8d5f5", // lavender
  "#ffe8d6", // peach
  "#d5eaf5", // baby blue
] as const;

// Strip theme presets — applied as border + background combos
export type StripTheme = {
  id:         string;
  label:      string;
  border:     string;
  bg:         string;
  text:       string;
};

export const STRIP_THEMES: StripTheme[] = [
  { id: "white",   label: "Classic White",  border: "#ffffff",  bg: "#ffffff",  text: "#222222" },
  { id: "rose",    label: "Rosé",           border: "#ffb3d1",  bg: "#fff0f5",  text: "#8b3a5a" },
  { id: "noir",    label: "Noir",           border: "#1a1a1a",  bg: "#0d0d0d",  text: "#ffffff" },
  { id: "sage",    label: "Sage",           border: "#a8c5a0",  bg: "#f0f5ee",  text: "#2d4a2a" },
  { id: "midnight",label: "Midnight",       border: "#3a2d6e",  bg: "#1a1428",  text: "#c8b8f5" },
  { id: "cream",   label: "Vintage Cream",  border: "#d4b896",  bg: "#fdf5e6",  text: "#5c4a2a" },
  { id: "lavender",label: "Lavender",       border: "#c4a8e0",  bg: "#f5f0fb",  text: "#5a3a8a" },
  { id: "peach",   label: "Peach",          border: "#f0b898",  bg: "#fff5f0",  text: "#7a3a1a" },
];

// Border width presets (px on canvas)
export const BORDER_WIDTHS = {
  thin:   8,
  medium: 16,
  thick:  28,
} as const;

// Photo layout definitions
export type LayoutOption = {
  id:       string;
  label:    string;
  count:    number;
  cols:     number;
  rows:     number;
  icon:     string;
};

export const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: "1",          label: "Single",    count: 1, cols: 1, rows: 1, icon: "▭" },
  { id: "2",          label: "Duo",       count: 2, cols: 1, rows: 2, icon: "▭▭" },
  { id: "3",          label: "Trio",      count: 3, cols: 1, rows: 3, icon: "▭▭▭" },
  { id: "4",          label: "Classic",   count: 4, cols: 1, rows: 4, icon: "▭▭▭▭" },
  { id: "6",          label: "Grid",      count: 6, cols: 2, rows: 3, icon: "⊞" },
  { id: "wide",       label: "Wide",      count: 3, cols: 3, rows: 1, icon: "▬" },
  { id: "outofframe", label: "No Border", count: 4, cols: 1, rows: 4, icon: "⬛" },
];

// Camera filters
export type FilterOption = {
  id:     string;
  label:  string;
  css:    string; // Applied to video element via filter CSS
};

export const CAMERA_FILTERS: FilterOption[] = [
  { id: "normal",   label: "Normal",    css: "none" },
  { id: "bw",       label: "B&W",       css: "grayscale(100%)" },
  { id: "sepia",    label: "Sepia",     css: "sepia(80%)" },
  { id: "warm",     label: "Warm",      css: "saturate(130%) hue-rotate(-15deg) brightness(105%)" },
  { id: "cool",     label: "Cool",      css: "saturate(110%) hue-rotate(15deg) brightness(102%)" },
  { id: "lofi",     label: "Lo-Fi",     css: "saturate(140%) contrast(110%) brightness(90%)" },
  { id: "faded",    label: "Faded",     css: "saturate(70%) brightness(110%) contrast(90%)" },
  { id: "vignette", label: "Vignette",  css: "brightness(95%) contrast(108%)" }, // vignette added on canvas
  { id: "filmburn", label: "Film Burn", css: "sepia(40%) saturate(120%) hue-rotate(10deg) contrast(105%)" },
  { id: "hearts",   label: "♡ Hearts",  css: "saturate(120%) brightness(102%)" }, // hearts overlaid on canvas
];

// Countdown durations (ms)
export const COUNTDOWN_DURATION   = 3000;
export const BETWEEN_SHOT_DELAY   = 1500;
export const AUTO_ADVANCE_DELAY   = 1500;

// Canvas export settings
export const EXPORT_SCALE         = 2;    // 2x for retina
export const STRIP_WIDTH_PX       = 320;
export const PHOTO_HEIGHT_PX      = 240;
export const WATERMARK_TEXT       = "virtualphotobooth.online";
export const WATERMARK_FONT_SIZE  = 11;
