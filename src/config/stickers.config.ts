// ─────────────────────────────────────────
// Sticker Packs Configuration
// All emoji — no image files, zero license risk
// Rendered to canvas via CanvasRenderingContext2D
// ─────────────────────────────────────────

export type StickerPack = {
  id:    string;
  label: string;
  icon:  string; // Pack icon emoji
  items: string[];
};

export const STICKER_PACKS: StickerPack[] = [
  {
    id:    "vanity",
    label: "Vanity & Beauty",
    icon:  "💄",
    items: ["💄","💅","👄","🪞","💋","🧴","💍","👑","🎀","🌸","✨","💫","🌷","🩷","🌹","🪷","💐","🫦","💎","🧁"],
  },
  {
    id:    "cats",
    label: "Cats",
    icon:  "🐱",
    items: ["🐱","🐈","😺","😸","😹","😻","🙀","😿","😾","🐈‍⬛","🐾","🫶","🐟","🐠","🎀","✨","💕","🌙","⭐","🫧"],
  },
  {
    id:    "dogs",
    label: "Dogs",
    icon:  "🐶",
    items: ["🐶","🐕","🦴","🐾","🐩","🐕‍🦺","🦮","🐾","🎾","🏠","🌿","💛","⭐","🌟","🐶","❤️","🫶","🥎","🎀","✨"],
  },
  {
    id:    "dreamy",
    label: "Dreamy",
    icon:  "✨",
    items: ["✨","💫","🌙","⭐","🌈","🫧","🦋","🌷","🌼","💝","🪩","🫶","🌸","🌺","🍃","🌿","🌙","💜","🩵","🩷"],
  },
  {
    id:    "y2k",
    label: "Y2K & Fun",
    icon:  "🍒",
    items: ["🍓","🧁","🍒","🎠","🪄","🎀","🩷","💌","📸","🎟️","🍭","🪄","🎆","💖","🍬","🎪","🌈","🛼","📷","🎞️"],
  },
];

// Default sticker size on canvas (px)
export const DEFAULT_STICKER_SIZE = 48;
export const MIN_STICKER_SIZE     = 24;
export const MAX_STICKER_SIZE     = 120;
