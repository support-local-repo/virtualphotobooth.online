// ─────────────────────────────────────────
// Format Utilities
// ─────────────────────────────────────────

/**
 * Returns today's date formatted for strip overlay
 * e.g. "April 19, 2026"
 */
export function formatStripDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(new Date());
}

/**
 * Returns a short date for file names
 * e.g. "2026-04-19"
 */
export function formatFileDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Generates a download filename for the strip
 */
export function generateStripFilename(format: "png" | "jpg" = "png"): string {
  return `virtualphotobooth-${formatFileDate()}.${format}`;
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Truncates a string with ellipsis
 */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}
