"use client"

import { Home, Search, Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navigation() {
  const pathname = usePathname()

  // Check if the current page is using DesktopLayout
  // These pages should not show the bottom navigation twice
  const usingDesktopLayout = ["/verify", "/explorer", "/feed", "/node", "/wallet", "/ai-services"].includes(pathname)

  if (usingDesktopLayout) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800">
      <div className="max-w-md mx-auto flex justify-around py-4">
        <Link href="/" className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/explorer" className="p-2 text-gray-400">
          <Search className="w-6 h-6" />
        </Link>
        <Link href="/feed" className="p-2 text-gray-400">
          <Bell className="w-6 h-6" />
        </Link>
        <Link href="/node" className="p-2 text-gray-400">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}

