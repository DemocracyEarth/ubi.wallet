"use client"

import { Home, Search, Bell, User } from "lucide-react"

export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800">
      <div className="max-w-md mx-auto flex justify-around py-4">
        <button className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          <Home className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400">
          <Search className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400">
          <Bell className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400">
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

