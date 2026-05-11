import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Free Virtual Photo Booth Online | Instant Browser Photo Booth",
  description: "Create instant photo strips using a free virtual photo booth directly in your browser. No app download or account required. Works on iPhone, Android, and desktop.",
  alternates: { canonical: "https://virtualphotobooth.online/free-virtual-photo-booth" },
  openGraph: {
    title: "Free Virtual Photo Booth Online | Instant Browser Photo Booth",
    description: "Create instant photo strips using a free virtual photo booth. No download needed.",
    url: "https://virtualphotobooth.online/free-virtual-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="free-virtual-photo-booth"
      canonical="https://virtualphotobooth.online/free-virtual-photo-booth"
      h1="Free Virtual Photo Booth Online"
      intro="Create instant online photo strips and event pictures using a free browser-based virtual photo booth. No installation, no account creation, and no mobile app required. Capture photos instantly from desktop or mobile devices and download customizable photo booth strips for parties, weddings, birthdays, corporate events, and online gatherings. Virtual Photo Booth is 100% free — with filters, stickers, custom frames, and instant downloads all included."
      features={[
        "100% free — no account, no subscription, no hidden fees",
        "Works on iPhone, Android, Mac, Windows, and Chromebook",
        "9 professional filters including B&W, Vintage, Sepia, Lo-Fi, and Film Burn",
        "Drag-and-drop stickers — hearts, stars, flowers, Y2K and more",
        "Custom frame upload — use your own PNG as a photo booth frame",
        "1, 2, 3, 4, and 6-photo strip layouts",
        "Selfie mode, Wide angle, Normal, and 2x zoom camera modes",
        "Save instantly to your phone gallery or download to desktop",
        "Date stamp and watermark options",
        "Private — photos never leave your device",
      ]}
      faqs={[
        { q: "What is a free virtual photo booth?", a: "A free virtual photo booth is a browser-based app that lets you take photo booth-style pictures using your device camera. Virtual Photo Booth works on any device without downloading software or creating an account." },
        { q: "Can I use a virtual photo booth without downloading an app?", a: "Yes. Virtual Photo Booth runs entirely in your browser. Open virtualphotobooth.online on any device and start capturing photo strips instantly — no app store, no installation required." },
        { q: "Is the online photo booth completely free?", a: "Yes. All features including filters, stickers, frames, and downloads are completely free. An optional $1.99 donation removes the watermark from your strips." },
        { q: "Does the free photo booth work on iPhone?", a: "Yes. Virtual Photo Booth is fully optimized for iPhone and iPad Safari. Photos save directly to your camera roll through the iOS share sheet." },
        { q: "What layouts are available in the free photo booth?", a: "Choose from 1, 2, 3, 4, or 6-photo strip layouts. Each layout is customizable with filters, borders, stickers, text, and frames." },
      ]}
    />
  );
}
