"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "@/shared/hooks/useCamera";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, BETWEEN_SHOT_DELAY, AUTO_ADVANCE_DELAY } from "@/core/theme";
import type { CapturedPhoto } from "@/modules/canvas/canvas.types";

export default function BoothCamera() {
  const router      = useRouter();
  const params      = useSearchParams();
  const layoutId    = params.get("layout")      ?? "4";
  const filterId    = params.get("filter")      ?? "normal";
  const themeId     = params.get("theme")       ?? "white";
  const borderWidth = params.get("borderWidth") ?? "16";

  const layout = LAYOUT_OPTIONS.find((l) => l.id === layoutId) ?? LAYOUT_OPTIONS[3];
  const filter = CAMERA_FILTERS.find((f) => f.id === filterId) ?? CAMERA_FILTERS[0];

  const { videoRef, state, error, isMirrored, startCamera, stopCamera, toggleMirror, captureFrame } = useCamera();

  const [photos,      setPhotos]      = useState<CapturedPhoto[]>([]);
  const [countdown,   setCountdown]   = useState<number | null>(null);
  const [shotIndex,   setShotIndex]   = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash,       setFlash]       = useState(false);
  const [camMode,     setCamMode]     = useState<"selfie" | "normal" | "wide" | "2x">("selfie");
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const totalShots = layout.count;

  useEffect(() => {
    // Check if camera permission already granted — skip prompt
    if (navigator.permissions) {
      navigator.permissions.query({ name: "camera" as PermissionName })
        .then(result => {
          if (result.state === "granted" || result.state === "prompt") {
            startCamera();
          }
        })
        .catch(() => startCamera()); // fallback if permissions API not supported
    } else {
      startCamera();
    }
    return () => stopCamera();
  }, []);

  const goToResult = useCallback((finalPhotos: CapturedPhoto[]) => {
    sessionStorage.setItem("vpb_photos", JSON.stringify(finalPhotos.map((p) => p.dataUrl)));
    const query = new URLSearchParams({ layout: layoutId, filter: filterId, theme: themeId, borderWidth });
    stopCamera();
    router.push("/booth/result?" + query.toString());
  }, [layoutId, filterId, themeId, borderWidth, stopCamera, router]);

  const switchCamera = useCallback(async (mode: "selfie" | "normal" | "wide" | "2x") => {
    setCamMode(mode);

    // For front/rear switch — restart stream with different facingMode
    // For 0.5x/2x — CSS zoom simulation on existing stream (avoids iOS native camera trigger)
    const needsRestart = (mode === "selfie") !== (camMode === "selfie");

    if (needsRestart) {
      stopCamera();
      setTimeout(async () => {
        try {
          const isFront = mode === "selfie";
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: isFront ? "user" : "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
        } catch (err) { console.error("Camera restart failed:", err); }
      }, 300);
    }

    // Always apply CSS transform for zoom simulation
    if (videoRef.current) {
      let transform = "none";
      if (mode === "selfie") transform = "scaleX(-1)";
      else if (mode === "wide") transform = "scale(0.6)";
      else if (mode === "2x")   transform = "scale(1.8)";
      videoRef.current.style.transform       = transform;
      videoRef.current.style.transformOrigin = "center";
      videoRef.current.style.transition      = "transform 0.35s ease";
    }
  }, [stopCamera, videoRef, camMode]);

  const triggerCapture = useCallback(() => {
    const canvas = captureCanvasRef.current;
    if (!canvas) return;
    const ok = captureFrame(canvas);
    if (!ok) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 350);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const photo: CapturedPhoto = { id: crypto.randomUUID(), dataUrl, slotIndex: shotIndex };

    setPhotos((prev) => {
      const next = [...prev, photo];
      if (next.length >= totalShots) {
        setTimeout(() => goToResult(next), AUTO_ADVANCE_DELAY);
      }
      return next;
    });
    setShotIndex((prev) => prev + 1);
  }, [shotIndex, totalShots, captureFrame, goToResult]);

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
      <div className="text-center mb-6">
        <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#e8399a" }}>✦ Step 2 of 2 — Strike a pose</p>
        <h1 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>
          Photo {Math.min(photos.length + 1, totalShots)} of {totalShots}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-3">
          {Array.from({ length: totalShots }).map((_, i) => (
            <div key={i} className="h-2 rounded-pill transition-all duration-300"
              style={{ width: photos[i] ? 24 : 8, background: photos[i] ? "#e8399a" : "rgba(232,57,154,0.20)" }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-6 items-start">
        <div className="relative">
          <div className="relative rounded-card overflow-hidden shadow-strip aspect-[4/3] bg-vpb-surface2">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"
              style={{ transform: isMirrored ? "scaleX(-1)" : "none", filter: filter.css }} />
            <AnimatePresence>
              {flash && (
                <motion.div className="absolute inset-0 bg-white"
                  initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }} />
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {countdown !== null && (
                <motion.div key={countdown} className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(45,26,38,0.35)" }}>
                  <motion.span className="font-display font-bold text-white"
                    style={{ fontSize: "clamp(5rem, 20vw, 8rem)", lineHeight: 1 }}
                    initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    {countdown}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            {state === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                style={{ background: "rgba(253,244,249,0.95)" }}>
                <p className="text-3xl mb-3">📷</p>
                <p className="font-body text-sm" style={{ color: "#7a5068" }}>{error}</p>
              </div>
            )}
            {filter.id !== "normal" && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-pill font-mono text-[10px] font-semibold tracking-widest uppercase"
                style={{ background: "rgba(232,57,154,0.85)", color: "#fff" }}>
                {filter.label}
              </div>
            )}
            <button onClick={() => switchCamera(camMode === "selfie" ? "normal" : "selfie")}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(0,0,0,0.50)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", fontSize: "18px",
                cursor: "pointer", minHeight: "unset", minWidth: "unset",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              🔄
            </button>

            {/* Camera mode switcher */}
            <div style={{
              position: "absolute", bottom: 12, left: 0, right: 0,
              display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
            }}>
              {(["wide", "selfie", "normal", "2x"] as const).map((m) => (
                <button key={m} onClick={() => switchCamera(m)}
                  style={{
                    background:     camMode === m ? "rgba(232,57,154,0.85)" : "rgba(0,0,0,0.55)",
                    border:         "1px solid " + (camMode === m ? "rgba(232,57,154,0.5)" : "rgba(255,255,255,0.2)"),
                    color:          "#fff", fontFamily: "monospace",
                    fontSize:       "11px", fontWeight: 600,
                    padding:        "5px 10px", borderRadius: "99px",
                    cursor:         "pointer", backdropFilter: "blur(8px)",
                    minHeight:      "unset", minWidth: "unset", whiteSpace: "nowrap",
                  }}>
                  {m === "wide" ? "🌐 Wide" : m === "selfie" ? "🤳 Selfie" : m === "normal" ? "📸 Normal" : "🔍 2x"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-5">
            <motion.button onClick={startCountdown}
              disabled={isCapturing || photos.length >= totalShots || state !== "active"}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: isCapturing || photos.length >= totalShots ? "rgba(232,57,154,0.30)" : "#e8399a",
                boxShadow:  "0 4px 24px rgba(232,57,154,0.40)",
                border:     "4px solid rgba(255,255,255,0.80)",
              }}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
              <span className="text-2xl">📸</span>
            </motion.button>
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b08898" }}>
              {isCapturing ? "Get ready..." : photos.length >= totalShots ? "All done!" : "Tap or press Space"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-widest uppercase text-center mb-1" style={{ color: "#b08898" }}>Your strip</p>
          {Array.from({ length: totalShots }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="rounded-lg overflow-hidden aspect-[4/3]"
                style={{ background: photos[i] ? "transparent" : "rgba(232,57,154,0.08)", border: "1px solid rgba(232,57,154,0.15)" }}>
                {photos[i] ? (
                  <img src={photos[i].dataUrl} alt={"Photo " + (i + 1)} className="w-full h-full object-cover" style={{ filter: filter.css }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-xs" style={{ color: "rgba(232,57,154,0.40)" }}>{i + 1}</span>
                  </div>
                )}
              </div>
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
      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
