// apps/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Scan all files in the `app` directory for class names
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Scan all files in the `components` directory for class names
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}