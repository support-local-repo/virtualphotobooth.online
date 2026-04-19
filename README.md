# Virtual Photo Booth

**Free online photo booth — beautiful strips, cute stickers, instant download.**
Live at: [virtualphotobooth.online](https://virtualphotobooth.online)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS animations
- **Animations:** Framer Motion
- **Photo compositing:** Canvas API
- **Camera:** `getUserMedia`
- **Email:** Resend (transactional)
- **Hosting:** Vercel

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/virtualphotobooth.git
cd virtualphotobooth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `EMAIL_FROM` | Must match your verified Resend domain |
| `NEXT_PUBLIC_PAYPAL_DONATION_URL` | Already set — your PayPal link |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Camera requires HTTPS in production. Localhost works fine for dev.

---

## Resend Setup (Email)

1. Sign up at [resend.com](https://resend.com) — free tier: 100 emails/day
2. Add `virtualphotobooth.online` as a verified sending domain
3. Add DNS records Resend provides (TXT + MX)
4. Create an API key → paste into `RESEND_API_KEY`

---

## Vercel Deployment

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial commit — Virtual Photo Booth"
git push origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy**

### Step 3 — Add Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
RESEND_API_KEY          = re_your_key_here
EMAIL_FROM              = noreply@virtualphotobooth.online
NEXT_PUBLIC_PAYPAL_DONATION_URL = https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U
NEXT_PUBLIC_WATERMARK_UNLOCK_PRICE = 1.99
NEXT_PUBLIC_APP_URL     = https://virtualphotobooth.online
```

### Step 4 — Connect Your Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add `virtualphotobooth.online`
3. At your domain registrar, point DNS to Vercel:
   - **A record:** `76.76.21.21`
   - **CNAME:** `www` → `cname.vercel-dns.com`
4. Wait ~10 minutes for propagation

---

## Project Structure

```
src/
  app/                    Next.js App Router pages + API routes
  modules/                Business domains (landing, booth, canvas, email, donation, print)
  shared/                 Hooks + utils used by 3+ modules
  core/                   Theme tokens + animation config
  infrastructure/         Resend email adapter
  config/                 Env vars + sticker/layout config
```

---

## Audience

Primary: **Teens (13–19)** — TikTok-native, aesthetic-obsessed, selfie-first.
Every design decision is made through this lens.

---

## License

Private project — all rights reserved.
