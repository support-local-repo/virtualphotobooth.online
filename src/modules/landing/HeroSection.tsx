"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/core/transitions";

const BOKEH = [
  { size: 280, top: "-8%",  left: "-6%",  color: "#ffd6e7", delay: "0s",  dur: "8s"  },
  { size: 200, top: "10%",  right: "-5%", color: "#e8d5f5", delay: "2s",  dur: "11s" },
  { size: 160, top: "55%",  left: "5%",   color: "#ffe8d6", delay: "4s",  dur: "14s" },
  { size: 220, bottom: "0", right: "8%",  color: "#d5eaf5", delay: "1s",  dur: "10s" },
  { size: 120, top: "35%",  left: "42%",  color: "#ffd6e7", delay: "3s",  dur: "9s"  },
];

const FLOATING_EMOJIS = [
  { emoji: "📸", x: "8%",  y: "18%", delay: 0.1,  size: "2rem"   },
  { emoji: "🌸", x: "88%", y: "12%", delay: 0.2,  size: "1.6rem" },
  { emoji: "✨", x: "80%", y: "55%", delay: 0.35, size: "1.4rem" },
  { emoji: "🎀", x: "6%",  y: "72%", delay: 0.15, size: "1.8rem" },
  { emoji: "💫", x: "92%", y: "78%", delay: 0.4,  size: "1.5rem" },
  { emoji: "🩷", x: "50%", y: "8%",  delay: 0.25, size: "1.3rem" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 vpb-bg-animated" />
      <div className="absolute inset-0 vpb-grain pointer-events-none" />
      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: b.size, height: b.size,
            top: b.top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
            background: b.color, filter: "blur(70px)", opacity: 0.5,
            animation: `bokehFloat ${b.dur} ease-in-out infinite ${b.delay}`,
          }} />
      ))}
      {FLOATING_EMOJIS.map((e, i) => (
        <motion.span key={i} className="absolute pointer-events-none select-none"
          style={{ left: e.x, top: e.y, fontSize: e.size }}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: e.delay + 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {e.emoji}
        </motion.span>
      ))}
      <motion.div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
        variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={staggerItem}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-xs font-mono font-semibold tracking-widest uppercase mb-6"
            style={{ background: "rgba(232, 57, 154, 0.10)", border: "1px solid rgba(232, 57, 154, 0.25)", color: "#e8399a" }}>
            ✦ Free Forever · No Account Needed
          </span>
        </motion.div>
        <motion.h1 variants={staggerItem}
          className="font-display text-hero font-bold leading-[1.05] tracking-tight mb-4"
          style={{ color: "#2d1a26" }}>
          Your vibe,<br />
          <em className="not-italic vpb-text-gradient">in a strip.</em>
        </motion.h1>
        <motion.p variants={staggerItem}
          className="font-accent italic text-xl md:text-2xl mb-8 leading-relaxed"
          style={{ color: "#7a5068" }}>
          Make beautiful photo strips with cute stickers,<br className="hidden sm:block" /> dreamy filters, and instant download.
        </motion.p>
        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/booth" className="vpb-btn-primary text-base px-8 py-4 shadow-donation">
            Start the Booth ✨
          </Link>
          <a href="#features" className="vpb-btn-secondary text-sm">See how it works</a>
        </motion.div>
        <motion.p variants={staggerItem} className="mt-8 text-xs font-mono tracking-wide uppercase"
          style={{ color: "#b08898" }}>
          📸 &nbsp;Loved by teens worldwide &nbsp;·&nbsp; 🔒 Photos never leave your device
        </motion.p>
      </motion.div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "#b08898" }}>scroll</span>
        <motion.div className="w-px h-8 rounded-full" style={{ background: "rgba(180, 100, 160, 0.3)" }}
          animate={{ scaleY: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </section>
  );
}
