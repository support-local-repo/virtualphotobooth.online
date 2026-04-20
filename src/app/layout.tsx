// ROOT LAYOUT — JSX to be generated in next phase
// This file is a placeholder to complete the repo scaffold
// It will be replaced with full implementation

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title:       "Virtual Photo Booth — Free Online Photo Strips",
  description: "Free online photo booth. Create beautiful photo strips with cute stickers, filters, and effects. No account needed. Instant download.",
  keywords:    ["photo booth", "photo strip", "online photobooth", "free photobooth", "selfie", "stickers", "filters"],
  authors:     [{ name: "Virtual Photo Booth" }],
  creator:     "Virtual Photo Booth",
  metadataBase: new URL("https://virtualphotobooth.online"),
  openGraph: {
    title:       "Virtual Photo Booth — Free Online Photo Strips",
    description: "Create beautiful photo strips with cute stickers, filters, and effects. Free, no account needed.",
    url:         "https://virtualphotobooth.online",
    siteName:    "Virtual Photo Booth",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Virtual Photo Booth — Free Online Photo Strips",
    description: "Create beautiful photo strips with cute stickers, filters, and effects.",
  },
  manifest: "/manifest.json",
  icons: {
    icon:  "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor:    "#e8399a",
  width:         "device-width",
  initialScale:  1,
  maximumScale:  1,      // prevent zoom on mobile inputs — important for teen UX
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — Playfair Display + DM Sans + Cormorant Garamond */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,600&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        {/* Print stylesheet */}
        <link rel="stylesheet" href="/print.css" media="print" />

      </head>
      <body>
        <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1983087777566242" strategy="afterInteractive" crossOrigin="anonymous" />
        {children}</body>
    </html>
  );
}
