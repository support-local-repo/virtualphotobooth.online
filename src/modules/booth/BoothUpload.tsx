"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, AUTO_ADVANCE_DELAY } from "@/core/theme";
import type { CapturedPhoto } from "@/modules/canvas/canvas.types";

export default function BoothUpload() {
  const router      = useRouter();
  const params      = useSearchParams();
  const layoutId    = params.get("layout")      ?? "4";
  const filterId    = params.get("filter")      ?? "normal";
  const themeId     = params.get("theme")       ?? "white";
  const borderWidth = params.get("borderWidth") ?? "16";

  const layout     = LAYOUT_OPTIONS.find((l) => l.id === layoutId) ?? LAYOUT_OPTIONS[3];
  const filter     = CAMERA_FILTERS.find((f) => f.id === filterId) ?? CAMERA_FILTERS[0];
  const totalShots = layout.count;

  const [photos,   setPhotos]   = useState<CapturedPhoto[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const goToResult = useCallback((finalPhotos: CapturedPhoto[]) => {
    sessionStorage.setItem("vpb_photos", JSON.stringify(finalPhotos.map((p) => p.dataUrl)));
    const query = new URLSearchParams({ layout: layoutId, filter: filterId, theme: themeId, borderWidth });
    router.push("/booth/result?" + query.toString());
  }, [layoutId, filterId, themeId, borderWidth, router]);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr     = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const allowed = arr.slice(0, totalShots - photos.length);
    const results = await Promise.all(allowed.map(readFile));
    setPhotos((prev) => {
      const next = [
        ...prev,
        ...results.map((dataUrl, i) => ({ id: crypto.randomUUID(), dataUrl, slotIndex: prev.length + i })),
      ];
      if (next.length >= totalShots) {
        setTimeout(() => goToResult(next), AUTO_ADVANCE_DELAY);
      }
      return next;
    });
  }, [photos.length, totalShots, goToResult]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, slotIndex: i })));
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#e8399a" }}>✦ Upload your photos</p>
        <h1 className="font-display text-h2 font-bold" style={{ color: "#2d1a26" }}>{photos.length} of {totalShots} added</h1>
        <div className="flex items-center justify-center gap-2 mt-3">
          {Array.from({ length: totalShots }).map((_, i) => (
            <div key={i} className="h-2 rounded-pill transition-all duration-300"
              style={{ width: photos[i] ? 24 : 8, background: photos[i] ? "#e8399a" : "rgba(232,57,154,0.20)" }} />
          ))}
        </div>
      </div>

      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="vpb-glass rounded-card p-10 flex flex-col items-center justify-center text-center cursor-pointer mb-6"
        animate={{ scale: dragging ? 1.01 : 1 }}
        style={{ minHeight: 180, border: "2px dashed " + (dragging ? "#e8399a" : "rgba(220,120,180,0.30)") }}>
        <p className="text-4xl mb-3">🖼️</p>
        <p className="font-body font-semibold" style={{ color: "#2d1a26" }}>
          {dragging ? "Drop your photos here" : "Tap to choose photos"}
        </p>
        <p className="font-mono text-xs mt-1" style={{ color: "#b08898" }}>
          or drag and drop · {totalShots - photos.length} remaining
        </p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </motion.div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <AnimatePresence>
            {photos.map((p, i) => (
              <motion.div key={p.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}>
                <img src={p.dataUrl} alt={"Photo " + (i + 1)} className="w-full h-full object-cover"
                  style={{ filter: filter.css }} />
                <button onClick={() => removePhoto(i)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs font-semibold"
                  style={{ background: "rgba(45,26,38,0.60)", color: "#fff" }}>
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {photos.length > 0 && photos.length < totalShots && (
        <button onClick={() => goToResult(photos)} className="vpb-btn-secondary w-full justify-center py-3">
          Continue with {photos.length} photo{photos.length > 1 ? "s" : ""} →
        </button>
      )}
    </div>
  );
}
