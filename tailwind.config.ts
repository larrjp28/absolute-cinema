import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ab: {
          primary: "#080B14",
          secondary: "#0F1724",
          card: "#151D2E",
          "card-hover": "#1A2540",
          accent: "#E50914",
          "accent-dark": "#CC0812",
          indigo: "#6366F1",
          text: "#F1F5F9",
          "text-secondary": "#94A3B8",
          "text-muted": "#64748B",
          border: "#1E293B",
          star: "#FBBF24",
          error: "#EF4444",
          surface: "#121829",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
