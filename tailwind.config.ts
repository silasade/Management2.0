import type { Config } from "tailwindcss";
export default {
  content: [
    
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#d4a373", // base
          900: "#e0b88f", // lighter tints
          800: "#edcba8",
          700: "#f9dfc2",
          600: "#b8895f", // darker shades
          500: "#996f4a",
          400: "#7a573a",
          300: "#c2a285", // muted
          200: "#a88c73",
          100: "#8f7862",
        },
        neutral: {
          100: "#d4c373",
          200: "#d48473",
          300: "#73d49d", // fixed duplicate key
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
