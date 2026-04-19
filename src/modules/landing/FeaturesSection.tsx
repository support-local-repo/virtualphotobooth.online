"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/core/transitions";
import { FEATURE_CARDS } from "./landing.types";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "rgba(255, 238, 247, 0.50)" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#e8399a" }}>
            ✦ Everything you need
          </p>
          <h2 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>
            Built for your aesthetic
          </h2>
          <p className="font-body text-base mt-3 max-w-md mx-auto" style={{ color: "#7a5068" }}>
            Every feature designed for teens who want their photos to look as good as their feed.
          </p>
        </motion.div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer} initial="initial"
          whileInView="animate" viewport={{ once: true, margin: "-60px" }}>
          {FEATURE_CARDS.map((card, i) => (
            <motion.div key={i} variants={staggerItem}
              className="vpb-glass p-6 group cursor-default transition-all duration-300"
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(220, 100, 180, 0.18)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(232, 57, 154, 0.10)" }}>
                {card.icon}
              </div>
              <h3 className="font-display text-h3 font-bold mb-2" style={{ color: "#2d1a26" }}>
                {card.title}
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: "#7a5068" }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
