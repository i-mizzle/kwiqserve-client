/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        'dark-gray': '#1F2937',
        'light-gray': '#E5E7EB',
        accent: '#F59E0B',
        white: '#FFFFFF',
      },
      fontFamily: {
        'stack-sans-pro': ['Stack Sans Headline', 'system-ui', 'sans-serif'],
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
