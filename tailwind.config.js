/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#603a2e',
          50: '#faf3e0',
          100: '#f5e6d3',
          200: '#e8d5c4',
          300: '#d4a574',
          400: '#c2a33d',
          500: '#603a2e',
          600: '#4d2e24',
          700: '#3a2219',
          800: '#2d1a13',
          900: '#1a0f0b',
        },
        accent: {
          DEFAULT: '#c2a33d',
          light: '#f5e6d3',
          dark: '#a67c2a',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Alata', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

