"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Server, Zap, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"

export default function AIServiceSummary() {
  const { totalEarned, totalSpent, fulfilledRequests, outgoingRequests, isProviding } = useAIRequestStore()

  // Calculate some statistics
  const totalRequests = fulfilledRequests.length + outgoingRequests.length
  const successRate =
    fulfilledRequests.length > 0
      ? Math.round(
          (fulfilledRequests.length /
            (fulfilledRequests.length + outgoingRequests.filter((r) => r.status === "failed").length)) *
            100,
        )
      : 0

  // Calculate net earnings
  const netEarnings = totalEarned - totalSpent

  if (totalRequests === 0) {
    return (
      <Card className="w-full p-4 bg-gray-900/80 text-center">
        <p className="text-gray-400">No AI service activity yet</p>
        <p className="text-sm text-gray-500 mt-1">Create or fulfill AI requests to see your statistics</p>
      </Card>
    )
  }

  return (
    <Card className="w-full p-4 bg-gray-900/80">
      <div className="flex items-center gap-2 mb-3">
        <Server className="w-5 h-5 text-purple-400" />
        <h3 className="font-medium">AI Services Summary</h3>
        <div
          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isProviding ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"}`}
        >
          {isProviding ? "Providing" : "Not Providing"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <ArrowDownLeft className="w-3 h-3 text-green-400" />
            <span>Earned</span>
          </div>
          <div className="text-lg font-bold text-green-400">{totalEarned.toFixed(2)} UBI</div>
          <div className="text-xs text-gray-400 mt-0.5">{fulfilledRequests.length} fulfilled</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <ArrowUpRight className="w-3 h-3 text-blue-400" />
            <span>Spent</span>
          </div>
          <div className="text-lg font-bold text-blue-400">{totalSpent.toFixed(2)} UBI</div>
          <div className="text-xs text-gray-400 mt-0.5">{outgoingRequests.length} requests</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-xs text-gray-400">Success Rate</span>
          <span className="text-xs font-medium">{successRate}%</span>
        </div>
        <Progress value={successRate} className="h-1.5" />
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Net Earnings:</span>
        </div>
        <div className={`font-bold ${netEarnings >= 0 ? "text-green-400" : "text-red-400"}`}>
          {netEarnings >= 0 ? "+" : ""}
          {netEarnings.toFixed(2)} UBI
        </div>
      </div>
    </Card>
  )
}
