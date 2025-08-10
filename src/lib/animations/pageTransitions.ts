/**
 * Page Transition Variants
 * Optimized page transition animations for routing
 */

import { Variants } from 'framer-motion';
import { DURATIONS, EASINGS, shouldReduceMotion } from './config';

// Base page transition with optimized performance
const createPageVariant = (
  initialProps: Record<string, any>,
  animateProps: Record<string, any>,
  exitProps: Record<string, any>
): Variants => ({
  initial: {
    ...initialProps,
    // Optimize for performance
    willChange: 'transform, opacity',
  },
  animate: {
    ...animateProps,
    willChange: 'auto',
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.smooth,
    },
  },
  exit: {
    ...exitProps,
    willChange: 'transform, opacity',
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.sharp,
    },
  },
});

// Page transition variants for different routes
export const pageTransitions = {
  // Default fade transition (most performant)
  fade: createPageVariant(
    { opacity: 0 },
    { opacity: 1 },
    { opacity: 0 }
  ),

  // Slide from right (navigation forward)
  slideRight: createPageVariant(
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0 },
    { opacity: 0, x: -50 }
  ),

  // Slide from left (navigation back)
  slideLeft: createPageVariant(
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0 },
    { opacity: 0, x: 50 }
  ),

  // Scale transition (modal-like pages)
  scale: createPageVariant(
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 1.05 }
  ),

  // Slide up (mobile modal pages)
  slideUp: createPageVariant(
    { opacity: 0, y: 100 },
    { opacity: 1, y: 0 },
    { opacity: 0, y: 50 }
  ),
};

// Route-specific transition mapping
export const routeTransitions: Record<string, keyof typeof pageTransitions> = {
  // Main navigation (left-to-right hierarchy)
  '/app': 'fade',
  '/app/scan': 'slideRight',
  '/app/boxes': 'slideRight',
  '/app/budget': 'slideRight',
  '/app/owners': 'slideRight',
  '/app/settings': 'slideRight',

  // Modal-like pages
  '/app/settings/profile': 'slideUp',
  '/app/settings/preferences': 'slideUp',
  
  // Detail pages
  '/app/boxes/:id': 'scale',
  '/app/budget/expense/:id': 'scale',
};

// Get transition variant based on current and previous routes
export const getPageTransition = (
  currentPath: string,
  previousPath?: string
): keyof typeof pageTransitions => {
  // If reduced motion is preferred, always use fade
  if (shouldReduceMotion()) {
    return 'fade';
  }

  // Check for specific route mappings
  const specificTransition = routeTransitions[currentPath];
  if (specificTransition) {
    return specificTransition;
  }

  // Determine direction based on route hierarchy
  if (previousPath && currentPath) {
    const previousDepth = previousPath.split('/').length;
    const currentDepth = currentPath.split('/').length;
    
    if (currentDepth > previousDepth) {
      return 'slideRight'; // Going deeper
    } else if (currentDepth < previousDepth) {
      return 'slideLeft';  // Going back
    }
  }

  // Default to fade for best performance
  return 'fade';
};

// Loading page variants for async route loading
export const loadingTransitions = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.smooth,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.sharp,
    }
  },
};

export default pageTransitions;