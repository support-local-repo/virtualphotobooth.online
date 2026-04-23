"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvas } from "@/modules/canvas/useCanvas";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, STRIP_THEMES } from "@/core/theme";
import { STICKER_PACKS } from "@/config/stickers.config";
import { createSticker } from "@/modules/canvas/stickers";
import { copyCanvasToClipboard } from "@/shared/utils/clipboard";
import type { StripConfig, PlacedSticker, CapturedPhoto } from "@/modules/canvas/canvas.types";

const FONTS: [string, string][] = [
  ["Dancing Script",        "Dancing Script — feminine"],
  ["Pacifico",              "Pacifico — cute"],
  ["Lobster",               "Lobster — retro"],
  ["Satisfy",               "Satisfy — elegant"],
  ["Permanent Marker",      "Permanent Marker — bold"],
  ["Righteous",             "Righteous — urban"],
  ["Bebas Neue",            "Bebas Neue — strong"],
  ["Abril Fatface",         "Abril Fatface — dramatic"],
  ["Caveat",                "Caveat — handwritten"],
  ["Covered By Your Grace", "Covered By Grace — teen"],
  ["Rock Salt",             "Rock Salt — edgy"],
  ["Special Elite",         "Special Elite — vintage"],
];

const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Pacifico&family=Lobster&family=Satisfy&family=Permanent+Marker&family=Righteous&family=Bebas+Neue&family=Abril+Fatface&family=Caveat:wght@600&family=Covered+By+Your+Grace&family=Rock+Salt&family=Special+Elite&display=swap";

type TextItem = { id: string; text: string; font: string; color: string; x: number; y: number };

