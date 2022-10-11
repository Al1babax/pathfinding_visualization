/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "50": "repeat(50, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        "50": "repeat(50, minmax(0, 1fr))",
        "25": "repeat(25, minmax(0, 1fr))",
        "20": "repeat(20, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "10": "repeat(10, minmax(0, 1fr))",
      },
    },
    plugins: [],
  },
}
