import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "No App Photo Booth | Virtual Photo Booth Without Download",
  description: "Use a virtual photo booth with no app download, installation, or account required. Works directly in any browser on any device. 100% free.",
  alternates: { canonical: "https://virtualphotobooth.online/no-app-photo-booth" },
  openGraph: {
    title: "No App Photo Booth | Virtual Photo Booth Without Download",
    description: "Photo booth with no app download or account required. Works in any browser.",
    url: "https://virtualphotobooth.online/no-app-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="no-app-photo-booth"
      canonical="https://virtualphotobooth.online/no-app-photo-booth"
      h1="Virtual Photo Booth With No App Required"
      intro="Create online event photos and downloadable digital photo strips using a browser-based virtual photo booth with no software installation or mobile app required. Virtual Photo Booth works instantly on any device — open the website, allow camera access, and start capturing photo strips in under 10 seconds. No App Store, no Google Play, no account creation, no email required. Just open and shoot."
      features={[
        "No app download — works instantly in any browser",
        "No account or email registration required",
        "No subscription or payment required",
        "No photos uploaded to any server — 100% private",
        "Opens in under 3 seconds on any device",
        "Works on iPhone Safari, Android Chrome, and all desktop browsers",
        "Full photo booth features — filters, stickers, frames, text",
        "Save and download instantly — no waiting, no processing queue",
        "Share directly to TikTok, Instagram, or iMessage",
        "Installable as a home screen shortcut — optional, not required",
      ]}
      faqs={[
        { q: "Can I use a photo booth online without downloading an app?", a: "Yes. Virtual Photo Booth runs entirely in your web browser. Open virtualphotobooth.online on any device and start taking photos instantly — no App Store, no Google Play, and no installation required." },
        { q: "Do I need to create an account to use Virtual Photo Booth?", a: "No. Virtual Photo Booth requires no account, no email address, and no registration of any kind. Open the site and start shooting immediately." },
        { q: "Is my data safe if I use the photo booth without an account?", a: "Yes. Virtual Photo Booth processes all photos locally on your device. No photos are ever uploaded to any server. Your images stay entirely on your device." },
        { q: "Why is no-app access important for a photo booth?", a: "Requiring app downloads creates friction that prevents guests from participating at events. Virtual Photo Booth eliminates this barrier — anyone with a phone browser can participate in under 10 seconds." },
        { q: "Does the no-app photo booth have all the same features?", a: "Yes. The browser-based Virtual Photo Booth includes all features: 9 filters, 6 sticker packs, 12 frame templates, custom frame upload, text overlay, date stamp, print mode, and instant gallery save." },
      ]}
    />
  );
}
