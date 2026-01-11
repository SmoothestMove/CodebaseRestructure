import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A5F", // Structure
          action: "#FF7E00",  // Primary Action (Orange)
        },
        secondary: "#708090", // Supporting text/icons
        accent: "#E1A95F",    // Badges/highlights
        neutral: {
          bg: "#D3D3D3",
          surface: "#FFFFFF",
          text: "#1F1F1F",
          border: "#C4C4C4",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
