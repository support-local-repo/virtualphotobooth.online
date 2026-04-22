export type PhotoTemplate = {
  id:       string;
  label:    string;
  category: string;
  icon:     string;
  url:      string | null;
};

export const PHOTO_TEMPLATES: PhotoTemplate[] = [
  { id: "none",       label: "None",       category: "plain",     icon: "✕",  url: null },
  { id: "wedding",    label: "Wedding",    category: "event",     icon: "💍", url: "/templates/wedding.png" },
  { id: "birthday",   label: "Birthday",   category: "event",     icon: "🎂", url: "/templates/birthday.png" },
  { id: "graduation", label: "Graduation", category: "event",     icon: "🎓", url: "/templates/graduation.png" },
  { id: "hearts",     label: "Hearts",     category: "aesthetic", icon: "💖", url: "/templates/hearts.png" },
  { id: "stars",      label: "Stars",      category: "aesthetic", icon: "✨", url: "/templates/stars.png" },
  { id: "floral",     label: "Floral",     category: "aesthetic", icon: "🌸", url: "/templates/floral.png" },
  { id: "custom",     label: "Upload Own", category: "custom",    icon: "⬆️", url: null },
];
