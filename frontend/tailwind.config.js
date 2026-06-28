/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#dbeafe',
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        danger: '#ef4444',
        presentiel: {
          bg: '#dcfce7',
          text: '#166534',
          darkBg: '#064e3b',
          darkText: '#34d399',
          border: '#6ee7b7',
          accent: '#059669',
          gradFrom: '#ecfdf5',
          gradTo: '#d1fae5',
          darkGradFrom: '#064e3b',
          darkGradTo: '#065f46',
        },
        distanciel: {
          bg: '#c8e7ec',
          text: '#07515e',
          darkBg: '#1e3a8a',
          darkText: '#60a5fa',
          border: '#407e89',
          accent: '#033d47',
          darkGradFrom: '#1e3a8a',
          darkGradTo: '#1d4ed8',
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        slideUp: 'slideUp 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
}
