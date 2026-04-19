// ─────────────────────────────────────────
// Email Module Types
// ─────────────────────────────────────────

export type SendEmailRequest = {
  email:       string;   // recipient
  stripBase64: string;   // base64 PNG data (no prefix)
};

export type SendEmailResponse = {
  success: boolean;
  error?:  string;
};

export type EmailModalState = "idle" | "open" | "sending" | "success" | "error";
