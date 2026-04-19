// ─────────────────────────────────────────
// POST /api/send-email
// Receives strip base64 + recipient email
// Sends via Resend with PNG attachment
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { sendStripEmail } from "@/infrastructure/resend/resend.client";
import { buildStripEmailHtml } from "@/modules/email/email.template";
import { isValidEmail, generateStripFilename } from "@/shared/utils/format";
import type { SendEmailRequest, SendEmailResponse } from "@/modules/email/email.types";

export async function POST(req: NextRequest): Promise<NextResponse<SendEmailResponse>> {
  try {
    const body = (await req.json()) as Partial<SendEmailRequest>;

    // Validate
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!body.stripBase64 || body.stripBase64.length < 100) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid strip image" },
        { status: 400 }
      );
    }

    const result = await sendStripEmail({
      to:          body.email.trim().toLowerCase(),
      subject:     "Your Virtual Photo Booth Strip 📸",
      htmlBody:    buildStripEmailHtml(),
      stripBase64: body.stripBase64,
      fileName:    generateStripFilename("png"),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Email failed to send" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[send-email] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
