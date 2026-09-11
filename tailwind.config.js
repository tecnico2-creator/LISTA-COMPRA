/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F4',
        blush: {
          50: '#FDF3F1',
          100: '#F9E4DF',
          200: '#F4CFC7',
          300: '#EEB6AA',
          400: '#E49C8C',
        },
        mint: {
          50: '#EFFAF5',
          100: '#D9F2E6',
          200: '#BCE7D4',
          300: '#9BDABF',
          400: '#78C9A8',
        },
        sky: {
          50: '#EFF6FB',
          100: '#D9EBF6',
          200: '#BADCEE',
          300: '#98CAE3',
          400: '#77B6D6',
        },
        lavender: {
          50: '#F4F1FA',
          100: '#E5DEF2',
          200: '#D2C5E9',
          300: '#BDA9DD',
          400: '#A88DD0',
        },
        sand: {
          50: '#FBF6EC',
          100: '#F3E7CC',
          200: '#E9D4A3',
          300: '#DEC07A',
        },
        ink: '#3E3A38',
        slate: '#6E6864',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 10px 0 rgba(62, 58, 56, 0.06), 0 1px 2px 0 rgba(62, 58, 56, 0.04)',
        card: '0 4px 16px 0 rgba(62, 58, 56, 0.08)',
      },
    },
  },
  plugins: [],
}
