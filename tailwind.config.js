/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ss-dark-blue': '#0C1B33', // prussian blue
        'ss-black': '#030A11', // ink black
        'ss-dark-gray': '#303436', // gunmetal
        'ss-light-gray': '#E5E7EB', // alice blue
        'ss-pale-blue': '#E5FCFF', // azue mist
        'ss-white': '#FCFFFF',
      },
      fontFamily: {
        'stack-sans-headline': ['Stack Sans Headline', 'system-ui', 'sans-serif'],
        'bricolage-grotesque': ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
