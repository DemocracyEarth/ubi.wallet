"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import { truncateAddress } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Home, Search, BarChart2, Wallet, User, Zap, FileText, Shield } from "lucide-react"
import Image from "next/image"

export default function NavBar() {
  const pathname = usePathname()
  const { publicKey, balance } = useWalletStore()
  const { isVerified } = useVerificationStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Explorer",
      path: "/explorer",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Feed",
      path: "/feed",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Contracts",
      path: "/contracts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Node",
      path: "/node",
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image src="/images/ubi-logo-white.svg" alt="UBI Logo" fill className="object-contain" priority />
              </div>
              <span className="text-xl font-bold">UBI</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    size="sm"
                    className={
                      pathname === item.path
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "text-gray-300 hover:text-white"
                    }
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                <Zap className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{balance.toFixed(2)} UBI</span>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-gray-700">
                      <AvatarImage src={`https://effigy.im/a/${publicKey}.svg`} />
                      <AvatarFallback className="bg-gray-800">{publicKey.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
                        <Shield className="h-3.5 w-3.5 text-green-400" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">{truncateAddress(publicKey)}</div>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        isVerified
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                      }`}
                    >
                      {isVerified ? "Verified Human" : "Unverified"}
                    </Badge>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
