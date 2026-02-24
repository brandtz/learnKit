/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1e293b',
          accent: '#047857',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: { color: '#047857' }
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
