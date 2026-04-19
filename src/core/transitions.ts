// ─────────────────────────────────────────
// Page Transition Variants — Framer Motion
// Consistent slide transitions across all booth pages
// ─────────────────────────────────────────

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // expo out — snappy, teen-friendly
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.97,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

// Stagger children (feature cards, sticker grid etc.)
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

// Modal
export const modalVariants = {
  initial: { opacity: 0, scale: 0.92, y: 16 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Backdrop
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};
