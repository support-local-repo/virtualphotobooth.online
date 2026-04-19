import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Brand color tokens — Virtual Photo Booth
      colors: {
        vpb: {
          // Backgrounds
          bg:        "#fdf4f9",
          surface:   "#fff8fc",
          surface2:  "#ffeef7",

          // Borders
          border:    "rgba(220, 120, 180, 0.15)",
          border2:   "rgba(220, 120, 180, 0.28)",

          // Text
          text:      "#2d1a26",
          text2:     "#7a5068",
          text3:     "#b08898",

          // Brand gradient stops
          pink:      "#ffb3d9",
          lavender:  "#d5b8f5",
          peach:     "#ffd4b8",
          blue:      "#b8dff5",

          // Accent / CTA
          primary:   "#e8399a",
          primaryDim:"rgba(232, 57, 154, 0.12)",
          primaryBdr:"rgba(232, 57, 154, 0.30)",

          // States
          success:   "#3db87a",
          warn:      "#f0a020",
          error:     "#e05858",
        },
      },

      // Font families — all Google Fonts
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        accent:  ["Cormorant Garamond", "Georgia", "serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },

      // Type scale
      fontSize: {
        "hero":  ["clamp(2.5rem, 6vw, 4rem)",    { lineHeight: "1.1" }],
        "h1":    ["clamp(2rem, 4vw, 3rem)",       { lineHeight: "1.15" }],
        "h2":    ["clamp(1.5rem, 3vw, 2.25rem)",  { lineHeight: "1.2" }],
        "h3":    ["1.25rem",                       { lineHeight: "1.3" }],
        "body":  ["0.9375rem",                     { lineHeight: "1.6" }],
        "small": ["0.8125rem",                     { lineHeight: "1.5" }],
        "badge": ["0.625rem",                      { lineHeight: "1" }],
      },

      // Spacing
      spacing: {
        "4.5": "1.125rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
      },

      // Border radius
      borderRadius: {
        "card":  "16px",
        "pill":  "999px",
        "strip": "12px",
      },

      // Animated gradient background
      backgroundImage: {
        "booth-gradient": `
          linear-gradient(
            135deg,
            #ffd6e7 0%,
            #e8d5f5 25%,
            #ffe8d6 50%,
            #d5eaf5 75%,
            #ffd6e7 100%
          )
        `,
      },

      // Keyframes for UI animations
      keyframes: {
        // Gradient pan
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        // Bokeh float
        bokehFloat: {
          "0%, 100%": { transform: "translateY(0px) scale(1)", opacity: "0.4" },
          "50%":      { transform: "translateY(-30px) scale(1.1)", opacity: "0.6" },
        },
        // Countdown pop
        countdownPop: {
          "0%":   { transform: "scale(0.4)", opacity: "0" },
          "60%":  { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Polaroid eject
        polaroidEject: {
          "0%":   { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "40%":  { transform: "translateY(-20px) rotate(-3deg)", opacity: "1" },
          "100%": { transform: "translateY(60px) rotate(2deg)", opacity: "0" },
        },
        // Donation heart pulse
        heartPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.18)" },
        },
        // Toast slide up
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Sticker drop-in
        popIn: {
          "0%":   { transform: "scale(0)", opacity: "0" },
          "70%":  { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Flash on capture
        shutterFlash: {
          "0%":   { opacity: "0" },
          "20%":  { opacity: "0.85" },
          "100%": { opacity: "0" },
        },
      },

      animation: {
        "gradient-shift":  "gradientShift 16s ease infinite",
        "bokeh-float":     "bokehFloat 8s ease-in-out infinite",
        "bokeh-float-2":   "bokehFloat 11s ease-in-out infinite 2s",
        "bokeh-float-3":   "bokehFloat 14s ease-in-out infinite 5s",
        "countdown-pop":   "countdownPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "polaroid-eject":  "polaroidEject 0.7s ease-in forwards",
        "heart-pulse":     "heartPulse 1.6s ease-in-out infinite",
        "slide-up":        "slideUp 0.25s ease",
        "pop-in":          "popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "shutter-flash":   "shutterFlash 0.35s ease",
      },

      // Box shadows — soft, dreamy
      boxShadow: {
        "card":      "0 4px 24px rgba(220, 100, 180, 0.10), 0 1px 4px rgba(220, 100, 180, 0.06)",
        "card-hover":"0 8px 40px rgba(220, 100, 180, 0.18), 0 2px 8px rgba(220, 100, 180, 0.10)",
        "strip":     "0 12px 48px rgba(180, 80, 160, 0.20)",
        "donation":  "0 4px 20px rgba(232, 57, 154, 0.35)",
        "modal":     "0 24px 80px rgba(45, 26, 38, 0.18)",
      },

      // Backdrop blur
      backdropBlur: {
        "xs": "4px",
      },
    },
  },
  plugins: [],
};

export default config;
