/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'grow-stem': {
          '0%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.1)' },
          '100%': { transform: 'scaleY(0.3)' },
        },
        'wave-leaf': {
          '0%': { transform: 'rotate(-10deg) scale(0.5)' },
          '50%': { transform: 'rotate(15deg) scale(1.1)' },
          '100%': { transform: 'rotate(-10deg) scale(0.5)' },
        }
      },
      animation: {
        'grow-stem': 'grow-stem 2s ease-in-out infinite',
        'wave-leaf': 'wave-leaf 2s ease-in-out infinite',
        'wave-leaf-delay': 'wave-leaf 2s ease-in-out infinite 0.5s',
      }
    },
  },
  plugins: [],
} 