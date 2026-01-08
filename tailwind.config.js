/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-charcoal': '#0a0a0a',
        'soft-black': '#121212',
        'raw-walnut': '#5d4037',
        'antique-brass': '#c0a060',
        'mist': '#e5e5e5',
        'smoke': '#a3a3a3',
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
