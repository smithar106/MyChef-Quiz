import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        accent: "#FF6B35",
        muted: "#999999",
        card: "rgba(255,255,255,0.05)",
        "card-border": "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
