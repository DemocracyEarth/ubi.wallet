"use client"

import { useEffect, useRef } from "react"

interface ScrollObserverProps {
  onReachEnd: () => void
  threshold?: number
  enabled?: boolean
  className?: string
  rootMargin?: string
}

export default function ScrollObserver({
  onReachEnd,
  threshold = 300,
  enabled = true,
  className = "h-10 w-full",
  rootMargin = "0px 0px 300px 0px",
}: ScrollObserverProps) {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onReachEnd()
        }
      },
      {
        rootMargin,
      },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [onReachEnd, rootMargin, enabled])

  return <div ref={observerRef} className={className} />
}
