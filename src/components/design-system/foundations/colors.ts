/**
 * Design System - Colors
 * Centralized color tokens for consistent theming across the application
 */

export const colors = {
  // Brand colors
  brand: {
    // Aligned to Tailwind brand palette (index.html) and CSS vars (index.css)
    primary: '#1e3a5f', // brand-primary
    'primary-dark': '#162b45', // brand-primary-dark
    'primary-light': '#34495e',
    secondary: '#708090', // brand-secondary
    'secondary-dark': '#5a6875', // brand-secondary-dark
    'secondary-light': '#adb5bd',
    tertiary: '#ff7e00', // brand-tertiary
    'tertiary-dark': '#e67100', // brand-tertiary-dark
    'tertiary-light': '#f39c12',
    accent: '#e1a95f', // brand-accent
    'accent-dark': '#ca9854', // brand-accent-dark
    'accent-light': '#f4d03f',
  },

  // Semantic colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },

  // Neutral grays
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Status colors
  status: {
    prepared: '#64748b', // slate-500
    packed: '#f59e0b', // amber-500
    loaded: '#3b82f6', // blue-500
    unloaded: '#8b5cf6', // violet-500
    delivered: '#10b981', // emerald-500
    unpacked: '#22c55e', // green-500
  },

  // Box status specific colors
  boxStatus: {
    prepared: {
      bg: '#f1f5f9', // slate-100
      border: '#cbd5e1', // slate-300
      text: '#475569', // slate-600
    },
    packed: {
      bg: '#fef3c7', // amber-100
      border: '#fbbf24', // amber-400
      text: '#92400e', // amber-800
    },
    loaded: {
      bg: '#dbeafe', // blue-100
      border: '#60a5fa', // blue-400
      text: '#1e40af', // blue-800
    },
    unloaded: {
      bg: '#ede9fe', // violet-100
      border: '#a78bfa', // violet-400
      text: '#5b21b6', // violet-800
    },
    delivered: {
      bg: '#d1fae5', // emerald-100
      border: '#34d399', // emerald-400
      text: '#065f46', // emerald-800
    },
    unpacked: {
      bg: '#dcfce7', // green-100
      border: '#4ade80', // green-400
      text: '#166534', // green-800
    },
  },

  // Dark mode variants
  dark: {
    primary: '#1e293b',
    secondary: '#475569',
    tertiary: '#f97316', // orange-500
    accent: '#eab308', // yellow-500
    surface: {
      100: '#0f172a', // slate-900
      200: '#1e293b', // slate-800
      300: '#334155', // slate-700
    },
    text: {
      primary: '#f8fafc', // slate-50
      secondary: '#cbd5e1', // slate-300
      tertiary: '#94a3b8', // slate-400
    },
  },
} as const;

// Type exports for TypeScript support
export type BrandColor = keyof typeof colors.brand;
export type SemanticColor = keyof typeof colors.semantic;
export type NeutralColor = keyof typeof colors.neutral;
export type StatusColor = keyof typeof colors.status;
export type BoxStatusColor = keyof typeof colors.boxStatus;

// Utility functions
export const getStatusColor = (status: string): string => {
  return colors.status[status as keyof typeof colors.status] || colors.neutral[500];
};

export const getBoxStatusColors = (status: string) => {
  return colors.boxStatus[status as keyof typeof colors.boxStatus] || colors.boxStatus.prepared;
};
