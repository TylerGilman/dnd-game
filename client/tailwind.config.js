/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      backgroundImage: {
        'dark-wood': "linear-gradient(to bottom, #3a1e10, #2c1810)",
        'parchment': "url('/torn-parchment.png')"
      },
      keyframes: {
        candleFlicker: {
          '0%, 100%': { filter: 'brightness(1)', opacity: '1' },
          '40%': { filter: 'brightness(1.2)', opacity: '0.9' },
          '60%': { filter: 'brightness(0.8)', opacity: '0.95' },
          '80%': { filter: 'brightness(1.1)', opacity: '1' },
        },
        // If you want to keep any of your original animations like fall-normal, twinkle, etc., leave them here.
        // Otherwise, remove them if not needed.
        'fall-normal': {
          '0%': { 
            transform: 'translateY(-10%) translateX(-10%)', 
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(110%) translateX(10%)', 
            opacity: 0 
          }
        },
        'fall-slow': {
          '0%': { 
            transform: 'translateY(-10%) translateX(10%)', 
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(110%) translateX(-10%)', 
            opacity: 0 
          }
        },
        'fall-slower': {
          '0%': { 
            transform: 'translateY(-10%) translateX(0%)', 
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(110%) translateX(10%)', 
            opacity: 0 
          }
        },
        'twinkle': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 }
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      },
      animation: {
        candleFlicker: 'candleFlicker 2s infinite ease-in-out',
        'fall-normal': 'fall-normal 10s linear infinite',
        'fall-slow': 'fall-slow 15s linear infinite',
        'fall-slower': 'fall-slower 20s linear infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
