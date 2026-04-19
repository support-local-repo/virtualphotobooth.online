"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";

const PAYPAL_URL = "https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U";

const STRIP_PREVIEW = [
  { emoji: "🌸", filter: "sepia(60%)",     label: "Sepia"  },
  { emoji: "🩷", filter: "none",            label: "Normal" },
  { emoji: "✨", filter: "grayscale(100%)", label: "B&W"    },
  { emoji: "🎀", filter: "saturate(140%)",  label: "Lo-Fi"  },
];

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] font-body">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(253, 244, 249, 0.80)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(220, 120, 180, 0.12)" }}>
        <span className="font-display font-bold text-lg tracking-tight" style={{ color: "#2d1a26" }}>
          Virtual Photo Booth
        </span>
        <div className="flex items-center gap-3">
          <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-pill transition-all duration-200"
            style={{ background: "rgba(232, 57, 154, 0.08)", border: "1px solid rgba(232, 57, 154, 0.20)", color: "#e8399a" }}>
            🩷 Support
          </a>
          <Link href="/booth" className="vpb-btn-primary text-sm px-5 py-2.5">
            Open Booth
          </Link>
        </div>
      </nav>
      <HeroSection />
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#e8399a" }}>
              ✦ Filters & Layouts
            </p>
            <h2 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>
              9 filters. Endless looks.
            </h2>
          </motion.div>
          <div className="flex items-end justify-center gap-4 flex-wrap">
            {STRIP_PREVIEW.map((s, i) => (
              <motion.div key={i} className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, rotate: 0, scale: 1.04 }}>
                <div className="rounded-strip overflow-hidden"
                  style={{ width: 90, background: "#fff", padding: "6px 6px 14px", boxShadow: "0 8px 32px rgba(180,80,160,0.18)" }}>
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="w-full rounded-sm mb-1.5 last:mb-0 flex items-center justify-center text-2xl"
                      style={{ height: 60, background: `hsl(${320 + i * 15 + j * 8}, ${40 + j * 10}%, ${85 + j * 3}%)`, filter: s.filter }}>
                      {j === 1 ? s.emoji : ""}
                    </div>
                  ))}
                  <p className="text-center font-mono text-[8px] tracking-widest uppercase mt-2" style={{ color: "#b08898" }}>
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FeaturesSection />
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 vpb-bg-animated opacity-60" />
        <motion.div className="relative z-10 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="vpb-glass p-10 md:p-14">
            <p className="text-4xl mb-4">📸</p>
            <h2 className="font-display text-h2 font-bold mb-3" style={{ color: "#2d1a26" }}>
              Ready for your close-up?
            </h2>
            <p className="font-accent italic text-lg mb-8" style={{ color: "#7a5068" }}>
              Free. Instant. No sign-up. Just vibes.
            </p>
            <Link href="/booth" className="vpb-btn-primary text-base px-10 py-4">
              Start the Booth ✨
            </Link>
            <p className="mt-6 text-xs font-mono tracking-wide" style={{ color: "#b08898" }}>
              🔒 Your photos never leave your device
            </p>
          </div>
        </motion.div>
      </section>
      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: "rgba(220, 120, 180, 0.12)" }}>
        <p className="font-mono text-xs tracking-wide" style={{ color: "#b08898" }}>
          Made with 🩷 &nbsp;·&nbsp;
          <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-vpb-primary transition-colors">
            Support this project
          </a>
          &nbsp;·&nbsp; virtualphotobooth.online
        </p>
      </footer>
    </main>
  );
}
