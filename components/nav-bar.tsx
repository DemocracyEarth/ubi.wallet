"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Wallet, FileText, Users, Settings } from "lucide-react"
import Image from "next/image"

export default function NavBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-40">
      <div className="max-w-md mx-auto flex justify-around py-3">
        <Link
          href="/"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/") ? "text-white" : "text-gray-400"}`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src="/images/ubi-logo-white.svg"
              alt="Home"
              width={24}
              height={24}
              className={isActive("/") ? "opacity-100" : "opacity-70"}
            />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/wallet"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/wallet") ? "text-white" : "text-gray-400"}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs mt-1">Wallet</span>
        </Link>

        <Link
          href="/ai-services"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/ai-services") ? "text-white" : "text-gray-400"}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs mt-1">AI Services</span>
        </Link>

        <Link
          href="/feed"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/feed") ? "text-white" : "text-gray-400"}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Feed</span>
        </Link>

        <Link
          href="/node"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/node") ? "text-white" : "text-gray-400"}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Node</span>
        </Link>
      </div>
    </div>
  )
}

