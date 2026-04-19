"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/core/transitions";
import { LAYOUT_OPTIONS, CAMERA_FILTERS, STRIP_THEMES, BORDER_WIDTHS } from "@/core/theme";
import type { LayoutOption, FilterOption, StripTheme } from "@/core/theme";

export default function BoothMenu() {
  const router = useRouter();
  const [layout,      setLayout]      = useState<LayoutOption>(LAYOUT_OPTIONS[3]);
  const [filter,      setFilter]      = useState<FilterOption>(CAMERA_FILTERS[0]);
  const [theme,       setTheme]       = useState<StripTheme>(STRIP_THEMES[0]);
  const [borderWidth, setBorderWidth] = useState<number>(BORDER_WIDTHS.medium);
  const [mode,        setMode]        = useState<"camera" | "upload">("camera");

  function handleStart() {
    const params = new URLSearchParams({
      layout:      layout.id,
      filter:      filter.id,
      theme:       theme.id,
      borderWidth: String(borderWidth),
    });
    router.push(