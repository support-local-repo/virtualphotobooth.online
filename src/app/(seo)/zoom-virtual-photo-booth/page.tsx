import { Metadata } from "next";
import SeoPage from "@/modules/landing/SeoPage";

export const metadata: Metadata = {
  title: "Zoom Virtual Photo Booth | Online Event Photo Booth for Meetings",
  description: "Use a virtual photo booth for Zoom meetings, online parties, webinars, and remote events directly from your browser. No download or account needed.",
  alternates: { canonical: "https://virtualphotobooth.online/zoom-virtual-photo-booth" },
  openGraph: {
    title: "Zoom Virtual Photo Booth | Online Event Photo Booth for Meetings",
    description: "Virtual photo booth for Zoom meetings and online events. Free, browser-based.",
    url: "https://virtualphotobooth.online/zoom-virtual-photo-booth",
    images: [{ url: "https://virtualphotobooth.online/og-image.png" }],
  },
};

export default function Page() {
  return (
    <SeoPage
      slug="zoom-virtual-photo-booth"
      canonical="https://virtualphotobooth.online/zoom-virtual-photo-booth"
      h1="Zoom Virtual Photo Booth"
      intro="Create virtual event photos and digital photo strips during Zoom meetings, webinars, online parties, and remote corporate events using a browser-based virtual photo booth. Participants open Virtual Photo Booth in a separate browser tab, capture their photo strips during or after the event, and share instantly — no Zoom plugin, no download, and no account required. Perfect for virtual team building, online celebrations, remote graduations, and digital event activations."
      features={[
        "Opens in any browser tab alongside Zoom, Teams, or Meet",
        "No Zoom plugin or integration required",
        "Participants join from any device — laptop, phone, or tablet",
        "Corporate and event frame templates available",
        "Upload branded event frames as custom PNG overlays",
        "Add event name, date, and custom text to every strip",
        "Share photo strips via link, email, or social media instantly",
        "B&W, Vintage, and professional filter options",
        "100% private — photos processed locally on each device",
        "Free for all participants — no per-user cost",
      ]}
      faqs={[
        { q: "How do I use Virtual Photo Booth during a Zoom meeting?", a: "Share the link virtualphotobooth.online with your Zoom participants in the chat. Each participant opens it in a new browser tab, takes their photo strip, and downloads or shares it — all while staying on the Zoom call." },
        { q: "Does Virtual Photo Booth work as a Zoom plugin?", a: "No plugin is required. Virtual Photo Booth runs as a standalone browser tab that works alongside any video conferencing platform including Zoom, Microsoft Teams, Google Meet, and Webex." },
        { q: "Can I add my company logo to the photo strips?", a: "Yes. Upload your company logo or branded event frame as a custom PNG overlay. All participant photos will include your branding automatically." },
        { q: "Is Virtual Photo Booth suitable for corporate events?", a: "Yes. Virtual Photo Booth is used for virtual team building, online conferences, remote graduations, digital award ceremonies, and corporate celebrations." },
      ]}
    />
  );
}
