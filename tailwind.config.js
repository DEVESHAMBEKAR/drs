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
        // The Backgrounds
        'luxury-black': '#050505',   // Main page background (Deepest Black)
        'luxury-card': '#121212',    // Product cards (Slightly lighter)
        'luxury-border': '#27272a',  // Subtle borders

        // The Text
        'text-main': '#ededed',      // Primary text (Soft White)
        'text-muted': '#a1a1aa',     // Secondary text (Gray)

        // The 'Glow' Accents
        'neon-gold': '#fbbf24',      // For Warm White LED accents
        'neon-blue': '#38bdf8',      // For Cool White/Tech accents
        'brand-white': '#ffffff',    // High contrast buttons
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
