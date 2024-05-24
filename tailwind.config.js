/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px 0px 10px 0px rgb(0 0 0 / 100%)',
      },
      colors: {
        primary: '#0c4a6e',
      },
    },
  },
  plugins: [],
};
