/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        urbanist: [
          "Urbanist",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "SimHei",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          500: "#335ef7",
        },
        greyscale: {
          50: "#fafafa",
          200: "#eeeeee",
          300: "#e0e0e0",
          500: "#9e9e9e",
          700: "#616161",
          900: "#212121",
        },
        button: {
          disabled: "#4360c9",
          shadow: "4px 8px 24px rgba(51,94,247,0.25)",
        },
        transparentBlue: "rgba(51,94,247,0.08)",
      },
      borderRadius: {
        16: "16px",
        100: "100px",
        1000: "1000px",
        card: "16px",
        input: "16px",
      },
    },
  },
  plugins: [],
};