import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e3a5f',
        'brand-primary-dark': '#162b45',
        'brand-secondary': '#708090',
        'brand-secondary-dark': '#5a6875',
        'brand-tertiary': '#ff7e00',
        'brand-tertiary-dark': '#e67100',
        'brand-accent': '#e1a95f',
        'brand-accent-dark': '#ca9854',
        'brand-light-gray': '#d3d3d3',
        'brand-light-gray-dark': '#bcbcbc',
        // Dark-specific helpers referenced in markup
        'dark-body-bg': '#0f172a',
        'dark-card-bg': '#1e293b',
        'dark-text-primary': '#f8fafc',
        'dark-text-secondary': '#cbd5e1',
        'dark-red-error': '#f87171',
        'dark-green-success': '#4ade80',
        'dark-purple-delivered': '#c084fc',
        'dark-scrollbar-track': '#1e293b',
        'dark-scrollbar-thumb': '#475569',
        'dark-scrollbar-thumb-hover': '#64748b',
      },
      keyframes: {
        'pulse-bg-once': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'var(--tw-bg-green-100, #dcfce7)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scan-line-vertical': {
          '0%, 100%': { top: '0%' },
          '50%': { top: 'calc(100% - 2px)' },
        },
      },
      animation: {
        'pulse-bg-once': 'pulse-bg-once 1.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-out': 'fade-out 0.3s ease-in forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'scan-line': 'scan-line-vertical 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

