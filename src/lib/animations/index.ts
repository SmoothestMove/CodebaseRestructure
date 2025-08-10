/**
 * Animation System - Main Export
 * Centralized export for all animation utilities and configurations
 */

export {
  DURATIONS,
  EASINGS,
  VARIANTS,
  GESTURE_CONFIG,
  PERFORMANCE_CONFIG,
  shouldReduceMotion,
} from './config';

export {
  pageTransitions,
  routeTransitions,
  getPageTransition,
  loadingTransitions,
} from './pageTransitions';

export { default as animationConfig } from './config';