import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gemini: {
          bg: "#f0f4f9",
          sidebar: "#f0f4f9",
          inputBg: "#f0f4f9",
          active: "#e9eef6",
          hover: "#dde3ea",
        },
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;