

import { useCallback, useRef } from "react"

interface UseLongPressOptions {
  onLongPress: () => void
  delay?: number
}

export function useLongPress({ onLongPress, delay = 300 }: UseLongPressOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
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
