// ROOT LAYOUT — JSX to be generated in next phase
// This file is a placeholder to complete the repo scaffold
// It will be replaced with full implementation

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title:       "Virtual Photo Booth | Free Online Photobooth & Photo Strip Maker",
  description: "Free online photobooth — take instant photo strips with cute stickers, filters & frames. No download needed. Works on any device. Loved by teens on TikTok.",
  keywords:    [
    "photobooth", "photo booth", "virtual photo booth", "online photobooth",
    "free photobooth", "photobooth website", "photobooth website tiktok",
    "tiktok photobooth", "tiktok viral photobooth", "photo strip",
    "photo strip maker", "picapica", "digibooth", "webcamtoy",
    "photobooth-io", "photo booth online", "free photo booth online",
    "selfie photo booth", "photo booth with stickers", "photo booth filters",
    "photo strip download", "photo booth no account", "instant photo booth",
    "cute photo booth", "aesthetic photo booth", "photo booth for teens",
    "virtual photobooth online", "photo booth app", "photo booth website",
    "make photo strips", "photo booth frames", "free photo strips",
    "online photoshoot", "online photo strip creator", "free photo strip maker",
    "life4cuts", "polaroid booth", "vintage photo booth online",
    "snappy photo booth", "yoyobooth", "beautyplus photo booth",
    "photo booth no download", "photo booth any device", "photo booth mobile",
    "instant photo strips", "photo booth stickers frames", "retro photo booth",
    "photo booth filters effects", "cute photo strips", "aesthetic photo strips",
    "photo booth for girls", "photo booth tiktok trend", "photobooth app online",
    "free online photoshoot", "webcam photo booth", "photo booth at home",
  ],
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
    icon:  [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png" },
    ],
    apple: "/icons/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor:          "#e8399a",
  width:               "device-width",
  initialScale:        1,
  maximumScale:        1,
  viewportFit:         "cover",  // enables safe-area-inset on iOS notch
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="ahrefs-site-verification" content="3f4af3653498b37459357be6dcaec1312d88e394245fa0919e8beaadb6ecf276" />
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
        <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1983087777566242" strategy="beforeInteractive" crossOrigin="anonymous" />
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="5ku4dLIWJQxGHdyb+mPQqg" strategy="afterInteractive" />
        {children}</body>
    </html>
  );
}
