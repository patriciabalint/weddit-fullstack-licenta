/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        neacademia: ['Neacademia', 'serif'],
        script: ['English Script', 'cursive'],
      },
      colors: {
        primary: '#576B7F',
        accent: '#D5BA8B',
        muted: '#727A82',
      },
    },
  },
  plugins: [],
};
