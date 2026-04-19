// ─────────────────────────────────────────
// Landing Module Types
// ─────────────────────────────────────────

export type FeatureCard = {
  icon:        string;
  title:       string;
  description: string;
};

export const FEATURE_CARDS: FeatureCard[] = [
  {
    icon:        "📸",
    title:       "Instant Strips",
    description: "Choose 1, 2, 3, 4, or 6-photo layouts. Shot in seconds, ready to share.",
  },
  {
    icon:        "✨",
    title:       "Filters & Effects",
    description: "9 filters including Lo-Fi, Film Burn, Faded, and the viral Hearts overlay.",
  },
  {
    icon:        "🎀",
    title:       "Cute Stickers",
    description: "Cats, dogs, vanity, Y2K, and dreamy sticker packs — all drag and drop.",
  },
  {
    icon:        "🔒",
    title:       "Totally Private",
    description: "Photos never leave your device. No upload, no storage, no account needed.",
  },
  {
    icon:        "📧",
    title:       "Send to Email",
    description: "Email your strip to yourself or a friend instantly — attached as full-res PNG.",
  },
  {
    icon:        "🖨️",
    title:       "Print Ready",
    description: "One-tap print — formatted perfectly for A4 portrait.",
  },
];
