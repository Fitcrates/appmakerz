/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        red: '0px 4px 6px rgba(255, 0, 0, 0.5)', // Red shadow
        blue: '0px 4px 6px rgba(0, 0, 255, 0.5)', // Blue shadow
        teal: '0px 4px 6px rgba(0, 128, 128, 0.8)', // Teal shadow
        custom: '0px 10px 15px rgba(150, 0, 178, 0.8)', // Example purple shadow
      },
    },
  },
  plugins: [],
};
