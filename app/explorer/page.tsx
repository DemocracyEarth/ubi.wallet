"use client"

import React from "react"

import { useState, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Layers, FileText, ArrowUpRight, Info, Code, ExternalLink, ChevronDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { truncateAddress } from "@/lib/utils"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useResponsiveGrid } from "@/hooks/use-responsive-grid"

// Mock blockchain data
const mockBlocks = [
  {
    number: 1342567,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    transactions: 156,
    miner: "0x1a2b3c4d5e6f7g8h9i0j",
    size: "1.2 MB",
    gasUsed: "65%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
  {
    number: 1342566,
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    transactions: 98,
    miner: "0x2b3c4d5e6f7g8h9i0j1a",
    size: "0.8 MB",
    gasUsed: "42%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
  {
    number: 1342565,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    transactions: 210,
    miner: "0x3c4d5e6f7g8h9i0j1a2b",
    size: "1.5 MB",
    gasUsed: "78%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
  {
    number: 1342564,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    transactions: 124,
    miner: "0x4d5e6f7g8h9i0j1a2b3c",
    size: "1.1 MB",
    gasUsed: "56%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
  {
    number: 1342563,
    timestamp: new Date(Date.now() - 1000 * 60 * 6),
    transactions: 87,
    miner: "0x5e6f7g8h9i0j1a2b3c4d",
    size: "0.7 MB",
    gasUsed: "38%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
  {
    number: 1342562,
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
    transactions: 145,
    miner: "0x6f7g8h9i0j1a2b3c4d5e",
    size: "1.3 MB",
    gasUsed: "62%",
    difficulty: "3.45 TH",
    totalDifficulty: "452.8 PTH",
  },
]

const mockTransactions = [
  {
    hash: "0xabcdef1234567890abcdef1234567890",
    from: "0x1a2b3c4d5e6f7g8h9i0j",
    to: "0x9i8h7g6f5e4d3c2b1a0",
    value: "12.5 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    type: "transfer",
    gasUsed: "21,000",
    gasPrice: "10 Gwei",
    status: "Success",
  },
  {
    hash: "0x1234567890abcdef1234567890abcdef",
    from: "0x2b3c4d5e6f7g8h9i0j1a",
    to: "0x8h7g6f5e4d3c2b1a0z9i",
    value: "0.75 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    type: "stream_start",
    gasUsed: "45,000",
    gasPrice: "12 Gwei",
    status: "Success",
  },
  {
    hash: "0x7890abcdef1234567890abcdef123456",
    from: "0x3c4d5e6f7g8h9i0j1a2b",
    to: "0x7g6f5e4d3c2b1a0z9i8h",
    value: "5.0 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: "transfer",
    gasUsed: "21,000",
    gasPrice: "8 Gwei",
    status: "Success",
  },
  {
    hash: "0xdef1234567890abcdef1234567890abc",
    from: "0x4d5e6f7g8h9i0j1a2b3c",
    to: "0x6f5e4d3c2b1a0z9i8h7g",
    value: "2.0 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: "stream_end",
    gasUsed: "35,000",
    gasPrice: "15 Gwei",
    status: "Success",
  },
  {
    hash: "0x567890abcdef1234567890abcdef1234",
    from: "0x5e6f7g8h9i0j1a2b3c4d",
    to: "0x5e4d3c2b1a0z9i8h7g6f",
    value: "1.25 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "transfer",
    gasUsed: "21,000",
    gasPrice: "9 Gwei",
    status: "Success",
  },
  {
    hash: "0x890abcdef1234567890abcdef123456",
    from: "0x6f7g8h9i0j1a2b3c4d5e",
    to: "0x4d3c2b1a0z9i8h7g6f5e",
    value: "3.5 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 6),
    type: "contract_deploy",
    gasUsed: "120,000",
    gasPrice: "11 Gwei",
    status: "Success",
  },
]

// Mock chain statistics
const mockChainStats = {
  totalBlocks: 1342567,
  totalTransactions: 8945672,
  activeStreams: 2456,
  totalContracts: 12567,
  averageTPS: 24.3,
  currentGasPrice: "12 gwei",
  totalValueLocked: "1.2M UBI",
  uniqueAddresses: 45678,
}

// Block item component for better code organization and memoization
const BlockItem = React.memo(
  ({
    block,
    isExpanded,
    onToggleExpand,
  }: {
    block: (typeof mockBlocks)[0]
    isExpanded: boolean
    onToggleExpand: () => void
  }) => {
    return (
      <Card className="p-4 bg-gray-900/80 transition-all duration-200 hover:bg-gray-900">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onToggleExpand}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onToggleExpand()
              e.preventDefault()
            }
          }}
        >
          <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
            <Layers size={20} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="font-medium">Block #{block.number}</div>
              <div className="text-sm text-gray-400 ml-2 truncate">
                {formatDistanceToNow(block.timestamp, { addSuffix: true })}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <div className="text-gray-400">{block.transactions} txns</div>
              <div className="text-gray-400">{block.size}</div>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={cn("text-gray-400 transition-transform flex-shrink-0", isExpanded ? "transform rotate-180" : "")}
            aria-hidden="true"
          />
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-700 transition-all duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Miner:</span>
                  <span className="truncate ml-2">{truncateAddress(block.miner)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gas Used:</span>
                  <span>{block.gasUsed}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Difficulty:</span>
                  <span>{block.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Difficulty:</span>
                  <span>{block.totalDifficulty}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-gray-700 flex items-center justify-center gap-1"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>View Block Details</span>
            </Button>
          </div>
        )}
      </Card>
    )
  },
)

BlockItem.displayName = "BlockItem"

// Transaction item component for better code organization and memoization
const TransactionItem = React.memo(
  ({
    tx,
    isExpanded,
    onToggleExpand,
  }: {
    tx: (typeof mockTransactions)[0]
    isExpanded: boolean
    onToggleExpand: () => void
  }) => {
    // Determine icon based on transaction type
    const getTransactionIcon = () => {
      switch (tx.type) {
        case "transfer":
          return <ArrowUpRight size={20} aria-hidden="true" />
        case "stream_start":
        case "stream_end":
          return <Clock size={20} aria-hidden="true" />
        default:
          return <Code size={20} aria-hidden="true" />
      }
    }

    // Determine background color based on transaction type
    const getTransactionBgColor = () => {
      switch (tx.type) {
        case "transfer":
          return "bg-blue-500/20 text-blue-400"
        case "stream_start":
          return "bg-green-500/20 text-green-400"
        case "stream_end":
          return "bg-red-500/20 text-red-400"
        default:
          return "bg-purple-500/20 text-purple-400"
      }
    }

    return (
      <Card className="p-4 bg-gray-900/80 transition-all duration-200 hover:bg-gray-900">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onToggleExpand}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onToggleExpand()
              e.preventDefault()
            }
          }}
        >
          <div className={`p-2 rounded-full flex-shrink-0 ${getTransactionBgColor()}`}>{getTransactionIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="font-medium capitalize truncate">{tx.type.replace("_", " ")}</div>
              <div className="text-sm text-gray-400 ml-2 truncate">
                {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <div className="text-gray-400 truncate">From: {truncateAddress(tx.from)}</div>
              <div className="text-gray-400 ml-2 truncate">{tx.value}</div>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={cn("text-gray-400 transition-transform flex-shrink-0", isExpanded ? "transform rotate-180" : "")}
            aria-hidden="true"
          />
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-700 transition-all duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hash:</span>
                  <span className="truncate ml-2 max-w-[120px]">{tx.hash}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">To:</span>
                  <span>{truncateAddress(tx.to)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gas Used:</span>
                  <span>{tx.gasUsed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gas Price:</span>
                  <span>{tx.gasPrice}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-gray-700 flex items-center justify-center gap-1"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>View Transaction Details</span>
            </Button>
          </div>
        )}
      </Card>
    )
  },
)

