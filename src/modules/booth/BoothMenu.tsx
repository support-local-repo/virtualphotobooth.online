"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/core/transitions";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, STRIP_THEMES, BORDER_WIDTHS } from "@/core/theme";
import { PHOTO_TEMPLATES } from "@/config/templates.config";

export default function BoothMenu() {
  const router = useRouter();
  const [layoutId,    setLayoutId]    = useState("4");
  const [filterId,    setFilterId]    = useState("normal");
  const [themeId,     setThemeId]     = useState("white");
  const [borderWidth, setBorderWidth] = useState(16);
  const [mode,        setMode]        = useState("camera");
  const [templateId,  setTemplateId]  = useState("none");
  const [customTpl,   setCustomTpl]   = useState<string | null>(null);

  // Restore frame selection if returning from loop
  useEffect(() => {
    const loopFrame = sessionStorage.getItem("vpb_loop_frame");
    if (loopFrame) setTemplateId(loopFrame);
  }, []);

  const layout = LAYOUT_OPTIONS.find((l) => l.id === layoutId) ?? LAYOUT_OPTIONS[3];
  const filter = CAMERA_FILTERS.find((f) => f.id === filterId) ?? CAMERA_FILTERS[0];
  const theme  = STRIP_THEMES.find((t) => t.id === themeId)    ?? STRIP_THEMES[0];

  async function handleStart() {
    const params = new URLSearchParams({
      layout: layoutId,
      filter: filterId,
      theme:  themeId,
      borderWidth: String(borderWidth),
    });
    const tpl = PHOTO_TEMPLATES.find(t => t.id === templateId);
    // Persist frame for loop mode
    if (templateId !== "none") sessionStorage.setItem("vpb_loop_frame", templateId);
    else sessionStorage.removeItem("vpb_loop_frame");

    if (templateId === "custom" && customTpl) {
      sessionStorage.setItem("vpb_template", customTpl);
      sessionStorage.setItem("vpb_template_type", "background");
    } else if (tpl?.url) {
      try {
        const res = await fetch(tpl.url);
        const blob = await res.blob();
        const b64 = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(blob);
        });
        sessionStorage.setItem("vpb_template", b64);
        sessionStorage.setItem("vpb_template_type", "overlay");
      } catch { sessionStorage.removeItem("vpb_template"); }
    } else {
      sessionStorage.removeItem("vpb_template");
    }
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
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b08898" }}>Photo Template</p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PHOTO_TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplateId(t.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                style={{
                  background: templateId === t.id ? "rgba(232,57,154,0.12)" : "transparent",
                  border: "1px solid " + (templateId === t.id ? "rgba(232,57,154,0.40)" : "rgba(220,120,180,0.15)"),
                }}>
                <span className="text-xl">{t.icon}</span>
                <span className="font-mono text-[9px] tracking-wide text-center" style={{ color: templateId === t.id ? "#e8399a" : "#b08898" }}>{t.label}</span>
              </button>
            ))}
          </div>
          {templateId === "custom" && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="vpb-btn-secondary justify-center py-2.5 text-xs cursor-pointer flex items-center gap-2">
                ⬆️ Upload your frame PNG
                <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setCustomTpl(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }} />
              </label>
              {customTpl && (
                <div className="relative mt-2">
                  <img src={customTpl} alt="custom template preview" className="rounded-xl w-full object-cover" style={{ maxHeight: 200 }} />
                  <p className="font-mono text-xs mt-1" style={{ color: "#b08898" }}>This image will appear as the background behind your photos</p>
                </div>
              )}
            </div>
          )}
          {templateId !== "none" && templateId !== "custom" && (
            <div className="mt-2">
              <img
                src={PHOTO_TEMPLATES.find(t => t.id === templateId)?.url ?? ""}
                alt="template preview"
                className="rounded-xl w-full object-cover"
                style={{ maxHeight: 200 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
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
