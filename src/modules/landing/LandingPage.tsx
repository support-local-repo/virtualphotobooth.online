"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";

const PAYPAL_URL = "https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U";

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] font-body bg-black">

      {/* Nav — minimal, floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 safe-top"
        style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(12px)" }}>
        <span className="font-display font-bold text-base tracking-tight text-white">
          Virtual Photo Booth
        </span>
        <Link href="/booth"
          className="font-mono text-xs font-semibold px-4 py-2 rounded-pill"
          style={{ background: "rgba(232,57,154,0.90)", color: "#fff", minHeight: "auto" }}>
          Open Booth
        </Link>
      </nav>

      {/* Hero — full screen camera */}
      <HeroSection />

      {/* Features — dark minimal */}
      <section className="bg-black py-20 px-5">
        <div className="max-w-lg mx-auto">
          <motion.p className="font-mono text-xs tracking-widest uppercase text-center mb-12"
            style={{ color: "#e8399a" }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            ✦ Everything included. Always free.
          </motion.p>

          <div className="flex flex-col gap-5">
            {[
              ["📸", "Instant strips", "1, 2, 3, 4 or 6-photo layouts. Shot in seconds."],
              ["✨", "9 filters", "B&W, Sepia, Lo-Fi, Film Burn, Vintage and more."],
              ["🎀", "Cute stickers", "Cats, dogs, vanity, Y2K — all draggable."],
              ["🖼️", "Custom frames", "Upload your own frame or pick from our templates."],
              ["🔒", "100% private", "Photos never leave your device. No account needed."],
              ["📧", "Email & print", "Send to email or print in wallet, strip or 4×6 size."],
            ].map(([icon, title, desc], i) => (
              <motion.div key={i}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}>
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-display font-bold text-white text-sm mb-0.5">{title}</p>
                  <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy notice */}
      <section className="bg-black py-10 px-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-2xl mb-3">🔒</p>
          <p className="font-body text-sm font-semibold text-white mb-1">No pictures saved on our server</p>
          <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            All photos are processed entirely on your device. Nothing is uploaded, stored, or shared without your consent. Your privacy is guaranteed.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 px-5">
        <motion.div className="max-w-sm mx-auto text-center"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Ready?</h2>
          <p className="font-accent italic text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Free. No sign-up. Just vibes.
          </p>
          <Link href="/booth" className="vpb-btn-primary text-base px-10 py-4 w-full justify-center">
            Start the Booth ✨
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 px-5 text-center border-t safe-bottom"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Made with 🩷 &nbsp;·&nbsp;
          <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-white transition-colors">
            Support this project
          </a>
          &nbsp;·&nbsp; virtualphotobooth.online
        </p>
      </footer>
    </main>
  );
}
