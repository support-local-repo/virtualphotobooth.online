export type PhotoTemplate = {
  id:       string;
  label:    string;
  category: string;
  icon:     string;
  url:      string | null;
};

export const PHOTO_TEMPLATES: PhotoTemplate[] = [
  { id: "none",             label: "None",           category: "plain",     icon: "✕",  url: null },
  { id: "frame-rosegold",   label: "Rose Gold",      category: "frame",     icon: "🌹", url: "/templates/frame-rosegold.png" },
  { id: "frame-neon",       label: "Neon Party",     category: "frame",     icon: "🎉", url: "/templates/frame-neon.png" },
  { id: "frame-whitegold",  label: "White Gold",     category: "frame",     icon: "✨", url: "/templates/frame-whitegold.png" },
  { id: "frame-film",       label: "Vintage Film",   category: "frame",     icon: "🎞️", url: "/templates/frame-film.png" },
  { id: "blue-hearts",      label: "Blue Hearts",    category: "birthday",  icon: "💙", url: "/templates/blue-hearts.png" },
  { id: "gold-balloon",     label: "Gold Balloon",   category: "birthday",  icon: "🎈", url: "/templates/gold-balloon.png" },
  { id: "pink-quince",      label: "Pink Glam",      category: "event",     icon: "👑", url: "/templates/pink-quinceañera.png" },
  { id: "wedding",          label: "Wedding",        category: "event",     icon: "💍", url: "/templates/wedding.png" },
  { id: "floral",           label: "Floral",         category: "aesthetic", icon: "🌸", url: "/templates/floral.png" },
  { id: "custom",           label: "Upload Own",     category: "custom",    icon: "⬆️", url: null },
];
