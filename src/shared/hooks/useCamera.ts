"use client";

// ─────────────────────────────────────────
// useCamera — getUserMedia abstraction
// Shared by BoothCamera and BoothUpload
// ─────────────────────────────────────────

// Module-level stream cache — survives component remounts
// Avoids repeated getUserMedia calls and iOS permission re-prompts
let _cachedStream: MediaStream | null = null;

import { useRef, useState, useCallback, useEffect } from "react";

export type CameraState = "idle" | "requesting" | "active" | "error";

export type UseCameraReturn = {
  videoRef:    React.RefObject<HTMLVideoElement>;
  state:       CameraState;
  error:       string | null;
  isMirrored:  boolean;
  startCamera: () => Promise<void>;
  stopCamera:  () => void;
  toggleMirror:() => void;
  captureFrame:(canvas: HTMLCanvasElement) => boolean;
};

export function useCamera(): UseCameraReturn {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state,      setState]      = useState<CameraState>("idle");
  const [error,      setError]      = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true); // selfie-mode default

  const stopCamera = useCallback((clearCache = false) => {
    if (clearCache) {
      _cachedStream?.getTracks().forEach((t) => t.stop());
      _cachedStream = null;
    }
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  }, []);

  const startCamera = useCallback(async () => {
    setState("requesting");
    setError(null);

    try {
      // Reuse cached stream if still active — avoids iOS permission re-prompt
      let stream = _cachedStream;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode:  "user",
            width:  { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        _cachedStream = stream;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState("active");
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access and refresh."
          : err instanceof DOMException && err.name === "NotFoundError"
          ? "No camera found on this device."
          : "Could not start camera. Please try again.";

      setError(msg);
      setState("error");
    }
  }, []);

  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  /**
   * Captures the current video frame onto the provided canvas.
   * Returns true on success.
   */
  const captureFrame = useCallback((canvas: HTMLCanvasElement): boolean => {
    const video = videoRef.current;
    if (!video || state !== "active") return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    if (isMirrored) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0);
    }

    return true;
  }, [state, isMirrored]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef,
    state,
    error,
    isMirrored,
    startCamera,
    stopCamera,
    toggleMirror,
    captureFrame,
  };
}
