/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#f8fafc",
          dark: "#020617",
        },
        glass: {
          light: "rgba(255,255,255,0.72)",
          dark: "rgba(15,23,42,0.72)",
        },
        accent: {
          DEFAULT: "#2563eb",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
