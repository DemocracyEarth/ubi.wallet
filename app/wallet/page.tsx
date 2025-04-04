"use client"

import { useEffect } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { generateKeyPair } from "@/lib/crypto"
import { Card } from "@/components/ui/card"
import { truncateAddress } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Copy, Clock, Pause, Play, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import PersistentDemoNotice from "@/components/persistent-demo-notice"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    type: "received",
    amount: 2.5,
    from: "0x1a2b3c4d5e6f7g8h9i0j",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    txHash: "0xabcdef1234567890abcdef1234567890",
  },
  {
    id: "tx2",
    type: "sent",
    amount: 0.75,
    to: "0x9i8h7g6f5e4d3c2b1a0",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    txHash: "0x1234567890abcdef1234567890abcdef",
  },
  {
    id: "tx3",
    type: "received",
    amount: 3.25,
    from: "0x2b3c4d5e6f7g8h9i0j1a",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    txHash: "0x7890abcdef1234567890abcdef123456",
  },
]

// Mock active streams data
const mockActiveStreams = [
  {
    id: "stream1",
    recipient: "@bob",
    recipientAddress: "0x3d4e5f6g7h8i9j0k1l2m",
    rate: 0.01,
    timeUnit: "hour",
    started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    duration: "30 days",
    status: "active",
    progress: 10, // 10% complete
    paused: false,
  },
  {
    id: "stream2",
    recipient: "@alice",
    recipientAddress: "0x2c3d4e5f6g7h8i9j0k1l",
    rate: 0.05,
    timeUnit: "day",
    started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    duration: "continuous",
    status: "active",
    paused: false,
  },
  {
    id: "stream3",
    recipient: "@charlie",
    recipientAddress: "0x1b2c3d4e5f6g7h8i9j0k",
    rate: 0.002,
    timeUnit: "minute",
    started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    duration: "14 days",
    status: "active",
    progress: 35, // 35% complete
    paused: true,
  },
]

export default function WalletPage() {
  const { balance, publicKey, initializeWallet } = useWalletStore()

  useEffect(() => {
    // If wallet not initialized, generate a new keypair
    if (!publicKey) {
      const keyPair = generateKeyPair()
      initializeWallet(keyPair)
    }
  }, [publicKey, initializeWallet])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey)
    alert("Public key copied to clipboard!")
  }

  const toggleStreamPause = (streamId: string) => {
    // In a real app, this would call a contract to pause/resume the stream
    alert(`Stream ${streamId} ${mockActiveStreams.find((s) => s.id === streamId)?.paused ? "resumed" : "paused"}`)
  }

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      <PersistentDemoNotice className="w-full mb-4" />
      <h1 className="text-2xl font-bold mb-4 self-start">Wallet</h1>

      <Card className="w-full mb-6 rounded-xl p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="text-6xl font-bold mb-2">{balance.toFixed(2)} UBI</div>
        <div className="flex justify-between items-center">
          <div className="text-xl">Wallet</div>
          <div className="text-sm opacity-80 flex items-center gap-2">
            {truncateAddress(publicKey)}
            <button onClick={copyToClipboard} className="opacity-70 hover:opacity-100">
              <Copy size={14} />
            </button>
          </div>
        </div>
      </Card>

      <div className="w-full mb-6">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          Active Streams
        </h2>
        <div className="space-y-3">
          {mockActiveStreams.map((stream) => (
            <Card key={stream.id} className="p-4 bg-gray-900/80">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {stream.recipient}
                    {stream.paused && (
                      <span className="text-xs bg-yellow-800/50 text-yellow-300 px-2 py-0.5 rounded-full">Paused</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{truncateAddress(stream.recipientAddress)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">
                    {stream.rate} UBI / {stream.timeUnit}
                  </div>
                  <div className="text-xs text-gray-400">
                    Started {formatDistanceToNow(stream.started, { addSuffix: true })}
                  </div>
                </div>
              </div>

              {stream.duration !== "continuous" && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{stream.progress}%</span>
                  </div>
                  <Progress value={stream.progress} className="h-1.5" />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {stream.duration === "continuous" ? "Continuous stream" : `Duration: ${stream.duration}`}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1 border-gray-700 hover:bg-gray-800"
                  onClick={() => toggleStreamPause(stream.id)}
                >
                  {stream.paused ? (
                    <>
                      <Play size={14} />
                      <span className="text-xs">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause size={14} />
                      <span className="text-xs">Pause</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link href="/explorer">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 flex items-center gap-1 border-gray-700 hover:bg-gray-800"
            >
              <ExternalLink size={14} />
              <span className="text-xs">Explorer</span>
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <Card key={tx.id} className="p-4 bg-gray-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${tx.type === "received" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {tx.type === "received" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <div className="font-medium">{tx.type === "received" ? "Received" : "Sent"}</div>
                  <div className="text-sm text-gray-400">
                    {tx.type === "received" ? `From: ${truncateAddress(tx.from)}` : `To: ${truncateAddress(tx.to)}`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                  {tx.type === "received" ? "+" : "-"}
                  {tx.amount} UBI
                </div>
                <div className="text-sm text-gray-400">{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

