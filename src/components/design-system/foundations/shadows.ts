/**
 * Design System - Shadows
 * Centralized shadow tokens for consistent elevation and depth across the application
 */

export const shadows = {
  // Core shadow scale
  scale: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Elevation system (Material Design inspired)
  elevation: {
    0: 'none', // Flat on surface
    1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)', // Cards, buttons
    2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)', // Raised buttons, hover states
    3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)', // Dropdowns, tooltips
    4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)', // Modals, sheets
    5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)', // Navigation, overlays
  },

  // Component-specific shadows
  component: {
    // Button shadows
    button: {
      default: '0 2px 4px rgba(0, 0, 0, 0.1)',
      hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
      active: '0 1px 2px rgba(0, 0, 0, 0.1)',
      focus: '0 0 0 3px rgba(59, 130, 246, 0.15)', // Blue focus ring
    },

    // Card shadows
    card: {
      default: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      hover: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
      elevated: '0 8px 25px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1)',
    },

    // Modal shadows
    modal: {
      backdrop: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      content: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },

    // Navigation shadows
    nav: {
      header: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      sidebar: '2px 0 8px rgba(0, 0, 0, 0.1)',
      bottomNav: '0 -1px 3px rgba(0, 0, 0, 0.1), 0 -1px 2px rgba(0, 0, 0, 0.06)',
    },

    // Input shadows
    input: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      focus: '0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      error: '0 0 0 3px rgba(239, 68, 68, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },

    // Dropdown shadows
    dropdown: {
      default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },

    // Toast shadows
    toast: {
      default: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      success: '0 10px 15px -3px rgba(34, 197, 94, 0.2), 0 4px 6px -2px rgba(34, 197, 94, 0.1)',
      error: '0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(239, 68, 68, 0.1)',
      warning: '0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.1)',
    },
  },

  // Dark mode shadow variants
  dark: {
    // Adjusted shadows for dark mode (lighter, more subtle)
    elevation: {
      1: '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.36)',
      2: '0 3px 6px rgba(0, 0, 0, 0.32), 0 3px 6px rgba(0, 0, 0, 0.46)',
      3: '0 10px 20px rgba(0, 0, 0, 0.38), 0 6px 6px rgba(0, 0, 0, 0.46)',
      4: '0 14px 28px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.44)',
      5: '0 19px 38px rgba(0, 0, 0, 0.6), 0 15px 12px rgba(0, 0, 0, 0.44)',
    },

    // Dark mode component shadows
    component: {
      card: {
        default: '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.12)',
        hover: '0 4px 12px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.16)',
        elevated: '0 8px 25px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(0, 0, 0, 0.2)',
      },
      modal: {
        backdrop: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
        content: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },

  // Focus ring variants
  focus: {
    default: '0 0 0 3px rgba(59, 130, 246, 0.15)', // Blue
    primary: '0 0 0 3px rgba(230, 126, 34, 0.15)', // Orange (brand tertiary)
    success: '0 0 0 3px rgba(34, 197, 94, 0.15)', // Green
    error: '0 0 0 3px rgba(239, 68, 68, 0.15)', // Red
    warning: '0 0 0 3px rgba(245, 158, 11, 0.15)', // Amber
  },

  // Inner shadows (for inset effects)
  inner: {
    sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    md: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: 'inset 0 4px 8px rgba(0, 0, 0, 0.15)',
  },
} as const;

// Type exports
export type ShadowScale = keyof typeof shadows.scale;
export type ShadowElevation = keyof typeof shadows.elevation;
export type ComponentShadow = keyof typeof shadows.component;
export type FocusRing = keyof typeof shadows.focus;

// Utility functions
export const getShadow = (scale: ShadowScale): string => {
  return shadows.scale[scale];
};

export const getElevation = (level: keyof typeof shadows.elevation): string => {
  return shadows.elevation[level];
};

export const getComponentShadow = (component: keyof typeof shadows.component, variant?: string): string => {
  const componentShadows = shadows.component[component];
  if (variant && typeof componentShadows === 'object' && variant in componentShadows) {
    return componentShadows[variant as keyof typeof componentShadows];
  }
  return typeof componentShadows === 'string' ? componentShadows : componentShadows.default;
};

export const getFocusRing = (type: FocusRing = 'default'): string => {
  return shadows.focus[type];
};