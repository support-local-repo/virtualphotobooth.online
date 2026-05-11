import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Mobile Photo Booth | Free Smartphone Virtual Photo Booth",
  description: "Use a mobile-friendly virtual photo booth directly from your smartphone browser. No app download required. Fully optimized for iPhone and Android.",
  alternates: { canonical: "https://virtualphotobooth.online/mobile-photo-booth" },
  openGraph: {
    title: "Mobile Photo Booth | Free Smartphone Virtual Photo Booth",
    description: "Mobile-friendly photo booth for iPhone and Android. No app download needed.",
    url: "https://virtualphotobooth.online/mobile-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="mobile-photo-booth"
      canonical="https://virtualphotobooth.online/mobile-photo-booth"
      h1="Mobile-Friendly Virtual Photo Booth"
      intro="Capture online photo strips and event photos directly from your smartphone browser using a mobile-friendly virtual photo booth optimized for instant sharing and easy participation. Virtual Photo Booth is built mobile-first — the camera fills your full screen, the shutter button sits at thumb reach, and photos save directly to your iPhone or Android gallery through the native share sheet. No app download, no account, no friction."
      features={[
        "Full-screen camera viewfinder optimized for mobile",
        "Shutter button positioned for easy one-hand use",
        "Front camera selfie mode with mirror toggle",
        "Wide angle simulation, Normal, and 2x zoom modes",
        "Switch between front and rear camera instantly",
        "Save photos directly to iPhone camera roll via share sheet",
        "Save to Android gallery via Web Share API",
        "Tap-to-drag stickers and text on mobile touchscreen",
        "iOS safe area support — works with notch and home bar",
        "Installable as PWA — add to iPhone or Android home screen",
      ]}
      faqs={[
        { q: "Does Virtual Photo Booth work on iPhone?", a: "Yes. Virtual Photo Booth is fully optimized for iPhone Safari. The camera, stickers, text, and download features all work natively on iOS without any app download." },
        { q: "How do I save my photo strip to my iPhone camera roll?", a: "Tap Save Image on the result page. On iPhone, the native iOS share sheet appears — tap Save Image to add it directly to your camera roll." },
        { q: "Does Virtual Photo Booth work on Android?", a: "Yes. Virtual Photo Booth works on all modern Android browsers. On Android, tapping Save Image uses the Web Share API to save directly to your gallery." },
        { q: "Can I install Virtual Photo Booth on my phone home screen?", a: "Yes. Virtual Photo Booth supports PWA installation. On iPhone, tap Share in Safari and select Add to Home Screen. On Android, your browser will prompt you to install it automatically." },
        { q: "Is the mobile photo booth touch-optimized?", a: "Yes. All interactive elements — sticker placement, text dragging, slider controls, and camera mode switching — are designed for touch interaction with minimum 44px tap targets." },
      ]}
    />
  );
}
