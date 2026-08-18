import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Brand tokens (mapped to CSS variables in globals.css; theme-aware)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // Warm gold scale — the doppi accent (var-driven so it flips per theme)
        gold: {
          50: "hsl(var(--g-50) / <alpha-value>)",
          100: "hsl(var(--g-100) / <alpha-value>)",
          200: "hsl(var(--g-200) / <alpha-value>)",
          300: "hsl(var(--g-300) / <alpha-value>)",
          400: "hsl(var(--g-400) / <alpha-value>)",
          500: "hsl(var(--g-500) / <alpha-value>)",
          600: "hsl(var(--g-600) / <alpha-value>)",
          700: "hsl(var(--g-700) / <alpha-value>)",
          800: "hsl(var(--g-800) / <alpha-value>)",
          900: "hsl(var(--g-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(230,169,44,0.25), 0 8px 40px -8px rgba(230,169,44,0.35)",
        "gold-sm": "0 0 24px -6px rgba(230,169,44,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F1D488 0%, #E6A92C 45%, #C98E1E 100%)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(-4%, -2%, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, 3%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-3%, 5%, 0) scale(0.96)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 32s linear infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "aurora-drift": "aurora-drift 26s ease-in-out infinite",
        "spin-slow": "spin-slow 90s linear infinite",
        breathe: "breathe 7s ease-in-out infinite",
      },
    },
  },
  plugins: [
    ({ addVariant }: { addVariant: (name: string, def: string) => void }) => {
      addVariant("light", ".light &");
    },
  ],
};

export default config;
