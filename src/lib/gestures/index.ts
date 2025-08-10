/**
 * Gesture Library - Main Export
 * Touch and swipe gesture utilities for mobile interaction
 */

export {
  SwipeHandler,
  createSwipeHandler,
  type SwipeConfig,
  type SwipeCallbacks,
  type TouchPoint,
} from './swipeHandler';

export {
  useSwipe,
  useSwipeToDelete,
  usePullToRefresh,
  useSwipeNavigation,
  type UseSwipeOptions,
} from './useSwipe';

// Re-export commonly used types for convenience
export type {
  SwipeConfig as GestureConfig,
  SwipeCallbacks as GestureCallbacks,
} from './swipeHandler';