/**
 * Swipe Gesture Handler
 * Generic swipe detection with customizable thresholds and callbacks
 */

export interface SwipeConfig {
  /** Minimum distance (in pixels) to register as a swipe */
  threshold?: number;
  /** Minimum velocity required for swipe detection */
  velocity?: number;
  /** Maximum perpendicular movement allowed */
  cancelThreshold?: number;
  /** Enable haptic feedback on mobile devices */
  hapticFeedback?: boolean;
  /** Prevent default touch behavior */
  preventDefault?: boolean;
}

export interface SwipeCallbacks {
  onSwipeLeft?: (distance: number, velocity: number) => void;
  onSwipeRight?: (distance: number, velocity: number) => void;
  onSwipeUp?: (distance: number, velocity: number) => void;
  onSwipeDown?: (distance: number, velocity: number) => void;
  onSwipeStart?: (startX: number, startY: number) => void;
  onSwipeMove?: (deltaX: number, deltaY: number, currentX: number, currentY: number) => void;
  onSwipeEnd?: (endX: number, endY: number) => void;
  onSwipeCancel?: () => void;
}

export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

const DEFAULT_CONFIG: Required<SwipeConfig> = {
  threshold: 50,
  velocity: 0.3,
  cancelThreshold: 15,
  hapticFeedback: true,
  preventDefault: true,
};

/**
 * SwipeHandler class for managing touch/mouse swipe gestures
 */
export class SwipeHandler {
  private config: Required<SwipeConfig>;
  private callbacks: SwipeCallbacks;
  private startPoint: TouchPoint | null = null;
  // private currentPoint: TouchPoint | null = null;
  private isTracking = false;
  private element: HTMLElement;

  constructor(element: HTMLElement, callbacks: SwipeCallbacks, config: SwipeConfig = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.bindEvents();
  }

  private bindEvents() {
    // Touch events for mobile
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel, { passive: false });

    // Mouse events for desktop (optional)
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private unbindEvents() {
    // Touch events
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);

    // Mouse events
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  private createTouchPoint(x: number, y: number): TouchPoint {
    return { x, y, time: Date.now() };
  }

  private handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return; // Only handle single finger touches
    
    const touch = event.touches[0];
    this.startTracking(touch.clientX, touch.clientY);
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.isTracking || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this.updateTracking(touch.clientX, touch.clientY);
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  };

  private handleTouchEnd = (event: TouchEvent) => {
    if (!this.isTracking) return;
    
    const touch = event.changedTouches[0];
    this.endTracking(touch.clientX, touch.clientY);
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  };

  private handleTouchCancel = (event: TouchEvent) => {
    this.cancelTracking();
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    this.startTracking(event.clientX, event.clientY);
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isTracking) return;
    this.updateTracking(event.clientX, event.clientY);
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (!this.isTracking) return;
    this.endTracking(event.clientX, event.clientY);
  };

  private handleMouseLeave = () => {
    if (this.isTracking) {
      this.cancelTracking();
    }
  };

  private startTracking(x: number, y: number) {
    this.startPoint = this.createTouchPoint(x, y);
    // this.currentPoint = this.startPoint;
    this.isTracking = true;
    
    this.callbacks.onSwipeStart?.(x, y);
  }

  private updateTracking(x: number, y: number) {
    if (!this.startPoint || !this.isTracking) return;
    
    // this.currentPoint = this.createTouchPoint(x, y);
    
    const deltaX = x - this.startPoint.x;
    const deltaY = y - this.startPoint.y;
    
    // Check if movement exceeds cancel threshold in perpendicular direction
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX > this.config.cancelThreshold && absDeltaY > this.config.cancelThreshold) {
      // If both X and Y movement are significant, it's not a clean swipe
      this.cancelTracking();
      return;
    }
    
    this.callbacks.onSwipeMove?.(deltaX, deltaY, x, y);
  }

  private endTracking(x: number, y: number) {
    if (!this.startPoint || !this.isTracking) return;
    
    const deltaX = x - this.startPoint.x;
    const deltaY = y - this.startPoint.y;
    const deltaTime = Date.now() - this.startPoint.time;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    // Check if swipe meets minimum requirements
    if (distance >= this.config.threshold && velocity >= this.config.velocity) {
      // Determine swipe direction
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.triggerHapticFeedback();
          this.callbacks.onSwipeRight?.(distance, velocity);
        } else {
          this.triggerHapticFeedback();
          this.callbacks.onSwipeLeft?.(distance, velocity);
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.triggerHapticFeedback();
          this.callbacks.onSwipeDown?.(distance, velocity);
        } else {
          this.triggerHapticFeedback();
          this.callbacks.onSwipeUp?.(distance, velocity);
        }
      }
    }
    
    this.callbacks.onSwipeEnd?.(x, y);
    this.resetTracking();
  }

  private cancelTracking() {
    this.callbacks.onSwipeCancel?.();
    this.resetTracking();
  }

  private resetTracking() {
    this.startPoint = null;
    // this.currentPoint = null;
    this.isTracking = false;
  }

  private triggerHapticFeedback() {
    if (!this.config.hapticFeedback) return;
    
    // Trigger haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SwipeConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Update callbacks
   */
  public updateCallbacks(newCallbacks: Partial<SwipeCallbacks>) {
    this.callbacks = { ...this.callbacks, ...newCallbacks };
  }

  /**
   * Destroy the swipe handler and remove event listeners
   */
  public destroy() {
    this.unbindEvents();
    this.resetTracking();
  }
}

/**
 * Hook-style function to create and manage swipe handler
 */
export const createSwipeHandler = (
  element: HTMLElement,
  callbacks: SwipeCallbacks,
  config?: SwipeConfig
): SwipeHandler => {
  return new SwipeHandler(element, callbacks, config);
};

export default SwipeHandler;