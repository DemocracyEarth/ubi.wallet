"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelProps {
  children: React.ReactNode
  direction?: "horizontal" | "vertical"
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
  onResize?: (size: number) => void
}

export default function ResizablePanel({
  children,
  direction = "horizontal",
  defaultSize = 300,
  minSize = 200,
  maxSize = 600,
  className,
  onResize,
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef(0)
  const startSizeRef = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startPosRef.current = direction === "horizontal" ? e.clientX : e.clientY
    startSizeRef.current = size

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const currentPos = direction === "horizontal" ? e.clientX : e.clientY
    const delta = currentPos - startPosRef.current

    let newSize = direction === "horizontal" ? startSizeRef.current + delta : startSizeRef.current - delta

    // Clamp size between min and max
    newSize = Math.max(minSize, Math.min(maxSize, newSize))

    setSize(newSize)
    if (onResize) onResize(newSize)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={panelRef}
      className={cn("relative", direction === "horizontal" ? "w-full" : "h-full", className)}
      style={{
        [direction === "horizontal" ? "width" : "height"]: `${size}px`,
      }}
    >
      {children}

      <div
        className={cn(
          "absolute bg-transparent cursor-resize z-10",
          direction === "horizontal"
            ? "top-0 right-0 w-2 h-full cursor-ew-resize"
            : "bottom-0 left-0 w-full h-2 cursor-ns-resize",
          isResizing && "bg-blue-500/20",
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

