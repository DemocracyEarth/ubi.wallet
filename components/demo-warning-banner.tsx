"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DemoWarningBanner() {
  const [minimized, setMinimized] = useState(false)
  const [showFull, setShowFull] = useState(true)

  // Show full banner again when changing routes
  useEffect(() => {
    if (minimized) {
      const timer = setTimeout(() => {
        setShowFull(true)
        setMinimized(false)
      }, 300000) // Show full banner again after 5 minutes

      return () => clearTimeout(timer)
    }
  }, [minimized])

  const handleMinimize = () => {
    setMinimized(true)
    setShowFull(false)
  }

  const handleExpand = () => {
    setMinimized(false)
    setShowFull(true)
  }

  if (minimized) {
    return (
      <div
        className="fixed bottom-20 right-4 z-50 bg-yellow-600 text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-yellow-500 transition-all"
        onClick={handleExpand}
      >
        <AlertTriangle className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white shadow-md transition-all ${showFull ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-bold">DEMO ONLY:</span> This is a demonstration platform. No real data is being
            displayed or utilized.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-yellow-500"
          onClick={handleMinimize}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

