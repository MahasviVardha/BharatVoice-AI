/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "Russian Palette" — periwinkle / indigo / coral / magenta / turquoise
        pink: { DEFAULT: "#C0436B", soft: "#F6CFE0" },
        blue: { DEFAULT: "#7B93E0", soft: "#E3E8FA" },
        teal: { DEFAULT: "#4B4A8E", light: "#6F71B5", dark: "#34315F" },
        coral: { DEFAULT: "#E8714A", soft: "#FAD9C8" },
        cream: "#F5D9A0",
        mint: "#4FC7C2",
        lavender: "#D6D7ED",
        ink: "#232A40",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Poppins'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 96, 120, 0.08)",
        card: "0 8px 30px rgba(0, 96, 120, 0.10)",
        lift: "0 16px 40px rgba(0, 96, 120, 0.16)",
        glow: "0 0 0 4px rgba(0, 96, 120, 0.10)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        fadeIn: "fadeIn 0.4s ease-out both",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        scaleIn: "scaleIn 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};
