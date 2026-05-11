import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Browser Photo Booth | Instant Online Photo Booth in Your Browser",
  description: "Use a browser-based photo booth directly from desktop or mobile with no software installation. Create photo strips, apply filters, and download instantly.",
  alternates: { canonical: "https://virtualphotobooth.online/browser-photo-booth" },
  openGraph: {
    title: "Browser Photo Booth | Instant Online Photo Booth in Your Browser",
    description: "Use a browser-based photo booth with no software installation required.",
    url: "https://virtualphotobooth.online/browser-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="browser-photo-booth"
      canonical="https://virtualphotobooth.online/browser-photo-booth"
      h1="Browser-Based Virtual Photo Booth"
      intro="Use a fully browser-based virtual photo booth without downloading software or mobile apps. Virtual Photo Booth runs entirely in your web browser — open it on Chrome, Safari, Firefox, or Edge on any device and start capturing photo strips in seconds. Apply filters, add stickers, upload custom frames, and download your finished photo strip without leaving your browser tab."
      features={[
        "Runs entirely in Chrome, Safari, Firefox, and Edge",
        "No software installation or mobile app required",
        "Full camera access via browser — front and rear camera support",
        "Wide angle simulation, Normal, and 2x zoom camera modes",
        "Switch between front and rear camera with one tap",
        "Mirror mode for accurate text capture",
        "9 filters, drag-and-drop stickers, and custom frame upload",
        "Instant download — PNG or save to phone gallery",
        "Works on iPhone, Android, Mac, Windows, Chromebook",
      ]}
      faqs={[
        { q: "What is a browser photo booth?", a: "A browser photo booth is a web application that uses your device camera to capture photo booth-style pictures directly inside your browser without any software download." },
        { q: "Which browsers support Virtual Photo Booth?", a: "Virtual Photo Booth works on Chrome, Safari, Firefox, and Edge on both desktop and mobile devices. For best results on iPhone, use Safari." },
        { q: "Does the browser photo booth access my camera without permission?", a: "No. Your browser will ask for camera permission the first time you use Virtual Photo Booth. Your camera is only active while you are on the camera page and stops immediately when you navigate away." },
        { q: "Can I use the browser photo booth on my laptop?", a: "Yes. Virtual Photo Booth works on any laptop with a webcam — Mac, Windows, or Chromebook — using your built-in or external camera." },
      ]}
    />
  );
}
