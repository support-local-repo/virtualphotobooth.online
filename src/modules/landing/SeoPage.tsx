import Link from "next/link";

export interface FAQ { q: string; a: string; }
export interface SeoPageProps {
  h1:        string;
  intro:     string;
  features:  string[];
  faqs:      FAQ[];
  slug:      string;
  canonical: string;
}

const ALL_PAGES = [
  { href: "/free-virtual-photo-booth",   label: "Free Virtual Photo Booth" },
  { href: "/browser-photo-booth",        label: "Browser Photo Booth" },
  { href: "/online-photo-strip-maker",   label: "Online Photo Strip Maker" },
  { href: "/wedding-photo-booth-online", label: "Wedding Photo Booth" },
  { href: "/birthday-photo-booth",       label: "Birthday Photo Booth" },
  { href: "/zoom-virtual-photo-booth",   label: "Zoom Virtual Photo Booth" },
  { href: "/mobile-photo-booth",         label: "Mobile Photo Booth" },
  { href: "/no-app-photo-booth",         label: "No App Photo Booth" },
];

export default function SeoPage({ h1, intro, features, faqs, slug, canonical }: SeoPageProps) {
  const mobileStyle = `
    @media (max-width: 640px) {
      .seo-main { padding: 1rem 1rem 3rem !important; }
      .seo-h1 { font-size: 1.6rem !important; }
      .seo-intro { font-size: 1rem !important; }
      .seo-cta { width: 100% !important; text-align: center !important; display: block !important; }
      .seo-iframe-wrap { height: 200px !important; }
      .seo-iframe-wrap iframe { height: 235px !important; }
      .seo-grid { grid-template-columns: 1fr !important; }
    }
  `;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Virtual Photo Booth",
    url: "https://virtualphotobooth.online",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: intro,
    featureList: features.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
      <main className="seo-main" style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1.25rem 4rem", fontFamily: "sans-serif", color: "#2d1a26" }}>

        <nav style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "#e8399a", fontWeight: 700, fontSize: 18, textDecoration: "none" }}>
            Virtual Photo Booth
          </Link>
        </nav>

        <h1 className="seo-h1" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem", color: "#2d1a26" }}>
          {h1}
        </h1>

        <p className="seo-intro" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#5a3a52", marginBottom: "2rem", maxWidth: 680 }}>
          {intro}
        </p>

        <Link href="https://virtualphotobooth.online/" style={{
          display: "inline-block", background: "#e8399a", color: "#fff",
          fontWeight: 700, fontSize: "1rem", padding: "14px 32px",
          borderRadius: 999, textDecoration: "none", marginBottom: "3rem",
        }}>
          Start Creating Free Photo Strips ✨
        </Link>

        <a href="https://virtualphotobooth.online" target="_blank" rel="noopener noreferrer"
          style={{
            display: "block", width: "100%", maxWidth: 680, marginBottom: "3rem",
            borderRadius: 20, overflow: "hidden", border: "none",
            textDecoration: "none", boxShadow: "0 12px 48px rgba(232,57,154,0.18)",
            position: "relative",
          }}>
          {/* Static replica of landing page hero */}
          <div style={{
            background: "linear-gradient(135deg, #ffd6e7 0%, #f5c6e0 30%, #e8d5f5 60%, #dce8fa 100%)",
            padding: "28px 24px 32px", minHeight: 380, position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {/* Nav */}
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#2d1a26", fontFamily: "sans-serif" }}>Virtual Photo Booth</span>
              <span style={{ background: "#e8399a", color: "#fff", fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 999, fontFamily: "sans-serif" }}>Open Booth</span>
            </div>
            {/* Badge */}
            <div style={{ border: "1.5px solid #e8399a88", borderRadius: 999, padding: "6px 20px", marginBottom: 20, display: "inline-block" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#e8399a", letterSpacing: 2 }}>✦ FREE FOREVER · NO ACCOUNT NEEDED</span>
            </div>
            {/* Floating stickers */}
            <span style={{ position: "absolute", top: 60, right: 24, fontSize: 28 }}>🌸</span>
            <span style={{ position: "absolute", top: 100, left: 16, fontSize: 22 }}>📸</span>
            <span style={{ position: "absolute", bottom: 80, right: 20, fontSize: 20 }}>✨</span>
            <span style={{ position: "absolute", bottom: 60, left: 20, fontSize: 24 }}>🎀</span>
            {/* Headline */}
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 800, color: "#2d1a26", textAlign: "center", lineHeight: 1.15, margin: "0 0 12px" }}>
              Your vibe,<br />
              <span style={{ color: "#e8399a" }}>in a strip.</span>
            </h2>
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15, color: "#7a5068", textAlign: "center", marginBottom: 24, maxWidth: 320, lineHeight: 1.6 }}>
              Make beautiful photo strips with cute stickers, dreamy filters, and instant download.
            </p>
            {/* CTA */}
            <div style={{ background: "#e8399a", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 40px", borderRadius: 999, fontFamily: "sans-serif", boxShadow: "0 8px 24px rgba(232,57,154,0.35)", marginBottom: 20 }}>
              Start the Booth ✨
            </div>
            {/* Trust badges */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#7a5068", letterSpacing: 1.5 }}>🎀 LOVED BY TEENS WORLDWIDE</span>
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#7a5068", letterSpacing: 1.5 }}>🔒 PHOTOS NEVER LEAVE YOUR DEVICE</span>
            </div>
          </div>
          {/* Click label */}
          <div style={{
            background: "#fff", padding: "10px 16px", display: "flex",
            alignItems: "center", gap: 8, borderTop: "1px solid #e8399a22",
          }}>
            <span style={{ fontSize: 13, color: "#e8399a" }}>📸</span>
            <span style={{ fontSize: 13, color: "#7a5068", fontWeight: 600, fontFamily: "sans-serif" }}>
              virtualphotobooth.online — Tap to open
            </span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#b08898" }}>↗</span>
          </div>
        </a>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Features</h2>
          <ul style={{ paddingLeft: "1.25rem", lineHeight: 2.2, color: "#5a3a52" }}>
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>How It Works</h2>
          <ol style={{ paddingLeft: "1.25rem", lineHeight: 2.4, color: "#5a3a52" }}>
            <li>Open virtualphotobooth.online on any device — no download required.</li>
            <li>Choose your photo layout: 1, 2, 3, 4 or 6 photos per strip.</li>
            <li>Select a filter — B&W, Sepia, Vintage, Lo-Fi, Film Burn and more.</li>
            <li>Add stickers, text, and custom frames to personalize your strip.</li>
            <li>Save your photo strip instantly to your device or gallery.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderLeft: "3px solid #e8399a", paddingLeft: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{f.q}</h3>
                <p style={{ color: "#5a3a52", lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Explore More</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {ALL_PAGES.filter(p => p.href !== `/${slug}`).map(p => (
              <Link key={p.href} href={p.href} style={{
                padding: "8px 16px", borderRadius: 999, fontSize: "0.85rem",
                background: "#fdf4f9", border: "1px solid #e8399a33",
                color: "#e8399a", textDecoration: "none", fontWeight: 600,
              }}>
                {p.label}
              </Link>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", padding: "2rem", background: "#fdf4f9", borderRadius: 16 }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            Ready to make your photo strip?
          </p>
          <Link href="https://virtualphotobooth.online/" style={{
            display: "inline-block", background: "#e8399a", color: "#fff",
            fontWeight: 700, fontSize: "1rem", padding: "14px 32px",
            borderRadius: 999, textDecoration: "none",
          }}>
            Open the Photo Booth Free ✨
          </Link>
        </div>

        <footer style={{ marginTop: "3rem", textAlign: "center", color: "#b08898", fontSize: "0.8rem" }}>
          <Link href="/" style={{ color: "#e8399a", textDecoration: "none" }}>Virtual Photo Booth</Link>
          {" · "}No account needed · Works on any device · 100% free
        </footer>
      </main>
    </>
  );
}
