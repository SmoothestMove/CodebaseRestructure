/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design System - using CSS variables for theming
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        accent: {
          DEFAULT: 'var(--primary-accent)',
          hover: 'var(--primary-accent-hover)',
          muted: 'var(--primary-accent-muted)',
        },
        text: {
          main: 'var(--text-main)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          muted: 'var(--border-muted)',
        },
        // Semantic colors
        success: 'var(--semantic-success)',
        warning: 'var(--semantic-warning)',
        danger: 'var(--semantic-error)',
        info: 'var(--semantic-info)',
        // Priority badges
        priority: {
          high: 'var(--priority-high)',
          medium: 'var(--priority-medium)',
          low: 'var(--priority-low)',
        },
        // Brand colors (preserved)
        brand: {
          primary: 'var(--brand-primary)',
          tertiary: 'var(--brand-tertiary)',
          accent: 'var(--brand-accent)',
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'safe': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'sm': '4px',
        'md': '8px',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      fontFamily: {
        display: ['Nunito', 'Nunito Sans', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'md': '28rem', // 448px - mobile app container
      },
      minHeight: {
        'screen-safe': 'max(884px, 100dvh)',
      },
    },
  },
  plugins: [],
}

