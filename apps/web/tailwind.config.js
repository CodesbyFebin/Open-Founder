/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  // Preflight off so existing module pages keep their globals.css styling.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
