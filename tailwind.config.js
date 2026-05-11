/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Lora", "ui-serif", "Georgia"],
        mono: ["JetBrains Mono", "ui-monospace"],
      },
      colors: {
        page: {
          bg: "#0e0a1f",
          panel: "#15102b",
          ink: "#ece4ff",
          mute: "#7a72a8",
        },
      },
    },
  },
  plugins: [],
};
