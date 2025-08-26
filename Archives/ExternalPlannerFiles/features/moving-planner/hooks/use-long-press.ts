

import { useCallback, useRef } from "react"

interface UseLongPressOptions {
  onLongPress: () => void
  delay?: number
}

export function useLongPress({ onLongPress, delay = 300 }: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
  }
}
