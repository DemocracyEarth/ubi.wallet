"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { truncateAddress } from "@/lib/utils"
import {
  Home,
  Wallet,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutPanelLeft,
  Maximize2,
  Minimize2,
  Activity,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DesktopLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  rightPanel?: ReactNode
  showRightPanel?: boolean
  contentClassName?: string
  mainRef?: React.RefObject<HTMLDivElement>
}

export default function DesktopLayout({
  children,
  sidebar,
  rightPanel,
  showRightPanel = false,
  contentClassName,
  mainRef,
}: DesktopLayoutProps) {
  const pathname = usePathname()
  const { publicKey, balance } = useWalletStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelVisible, setRightPanelVisible] = useState(showRightPanel)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px)")

  // Reset mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setMobileMenuOpen(false)
    }
  }, [isDesktop])

  // Dispatch initial sidebar state on component mount
  useEffect(() => {
    if (isDesktop) {
      window.dispatchEvent(
        new CustomEvent("sidebarStateChange", {
          detail: { expanded: !sidebarCollapsed },
        }),
      )
    }
  }, [isDesktop, sidebarCollapsed])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  // Updated navigation items to use /contracts instead of /ai-services
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/contracts", icon: FileText, label: "Contracts" },
    { path: "/feed", icon: Users, label: "Feed" },
    { path: "/explorer", icon: Activity, label: "Explorer" },
    { path: "/node", icon: Settings, label: "Node" },
  ]

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top bar - visible on all devices */}
      <div className="h-14 border-b border-gray-800 flex items-center px-4 justify-between bg-gray-900/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Image src="/images/ubi-logo-white.svg" alt="UBI" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold text-lg hidden sm:inline-block">ubi.eth</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">{truncateAddress(publicKey)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1.5">
            <span className="font-medium">{balance.toFixed(2)}</span>
            <span className="text-sm opacity-80">UBI</span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hidden md:flex">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - collapsible on desktop, drawer on mobile */}
        <aside
          className={cn(
            "bg-gray-900/90 backdrop-blur-md border-r border-gray-800 flex flex-col z-10",
            isDesktop
              ? sidebarCollapsed
                ? "w-16"
                : `w-[${sidebarWidth}px]`
              : mobileMenuOpen
                ? "fixed inset-y-0 left-0 w-64 z-50"
                : "fixed inset-y-0 -left-64 w-64 z-50",
          )}
          style={{ width: isDesktop ? (sidebarCollapsed ? 64 : sidebarWidth) : mobileMenuOpen ? 256 : 0 }}
        >
          {/* Sidebar content - streamlined to only include navigation links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600/50 to-purple-600/50 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  )}
                  onClick={() => !isDesktop && setMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  {(!isDesktop || !sidebarCollapsed) && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Collapse button - desktop only */}
          {isDesktop && (
            <div className="p-3 border-t border-gray-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newState = !sidebarCollapsed
                  setSidebarCollapsed(newState)
                  // Dispatch custom event for sidebar state change
                  window.dispatchEvent(
                    new CustomEvent("sidebarStateChange", {
                      detail: { expanded: !newState },
                    }),
                  )
                }}
                className="w-full flex items-center justify-center"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main
          ref={mainRef}
          className={cn(
            "flex-1 overflow-y-auto",
            rightPanelVisible && isDesktop ? "w-[calc(100%-320px)]" : "w-full",
            contentClassName,
          )}
          style={{
            paddingBottom: isDesktop ? "0" : "90px", // Only add padding for bottom nav on mobile
          }}
        >
          {/* Toggle right panel button */}
          {rightPanel && isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightPanelVisible(!rightPanelVisible)}
              className="fixed top-20 right-4 z-10 bg-gray-800/50 hover:bg-gray-800"
            >
              <LayoutPanelLeft size={18} />
            </Button>
          )}

          <div className="w-full px-4 sm:px-6 md:px-8 py-4">{children}</div>
        </main>

        {/* Right panel - desktop only */}
        {rightPanel && isDesktop && (
          <aside
            className={cn(
              "bg-gray-900/90 backdrop-blur-md border-l border-gray-800 overflow-y-auto",
              rightPanelVisible ? `w-[${rightPanelWidth}px]` : "hidden",
            )}
            style={{ width: rightPanelVisible ? rightPanelWidth : 0 }}
          >
            {rightPanelVisible && <div className="p-6">{rightPanel}</div>}
          </aside>
        )}

        {/* Bottom navigation - ONLY visible on mobile, NEVER on desktop */}
        {!isDesktop && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-40">
            <div className="max-w-md mx-auto flex justify-around py-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "p-2 rounded-full flex flex-col items-center",
                    isActive(item.path) ? "text-white" : "text-gray-400",
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
