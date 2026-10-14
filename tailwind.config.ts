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
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff6305", // Cor de destaque absoluta Belezura News
          600: "#ea5400",
          700: "#c23e00",
          800: "#9a3203",
          900: "#7c2a07",
          950: "#431201",
          primary: "#ff6305",
        },
      },
      fontFamily: {
        recoleta: ["Recoleta", "Georgia", "serif"],
        alleron: ["Alleron", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};

export default config;
