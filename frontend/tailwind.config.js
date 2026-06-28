// Tailwind is loaded via CDN in index.html.
// Config is declared inline in index.html inside <script>tailwind.config = {...}</script>
// This file is kept for architecture compliance and future migration to PostCSS build.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
