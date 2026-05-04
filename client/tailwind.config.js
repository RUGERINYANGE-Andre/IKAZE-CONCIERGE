// client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#1BA19C',
          tealLight: '#5BC4BF',
          tealDark: '#158B87',
        },
        neutral: {
          white: '#FFFFFF',
          offWhite: '#F9FAFB',
          lightGray: '#E5E7EB',
          gray: '#9CA3AF',
          darkGray: '#4B5563',
          navy: '#1F2937',
          darkNavy: '#111827',
        },
        status: {
          pending: '#F59E0B',
          inProgress: '#3B82F6',
          completed: '#10B981',
          cancelled: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}