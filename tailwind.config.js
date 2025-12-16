/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cabinet: {
          dark: '#0b1021',
          glow: '#1c2a52'
        }
      },
      boxShadow: {
        neon: '0 0 20px rgba(56, 189, 248, 0.35)',
        win: '0 0 30px rgba(74, 222, 128, 0.55)'
      }
    }
  },
  plugins: []
};
