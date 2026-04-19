"use client";

// ─────────────────────────────────────────
// useSessionFlag — sessionStorage boolean flag
// Used for watermark unlock state per session
// ─────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

export function useSessionFlag(key: string, defaultValue = false) {
  const [value, setValue] = useState<boolean>(defaultValue);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) setValue(stored === "true");
    } catch {
      // sessionStorage unavailable (private mode etc.) — silently fall back
    }
  }, [key]);

  const set = useCallback((next: boolean) => {
    setValue(next);
    try {
      sessionStorage.setItem(key, String(next));
    } catch {
      // silent
    }
  }, [key]);

  const clear = useCallback(() => {
    setValue(defaultValue);
    try {
      sessionStorage.removeItem(key);
    } catch {
      // silent
    }
  }, [key, defaultValue]);

  return { value, set, clear };
}

// Specific flag keys — centralised here to avoid typos
export const SESSION_FLAGS = {
  WATERMARK_UNLOCKED: "vpb_watermark_unlocked",
  DONATION_PROMPTED:  "vpb_donation_prompted",
} as const;
