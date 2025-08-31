/**
 * useSwipe Hook
 * React hook for easy swipe gesture integration
 */

import { useEffect, useRef, useMemo } from 'react';
import { SwipeHandler, SwipeCallbacks, SwipeConfig } from './swipeHandler';

export interface UseSwipeOptions extends SwipeConfig {
  /** Enable swipe gesture detection */
  enabled?: boolean;
  /** Element ref to attach swipe handlers to (if not provided, uses returned ref) */
  elementRef?: React.RefObject<HTMLElement>;
}

/**
 * React hook for swipe gesture detection
 * Returns a ref to attach to the element you want to make swipeable
 */
export const useSwipe = (
  callbacks: SwipeCallbacks,
  options: UseSwipeOptions = {}
) => {
  const internalRef = useRef<HTMLElement>(null);
  const swipeHandlerRef = useRef<SwipeHandler | null>(null);
  const callbacksRef = useRef(callbacks);
  const optionsRef = useRef(options);

  // Update refs when props change to avoid stale closures
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Initialize swipe handler
  useEffect(() => {
    const { enabled = true, elementRef, ...config } = optionsRef.current;
    const element = elementRef?.current || internalRef.current;
    
    if (!enabled || !element) {
      return;
    }

    // Create swipe handler with current callbacks
    swipeHandlerRef.current = new SwipeHandler(element, callbacksRef.current, config);

    // Cleanup function
    return () => {
      if (swipeHandlerRef.current) {
        swipeHandlerRef.current.destroy();
        swipeHandlerRef.current = null;
      }
    };
  }, [options.enabled, options.elementRef]);

  // Update handler configuration when options change
  useEffect(() => {
    if (swipeHandlerRef.current) {
      const { enabled, elementRef, ...config } = optionsRef.current;
      swipeHandlerRef.current.updateConfig(config);
    }
  }, [
    options.threshold,
    options.velocity,
    options.cancelThreshold,
    options.hapticFeedback,
    options.preventDefault,
  ]);

  // Update callbacks when they change
  useEffect(() => {
    if (swipeHandlerRef.current) {
      swipeHandlerRef.current.updateCallbacks(callbacksRef.current);
    }
  }, [callbacks]);

  const elementRef = options.elementRef || internalRef;

  return {
    ref: elementRef,
    swipeHandler: swipeHandlerRef.current,
  };
};

/**
 * Specialized hook for swipe-to-delete functionality
 */
export const useSwipeToDelete = (
  onDelete: () => void,
  options: {
    deleteThreshold?: number;
    confirmationRequired?: boolean;
    onSwipeStart?: () => void;
    onSwipeCancel?: () => void;
    enabled?: boolean;
  } = {}
) => {
  const {
    deleteThreshold = 100,
    confirmationRequired = true,
    onSwipeStart,
    onSwipeCancel,
    enabled = true,
  } = options;

  const swipeCallbacks: SwipeCallbacks = useMemo(
    () => ({
      onSwipeLeft: (distance: number, _velocity: number) => {
        if (distance >= deleteThreshold) {
          if (confirmationRequired) {
            // Show confirmation dialog
            const confirmed = window.confirm('Are you sure you want to delete this item?');
            if (confirmed) {
              onDelete();
            }
          } else {
            onDelete();
          }
        }
      },
      onSwipeStart: () => {
        onSwipeStart?.();
      },
      onSwipeCancel: () => {
        onSwipeCancel?.();
      },
    }),
    [onDelete, deleteThreshold, confirmationRequired, onSwipeStart, onSwipeCancel]
  );

  return useSwipe(swipeCallbacks, {
    enabled,
    threshold: deleteThreshold * 0.7, // Start detecting at 70% of delete threshold
    hapticFeedback: true,
    preventDefault: true,
  });
};

/**
 * Hook for pull-to-refresh functionality
 */
export const usePullToRefresh = (
  onRefresh: () => void | Promise<void>,
  options: {
    pullThreshold?: number;
    triggerThreshold?: number;
    enabled?: boolean;
    elementRef?: React.RefObject<HTMLElement>;
  } = {}
) => {
  const {
    pullThreshold = 80,
    triggerThreshold = 120,
    enabled = true,
    elementRef,
  } = options;

  const isRefreshingRef = useRef(false);

  const swipeCallbacks: SwipeCallbacks = useMemo(
    () => ({
      onSwipeDown: async (distance: number, _velocity: number) => {
        if (distance >= triggerThreshold && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          
          try {
            await onRefresh();
          } finally {
            isRefreshingRef.current = false;
          }
        }
      },
      onSwipeMove: (_deltaX: number, deltaY: number) => {
        // Only allow downward scrolling when at top of page
        if (deltaY > 0 && window.scrollY === 0) {
          // Visual feedback could be added here
          // For example, show a loading indicator when deltaY > pullThreshold
        }
      },
    }),
    [onRefresh, triggerThreshold, pullThreshold]
  );

  return useSwipe(swipeCallbacks, {
    enabled,
    elementRef,
    threshold: pullThreshold,
    cancelThreshold: 30, // Allow some horizontal movement
    preventDefault: false, // Don't prevent scrolling
  });
};

/**
 * Hook for horizontal swipe navigation (like carousel)
 */
export const useSwipeNavigation = (
  onNavigate: (direction: 'left' | 'right') => void,
  options: {
    navigationThreshold?: number;
    enabled?: boolean;
  } = {}
) => {
  const { navigationThreshold = 50, enabled = true } = options;

  const swipeCallbacks: SwipeCallbacks = useMemo(
    () => ({
      onSwipeLeft: () => {
        onNavigate('left');
      },
      onSwipeRight: () => {
        onNavigate('right');
      },
    }),
    [onNavigate]
  );

  return useSwipe(swipeCallbacks, {
    enabled,
    threshold: navigationThreshold,
    velocity: 0.2,
    hapticFeedback: true,
  });
};

export default useSwipe;