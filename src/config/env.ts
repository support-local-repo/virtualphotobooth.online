// ─────────────────────────────────────────
// Environment Configuration
// Single source of truth for all env vars
// ─────────────────────────────────────────

export const env = {
  // Server-side only (never exposed to browser)
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom:    process.env.EMAIL_FROM ?? "noreply@virtualphotobooth.online",

  // Public (safe to expose to browser)
  paypalUrl:          process.env.NEXT_PUBLIC_PAYPAL_DONATION_URL ?? "https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U",
  watermarkPrice:     process.env.NEXT_PUBLIC_WATERMARK_UNLOCK_PRICE ?? "1.99",
  appUrl:             process.env.NEXT_PUBLIC_APP_URL ?? "https://virtualphotobooth.online",
} as const;

// Validate required server env vars at build time
if (typeof window === "undefined") {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY is not set — email sending will fail");
  }
}
