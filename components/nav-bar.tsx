"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Wallet, FileText, Users, Coins, Shield, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useVerificationStore } from "@/lib/stores/verification-store"

export default function NavBar() {
  const pathname = usePathname()
  const { isVerified } = useVerificationStore()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-10 relative">
      <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-full">
        <div className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-t-md flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Demo Only</span>
        </div>
      </div>
      <div className="max-w-md mx-auto flex justify-around py-4">
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
          href="/contracts"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/contracts") ? "text-white" : "text-gray-400"}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs mt-1">Contracts</span>
        </Link>

        <Link
          href="/ubi"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/ubi") ? "text-green-400" : "text-gray-400"}`}
        >
          <Coins className="w-6 h-6" />
          <span className="text-xs mt-1">UBI</span>
        </Link>

        <Link
          href="/feed"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/feed") ? "text-white" : "text-gray-400"}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Feed</span>
        </Link>

        <Link
          href="/verify"
          className={`p-2 rounded-full flex flex-col items-center ${isActive("/verify") ? "text-white" : isVerified ? "text-green-400" : "text-yellow-400"}`}
        >
          <Shield className="w-6 h-6" />
          <span className="text-xs mt-1">Verify</span>
        </Link>
      </div>
    </div>
  )
}

