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
            borderRadius: 16, overflow: "hidden", border: "2px solid #e8399a22",
            textDecoration: "none", boxShadow: "0 8px 32px rgba(232,57,154,0.12)",
          }}>
          <iframe
            src="https://virtualphotobooth.online"
            title="Virtual Photo Booth — Live Preview"
            scrolling="no"
            style={{
              width: "100%", height: 360, border: "none",
              pointerEvents: "none", display: "block",
              transform: "scale(0.85)", transformOrigin: "top left",
              width: "117%", height: 424,
            }}
          />
          <div style={{
            background: "#fdf4f9", padding: "10px 16px", display: "flex",
            alignItems: "center", gap: 8, borderTop: "1px solid #e8399a22",
          }}>
            <span style={{ fontSize: 14, color: "#e8399a" }}>📸</span>
            <span style={{ fontSize: 13, color: "#7a5068", fontWeight: 600 }}>
              virtualphotobooth.online — Click to open
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
