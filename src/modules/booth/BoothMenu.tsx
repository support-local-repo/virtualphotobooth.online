"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/core/transitions";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, STRIP_THEMES, BORDER_WIDTHS } from "@/core/theme";

export default function BoothMenu() {
  const router = useRouter();
  const [layoutId,    setLayoutId]    = useState("4");
  const [filterId,    setFilterId]    = useState("normal");
  const [themeId,     setThemeId]     = useState("white");
  const [borderWidth, setBorderWidth] = useState(16);
  const [mode,        setMode]        = useState("camera");

  const layout = LAYOUT_OPTIONS.find((l) => l.id === layoutId) ?? LAYOUT_OPTIONS[3];
  const filter = CAMERA_FILTERS.find((f) => f.id === filterId) ?? CAMERA_FILTERS[0];
  const theme  = STRIP_THEMES.find((t) => t.id === themeId)    ?? STRIP_THEMES[0];

  function handleStart() {
    const params = new URLSearchParams({
      layout: layoutId,
      filter: filterId,
      theme:  themeId,
      borderWidth: String(borderWidth),
    });
    router.push("/booth/" + mode + "?" + params.toString());
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-8">

        <motion.div variants={staggerItem} className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#e8399a" }}>
            ✦ Step 1 of 2 — Set your vibe
          </p>
          <h1 className="font-display text-h1 font-bold" style={{ color: "#2d1a26" }}>Choose your look</h1>
          <p className="font-body text-sm mt-2" style={{ color: "#7a5068" }}>Pick a layout, filter, and theme before shooting.</p>
        </motion.div>

        <motion.div variants={staggerItem} className="vpb-glass p-5">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Capture Mode</p>
          <div className="grid grid-cols-2 gap-3">
            {["camera", "upload"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="py-3 rounded-xl font-mono text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                style={{
                  background: mode === m ? "#e8399a" : "rgba(232,57,154,0.08)",
                  color:      mode === m ? "#fff"    : "#e8399a",
                  border:     "1px solid " + (mode === m ? "#e8399a" : "rgba(232,57,154,0.20)"),
                }}>
                {m === "camera" ? "📸 Camera" : "🖼️ Upload"}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="vpb-glass p-5">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Layout — {layout.label}</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {LAYOUT_OPTIONS.map((l) => (
              <button key={l.id} onClick={() => setLayoutId(l.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                style={{
                  background: layoutId === l.id ? "rgba(232,57,154,0.12)" : "transparent",
                  border:     "1px solid " + (layoutId === l.id ? "rgba(232,57,154,0.40)" : "transparent"),
                }}>
                <span className="text-lg">{l.icon}</span>
                <span className="font-mono text-[9px] tracking-wide" style={{ color: layoutId === l.id ? "#e8399a" : "#b08898" }}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="vpb-glass p-5">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Filter — {filter.label}</p>
          <div className="flex gap-2 flex-wrap">
            {CAMERA_FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilterId(f.id)}
                className="px-3 py-1.5 rounded-pill font-mono text-xs font-semibold tracking-wide transition-all duration-200"
                style={{
                  background: filterId === f.id ? "#e8399a"              : "rgba(232,57,154,0.08)",
                  color:      filterId === f.id ? "#fff"                  : "#7a5068",
                  border:     "1px solid " + (filterId === f.id ? "#e8399a" : "rgba(232,57,154,0.15)"),
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="vpb-glass p-5">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Strip Theme — {theme.label}</p>
          <div className="flex gap-2 flex-wrap">
            {STRIP_THEMES.map((t) => (
              <button key={t.id} onClick={() => setThemeId(t.id)}
                className="w-8 h-8 rounded-full transition-all duration-200"
                style={{
                  background:    t.border,
                  outline:       themeId === t.id ? "2px solid #e8399a" : "2px solid transparent",
                  outlineOffset: "2px",
                }}
                title={t.label} />
            ))}
          </div>
          <p className="font-mono text-xs mt-2" style={{ color: "#b08898" }}>{theme.label}</p>
        </motion.div>

        <motion.div variants={staggerItem} className="vpb-glass p-5">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Border Width</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(BORDER_WIDTHS).map(([label, val]) => (
              <button key={label} onClick={() => setBorderWidth(val)}
                className="py-2.5 rounded-xl font-mono text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                style={{
                  background: borderWidth === val ? "rgba(232,57,154,0.12)" : "transparent",
                  color:      borderWidth === val ? "#e8399a"                : "#7a5068",
                  border:     "1px solid " + (borderWidth === val ? "rgba(232,57,154,0.40)" : "rgba(220,120,180,0.20)"),
                }}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <button onClick={handleStart} className="vpb-btn-primary w-full text-base py-4 justify-center">
            {mode === "camera" ? "Open Camera →" : "Upload Photos →"}
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
