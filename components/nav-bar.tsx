"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Wallet, Settings, MessageSquare, Code, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NavBar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/wallet",
      icon: Wallet,
      label: "Wallet",
      active: pathname === "/wallet",
    },
    {
      href: "/smart-contracts",
      icon: Code,
      label: "Contracts",
      active: pathname === "/smart-contracts",
    },
    {
      href: "/feed",
      icon: MessageSquare,
      label: "Feed",
      active: pathname === "/feed",
    },
    {
      href: "/explorer",
      icon: Activity,
      label: "Explorer",
      active: pathname === "/explorer",
    },
    {
      href: "/node",
      icon: Settings,
      label: "Node",
      active: pathname === "/node",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              route.active ? "text-white" : "text-gray-400 hover:text-gray-300",
            )}
          >
            <route.icon className={cn("h-5 w-5 mb-1", route.active ? "text-blue-400" : "")} />
            <span>{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

