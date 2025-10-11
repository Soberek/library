/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'golden-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 8px rgb(251 191 36 / 0.8))',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 16px rgb(251 191 36 / 1)) drop-shadow(0 0 24px rgb(251 191 36 / 0.6))',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'golden-pulse': 'golden-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
