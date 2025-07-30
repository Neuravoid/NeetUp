/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#a6c7ff',
          300: '#7baaf7',
          400: '#5491f5',
          500: '#1a73e8',
          600: '#1765cc',
          700: '#1356b1',
          800: '#0f4995',
          900: '#0b3b79',
        },
        accent: {
          DEFAULT: '#34a853',
          50: '#e6f4ea',
          100: '#ceead6',
          200: '#9ddcac',
          300: '#6dc982',
          400: '#4caf50',
          500: '#34a853',
          600: '#2d964a',
          700: '#27843f',
          800: '#207235',
          900: '#195f2c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-border': 'pulse-border 2s infinite',
        'pulse-subtle': 'pulse-subtle 3s infinite',
      },
      keyframes: {
        'pulse-border': {
          '0%': { 
            borderColor: 'rgba(99, 102, 241, 0.3)',
            boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.3)'
          },
          '50%': { 
            borderColor: 'rgba(99, 102, 241, 0.6)',
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)'
          },
          '100%': { 
            borderColor: 'rgba(99, 102, 241, 0.3)',
            boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.3)'
          },
        },
        'pulse-subtle': {
          '0%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.1)' },
          '50%': { boxShadow: '0 0 10px 0px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.1)' },
        },
      },
    },
  },
  plugins: [],
}
