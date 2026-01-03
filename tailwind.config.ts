import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          light: '#76b3f7',
          dark: '#357abd',
        },
        secondary: {
          DEFAULT: '#50E3C2',
          dark: '#3cbca0',
        },
        accent: {
          DEFAULT: '#F5A623',
          dark: '#d48e1b',
        },
        danger: {
          DEFAULT: '#EF4444', // red-500
          dark: '#DC2626', // red-600
        },
        success: {
          DEFAULT: '#10B981', // green-500
          dark: '#059669', // green-600
        },
        text: {
          main: '#333333',
          subtle: '#666666',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        },
        background: {
          main: '#FFFFFF',
          alt: '#F4F4F4',
        },
        // Mapping existing brand colors to new tokens (or keeping them if used extensively)
        brand: {
          primary: '#4A90E2',
          secondary: '#64748b', // slate-500
          tertiary: '#f97316', // orange-500
          'tertiary-dark': '#ea580c', // orange-600
        }
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter is used or preferred
        heading: ['Outfit', 'sans-serif'], // Assuming Outfit for headings
      }
    },
  },
  plugins: [],
} satisfies Config
