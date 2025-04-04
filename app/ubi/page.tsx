"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import { Shield, AlertCircle } from "lucide-react"
import Link from "next/link"

// Add the PersistentDemoNotice component to the UBI page
import PersistentDemoNotice from "@/components/persistent-demo-notice"

// Initial mock claim history
const initialClaimHistory = [
  {
    id: "claim1",
    amount: 25,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    status: "completed",
  },
  {
    id: "claim2",
    amount: 25,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    status: "completed",
  },
]

export default function UbiPage() {
  const [nextClaimAmount, setNextClaimAmount] = useState(25)
  const [claimHistory, setClaimHistory] = useState(initialClaimHistory)
  const [nextClaimDate, setNextClaimDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24)) // Tomorrow
  const [isClaiming, setIsClaiming] = useState(false)

  const { balance, updateBalance } = useWalletStore()
  const { isVerified } = useVerificationStore()

  const handleClaim = () => {
    if (!isVerified) return

    setIsClaiming(true)

    // Simulate network delay
    setTimeout(() => {
      // Add to claim history
      const newClaim = {
        id: `claim${Date.now()}`,
        amount: nextClaimAmount,
        timestamp: new Date(),
        status: "completed",
      }

      setClaimHistory([newClaim, ...claimHistory])

      // Update wallet balance
      updateBalance(balance + nextClaimAmount)

      // Set next claim date (7 days from now)
      setNextClaimDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

      setIsClaiming(false)
    }, 1500)
  }

  const isClaimable = new Date() >= nextClaimDate

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      {/* Add this after the opening <main> tag */}
      <PersistentDemoNotice className="w-full mb-4" />

      <h1 className="text-2xl font-bold mb-4 self-start">Universal Basic Income</h1>

      {!isVerified ? (
        <Card className="w-full mb-6 p-5 bg-gray-900/80 border border-yellow-800/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-lg mb-2">Verification Required</h2>
              <p className="text-gray-300 text-sm mb-4">
                To access UBI claims, you need to verify your identity using our privacy-preserving verification system.
              </p>
              <Link href="/verify">
                <Button className="bg-green-600 hover:bg-green-700">Verify Identity</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="w-full mb-2 p-3 bg-green-900/20 border border-green-800/30 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-300">Your identity is verified. You can claim UBI.</span>
        </Card>
      )}

      <Card className="w-full mb-6 rounded-xl p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <h2 className="text-xl mb-2">Next Claim</h2>
        <div className="text-5xl font-bold mb-4">{nextClaimAmount} UBI</div>

        {isClaimable ? (
          <Button
            onClick={handleClaim}
            disabled={isClaiming || !isVerified}
            className={`w-full ${isVerified ? "bg-white text-emerald-700 hover:bg-gray-100" : "bg-white/50 text-emerald-700 cursor-not-allowed"}`}
          >
            {isClaiming ? "Claiming..." : isVerified ? "Claim Now" : "Verification Required"}
          </Button>
        ) : (
          <div>
            <div className="text-sm mb-2">Next claim available:</div>
            <div className="font-medium">{formatDistanceToNow(nextClaimDate, { addSuffix: true })}</div>
          </div>
        )}
      </Card>

      <div className="w-full">
        <h2 className="text-xl font-bold mb-3">Claim History</h2>
        <div className="space-y-3">
          {claimHistory.map((claim) => (
            <Card key={claim.id} className="p-4 bg-gray-900/80 flex items-center justify-between">
              <div>
                <div className="font-medium">UBI Claim</div>
                <div className="text-sm text-gray-400">{formatDistanceToNow(claim.timestamp, { addSuffix: true })}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-400">+{claim.amount} UBI</div>
                <div className="text-sm text-gray-400 capitalize">{claim.status}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

