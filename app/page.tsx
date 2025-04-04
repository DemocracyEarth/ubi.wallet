"use client"

import { useEffect, useState } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import { generateKeyPair } from "@/lib/crypto"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Wallet, FileText, Users, Settings, Coins, ArrowRight, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

// Add the PersistentDemoNotice component to the home page
import PersistentDemoNotice from "@/components/persistent-demo-notice"

export default function Home() {
  const { initializeWallet, balance } = useWalletStore()
  const { isVerified } = useVerificationStore()
  const [nextClaimDate, setNextClaimDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24)) // Tomorrow
  const [nextClaimAmount, setNextClaimAmount] = useState(25)
  const [activeStreamsCount, setActiveStreamsCount] = useState(2)
  const [streamingRate, setStreamingRate] = useState(0.06) // Tokens per hour

  useEffect(() => {
    // Generate a new keypair on session load
    const keyPair = generateKeyPair()
    initializeWallet(keyPair)
  }, [initializeWallet])

  const isClaimable = new Date() >= nextClaimDate

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      {/* Add this after the opening <main> tag */}
      <PersistentDemoNotice className="w-full mb-4" />

      {/* Key Metric Card */}
      <Card className="w-full mb-4 p-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg font-medium">Current Balance</h2>
          <Link href="/wallet" className="text-xs bg-white/20 rounded-full px-2 py-1 flex items-center">
            Details <ArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        <div className="text-4xl font-bold mb-3">{balance.toFixed(2)}</div>

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

      {/* Verification Status */}
      {!isVerified && (
        <Card className="w-full mb-4 p-4 bg-yellow-900/20 border border-yellow-800/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Verification Required</h3>
            <p className="text-sm text-gray-300 mb-2">
              Verify your identity to access UBI claims and create native streams.
            </p>
            <Link href="/verify">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Verify Now
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <Link href="/wallet" className="col-span-2">
          <Card className="p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5" />
              <span className="text-lg font-bold">Wallet</span>
            </div>
            <p className="mt-1 text-sm opacity-80">View your balance and transactions</p>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="p-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity h-full">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="text-base font-bold">Contracts</span>
            </div>
          </Card>
        </Link>

        <Link href="/ubi">
          <Card className="p-5 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-opacity h-full">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              <span className="text-base font-bold">UBI</span>
            </div>
          </Card>
        </Link>

        <Link href="/feed" className="col-span-2">
          <Card className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span className="text-lg font-bold">Social Feed</span>
            </div>
            <p className="mt-1 text-sm opacity-80">Connect with the community</p>
          </Card>
        </Link>

        <Link href="/node" className="col-span-2">
          <Card className="p-5 bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <span className="text-lg font-bold">Node</span>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  )
}

