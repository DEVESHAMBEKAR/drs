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
        // ═══════════════════════════════════════════════════════════════
        // LEGACY COLORS (Keep for existing components)
        // ═══════════════════════════════════════════════════════════════

        // The Backgrounds (Legacy)
        'luxury-black': '#050505',   // Main page background (Deepest Black)
        'luxury-card': '#121212',    // Product cards (Slightly lighter)
        'luxury-border': '#27272a',  // Subtle borders

        // The Text (Legacy)
        'text-main': '#ededed',      // Primary text (Soft White)
        'text-muted': '#a1a1aa',     // Secondary text (Gray)

        // The 'Glow' Accents (Legacy)
        'neon-gold': '#ffffff',      // For Monochrome white accents
        'neon-blue': '#38bdf8',      // For Cool White/Tech accents
        'brand-white': '#ffffff',    // High contrast buttons

        // ═══════════════════════════════════════════════════════════════
        // NEW DEEPROOT STUDIOS BRAND COLORS
        // ═══════════════════════════════════════════════════════════════

        // Primary Palette
        'obsidian': '#0E0E0E',       // Primary dark background
        'charcoal': '#1C1C1C',       // Secondary dark / cards
        'ash': '#F5F5F5',            // Primary light text / backgrounds
        'stone': '#8E8E8E',          // Muted text / borders

        // Accent Colors
        'cold-silver': '#BFC2C7',    // Subtle metallic accent
        'deep-walnut': '#4A3527',    // Warm wood accent (brand material)
      },
      fontFamily: {
        // Legacy Fonts
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['Inter', 'Geist', 'sans-serif'],

        // New Brand Fonts
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
