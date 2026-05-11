import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Online Photo Strip Maker | Free Virtual Photo Strip Creator",
  description: "Create customizable digital photo strips online using a free browser-based photo strip maker. Choose layouts, filters, stickers, and frames. Instant download.",
  alternates: { canonical: "https://virtualphotobooth.online/online-photo-strip-maker" },
  openGraph: {
    title: "Online Photo Strip Maker | Free Virtual Photo Strip Creator",
    description: "Create digital photo strips online with filters, stickers, and frames. Free and instant.",
    url: "https://virtualphotobooth.online/online-photo-strip-maker",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="online-photo-strip-maker"
      canonical="https://virtualphotobooth.online/online-photo-strip-maker"
      h1="Online Photo Strip Maker"
      intro="Create aesthetic online photo strips instantly using a browser-based virtual photo strip maker. Virtual Photo Booth lets you capture 1, 2, 3, 4, or 6-photo strips with professional filters, custom frames, drag-and-drop stickers, and personalized text. Download your finished photo strip as a high-quality PNG or save it directly to your phone gallery — no account or app required."
      features={[
        "1, 2, 3, 4, and 6-photo strip layouts",
        "9 professional filters — B&W, Sepia, Vintage, Lo-Fi, Film Burn, and more",
        "Custom border width — thin, medium, or thick",
        "Custom frame upload — use your PNG as a decorative border",
        "12 preset frame templates — rosegold, neon, polaroid, film, lace, and more",
        "Drag-and-drop stickers from 6 sticker packs",
        "Add custom text with 12 font styles and color picker",
        "Date stamp option",
        "High-quality PNG download or save to phone gallery",
        "Print in wallet, strip, 3R, 4R, or 4×6 sizes",
      ]}
      faqs={[
        { q: "What is an online photo strip maker?", a: "An online photo strip maker is a browser-based tool that lets you take multiple photos and arrange them into a vertical or horizontal strip — just like a real photo booth machine." },
        { q: "How many photos can I put in one strip?", a: "Virtual Photo Booth supports 1, 2, 3, 4, and 6-photo layouts. Each layout can be customized with filters, borders, stickers, and frames." },
        { q: "Can I upload my own photos to the photo strip maker?", a: "Yes. Virtual Photo Booth includes an upload mode that lets you use photos from your camera roll instead of taking new ones with your device camera." },
        { q: "What file format does the photo strip download in?", a: "Photo strips download as high-quality PNG files. You can also save directly to your iPhone or Android gallery through the native share sheet." },
        { q: "Can I print my photo strip?", a: "Yes. Virtual Photo Booth includes a print mode with wallet, strip, 3R, 4R, and 4×6 size options optimized for home and professional printing." },
      ]}
    />
  );
}
