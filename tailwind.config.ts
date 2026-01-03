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
        // Core Palette (Audit Requirements)
        primary: {
          DEFAULT: '#1e3a5f', // mapped to brand-primary
          light: '#2a4d7a',
          dark: '#162b45',
        },
        secondary: {
          DEFAULT: '#708090', // mapped to brand-secondary
          light: '#8d9ba8',
          dark: '#5a6875',
        },
        accent: {
          DEFAULT: '#e1a95f', // mapped to brand-accent
          light: '#e8be82',
          dark: '#ca9854',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        success: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dark: '#16a34a',
        },
        text: {
          main: '#0f172a', // Slate 900
          subtle: '#64748b', // Slate 500
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-danger': '#ffffff',
        },
        background: {
          main: '#ffffff',
          alt: '#f8fafc', // Slate 50
        },
        
        // Legacy Brand Colors (Keeping for backward compatibility)
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

        // Dark-specific helpers (Audit: Ensure these align with tokens)
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
      spacing: {
        // Audit Recommendation: Strict Spacing Scale
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        // Audit Recommendation: Standard Radii
        sm: '0.125rem', // 2px
        md: '0.375rem', // 6px
        lg: '0.5rem',   // 8px
        xl: '0.75rem',  // 12px
      },
      boxShadow: {
        // Audit Recommendation: Standard Shadows
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
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

