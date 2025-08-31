/**
 * Animation Configuration
 * Centralized animation settings optimized for mobile performance
 */

// Check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Core animation durations (optimized for mobile)
export const DURATIONS = {
  // Quick interactions (button press, focus)
  fast: shouldReduceMotion() ? 0 : 0.15,
  
  // Standard UI feedback (hover, form validation)
  normal: shouldReduceMotion() ? 0 : 0.25,
  
  // Page transitions and larger movements
  slow: shouldReduceMotion() ? 0 : 0.4,
  
  // Stagger intervals for list animations
  stagger: shouldReduceMotion() ? 0 : 0.05,
};

// Easing curves optimized for different interaction types
export const EASINGS = {
  // Natural bounce for attention-grabbing elements
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Smooth ease for page transitions
  smooth: [0.4, 0, 0.2, 1] as const,
  
  // Sharp ease for quick feedback
  sharp: [0.4, 0, 0.6, 1] as const,
  
  // Linear for loading animations
  linear: [0, 0, 1, 1] as const,
};

// Animation variants for common patterns
export const VARIANTS = {
  // Page transition variants
  page: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: DURATIONS.slow,
        ease: EASINGS.smooth,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: {
        duration: DURATIONS.normal,
        ease: EASINGS.sharp,
      }
    },
  },

  // Card entrance animations
  card: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: DURATIONS.normal,
        ease: EASINGS.smooth,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
  },

  // Button press animation
  button: {
    initial: { scale: 1 },
    tap: { 
      scale: 0.95,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.smooth,
      }
    },
  },

  // Modal animations (optimized for mobile)
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: DURATIONS.normal,
        ease: EASINGS.smooth,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
  },

  // Bottom sheet for mobile modals
  bottomSheet: {
    initial: { opacity: 0, y: '100%' },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: DURATIONS.normal,
        ease: EASINGS.smooth,
      }
    },
    exit: { 
      opacity: 0, 
      y: '100%',
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
  },

  // List item stagger animation
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: DURATIONS.normal,
        delay: index * DURATIONS.stagger,
        ease: EASINGS.smooth,
      }
    }),
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
  },

  // Loading spinner
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: EASINGS.linear,
      }
    },
  },

  // Success/Error states
  feedback: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.1, 1], 
      opacity: 1,
      transition: {
        duration: DURATIONS.normal,
        ease: EASINGS.bounce,
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: DURATIONS.fast,
        ease: EASINGS.sharp,
      }
    },
  },
};

// Gesture configuration for mobile interactions
export const GESTURE_CONFIG = {
  // Swipe detection thresholds
  swipe: {
    threshold: 50,      // Minimum distance for swipe detection
    velocity: 0.3,      // Minimum velocity for swipe
    restThreshold: 10,  // Distance to trigger action
    cancelThreshold: 15, // Cancel if perpendicular movement exceeds this
  },
  
  // Drag constraints
  drag: {
    elastic: 0.2,       // Resistance when dragging beyond bounds
    momentum: true,     // Enable momentum-based dragging
  },
};

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  // Reduce animations on low-end devices
  gpuAcceleration: true,
  willChange: true,
  layoutOptimization: true,
  
  // Animation frame optimization
  targetFPS: 60,
  maxAnimationDuration: 1000, // 1 second max for any animation
};

export default {
  DURATIONS,
  EASINGS,
  VARIANTS,
  GESTURE_CONFIG,
  PERFORMANCE_CONFIG,
  shouldReduceMotion,
};