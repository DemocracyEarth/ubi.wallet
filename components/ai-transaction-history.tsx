import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"
import { truncateAddress } from "@/lib/utils"

export default function AITransactionHistory() {
  const { outgoingRequests, fulfilledRequests } = useAIRequestStore()

  // Combine and sort transactions
  const transactions = [
    ...outgoingRequests
      .filter((req) => req.status !== "canceled")
      .map((req) => ({
        id: req.id,
        type: "outgoing",
        amount: req.reward,
        timestamp: req.createdAt,
        status: req.status,
        counterparty: req.providerName || (req.providerAddress ? truncateAddress(req.providerAddress) : "Network"),
        model: req.model,
        requestType: req.type,
      })),
    ...fulfilledRequests.map((req) => ({
      id: req.id,
      type: "incoming",
      amount: req.reward,
      timestamp: req.completedAt || req.createdAt,
      status: "completed",
      counterparty: req.requesterName || truncateAddress(req.requesterAddress),
      model: req.model,
      requestType: req.type,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (transactions.length === 0) {
    return (
      <Card className="w-full p-4 bg-gray-900/80 text-center">
        <p className="text-gray-400">No AI-related transactions yet</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4 bg-gray-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${tx.type === "incoming" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}
            >
              {tx.type === "incoming" ? <Server size={20} /> : <MessageSquare size={20} />}
            </div>
            <div>
              <div className="font-medium">{tx.type === "incoming" ? "AI Service Provided" : "AI Request"}</div>
              <div className="text-sm text-gray-400">
                {tx.type === "incoming" ? `To: ${tx.counterparty}` : `From: ${tx.counterparty}`}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {tx.model} • {tx.requestType}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold ${tx.type === "incoming" ? "text-green-400" : "text-blue-400"}`}>
              {tx.type === "incoming" ? "+" : "-"}
              {tx.amount} UBI
            </div>
            <div className="text-sm text-gray-400">{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</div>
            <div className="mt-1">
              {tx.status === "pending" && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
              )}
              {tx.status === "processing" && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Processing</Badge>
              )}
              {tx.status === "completed" && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
              )}
              {tx.status === "failed" && <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
