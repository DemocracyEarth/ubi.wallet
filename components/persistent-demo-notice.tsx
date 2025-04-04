"use client"

import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PersistentDemoNoticeProps {
  className?: string
  variant?: "default" | "subtle" | "minimal"
}

export default function PersistentDemoNotice({ className, variant = "default" }: PersistentDemoNoticeProps) {
  // Different styling based on variant
  const getStyles = () => {
    switch (variant) {
      case "subtle":
        return "bg-yellow-900/20 border border-yellow-800/30 text-yellow-300"
      case "minimal":
        return "bg-transparent border border-yellow-800/30 text-yellow-300 text-xs"
      default:
        return "bg-yellow-600/90 text-white"
    }
  }

  return (
    <div className={cn("rounded-md px-3 py-1.5 flex items-center gap-2", getStyles(), className)}>
      <AlertTriangle className={cn("flex-shrink-0", variant === "minimal" ? "h-3 w-3" : "h-4 w-4")} />
      <p className={cn("font-medium", variant === "minimal" ? "text-xs" : "text-sm")}>
        Demo Only: No real data is being used
      </p>
    </div>
  )
}

