/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.{edge,js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'nebula': "#5468ff"
      },
      fontFamily:{
        'body' : 'Barlow'
      }
    },
  },
  plugins: [],
}

