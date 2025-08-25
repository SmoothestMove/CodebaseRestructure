

import type React from "react"
import { useCallback, useRef } from "react"

export function useLongPress(callback: () => void, delay = 300) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isLongPress = useRef(false)

  const start = useCallback(() => {
    isLongPress.current = false
    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true
      callback()
    }, delay)
  }, [callback, delay])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const onTouchStart = useCallback(() => {
    start()
  }, [start])

  const onTouchEnd = useCallback(() => {
    clear()
  }, [clear])

  const onTouchCancel = useCallback(() => {
    clear()
  }, [clear])

  const onClick = useCallback((e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  return {
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onClick,
  }
}
