/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          light: "#F8F9F8",
          DEFAULT: "#B2C5B2",
          dark: "#8DA38D",
        },
        charcoal: "#2C3E50",
      },
    },
  },
  plugins: [],
};

