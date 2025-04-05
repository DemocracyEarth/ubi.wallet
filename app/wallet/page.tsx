"use client"

import { useEffect, useState } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import { generateKeyPair } from "@/lib/crypto"
import { Card } from "@/components/ui/card"
import { truncateAddress } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Copy, Pause, Play, ExternalLink, Shield, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AIServiceSummary from "@/components/ai-service-summary"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

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
  {
    id: "tx4",
    type: "sent",
    amount: 1.5,
    to: "0x8h7g6f5e4d3c2b1a0z9i",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    txHash: "0xdef1234567890abcdef1234567890abc",
  },
  {
    id: "tx5",
    type: "received",
    amount: 5.0,
    from: "0x3c4d5e6f7g8h9i0j1a2b",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    txHash: "0x567890abcdef1234567890abcdef1234",
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

export default function WalletPage() {
  const { balance, publicKey, initializeWallet, updateBalance } = useWalletStore()
  const { isVerified } = useVerificationStore()

  const [nextClaimAmount, setNextClaimAmount] = useState(25)
  const [claimHistory, setClaimHistory] = useState(initialClaimHistory)
  const [nextClaimDate, setNextClaimDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24)) // Tomorrow
  const [isClaiming, setIsClaiming] = useState(false)

  // Stream creation state
  const [showStreamForm, setShowStreamForm] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [timeUnit, setTimeUnit] = useState("hour")
  const [duration, setDuration] = useState("")

  const isDesktop = useMediaQuery("(min-width: 1024px)")

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

  const createStream = () => {
    if (!recipient || !amount) {
      alert("Please fill in all required fields")
      return
    }

    // In a real app, this would create a token stream contract
    alert(
      `Stream created: ${amount} UBI per ${timeUnit} to ${recipient}${duration ? ` for ${duration} ${duration === "1" ? timeUnit : timeUnit + "s"}` : " continuously"}`,
    )

    // Reset form
    setShowStreamForm(false)
    setRecipient("")
    setAmount("")
    setTimeUnit("hour")
    setDuration("")
  }

  const isClaimable = new Date() >= nextClaimDate

  // Sidebar content
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <div className="text-sm font-medium text-gray-400">Quick Actions</div>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-gray-700 hover:bg-gray-800"
          onClick={() => setShowStreamForm(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          New Stream
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-gray-700 hover:bg-gray-800"
          onClick={copyToClipboard}
        >
          <Copy className="w-3.5 h-3.5 mr-2" />
          Copy Address
        </Button>

        <Link href="/explorer">
          <Button variant="outline" size="sm" className="w-full justify-start border-gray-700 hover:bg-gray-800">
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Explorer
          </Button>
        </Link>
      </div>
    </div>
  )

  // Right panel content
  const rightPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Transaction History</h3>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {mockTransactions.map((tx) => (
          <Card key={tx.id} className="p-3 bg-gray-800 border-gray-700">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-full ${tx.type === "received" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              >
                {tx.type === "received" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium text-sm">{tx.type === "received" ? "Received" : "Sent"}</div>
                  <div className={`font-bold text-sm ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "received" ? "+" : "-"}
                    {tx.amount} UBI
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <div>
                    {tx.type === "received" ? `From: ${truncateAddress(tx.from)}` : `To: ${truncateAddress(tx.to)}`}
                  </div>
                  <div>{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
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
        <h1 className="text-2xl font-bold mb-4">Wallet</h1>

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

        <Tabs defaultValue="overview" className="w-full mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ubi">UBI Claims</TabsTrigger>
            <TabsTrigger value="streams">Token Streams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="w-full">
                  <h2 className="text-xl font-bold mb-4">AI Service Activity</h2>
                  <AIServiceSummary />
                </div>

                <div className="w-full">
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
                    {mockTransactions.slice(0, 3).map((tx) => (
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
                              {tx.type === "received"
                                ? `From: ${truncateAddress(tx.from)}`
                                : `To: ${truncateAddress(tx.to)}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                            {tx.type === "received" ? "+" : "-"}
                            {tx.amount} UBI
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Active Streams</h2>
                    <Button
                      onClick={() => setShowStreamForm(!showStreamForm)}
                      size="sm"
                      className="h-8 px-2 flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span className="text-xs">New Stream</span>
                    </Button>
                  </div>

                  {showStreamForm && (
                    <Card className="w-full mb-4 p-4 bg-gray-900/80">
                      <h3 className="text-lg font-bold mb-3">Create Token Stream</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipient">Recipient</Label>
                          <Input
                            id="recipient"
                            placeholder="@username or address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="bg-gray-800/50 border-gray-700"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              placeholder="0.01"
                              type="number"
                              step="0.000001"
                              min="0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-gray-800/50 border-gray-700"
                            />
                          </div>

                          <div>
                            <Label htmlFor="timeUnit">Per</Label>
                            <Select value={timeUnit} onValueChange={setTimeUnit}>
                              <SelectTrigger id="timeUnit" className="bg-gray-800/50 border-gray-700">
                                <SelectValue placeholder="Time unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="second">Second</SelectItem>
                                <SelectItem value="minute">Minute</SelectItem>
                                <SelectItem value="hour">Hour</SelectItem>
                                <SelectItem value="day">Day</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="month">Month</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="duration" className="flex items-center justify-between">
                            <span>Duration (optional)</span>
                            <span className="text-xs text-gray-400">Leave empty for continuous</span>
                          </Label>
                          <Input
                            id="duration"
                            placeholder="Number of time units"
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="bg-gray-800/50 border-gray-700"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={createStream}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                          >
                            Create Stream
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowStreamForm(false)}
                            className="flex-1 border-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {mockActiveStreams.length === 0 ? (
                      <Card className="p-5 bg-gray-900/80 text-center">
                        <p className="text-gray-400">No active streams</p>
                        <Button
                          onClick={() => setShowStreamForm(true)}
                          className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Create Your First Stream
                        </Button>
                      </Card>
                    ) : (
                      mockActiveStreams.map((stream) => (
                        <Card key={stream.id} className="p-4 bg-gray-900/80">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {stream.recipient}
                                {stream.paused && (
                                  <span className="text-xs bg-yellow-800/50 text-yellow-300 px-2 py-0.5 rounded-full">
                                    Paused
                                  </span>
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
                      ))
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <h2 className="text-xl font-bold mb-4">Next UBI Claim</h2>
                  {!isVerified ? (
                    <Card className="w-full mb-6 p-5 bg-gray-900/80 border border-yellow-800/50">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h2 className="font-bold text-lg mb-2">Verification Required</h2>
                          <p className="text-gray-300 text-sm mb-4">
                            To access UBI claims, you need to verify your identity using our privacy-preserving
                            verification system.
                          </p>
                          <Link href="/verify">
                            <Button className="bg-green-600 hover:bg-green-700">Verify Identity</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="w-full mb-4 rounded-xl p-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <div className="text-4xl font-bold mb-3">{nextClaimAmount} UBI</div>

                      {isClaimable ? (
                        <Button
                          onClick={handleClaim}
                          disabled={isClaiming}
                          className="w-full bg-white text-emerald-700 hover:bg-gray-100"
                        >
                          {isClaiming ? "Claiming..." : "Claim Now"}
                        </Button>
                      ) : (
                        <div>
                          <div className="text-sm mb-1">Next claim available:</div>
                          <div className="font-medium">{formatDistanceToNow(nextClaimDate, { addSuffix: true })}</div>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ubi">
            {!isVerified ? (
              <Card className="w-full mb-6 p-5 bg-gray-900/80 border border-yellow-800/50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-bold text-lg mb-2">Verification Required</h2>
                    <p className="text-gray-300 text-sm mb-4">
                      To access UBI claims, you need to verify your identity using our privacy-preserving verification
                      system.
                    </p>
                    <Link href="/verify">
                      <Button className="bg-green-600 hover:bg-green-700">Verify Identity</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card className="w-full mb-2 p-3 bg-green-900/20 border border-green-800/30 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Your identity is verified. You can claim UBI.</span>
                </Card>

                <Card className="w-full mb-6 rounded-xl p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <h2 className="text-xl mb-2">Next Claim</h2>
                  <div className="text-5xl font-bold mb-4">{nextClaimAmount} UBI</div>

                  {isClaimable ? (
                    <Button
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="w-full bg-white text-emerald-700 hover:bg-gray-100"
                    >
                      {isClaiming ? "Claiming..." : "Claim Now"}
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
                          <div className="text-sm text-gray-400">
                            {formatDistanceToNow(claim.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-400">+{claim.amount} UBI</div>
                          <div className="text-sm text-gray-400 capitalize">{claim.status}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="streams">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Token Streams</h2>
              <Button
                onClick={() => setShowStreamForm(!showStreamForm)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-1"
              >
                {showStreamForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus size={16} />
                    <span>New Stream</span>
                  </>
                )}
              </Button>
            </div>

            {showStreamForm && (
              <Card className="w-full mb-6 p-5 bg-gray-900/80">
                <h3 className="text-lg font-bold mb-3">Create Token Stream</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      placeholder="@username or address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        placeholder="0.01"
                        type="number"
                        step="0.000001"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-800/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeUnit">Per</Label>
                      <Select value={timeUnit} onValueChange={setTimeUnit}>
                        <SelectTrigger id="timeUnit" className="bg-gray-800/50 border-gray-700">
                          <SelectValue placeholder="Time unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="minute">Minute</SelectItem>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="flex items-center justify-between">
                      <span>Duration (optional)</span>
                      <span className="text-xs text-gray-400">Leave empty for continuous</span>
                    </Label>
                    <Input
                      id="duration"
                      placeholder="Number of time units"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <Button onClick={createStream} className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                    Create Stream
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              {mockActiveStreams.length === 0 ? (
                <Card className="p-5 bg-gray-900/80 text-center">
                  <p className="text-gray-400">No active streams</p>
                  <Button
                    onClick={() => setShowStreamForm(true)}
                    className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Create Your First Stream
                  </Button>
                </Card>
              ) : (
                mockActiveStreams.map((stream) => (
                  <Card key={stream.id} className="p-4 bg-gray-900/80">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {stream.recipient}
                          {stream.paused && (
                            <span className="text-xs bg-yellow-800/50 text-yellow-300 px-2 py-0.5 rounded-full">
                              Paused
                            </span>
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}