export default function BoothResult() {
  const router  = useRouter();
  const params  = useSearchParams();
  const { canvasRef, renderStrip, exportStrip, getDataUrl } = useCanvas();

  const layoutId    = params.get("layout")      ?? "4";
  const filterId    = params.get("filter")      ?? "normal";
  const themeId     = params.get("theme")       ?? "white";
  const borderWidth = Number(params.get("borderWidth") ?? "16");

  const layout = LAYOUT_OPTIONS.find((l) => l.id === layoutId) ?? LAYOUT_OPTIONS[3];
  const filter = CAMERA_FILTERS.find((f) => f.id === filterId) ?? CAMERA_FILTERS[0];
  const theme  = STRIP_THEMES.find((t)  => t.id === themeId)   ?? STRIP_THEMES[0];

  const [photos,        setPhotos]        = useState<CapturedPhoto[]>([]);
  const [stickers,      setStickers]      = useState<PlacedSticker[]>([]);
  const [showDate,      setShowDate]      = useState(true);
  const [activeTab,     setActiveTab]     = useState<"stickers" | "text" | "options">("stickers");
  const [activePack,    setActivePack]    = useState(0);
  const [emailModal,    setEmailModal]    = useState(false);
  const [email,         setEmail]         = useState("");
  const [emailState,    setEmailState]    = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [toast,         setToast]         = useState<string | null>(null);
  const [copied,        setCopied]        = useState(false);
  const [printModal,     setPrintModal]     = useState(false);
  const [textItems,      setTextItems]      = useState<TextItem[]>([]);
  const [textInput,      setTextInput]      = useState("");
  const [textFont,       setTextFont]       = useState("Dancing Script");
  const [textColor,      setTextColor]      = useState("#e8399a");
  const [ready,         setReady]         = useState(false);
  const [loopModal,     setLoopModal]     = useState(false);
  const [frameScale,    setFrameScale]    = useState(1);
  const [framePos,      setFramePos]      = useState({ x: 0, y: 0 });
  const [frameSrc,      setFrameSrc]      = useState<string | null>(null);
  const frameDragRef    = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const stripWrapperRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("vpb_photos");
      if (raw) {
        const urls: string[] = JSON.parse(raw);
        setPhotos(urls.map((dataUrl, i) => ({ id: crypto.randomUUID(), dataUrl, slotIndex: i })));
        setReady(true);
      }
    } catch { setReady(true); }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("vpb_template_type") === "background") {
      setFrameSrc(sessionStorage.getItem("vpb_template"));
    }
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = FONT_IMPORT;
    document.head.appendChild(link);
  }, []);

  function addTextItem() {
    if (!textInput.trim()) return;
    setTextItems((prev) => [...prev, { id: crypto.randomUUID(), text: textInput.trim(), font: textFont, color: textColor, x: 0.5, y: 0.5 }]);
    setTextInput("");
  }

  const config: StripConfig = {
    layout, filter, theme, borderWidth, showDate,
    showWatermark: false,
    stickers, textOverlay: null,
  };

  useEffect(() => {
    if (ready && photos.length > 0) renderStrip(photos, config);
  }, [ready, photos, stickers, showDate]);

  useEffect(() => {
    sessionStorage.setItem("vpb_text_items", JSON.stringify(textItems));
  }, [textItems]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addSticker(emoji: string) {
    setStickers((prev) => [...prev, createSticker(emoji, 0.3 + Math.random() * 0.4, 0.2 + Math.random() * 0.6)]);
  }

  function onItemPointerDown(e: React.PointerEvent, itemId: string, x: number, y: number) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { id: itemId, startX: e.clientX, startY: e.clientY, origX: x, origY: y };
  }

  function onWrapperPointerMove(e: React.PointerEvent) {
    const d = dragState.current;
    if (!d || !stripWrapperRef.current) return;
    const { width, height } = stripWrapperRef.current.getBoundingClientRect();
    const dx = (e.clientX - d.startX) / width;
    const dy = (e.clientY - d.startY) / height;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    setStickers((prev) => prev.map((s) => s.id === d.id ? { ...s, x: clamp(d.origX + dx), y: clamp(d.origY + dy) } : s));
    setTextItems((prev) => prev.map((t) => t.id === d.id ? { ...t, x: clamp(d.origX + dx), y: clamp(d.origY + dy) } : t));
  }

  function onWrapperPointerUp() { dragState.current = null; }

  async function handleDownload(format: "png" | "jpg" | "stories") {
    await exportStrip(format, config);
    showToast(format === "stories" ? "Stories version downloaded ✨" : "Strip downloaded 🎀");
  }

  async function handleCopy() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = await copyCanvasToClipboard(canvas);
    if (result.success) {
      setCopied(true); showToast("Copied to clipboard ✨");
      setTimeout(() => setCopied(false), 2000);
    } else { showToast("Copy not supported on this device"); }
  }

  function handlePrint(size: "wallet" | "strip" | "4x6" | "3r" | "4r") {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = { wallet: 160, strip: 280, "4x6": 380, "3r": 300, "4r": 380 }[size];
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      "<html><head><title>Virtual Photo Booth</title>" +
      "<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fdf4f9;}" +
      "img{max-width:" + maxW + "px;width:100%;box-shadow:0 8px 32px rgba(180,80,160,0.20);}" +
      "@media print{body{background:white;}}</style></head>" +
      "<body><img src=\"" + canvas.toDataURL("image/png") + "\" onload=\"window.print();window.close();\" /></body></html>"
    );
  }

  async function handleEmail() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("Please enter a valid email"); return; }
    setEmailState("sending");
    const base64 = getDataUrl("png")?.split(",")[1] ?? "";
    try {
      const res  = await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, stripBase64: base64 }) });
      const data = await res.json();
      if (data.success) { setEmailState("sent"); showToast("Strip sent to your email 📧"); }
      else              { setEmailState("error"); showToast("Email failed — please try again"); }
    } catch { setEmailState("error"); showToast("Email failed — please try again"); }
  }


  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-sm" style={{ color: "#b08898" }}>Loading your strip...</p>
    </div>
  );

  if (photos.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-4xl">📷</p>
      <p className="font-body text-sm" style={{ color: "#7a5068" }}>No photos found. Let's start over.</p>
      <button onClick={() => router.push("/booth")} className="vpb-btn-primary px-6 py-3">Back to Booth</button>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">

      <AnimatePresence>
        {toast && (
          <motion.div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-pill font-mono text-xs font-semibold text-white"
            style={{ background: "#e8399a", boxShadow: "0 4px 20px rgba(232,57,154,0.40)" }}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-8">
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#e8399a" }}>✦ Your strip is ready</p>
        <h1 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>Looking good ✨</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">

        <div className="flex flex-col items-center gap-4">
          {/* Canvas + draggable sticker overlay */}
          <div
            ref={stripWrapperRef}
            className="relative"
            style={{ maxWidth: 280, width: "100%" }}
            onPointerMove={onWrapperPointerMove}
            onPointerUp={onWrapperPointerUp}
            onPointerLeave={onWrapperPointerUp}
          >
            <motion.canvas ref={canvasRef}
              className="rounded-strip shadow-strip"
              style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />

            {stickers.map((sticker) => (
              <div key={sticker.id}
                onPointerDown={(e) => onItemPointerDown(e, sticker.id, sticker.x, sticker.y)}
                style={{
                  position: "absolute", left: sticker.x * 100 + "%", top: sticker.y * 100 + "%",
                  transform: "translate(-50%, -50%)", fontSize: "28px",
                  cursor: "grab", userSelect: "none", touchAction: "none",
                  lineHeight: 1, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
                  zIndex: 10, pointerEvents: "auto",
                }}>
                {sticker.emoji}
              </div>
            ))}

            {textItems.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  const el = { id: item.id, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y };
                  dragState.current = el as any;
                }}
                style={{
                  position:    "absolute",
                  left:        `${item.x * 100}%`,
                  top:         `${item.y * 100}%`,
                  transform:   "translate(-50%, -50%)",
                  fontFamily:  item.font,
                  fontSize:    "18px",
                  color:       item.color,
                  cursor:      "grab",
                  userSelect:  "none",
                  touchAction: "none",
                  whiteSpace:  "nowrap",
                  textShadow:  "0 1px 3px rgba(0,0,0,0.35)",
                  fontWeight:  600,
                }}>
                {item.text}
              </div>
            ))}


          </div>

          {/* Frame scale slider */}
          {frameSrc && (
            <div className="w-full max-w-[280px] flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: "#b08898" }}>Scale</span>
              <input type="range" min="0.5" max="2" step="0.05" value={frameScale}
                onChange={(e) => { const v = Number(e.target.value); setFrameScale(v); sessionStorage.setItem("vpb_frame_scale", String(v)); }}
                className="flex-1" />
              <button onClick={() => { setFrameScale(1); setFramePos({ x: 0, y: 0 }); sessionStorage.setItem("vpb_frame_scale", "1"); }}
                className="font-mono text-xs" style={{ color: "#b08898" }}>Reset</button>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full max-w-[280px]">
            <button onClick={() => handleDownload("png")} className="vpb-btn-primary justify-center py-3 text-sm">Download PNG</button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleDownload("jpg")}     className="vpb-btn-secondary justify-center py-2.5 text-xs">JPG</button>
              <button onClick={() => handleDownload("stories")} className="vpb-btn-secondary justify-center py-2.5 text-xs">Stories</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={handleCopy}                className="vpb-btn-secondary justify-center py-2.5 text-xs">{copied ? "✓" : "Copy"}</button>
              <button onClick={() => { setPrintModal(true); }} className="vpb-btn-secondary justify-center py-2.5 text-xs">Print</button>
              <button onClick={() => setEmailModal(true)} className="vpb-btn-secondary justify-center py-2.5 text-xs">Email</button>
            </div>
            <button onClick={() => router.push("/booth")} className="text-center font-mono text-xs py-2 transition-colors" style={{ color: "#b08898" }}>
              ← Make another
            </button>
          </div>
        </div>

        <div className="vpb-glass p-5">
          <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(232,57,154,0.06)" }}>
            {(["stickers", "text", "options"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg font-mono text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                style={{ background: activeTab === tab ? "#e8399a" : "transparent", color: activeTab === tab ? "#fff" : "#7a5068" }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "stickers" && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {STICKER_PACKS.map((pack, i) => (
                  <button key={pack.id} onClick={() => setActivePack(i)}
                    className="px-3 py-1.5 rounded-pill font-mono text-xs font-semibold transition-all duration-200"
                    style={{
                      background: activePack === i ? "rgba(232,57,154,0.12)" : "transparent",
                      border:     "1px solid " + (activePack === i ? "rgba(232,57,154,0.40)" : "rgba(220,120,180,0.20)"),
                      color:      activePack === i ? "#e8399a" : "#7a5068",
                    }}>
                    {pack.icon} {pack.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-8 gap-1 mb-4">
                {STICKER_PACKS[activePack].items.map((emoji) => (
                  <button key={emoji} onClick={() => addSticker(emoji)}
                    className="text-2xl p-1.5 rounded-lg hover:scale-125 transition-transform duration-150"
                    style={{ hover: { background: "rgba(232,57,154,0.10)" } } as React.CSSProperties}>
                    {emoji}
                  </button>
                ))}
              </div>
              {stickers.length > 0 && (
                <div className="flex gap-3 items-center">
                  <button onClick={() => setStickers((p) => p.slice(0, -1))} className="font-mono text-xs tracking-wide" style={{ color: "#b08898" }}>↩ Undo last</button>
                  <button onClick={() => setStickers([])}                     className="font-mono text-xs tracking-wide" style={{ color: "#b08898" }}>✕ Clear all</button>
                </div>
              )}
              {stickers.length > 0 && (
                <p className="font-mono text-xs mt-3" style={{ color: "#d4a8c0" }}>Drag stickers on the strip to reposition</p>
              )}
            </div>
          )}

          {activeTab === "text" && (
            <div className="flex flex-col gap-3">
              <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addTextItem(); }}
                placeholder="Type your text..." className="vpb-input" maxLength={40} />
              <div className="grid grid-cols-6 gap-1">
                {(["#e8399a", "#ffffff", "#2d1a26", "#f0c040", "#4ecdc4", "#a855f7"] as const).map((c) => (
                  <button key={c} onClick={() => setTextColor(c)}
                    className="h-7 rounded-lg border-2 transition-all"
                    style={{ background: c, borderColor: textColor === c ? "#fff" : "transparent" }} />
                ))}
              </div>
              <select value={textFont} onChange={(e) => setTextFont(e.target.value)}
                className="vpb-input text-sm" style={{ fontFamily: textFont }}>
                {FONTS.map(([val, label]) => (
                  <option key={val} value={val} style={{ fontFamily: val }}>{label}</option>
                ))}
              </select>
              <button onClick={addTextItem} className="vpb-btn-primary justify-center py-2.5 text-sm">
                Add Text to Strip
              </button>
              {textItems.length > 0 && (
                <div className="flex gap-3 items-center">
                  <button onClick={() => setTextItems((p) => p.slice(0, -1))} className="font-mono text-xs" style={{ color: "#b08898" }}>Undo last</button>
                  <button onClick={() => setTextItems([])} className="font-mono text-xs" style={{ color: "#b08898" }}>Clear all</button>
                </div>
              )}
              {textItems.length > 0 && (
                <p className="font-mono text-xs" style={{ color: "#d4a8c0" }}>Drag text on the strip to reposition</p>
              )}
            </div>
          )}

          {activeTab === "options" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: "#2d1a26" }}>Date stamp</p>
                  <p className="font-mono text-xs" style={{ color: "#b08898" }}>Show today's date on strip</p>
                </div>
                <button onClick={() => setShowDate((p) => !p)}
                  className="w-11 h-6 rounded-pill relative transition-colors duration-200"
                  style={{ background: showDate ? "#e8399a" : "rgba(220,120,180,0.25)" }}>
                  <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: showDate ? "translateX(22px)" : "translateX(2px)" }} />
                </button>
              </div>



            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {printModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(45,26,38,0.50)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setPrintModal(false); }}>
            <motion.div className="vpb-glass p-8 w-full max-w-sm rounded-card shadow-modal text-center"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: "#2d1a26" }}>Print Size</h3>
              <p className="font-body text-sm mb-6" style={{ color: "#7a5068" }}>Choose a size before printing.</p>
              <div className="flex flex-col gap-3">
                {([["wallet", "Wallet — small"], ["strip", "Strip — standard"], ["3r", "3R — 3×5 inch"], ["4r", "4R — 4×6 inch"], ["4x6", "4×6 — large"]] as ["wallet"|"strip"|"4x6"|"3r"|"4r", string][]).map(([size, label]) => (
                  <button key={size} onClick={() => { handlePrint(size); setPrintModal(false); }}
                    className="vpb-btn-secondary justify-center py-3 text-sm">{label}</button>
                ))}
              </div>
              <button onClick={() => setPrintModal(false)} className="w-full text-center font-mono text-xs py-3 mt-2" style={{ color: "#b08898" }}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loop modal */}
      <AnimatePresence>
        {loopModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(45,26,38,0.60)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="vpb-glass p-8 w-full max-w-sm rounded-card shadow-modal text-center"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
              <p className="text-4xl mb-3">📸</p>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: "#2d1a26" }}>Capture more?</h3>
              <p className="font-body text-sm mb-6" style={{ color: "#7a5068" }}>
                Use the same frame for your next photo session?
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => {
                  setLoopModal(false);
                  const params = new URLSearchParams(window.location.search);
                  router.push("/booth/camera?" + params.toString());
                }} className="vpb-btn-primary justify-center py-3 text-sm">
                  📸 Camera — same frame
                </button>
                <button onClick={() => {
                  setLoopModal(false);
                  const params = new URLSearchParams(window.location.search);
                  router.push("/booth/upload?" + params.toString());
                }} className="vpb-btn-secondary justify-center py-3 text-sm">
                  🖼️ Upload — same frame
                </button>
                <button onClick={() => {
                  sessionStorage.clear();
                  router.push("/booth");
                }} className="font-mono text-xs py-2" style={{ color: "#b08898" }}>
                  Start over — clear everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emailModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(45,26,38,0.50)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setEmailModal(false); }}>
            <motion.div className="vpb-glass p-8 w-full max-w-sm rounded-card shadow-modal"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
              <h3 className="font-display text-xl font-bold mb-1" style={{ color: "#2d1a26" }}>Send to Email</h3>
              <p className="font-body text-sm mb-5" style={{ color: "#7a5068" }}>Your strip will be attached as a full-res PNG.</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="vpb-input mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleEmail()} />
              <button onClick={handleEmail} disabled={emailState === "sending"} className="vpb-btn-primary w-full justify-center py-3 mb-3">
                {emailState === "sending" ? "Sending..." : emailState === "sent" ? "Sent ✓" : "Send Strip 📧"}
              </button>
              <button onClick={() => setEmailModal(false)} className="w-full text-center font-mono text-xs py-2" style={{ color: "#b08898" }}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
