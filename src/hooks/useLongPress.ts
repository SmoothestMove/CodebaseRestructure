import { useCallback, useRef } from 'react';

export const useLongPress = (callback: () => void, ms = 300) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    timeout.current = setTimeout(callback, ms);
  }, [callback, ms]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};