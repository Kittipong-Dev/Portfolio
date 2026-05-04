import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#132238",
        muted: "#5b667a",
        accent: "#243b80",
        soft: "#f5f7fb"
      },
      boxShadow: {
        card: "0 18px 45px rgba(25, 45, 82, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
