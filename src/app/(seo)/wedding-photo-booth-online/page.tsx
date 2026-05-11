import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Wedding Photo Booth Online | Free Digital Wedding Photo Strips",
  description: "Create elegant wedding photo strips online using a free browser-based wedding virtual photo booth. No app or account required. Works on any device.",
  alternates: { canonical: "https://virtualphotobooth.online/wedding-photo-booth-online" },
  openGraph: {
    title: "Wedding Photo Booth Online | Free Digital Wedding Photo Strips",
    description: "Create elegant wedding photo strips online. Free, no app required.",
    url: "https://virtualphotobooth.online/wedding-photo-booth-online",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="wedding-photo-booth-online"
      canonical="https://virtualphotobooth.online/wedding-photo-booth-online"
      h1="Wedding Virtual Photo Booth Online"
      intro="Create beautiful wedding event photo strips online using a browser-based virtual wedding photo booth. Guests can capture photos instantly from desktop or mobile devices — no app installation or account required. Choose from elegant frame templates including rosegold, white gold, lace, arch, and floral designs. Add your wedding date, custom text, and personalized decorations to create memorable keepsakes for every guest."
      features={[
        "Elegant wedding frame templates — rosegold, whitegold, lace, arch, floral",
        "Upload your own custom wedding frame PNG",
        "Add wedding date stamp automatically",
        "Custom text — add couple names, wedding date, or venue",
        "12 decorative font styles for personalized strips",
        "Soft filters — B&W, Sepia, and Vintage for timeless looks",
        "1, 2, 3, and 4-photo strip layouts",
        "Print in wallet, strip, 4R, and 4×6 sizes for guest favors",
        "Save to phone gallery — guests keep their own copy instantly",
        "100% private — photos never uploaded to any server",
      ]}
      faqs={[
        { q: "Can I use Virtual Photo Booth at a wedding?", a: "Yes. Virtual Photo Booth works on any device browser — set up a tablet or laptop at your wedding venue and guests can take their own photo strips as keepsakes without any app installation." },
        { q: "Are there wedding-specific frames available?", a: "Yes. Virtual Photo Booth includes wedding frame templates including rosegold, white gold, lace, arch, and floral designs. You can also upload your own custom wedding frame PNG." },
        { q: "Can guests print their wedding photo strips?", a: "Yes. Virtual Photo Booth includes a print mode with wallet, strip, 3R, 4R, and 4×6 options — perfect for printing guest favors at home or at a print shop." },
        { q: "Is the wedding photo booth free for all guests?", a: "Yes. Virtual Photo Booth is completely free. Every guest can take, customize, and download their own photo strip at no cost." },
      ]}
    />
  );
}
