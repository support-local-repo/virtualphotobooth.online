"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvas } from "@/modules/canvas/useCanvas";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, STRIP_THEMES } from "@/core/theme";
import { STICKER_PACKS } from "@/config/stickers.config";
import { createSticker } from "@/modules/canvas/stickers";
import { copyCanvasToClipboard } from "@/shared/utils/clipboard";
import { useSessionFlag, SESSION_FLAGS } from "@/shared/hooks/useSessionFlag";
import type { StripConfig, PlacedSticker, CapturedPhoto } from "@/modules/canvas/canvas.types";

const PAYPAL_URL = "https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U";

export default function BoothResult() {
  const router  = useRouter();
  const params  = useSearchParams();
  const { canvasRef, renderStrip, exportStrip, getDataUrl } = useCanvas();
  const watermarkUnlocked = useSessionFlag(SESSION_FLAGS.WATERMARK_UNLOCKED);

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
  const [showWatermark, setShowWatermark] = useState(true);
  const [activeTab,     setActiveTab]     = useState<"stickers" | "options">("stickers");
  const [activePack,    setActivePack]    = useState(0);
  const [emailModal,    setEmailModal]    = useState(false);
  const [email,         setEmail]         = useState("");
  const [emailState,    setEmailState]    = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [toast,         setToast]         = useState<string | null>(null);
  const [showGate,      setShowGate]      = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [printModal,     setPrintModal]     = useState(false);
  const [ready,         setReady]         = useState(false);

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

  const config: StripConfig = {
    layout, filter, theme, borderWidth, showDate,
    showWatermark: showWatermark && !watermarkUnlocked.value,
    stickers, textOverlay: null,
  };

  useEffect(() => {
    if (ready && photos.length > 0) renderStrip(photos, config);
  }, [ready, photos, stickers, showDate, showWatermark, watermarkUnlocked.value]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addSticker(emoji: string) {
    $1
    setTextItems((prev) =>
      prev.map((s) => s.id === d.id
        ? { ...s, x: Math.max(0, Math.min(1, d.origX + dx)), y: Math.max(0, Math.min(1, d.origY + dy)) }
        : s
      )
    );

  function onStickerPointerUp() { dragState.current = null; }
  // ─────────────────────────────────────────────────────────────────────────

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

  function handlePrint() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Virtual Photo Booth</title>
      <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fdf4f9;}
      img{max-width:320px;width:100%;box-shadow:0 8px 32px rgba(180,80,160,0.20);}
      @media print{body{background:white;}}</style></head>
      <body><img src="${canvas.toDataURL("image/png")}" onload="window.print();window.close();" /></body></html>`);
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

  function handleWatermarkToggle() {
    if (showWatermark && !watermarkUnlocked.value) setShowGate(true);
    else setShowWatermark((p) => !p);
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
            onPointerMove={onStickerPointerMove}
            onPointerUp={onStickerPointerUp}
            onPointerLeave={onStickerPointerUp}
          >
            <motion.canvas ref={canvasRef}
              className="rounded-strip shadow-strip"
              style={{ width: "100%", height: "auto", display: "block" }}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />

            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                onPointerDown={(e) => onStickerPointerDown(e, sticker.id)}

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
                style={{
                  position:    "absolute",
                  left:        `${sticker.x * 100}%`,
                  top:         `${sticker.y * 100}%`,
                  transform:   "translate(-50%, -50%)",
                  fontSize:    "28px",
                  cursor:      "grab",
                  userSelect:  "none",
                  touchAction: "none",
                  lineHeight:  1,
                  filter:      "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
                }}
              >
                {sticker.emoji}
              </div>
            ))}
          </div>

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
            {(["stickers", "options"] as const).map((tab) => (
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: "#2d1a26" }}>Watermark</p>
                  <p className="font-mono text-xs" style={{ color: "#b08898" }}>
                    {watermarkUnlocked.value ? "Unlocked ✓" : "Remove for $1.99 donation"}
                  </p>
                </div>
                <button onClick={handleWatermarkToggle}
                  className="w-11 h-6 rounded-pill relative transition-colors duration-200"
                  style={{ background: (!showWatermark || watermarkUnlocked.value) ? "#e8399a" : "rgba(220,120,180,0.25)" }}>
                  <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: (!showWatermark || watermarkUnlocked.value) ? "translateX(22px)" : "translateX(2px)" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

      <AnimatePresence>
        {showGate && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(45,26,38,0.50)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowGate(false); }}>
            <motion.div className="vpb-glass p-8 w-full max-w-sm rounded-card shadow-modal text-center"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
              <p className="text-4xl mb-3">🩷</p>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: "#2d1a26" }}>Support the project</h3>
              <p className="font-body text-sm mb-6" style={{ color: "#7a5068" }}>
                Remove the watermark with a small $1.99 donation. It helps keep Virtual Photo Booth free for everyone.
              </p>
              <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
                onClick={() => { watermarkUnlocked.set(true); setShowWatermark(false); setShowGate(false); showToast("Watermark removed — thank you 🩷"); }}
                className="vpb-btn-primary w-full justify-center py-3 mb-3 block">
                Donate $1.99 & Remove Watermark
              </a>
              <button onClick={() => setShowGate(false)} className="w-full text-center font-mono text-xs py-2" style={{ color: "#b08898" }}>Keep watermark</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
