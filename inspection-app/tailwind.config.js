/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // blue-600
        success: '#16a34a', // green-600
        alert: '#d97706',   // amber-500
        error: '#dc2626',   // red-600
        inspected: '#9333ea', // purple-500
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'dark-start': '#0f172a', // slate-900
        'dark-mid': '#1e293b',   // slate-800
        'dark-end': '#0f172a',   // slate-900
      }),
    },
  },
  plugins: [],
}
