/**
 * Design System - Typography
 * Centralized typography tokens for consistent text styling across the application
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },

  // Font sizes (using rem units for accessibility)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Line heights for optimal readability
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text scale presets for consistent hierarchy
  scale: {
    // Display text (hero sections, landing pages)
    display: {
      size: '3.75rem', // 60px
      lineHeight: '1.1',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    
    // Headings
    h1: {
      size: '2.25rem', // 36px
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    h2: {
      size: '1.875rem', // 30px
      lineHeight: '1.25',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h3: {
      size: '1.5rem', // 24px
      lineHeight: '1.3',
      fontWeight: '600',
      letterSpacing: '0em',
    },
    h4: {
      size: '1.25rem', // 20px
      lineHeight: '1.375',
      fontWeight: '600',
      letterSpacing: '0em',
    },
    h5: {
      size: '1.125rem', // 18px
      lineHeight: '1.375',
      fontWeight: '500',
      letterSpacing: '0em',
    },
    h6: {
      size: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0em',
    },

    // Body text
    body: {
      large: {
        size: '1.125rem', // 18px
        lineHeight: '1.625',
        fontWeight: '400',
      },
      base: {
        size: '1rem', // 16px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      small: {
        size: '0.875rem', // 14px
        lineHeight: '1.425',
        fontWeight: '400',
      },
    },

    // UI elements
    button: {
      large: {
        size: '1rem', // 16px
        lineHeight: '1.5',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      base: {
        size: '0.875rem', // 14px
        lineHeight: '1.425',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      small: {
        size: '0.75rem', // 12px
        lineHeight: '1.25',
        fontWeight: '600',
        letterSpacing: '0.05em',
      },
    },

    // Labels and captions
    label: {
      size: '0.875rem', // 14px
      lineHeight: '1.425',
      fontWeight: '500',
      letterSpacing: '0em',
    },
    caption: {
      size: '0.75rem', // 12px
      lineHeight: '1.25',
      fontWeight: '400',
      letterSpacing: '0.025em',
    },
  },

  // Mobile-specific overrides for better readability
  mobile: {
    // Slightly larger text for mobile devices
    scale: {
      h1: {
        size: '2rem', // 32px (smaller than desktop)
        lineHeight: '1.25',
        fontWeight: '700',
      },
      h2: {
        size: '1.75rem', // 28px
        lineHeight: '1.3',
        fontWeight: '600',
      },
      h3: {
        size: '1.375rem', // 22px
        lineHeight: '1.35',
        fontWeight: '600',
      },
      body: {
        base: {
          size: '1rem', // Keep 16px as minimum for accessibility
          lineHeight: '1.6', // Slightly more line height for mobile
        },
        small: {
          size: '0.875rem', // 14px
          lineHeight: '1.5',
        },
      },
    },
  },
} as const;

// Type exports
export type FontSize = keyof typeof typography.fontSize;
export type LineHeight = keyof typeof typography.lineHeight;
export type FontWeight = keyof typeof typography.fontWeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;
export type TextScale = keyof typeof typography.scale;

// Utility functions
export const getTextStyles = (scale: keyof typeof typography.scale) => {
  return typography.scale[scale];
};

export const getMobileTextStyles = (scale: keyof typeof typography.mobile.scale) => {
  return typography.mobile.scale[scale];
};