/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1A1A1A', // Logo's dark color
          light: '#FFFFFF',
          hover: {
            delete: '#EF4444', // Red hover for delete actions
            confirm: '#3B82F6', // Blue hover for confirmations
          },
        },
      },
    },
  },
  plugins: [],
};