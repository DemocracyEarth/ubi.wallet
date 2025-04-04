"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Layers, FileText, ArrowUpRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { truncateAddress } from "@/lib/utils"

// Mock blockchain data
const mockBlocks = [
  {
    number: 1342567,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    transactions: 156,
    miner: "0x1a2b3c4d5e6f7g8h9i0j",
    size: "1.2 MB",
  },
  {
    number: 1342566,
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    transactions: 98,
    miner: "0x2b3c4d5e6f7g8h9i0j1a",
    size: "0.8 MB",
  },
  {
    number: 1342565,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    transactions: 210,
    miner: "0x3c4d5e6f7g8h9i0j1a2b",
    size: "1.5 MB",
  },
  {
    number: 1342564,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    transactions: 124,
    miner: "0x4d5e6f7g8h9i0j1a2b3c",
    size: "1.1 MB",
  },
  {
    number: 1342563,
    timestamp: new Date(Date.now() - 1000 * 60 * 6),
    transactions: 87,
    miner: "0x5e6f7g8h9i0j1a2b3c4d",
    size: "0.7 MB",
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
  },
  {
    hash: "0x1234567890abcdef1234567890abcdef",
    from: "0x2b3c4d5e6f7g8h9i0j1a",
    to: "0x8h7g6f5e4d3c2b1a0z9i",
    value: "0.75 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    type: "stream_start",
  },
  {
    hash: "0x7890abcdef1234567890abcdef123456",
    from: "0x3c4d5e6f7g8h9i0j1a2b",
    to: "0x7g6f5e4d3c2b1a0z9i8h",
    value: "5.0 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: "transfer",
  },
  {
    hash: "0xdef1234567890abcdef1234567890abc",
    from: "0x4d5e6f7g8h9i0j1a2b3c",
    to: "0x6f5e4d3c2b1a0z9i8h7g",
    value: "2.0 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: "stream_end",
  },
  {
    hash: "0x567890abcdef1234567890abcdef1234",
    from: "0x5e6f7g8h9i0j1a2b3c4d",
    to: "0x5e4d3c2b1a0z9i8h7g6f",
    value: "1.25 UBI",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "transfer",
  },
]

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  const handleSearch = (e: React.FormEvent) => {
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
  }

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      <h1 className="text-2xl font-bold mb-4 self-start">Block Explorer</h1>

      <Card className="w-full p-4 bg-gray-900/80 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by address, tx hash, or block"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800/50 border-gray-700"
          />
          <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
            <Search size={18} />
          </Button>
        </form>
      </Card>

      {searchResults !== null && (
        <Card className="w-full p-4 bg-gray-900/80 mb-4">
          <h2 className="text-lg font-medium mb-3">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
          ) : (
            <div className="space-y-3">
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

      <Tabs defaultValue="blocks" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="blocks" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Latest Blocks</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks">
          <div className="space-y-3">
            {mockBlocks.map((block, index) => (
              <Card key={index} className="p-4 bg-gray-900/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                    <Layers size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">Block #{block.number}</div>
                      <div className="text-sm text-gray-400">
                        {formatDistanceToNow(block.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <div className="text-gray-400">{block.transactions} txns</div>
                      <div className="text-gray-400">{block.size}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="space-y-3">
            {mockTransactions.map((tx, index) => (
              <Card key={index} className="p-4 bg-gray-900/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      tx.type === "transfer"
                        ? "bg-blue-500/20 text-blue-400"
                        : tx.type === "stream_start"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.type === "transfer" ? (
                      <ArrowUpRight size={20} />
                    ) : tx.type === "stream_start" ? (
                      <Clock size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium capitalize">{tx.type.replace("_", " ")}</div>
                      <div className="text-sm text-gray-400">
                        {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <div className="text-gray-400">From: {truncateAddress(tx.from)}</div>
                      <div className="text-gray-400">{tx.value}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

