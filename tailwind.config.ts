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
        primary: { DEFAULT: "#0A0A0A", dark: "#000000" },
        secondary: { DEFAULT: "#E5E5E7" },
        accent: { DEFAULT: "#8E8E93" },
        background: { DEFAULT: "#FAFAF8" },
        "surface": { DEFAULT: "#F5F5F3" },
        "text": { primary: "#0A0A0A", secondary: "#8E8E93" },
        "deep-navy": "#0A1628",
        "navy-light": "#1E3A5F",
        "warm-ivory": "#FAFAF8",
        "cool-ivory": "#F5F5F3",
        "light-gray": "#E5E5E7",
        "mid-gray": "#8E8E93",
        "dark-gray": "#1C1C1E",
        "charcoal": "#2C2C2E",
        "warm-black": "#1A1A1A",
        "soft-white": "#FEFEFC",
        "error": "#B91C1C",
        "success": "#2D6A4F",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-navy": "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
        "gradient-warm": "linear-gradient(180deg, #FAFAF8 0%, #F5F5F3 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
      },
      animation: {
        "fadeIn": "fadeIn 0.8s ease-out forwards",
        "fadeUp": "fadeUp 1s ease-out forwards",
        "fadeInLeft": "fadeInLeft 0.8s ease-out forwards",
        "fadeInRight": "fadeInRight 0.8s ease-out forwards",
        "imageReveal": "imageReveal 1.2s cubic-bezier(0.77, 0, 0.18, 1) forwards",
        "cartPulse": "cartPulse 0.3s ease-out",
        "kenBurns": "kenBurns 8s ease-in-out forwards",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scaleIn": "scaleIn 0.6s ease-out forwards",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        imageReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        cartPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(-0.5%, -0.5%)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
