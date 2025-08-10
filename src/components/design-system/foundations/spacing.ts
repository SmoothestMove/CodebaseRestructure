/**
 * Design System - Spacing
 * Centralized spacing tokens for consistent layout and padding across the application
 */

export const spacing = {
  // Base spacing scale (in rem units)
  scale: {
    0: '0rem', // 0px
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    18: '4.5rem', // 72px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Component-specific spacing
  component: {
    // Button padding
    button: {
      sm: { x: '1rem', y: '0.75rem' }, // 16px x 12px
      md: { x: '1.25rem', y: '0.75rem' }, // 20px x 12px
      lg: { x: '1.75rem', y: '1rem' }, // 28px x 16px
      icon: { x: '0.75rem', y: '0.75rem' }, // 12px x 12px (44px total with content)
    },

    // Input field padding
    input: {
      sm: { x: '0.75rem', y: '0.5rem' }, // 12px x 8px
      md: { x: '1rem', y: '0.75rem' }, // 16px x 12px
      lg: { x: '1.25rem', y: '1rem' }, // 20px x 16px
    },

    // Card padding
    card: {
      sm: '1rem', // 16px
      md: '1.5rem', // 24px
      lg: '2rem', // 32px
      xl: '2.5rem', // 40px
    },

    // Modal padding
    modal: {
      header: { x: '1.5rem', y: '1rem' }, // 24px x 16px
      body: { x: '1.5rem', y: '1.25rem' }, // 24px x 20px
      footer: { x: '1.5rem', y: '1rem' }, // 24px x 16px
    },

    // Navigation spacing
    nav: {
      mobile: {
        height: '5rem', // 80px (increased for touch targets)
        padding: '0.5rem', // 8px
        itemSpacing: '0.25rem', // 4px
      },
      desktop: {
        width: '16rem', // 256px
        padding: '1.25rem', // 20px
        itemSpacing: '0.5rem', // 8px
      },
    },

    // Form spacing
    form: {
      fieldSpacing: '1rem', // 16px between form fields
      labelSpacing: '0.25rem', // 4px between label and input
      groupSpacing: '1.5rem', // 24px between form groups
      sectionSpacing: '2rem', // 32px between form sections
    },
  },

  // Layout spacing
  layout: {
    // Container padding
    container: {
      mobile: '1rem', // 16px
      tablet: '1.5rem', // 24px
      desktop: '2rem', // 32px
    },

    // Section spacing
    section: {
      xs: '1.5rem', // 24px
      sm: '2rem', // 32px
      md: '3rem', // 48px
      lg: '4rem', // 64px
      xl: '6rem', // 96px
    },

    // Grid gaps
    grid: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      md: '1.5rem', // 24px
      lg: '2rem', // 32px
      xl: '2.5rem', // 40px
    },
  },

  // Touch target spacing (mobile-specific)
  touch: {
    minTarget: '2.75rem', // 44px minimum touch target
    comfortableTarget: '3rem', // 48px comfortable touch target
    spacing: '0.5rem', // 8px minimum spacing between touch targets
  },

  // Responsive breakpoint-specific spacing
  responsive: {
    mobile: {
      // Tighter spacing for mobile
      card: '1rem', // 16px
      section: '1.5rem', // 24px
      margin: '1rem', // 16px
    },
    tablet: {
      card: '1.5rem', // 24px
      section: '2rem', // 32px
      margin: '1.5rem', // 24px
    },
    desktop: {
      card: '2rem', // 32px
      section: '3rem', // 48px
      margin: '2rem', // 32px
    },
  },
} as const;

// Type exports
export type SpacingScale = keyof typeof spacing.scale;
export type ComponentSpacing = keyof typeof spacing.component;
export type LayoutSpacing = keyof typeof spacing.layout;

// Utility functions
export const getSpacing = (size: SpacingScale): string => {
  return spacing.scale[size];
};

export const getComponentSpacing = (component: keyof typeof spacing.component, variant: string) => {
  const componentSpacing = spacing.component[component];
  return componentSpacing[variant as keyof typeof componentSpacing] || componentSpacing;
};

export const getResponsiveSpacing = (breakpoint: keyof typeof spacing.responsive) => {
  return spacing.responsive[breakpoint];
};