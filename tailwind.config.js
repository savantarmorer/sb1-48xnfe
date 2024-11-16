/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            50: '#f0f9fa',
            100: '#d0f1f5',
            200: '#a0e4eb',
            300: '#70d7e1',
            400: '#40cad7',
            500: '#20b2c1',
            600: '#108799',
            700: '#086577',
            800: '#044355',
            900: '#022133'
          },
          copper: {
            50: '#fdf6f0',
            100: '#fae8d8',
            200: '#f5d0b0',
            300: '#f0b888',
            400: '#eb9f60',
            500: '#e68738',
            600: '#cc6f20',
            700: '#a65718',
            800: '#803f10',
            900: '#5a2708'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
};