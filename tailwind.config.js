/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        // Calm & Mindful palette
        cream: {
          DEFAULT: '#F7F3ED',
          50: '#FDFBF8',
          100: '#FAF6F0',
          200: '#F2EBE0',
        },
        ink: {
          DEFAULT: '#33302B',
          muted: '#8A857C',
          soft: '#A8A299',
        },
        sage: {
          50: '#EEF3EE',
          100: '#E0EAE1',
          200: '#C5D6C7',
          400: '#8FAE97',
          500: '#7C9885',
          600: '#647D6E',
          700: '#4F6357',
        },
        clay: {
          DEFAULT: '#C98A6E',
          500: '#C98A6E',
          600: '#B5775B',
        },
        line: '#EAE3D8',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        calm: '0 4px 20px -6px rgba(80, 70, 55, 0.12)',
        'calm-lg': '0 12px 40px -10px rgba(80, 70, 55, 0.18)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
