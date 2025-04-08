"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ScrollContainerProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  bottomPadding?: number
  id?: string
}

export default function ScrollContainer({ children, className, style, bottomPadding = 40, id }: ScrollContainerProps) {
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const { scrollTop } = containerRef.current
      setShowScrollButtons(scrollTop > 200)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "auto", // Changed from "smooth" to "auto" for immediate scrolling
      })
    }
  }

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "auto", // Changed from "smooth" to "auto" for immediate scrolling
      })
    }
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        id={id}
        className={cn("h-full overflow-y-auto scrollbar-thin", className)}
        style={{
          ...style,
          paddingBottom: `${bottomPadding}px`,
        }}
      >
        {children}
      </div>

      {showScrollButtons && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <Button
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            size="icon"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <Button
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            size="icon"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
