import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Birthday Photo Booth Online | Free Virtual Birthday Photo Strips",
  description: "Create fun birthday photo strips online using a free virtual birthday photo booth. Works on any device, no app or account needed. Perfect for parties.",
  alternates: { canonical: "https://virtualphotobooth.online/birthday-photo-booth" },
  openGraph: {
    title: "Birthday Photo Booth Online | Free Virtual Birthday Photo Strips",
    description: "Create fun birthday photo strips online. Free, no app required.",
    url: "https://virtualphotobooth.online/birthday-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="birthday-photo-booth"
      canonical="https://virtualphotobooth.online/birthday-photo-booth"
      h1="Birthday Virtual Photo Booth"
      intro="Capture birthday memories instantly using an online virtual photo booth designed for parties, celebrations, and social sharing. Virtual Photo Booth lets you and your guests create downloadable digital photo strips directly from any browser — add birthday stickers, colorful frames, custom text, and fun filters to make every strip unique. Perfect for kids parties, teen birthdays, sweet sixteen celebrations, and quinceañera events."
      features={[
        "Birthday and celebration frame templates",
        "Fun sticker packs — balloons, stars, hearts, and party emojis",
        "Add custom birthday text in 12 decorative font styles",
        "Bright colorful filters perfect for party photos",
        "1, 2, 3, and 4-photo strip layouts",
        "Upload your own birthday party frame PNG",
        "Date stamp — automatically add the birthday date",
        "Save to phone gallery and share instantly to Instagram or TikTok",
        "Print in multiple sizes for party favor keepsakes",
        "100% free — no account required",
      ]}
      faqs={[
        { q: "Can I use Virtual Photo Booth at a birthday party?", a: "Yes. Set up Virtual Photo Booth on a tablet, laptop, or phone at your birthday party. Guests can take photo strips instantly with no app download required." },
        { q: "Are there birthday stickers and frames available?", a: "Yes. Virtual Photo Booth includes celebration sticker packs and frame templates perfect for birthday parties. You can also upload your own custom birthday frame." },
        { q: "Can kids use the online birthday photo booth?", a: "Yes. Virtual Photo Booth is designed to be simple and fun for all ages. The interface is intuitive enough for children to use independently." },
        { q: "Can I share birthday photo strips on TikTok or Instagram?", a: "Yes. Download your photo strip and share it directly to TikTok, Instagram, Snapchat, or any social platform. On iPhone the native share sheet lets you save directly to your camera roll." },
      ]}
    />
  );
}
