"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useResponsiveGrid(breakpoints: { small: number; medium: number }, debounceTime = 100) {
  const [containerWidth, setContainerWidth] = useState(0)
  const [columns, setColumns] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced function to update width
  const updateWidth = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth
        setContainerWidth(newWidth)

        // Calculate columns based on container width
        if (newWidth < breakpoints.small) {
          setColumns(1)
        } else if (newWidth < breakpoints.medium) {
          setColumns(2)
        } else {
          setColumns(3)
        }
      }
    }, debounceTime)
  }, [breakpoints.small, breakpoints.medium, debounceTime])

  useEffect(() => {
    // Initial width calculation
    updateWidth()

    // Set up ResizeObserver if supported
    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(updateWidth)

      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current)
      }
    } else {
      // Fallback to window resize event
      window.addEventListener("resize", updateWidth)
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      } else {
        window.removeEventListener("resize", updateWidth)
      }
    }
  }, [updateWidth])

  return { containerRef, containerWidth, columns }
}

