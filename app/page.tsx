"use client"

import { useEffect, useState } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import { generateKeyPair } from "@/lib/crypto"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Wallet, FileText, Users, ArrowRight, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const { initializeWallet, balance } = useWalletStore()
  const { isVerified } = useVerificationStore()

  const [nextClaimDate, setNextClaimDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24)) // Tomorrow
  const [nextClaimAmount, setNextClaimAmount] = useState(25)
  const [activeStreamsCount, setActiveStreamsCount] = useState(2)
  const [streamingRate, setStreamingRate] = useState(0.06) // Tokens per hour

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    // Generate a new keypair on session load
    const keyPair = generateKeyPair()
    initializeWallet(keyPair)
  }, [initializeWallet])

  const isClaimable = new Date() >= nextClaimDate

  // Sidebar content
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <div className="text-sm font-medium text-gray-400">Quick Stats</div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Next UBI:</span>
          <span>{isClaimable ? "Available Now" : formatDistanceToNow(nextClaimDate, { addSuffix: true })}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Active Streams:</span>
          <span>{activeStreamsCount}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Streaming Rate:</span>
          <span>{streamingRate.toFixed(2)}/hr</span>
        </div>
      </div>
    </div>
  )

  // Right panel content
  const rightPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Network Activity</h3>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          View Details
        </Button>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Network Status</div>
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Healthy</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Nodes:</span>
              <span>24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">TPS:</span>
              <span>24.3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Block Height:</span>
              <span>#1,342,567</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="font-medium mb-2">Network Load</div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Current</span>
            <span>62%</span>
          </div>
          <Progress value={62} className="h-1.5 mb-3" />

          <div className="h-24 flex items-end justify-between">
            {/* Mock chart bars */}
            {[35, 42, 28, 65, 53, 48, 72].map((height, i) => (
              <div
                key={i}
                className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>12h</span>
            <span>10h</span>
            <span>8h</span>
            <span>6h</span>
            <span>4h</span>
            <span>2h</span>
            <span>Now</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DesktopLayout
      sidebar={isDesktop ? sidebarContent : undefined}
      rightPanel={rightPanelContent}
      showRightPanel={isDesktop}
    >
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Key Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-medium">Current Balance</h2>
              <Link href="/wallet" className="text-xs bg-white/20 rounded-full px-2 py-1 flex items-center">
                Details <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            <div className="text-4xl font-bold mb-3">{balance.toFixed(2)} UBI</div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="opacity-80">Next UBI Claim</div>
                <div className="font-medium">
                  {isClaimable ? (
                    <span className="text-white bg-white/20 px-2 py-0.5 rounded-full text-xs">Available Now</span>
                  ) : (
                    formatDistanceToNow(nextClaimDate, { addSuffix: true })
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="opacity-80">Active Streams</div>
                <div className="font-medium">
                  {activeStreamsCount > 0 ? (
                    <span>
                      {activeStreamsCount} ({streamingRate.toFixed(2)}/hr)
                    </span>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-medium">AI Services</h2>
              <Link href="/ai-services" className="text-xs bg-white/20 rounded-full px-2 py-1 flex items-center">
                Open <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            <div className="text-4xl font-bold mb-3">+0.75 UBI</div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="opacity-80">Earned Today</div>
                <div className="font-medium">3 requests fulfilled</div>
              </div>
              <div className="text-right">
                <div className="opacity-80">Network Status</div>
                <div className="font-medium flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-medium">Social Feed</h2>
              <Link href="/feed" className="text-xs bg-white/20 rounded-full px-2 py-1 flex items-center">
                View <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            <div className="text-4xl font-bold mb-3">12 New</div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="opacity-80">Active Polls</div>
                <div className="font-medium">2 polls ending soon</div>
              </div>
              <div className="text-right">
                <div className="opacity-80">Tips Received</div>
                <div className="font-medium">+1.2 UBI</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Status */}
        {!isVerified && (
          <Card className="w-full mb-6 p-5 bg-gray-900/80 border border-yellow-800/50">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-lg mb-2">Verification Required</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Verify your identity to access UBI claims and create native streams.
                </p>
                <Link href="/verify">
                  <Button className="bg-green-600 hover:bg-green-700">Verify Identity</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link href="/wallet" className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card className="p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity h-full">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                <span className="text-lg font-bold">Wallet & UBI</span>
              </div>
              <p className="mt-1 text-sm opacity-80">Manage your funds and UBI claims</p>
            </Card>
          </Link>

          <Link href="/ai-services">
            <Card className="p-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity h-full">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-base font-bold">AI Services</span>
              </div>
              <p className="mt-1 text-sm opacity-80">Interact with decentralized AI</p>
            </Card>
          </Link>

          <Link href="/feed">
            <Card className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 transition-opacity h-full">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-base font-bold">Feed</span>
              </div>
              <p className="mt-1 text-sm opacity-80">Connect with the community</p>
            </Card>
          </Link>
        </div>
      </div>
    </DesktopLayout>
  )
}

