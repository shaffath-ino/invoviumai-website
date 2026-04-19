/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#E63946', // Crimson Red
        secondary: '#990000', // Deep Maroon
        tertiary: '#EF4444', // Lighter Red Accent
        dark: '#0a0a0a', // Deep neutral dark
        light: '#FAFAFA', // Clean white-gray
        cardDark: 'rgba(255, 255, 255, 0.03)', // Elegant dark glass
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
