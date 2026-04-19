// ─────────────────────────────────────────
// Resend Client — Email Infrastructure
// Isolated adapter — swap provider here without touching business logic
// Server-side only — never import in client components
// ─────────────────────────────────────────

import { Resend } from "resend";
import { env } from "@/config/env";

// Singleton instance
let _resend: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resend) {
    if (!env.resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    _resend = new Resend(env.resendApiKey);
  }
  return _resend;
}

export type SendEmailPayload = {
  to:          string;
  subject:     string;
  htmlBody:    string;
  stripBase64: string; // Base64 PNG of the photo strip
  fileName?:   string;
};

export async function sendStripEmail(payload: SendEmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from:    env.emailFrom,
      to:      [payload.to],
      subject: payload.subject,
      html:    payload.htmlBody,
      attachments: [
        {
          filename: payload.fileName ?? "my-photo-strip.png",
          content:  payload.stripBase64,
        },
      ],
    });

    if (error) {
      console.error("[Resend] Send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Resend] Unexpected error:", message);
    return { success: false, error: message };
  }
}
