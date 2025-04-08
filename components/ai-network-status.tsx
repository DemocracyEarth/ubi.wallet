"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, Server, Users, Clock } from "lucide-react"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"
import { useEffect, useState } from "react"

export default function AINetworkStatus() {
  const {
    isProviding,
    toggleProviding,
    totalEarned,
    totalSpent,
    incomingRequests,
    outgoingRequests,
    availableRequests,
    fulfilledRequests,
    mockNetworkActivity,
  } = useAIRequestStore()

  const [networkNodes, setNetworkNodes] = useState(24)
  const [activeProviders, setActiveProviders] = useState(18)
  const [avgResponseTime, setAvgResponseTime] = useState(45) // seconds
  const [networkLoad, setNetworkLoad] = useState(62) // percent

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      mockNetworkActivity()

      // Simulate fluctuations in network stats
      setNetworkNodes((prev) => Math.max(20, Math.min(30, prev + Math.floor(Math.random() * 3) - 1)))
      setActiveProviders((prev) => Math.max(15, Math.min(25, prev + Math.floor(Math.random() * 3) - 1)))
      setAvgResponseTime((prev) => Math.max(30, Math.min(60, prev + Math.floor(Math.random() * 5) - 2)))
      setNetworkLoad((prev) => Math.max(40, Math.min(85, prev + Math.floor(Math.random() * 6) - 3)))
    }, 5000)

    return () => clearInterval(interval)
  }, [mockNetworkActivity])

  return (
    <Card className="w-full p-5 bg-gray-900/80">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold">Network Status</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Provide AI Services</span>
          <Switch checked={isProviding} onCheckedChange={toggleProviding} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Network Nodes</span>
          </div>
          <div className="text-xl font-bold">{networkNodes}</div>
          <div className="text-xs text-gray-400 mt-1">{activeProviders} active providers</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Avg Response</span>
          </div>
          <div className="text-xl font-bold">{avgResponseTime}s</div>
          <div className="text-xs text-gray-400 mt-1">Network-wide average</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Network Load</span>
          <span>{networkLoad}%</span>
        </div>
        <Progress value={networkLoad} className="h-2" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Earned</div>
          <div className="text-xl font-bold text-green-400">{totalEarned.toFixed(2)} UBI</div>
          <div className="text-xs text-gray-400 mt-1">From {fulfilledRequests.length} requests</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Spent</div>
          <div className="text-xl font-bold text-yellow-400">{totalSpent.toFixed(2)} UBI</div>
          <div className="text-xs text-gray-400 mt-1">On {outgoingRequests.length} requests</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{availableRequests.length} Available</Badge>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          {incomingRequests.filter((r) => r.status === "processing").length} Processing
        </Badge>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {fulfilledRequests.length} Fulfilled
        </Badge>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          {incomingRequests.filter((r) => r.status === "failed").length +
            outgoingRequests.filter((r) => r.status === "failed").length}{" "}
          Failed
        </Badge>
      </div>

      {isProviding && (
        <div className="mt-4 bg-green-900/20 border border-green-800/30 rounded-md p-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-sm text-green-300 font-medium">You are providing AI services</p>
            <p className="text-xs text-gray-300">
              You'll receive requests from the network and earn UBI for fulfilling them
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
