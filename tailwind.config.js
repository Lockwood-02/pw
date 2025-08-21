/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0b0f10",
          panel: "#0f1517",
          text: "#d1dee6",
          dim: "#95a1aa",
          accent: "#00ff99",
          warning: "#ffd166",
          error: "#ff6b6b",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        "glow-green":
          "0 0 0 1px rgba(0,255,153,0.15), 0 0 32px rgba(0,255,153,0.06)",
        "glow-amber":
          "0 0 0 1px rgba(255,209,102,0.15), 0 0 32px rgba(255,209,102,0.06)",
        "glow-ice":
          "0 0 0 1px rgba(128,234,255,0.15), 0 0 32px rgba(128,234,255,0.06)",
      },
    },
  },
  plugins: [],
};