TransactionItem.displayName = "TransactionItem"

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  // Use our custom hook for responsive grid
  const { containerRef, columns } = useResponsiveGrid({
    small: 800,
    medium: 1200,
  })

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px)")
  const isLargeDesktop = useMediaQuery("(min-width: 1536px)")

  // Memoize grid class to prevent unnecessary re-renders
  const gridClass = useMemo(() => {
    return cn(
      "grid gap-3",
      columns === 1
        ? "grid-cols-1"
        : columns === 2
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    )
  }, [columns])

  // Handle search with useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!searchQuery.trim()) return

      // Mock search functionality
      if (searchQuery.startsWith("0x")) {
        // Searching for address or transaction
        const txResults = mockTransactions.filter(
          (tx) => tx.hash.includes(searchQuery) || tx.from.includes(searchQuery) || tx.to.includes(searchQuery),
        )
        setSearchResults(txResults.length > 0 ? txResults : [])
      } else if (!isNaN(Number(searchQuery))) {
        // Searching for block number
        const blockNumber = Number.parseInt(searchQuery)
        const blockResults = mockBlocks.filter((block) => block.number === blockNumber)
        setSearchResults(blockResults.length > 0 ? blockResults : [])
      } else {
        setSearchResults([])
      }
    },
    [searchQuery],
  )

  // Toggle block expansion with useCallback
  const toggleBlockExpansion = useCallback((blockNumber: number) => {
    setExpandedBlock((prev) => (prev === blockNumber ? null : blockNumber))
  }, [])

  // Toggle transaction expansion with useCallback
  const toggleTxExpansion = useCallback((txHash: string) => {
    setExpandedTx((prev) => (prev === txHash ? null : txHash))
  }, [])

  // Sidebar content for desktop layout
  const sidebarContent = useMemo(
    () => (
      <div className="space-y-4 px-2">
        <div className="text-sm font-medium text-gray-400">Chain Statistics</div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Total Blocks:</span>
            <span>{mockChainStats.totalBlocks.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Transactions:</span>
            <span>{mockChainStats.totalTransactions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Active Streams:</span>
            <span>{mockChainStats.activeStreams.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Smart Contracts:</span>
            <span>{mockChainStats.totalContracts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">TPS:</span>
            <span>{mockChainStats.averageTPS}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Gas Price:</span>
            <span>{mockChainStats.currentGasPrice}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">TVL:</span>
            <span>{mockChainStats.totalValueLocked}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Unique Addresses:</span>
            <span>{mockChainStats.uniqueAddresses.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ),
    [],
  )

  return (
    <DesktopLayout sidebar={isDesktop ? sidebarContent : undefined}>
      <div ref={containerRef} className={cn("flex flex-col w-full", isDesktop ? "px-6" : "px-4", "mx-auto")}>
        <h1 className="text-2xl font-bold mb-4 self-start">Block Explorer</h1>

        {/* Feature highlights - only visible on desktop/tablet */}
        {(isDesktop || isTablet) && (
          <div className="mb-6">
            <Card className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-medium mb-1">Blockchain Features</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    This blockchain supports natural language contracts and real-time token streaming, making it easier
                    to create and manage digital agreements without complex coding.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Natural Language Contracts
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Token Streaming</Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Human Verification</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search section */}
        <Card className={cn("w-full p-4 bg-gray-900/80 mb-6", isDesktop ? "max-w-none" : "max-w-md mx-auto")}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by address, tx hash, or block"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border-gray-700"
              aria-label="Search input"
            />
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600" aria-label="Search">
              <Search size={18} aria-hidden="true" />
            </Button>
          </form>
        </Card>

        {/* Search results */}
        {searchResults !== null && (
          <Card className={cn("w-full p-4 bg-gray-900/80 mb-6", isDesktop ? "max-w-none" : "max-w-md mx-auto")}>
            <h2 className="text-lg font-medium mb-3">Search Results</h2>
            {searchResults.length === 0 ? (
              <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
            ) : (
              <div className={gridClass}>
                {searchResults.map((result, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-lg text-sm">
                    {"number" in result ? (
                      // Block result
                      <>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Block:</span>
                          <span>#{result.number}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Time:</span>
                          <span>{formatDistanceToNow(result.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transactions:</span>
                          <span>{result.transactions}</span>
                        </div>
                      </>
                    ) : (
                      // Transaction result
                      <>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Tx Hash:</span>
                          <span className="truncate max-w-[180px]">{result.hash}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">From:</span>
                          <span>{truncateAddress(result.from)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">To:</span>
                          <span>{truncateAddress(result.to)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Value:</span>
                          <span>{result.value}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Main content tabs */}
        <Tabs defaultValue="blocks" className={cn("w-full", isDesktop ? "max-w-none" : "max-w-md mx-auto")}>
          <TabsList className={cn("mb-4", isDesktop ? "w-auto" : "grid grid-cols-2 w-full")}>
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Latest Blocks</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>

          {/* Blocks tab */}
          <TabsContent value="blocks">
            <div className={gridClass}>
              {mockBlocks.map((block) => (
                <BlockItem
                  key={block.number}
                  block={block}
                  isExpanded={expandedBlock === block.number}
                  onToggleExpand={() => toggleBlockExpansion(block.number)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Transactions tab */}
          <TabsContent value="transactions">
            <div className={gridClass}>
              {mockTransactions.map((tx) => (
                <TransactionItem
                  key={tx.hash}
                  tx={tx}
                  isExpanded={expandedTx === tx.hash}
                  onToggleExpand={() => toggleTxExpansion(tx.hash)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional information for desktop */}
        {isDesktop && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <h2 className="text-xl font-bold mb-4">Blockchain Features</h2>
            <div className={cn("grid gap-6", isLargeDesktop ? "grid-cols-2" : "grid-cols-1")}>
              <Card className="p-4 bg-gray-900/80">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" aria-hidden="true" />
                  <span>Natural Language Contracts</span>
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Create smart contracts using plain English. Our system translates natural language into secure,
                  executable code that runs on the blockchain.
                </p>
                <div className="bg-gray-800 p-3 rounded-md text-sm">
                  <div className="font-medium mb-1">Example:</div>
                  <div className="text-gray-300">
                    "Send 5 UBI to @bob every week for 3 months" automatically creates a token stream contract without
                    writing code.
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-900/80">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <span>Token Streaming</span>
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Send tokens continuously in real-time instead of discrete transfers. Perfect for salaries,
                  subscriptions, and recurring payments.
                </p>
                <div className="bg-gray-800 p-3 rounded-md text-sm">
                  <div className="font-medium mb-1">Example:</div>
                  <div className="text-gray-300">
                    "0.1 UBI per minute" creates a continuous payment stream that recipients can withdraw from at any
                    time.
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DesktopLayout>
  )
}

