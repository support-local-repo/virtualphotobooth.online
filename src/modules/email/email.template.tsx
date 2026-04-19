// ─────────────────────────────────────────
// Email Template
// Rendered server-side, sent via Resend
// Returns an HTML string
// ─────────────────────────────────────────

import { env } from "@/config/env";

export function buildStripEmailHtml(): string {
  const appUrl = env.appUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Photo Strip 📸</title>
</head>
<body style="margin:0;padding:0;background:#fdf4f9;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf4f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#fff8fc;border-radius:20px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(220,100,180,0.12);">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#ffd6e7,#e8d5f5,#ffe8d6);
                       padding:32px 24px 24px;">
              <p style="margin:0;font-size:28px;">📸</p>
              <h1 style="margin:8px 0 4px;font-size:22px;font-weight:700;
                         color:#2d1a26;letter-spacing:-0.5px;">
                Your Photo Strip is Here!
              </h1>
              <p style="margin:0;font-size:14px;color:#7a5068;">
                Find your strip attached to this email
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#2d1a26;line-height:1.6;">
                Hey! Your Virtual Photo Booth strip is attached to this email as a PNG file.
                Save it to your camera roll, share it, or print it — it's yours.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#2d1a26;line-height:1.6;">
                Want to make another one?
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center"
                      style="background:#e8399a;border-radius:999px;padding:14px 32px;">
                    <a href="${appUrl}/booth"
                       style="color:#ffffff;font-size:14px;font-weight:700;
                              text-decoration:none;letter-spacing:0.3px;">
                      Make Another Strip ✨
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid rgba(220,120,180,0.15);margin:0 0 20px;" />

              <p style="margin:0;font-size:12px;color:#b08898;text-align:center;line-height:1.6;">
                Made with love at
                <a href="${appUrl}"
                   style="color:#e8399a;text-decoration:none;font-weight:600;">
                  Virtual Photo Booth
                </a>
                &nbsp;·&nbsp; Free, always.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
