"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "@/shared/hooks/useCamera";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, COUNTDOWN_DURATION, BETWEEN_SHOT_DELAY, AUTO_ADVANCE_DELAY } from "@/core/theme";
import type { CapturedPhoto } from "@/modules/canvas/canvas.types";

export default function BoothCamera() {
  const router       = useRouter();
  const params       = useSearchParams();
  const layoutId     = params.get("layout")  ?? "4";
  const filterId     = params.get("filter")  ?? "normal";
  const themeId      = params.get("theme")   ?? "white";
  const borderWidth  = params.get("borderWidth") ?? "16";

  const layout  = LAYOUT_OPTIONS.find((l) => l.id === layoutId)  ?? LAYOUT_OPTIONS[3];
  const filter  = CAMERA_FILTERS.find((f) => f.id === filterId)  ?? CAMERA_FILTERS[0];

  const { videoRef, state, error, isMirrored, startCamera, stopCamera, toggleMirror, captureFrame } = useCamera();

  const [photos,      setPhotos]      = useState<CapturedPhoto[]>([]);
  const [countdown,   setCountdown]   = useState<number | null>(null);
  const [shotIndex,   setShotIndex]   = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash,       setFlash]       = useState(false);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  const totalShots = layout.count;

  useEffect(() => { startCamera(); return () => stopCamera(); }, []);

  const triggerCapture = useCallback(() => {
    const canvas = captureCanvasRef.current;
    if (!canvas) return;
    const ok = captureFrame(canvas);
    if (!ok) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 350);

    const dataUrl = canvas.toDataURL("image/png");
    const photo: CapturedPhoto = {
      id:        crypto.randomUUID(),
      dataUrl,
      slotIndex: shotIndex,
    };

    setPhotos((prev) => {
      const next = [...prev, photo];
      if (next.length >= totalShots) {
        setTimeout(() => {
          const query = new URLSearchParams({
            layout: layoutId, filter: filterId,
            theme: themeId, borderWidth,
            photos: JSON.stringify(next.map((p) => p.dataUrl)),
          });
          stopCamera();
          router.push(`/booth/result?${query.toString()}`);
        }, AUTO_ADVANCE_DELAY);
      }
      return next;
    });

    setShotIndex((prev) => prev + 1);
  }, [shotIndex, totalShots, captureFrame, layoutId, filterId, themeId, borderWidth]);

  const startCountdown = useCallback(() => {
    if (isCapturing || photos.length >= totalShots) return;
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        triggerCapture();
        setTimeout(() => setIsCapturing(false), BETWEEN_SHOT_DELAY);
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [isCapturing, photos.length, totalShots, triggerCapture]);

  // Spacebar shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); startCountdown(); }
      if (e.code === "Escape") router.push("/booth");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [startCountdown, router]);

  function retakePhoto(index: number) {
    setPhotos((prev) => prev.filter((p) => p.slotIndex !== index));
    setShotIndex(index);
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#e8399a" }}>
          ✦ Step 2 of 2 — Strike a pose
        </p>
        <h1 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>
          Photo {Math.min(photos.length + 1, totalShots)} of {totalShots}
        </h1>
        {/* Progress pills */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {Array.from({ length: totalShots }).map((_, i) => (
            <div key={i} className="h-2 rounded-pill transition-all duration-300"
              style={{
                width:      photos[i] ? 24 : 8,
                background: photos[i] ? "#e8399a" : "rgba(232,57,154,0.20)",
              }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-6 items-start">
        {/* Camera view */}
        <div className="relative">
          <div className="relative rounded-card overflow-hidden shadow-strip aspect-[4/3] bg-vpb-surface2">
            {/* Video */}
            <video ref={videoRef} autoPlay playsInline muted
              className="w-full h-full object-cover"
              style={{ transform: isMirrored ? "scaleX(-1)" : "none", filter: filter.css }} />

            {/* Flash overlay */}
            <AnimatePresence>
              {flash && (
                <motion.div className="absolute inset-0 bg-white"
                  initial={{ opacity: 0.9 }} animate={{ opacity: 0 }}
                  transition={{ duration: 0.35 }} />
              )}
            </AnimatePresence>

            {/* Countdown overlay */}
            <AnimatePresence mode="wait">
              {countdown !== null && (
                <motion.div key={countdown}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(45,26,38,0.35)" }}>
                  <motion.span
                    className="font-display font-bold text-white"
                    style={{ fontSize: "clamp(5rem, 20vw, 8rem)", lineHeight: 1 }}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    {countdown}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera error */}
            {state === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                style={{ background: "rgba(253,244,249,0.95)" }}>
                <p className="text-3xl mb-3">📷</p>
                <p className="font-body text-sm" style={{ color: "#7a5068" }}>{error}</p>
              </div>
            )}

            {/* Filter label */}
            {filter.id !== "normal" && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-pill font-mono text-[10px] font-semibold tracking-widest uppercase"
                style={{ background: "rgba(232,57,154,0.85)", color: "#fff" }}>
                {filter.label}
              </div>
            )}

            {/* Mirror toggle */}
            <button onClick={toggleMirror}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.80)" }}
              title="Toggle mirror">
              ↔️
            </button>
          </div>

          {/* Shutter button */}
          <div className="flex flex-col items-center gap-3 mt-5">
            <motion.button onClick={startCountdown}
              disabled={isCapturing || photos.length >= totalShots || state !== "active"}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background:   isCapturing || photos.length >= totalShots ? "rgba(232,57,154,0.30)" : "#e8399a",
                boxShadow:    "0 4px 24px rgba(232,57,154,0.40)",
                border:       "4px solid rgba(255,255,255,0.80)",
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}>
              <span className="text-2xl">📸</span>
            </motion.button>
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b08898" }}>
              {isCapturing ? "Get ready..." : photos.length >= totalShots ? "All done!" : "Tap or press Space"}
            </p>
          </div>
        </div>

        {/* Strip preview */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-widest uppercase text-center mb-1" style={{ color: "#b08898" }}>
            Your strip
          </p>
          {Array.from({ length: totalShots }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="rounded-lg overflow-hidden aspect-[4/3]"
                style={{ background: photos[i] ? "transparent" : "rgba(232,57,154,0.08)", border: "1px solid rgba(232,57,154,0.15)" }}>
                {photos[i] ? (
                  <img src={photos[i].dataUrl} alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={{ filter: filter.css }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-xs" style={{ color: "rgba(232,57,154,0.40)" }}>{i + 1}</span>
                  </div>
                )}
              </div>
              {/* Retake button */}
              {photos[i] && (
                <button onClick={() => retakePhoto(i)}
                  className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[10px] font-semibold tracking-widest uppercase"
                  style={{ background: "rgba(45,26,38,0.60)", color: "#fff" }}>
                  Retake
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden capture canvas */}
      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
