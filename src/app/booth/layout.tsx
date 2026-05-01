"use client";

import { ReactNode } from "react";
import Link from "next/link";
import DonationButton from "@/modules/donation/DonationButton";

export default function BoothLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] vpb-bg-animated font-body">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(253, 244, 249, 0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(220, 120, 180, 0.12)" }}>
        <Link href="/" className="font-display font-bold text-lg tracking-tight" style={{ color: "#2d1a26" }}>
          Virtual Photo Booth
        </Link>
        <Link href="/booth"
          style={{
            background:   "rgba(232, 57, 154, 0.08)",
            border:       "1px solid rgba(232, 57, 154, 0.20)",
            color:        "#e8399a",
            fontFamily:   "monospace",
            fontSize:     "11px",
            fontWeight:   600,
            padding:      "6px 14px",
            borderRadius: "999px",
            whiteSpace:   "nowrap",
            lineHeight:   "1",
            display:      "inline-flex",
            alignItems:   "center",
          }}>
          ← Start Over
        </Link>
      </nav>

      {/* Page content */}
      <div className="pt-20 pb-24">
        {children}
      </div>

      {/* Floating donation button */}
      <DonationButton />
    </div>
  );
}
