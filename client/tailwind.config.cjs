/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        // Simple wood gradient
        'dark-wood': "linear-gradient(to bottom, #3a1e10, #2c1810)",
        // Just a parchment color, no image. If you need an image, ensure it's in /public and accessible.
        'parchment': "linear-gradient(to bottom, #f4e4bc, #f0d8a8)"
      },
      keyframes: {
        candleFlicker: {
          '0%, 100%': { filter: 'brightness(1)', opacity: '1' },
          '40%': { filter: 'brightness(1.2)', opacity: '0.9' },
          '60%': { filter: 'brightness(0.8)', opacity: '0.95' },
          '80%': { filter: 'brightness(1.1)', opacity: '1' },
        }
      },
      animation: {
        candleFlicker: 'candleFlicker 2s infinite ease-in-out',
      }
    }
  },
  plugins: []
};
