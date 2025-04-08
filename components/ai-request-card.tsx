"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ImageIcon, FileText, Code, AlertTriangle, RefreshCw, Coins } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  type AIRequest,
  type AIRequestStatus,
  type AIRequestType,
  useAIRequestStore,
} from "@/lib/stores/ai-request-store"
import { truncateAddress } from "@/lib/utils"

interface AIRequestCardProps {
  request: AIRequest
  mode: "outgoing" | "incoming" | "available" | "fulfilled"
}

export default function AIRequestCard({ request, mode }: AIRequestCardProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { cancelRequest, acceptRequest, completeRequest, failRequest, retryRequest } = useAIRequestStore()

  const getRequestTypeIcon = (type: AIRequestType) => {
    switch (type) {
      case "text":
        return <MessageSquare className="w-4 h-4 text-blue-400" />
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-400" />
      case "audio":
        return <FileText className="w-4 h-4 text-green-400" />
      case "code":
        return <Code className="w-4 h-4 text-yellow-400" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: AIRequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pending</Badge>
      case "processing":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case "canceled":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Canceled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleAccept = async () => {
    try {
      await acceptRequest(request.id)
    } catch (error) {
      console.error("Failed to accept request:", error)
    }
  }

  const handleComplete = async () => {
    if (!response.trim()) return

    setIsSubmitting(true)

    try {
      completeRequest(request.id, response)
    } catch (error) {
      console.error("Failed to complete request:", error)
      failRequest(request.id, "Failed to process request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    cancelRequest(request.id)
  }

  const handleRetry = () => {
    retryRequest(request.id)
  }

  return (
    <Card className={`w-full p-4 bg-gray-900/80 ${isExpanded ? "mb-4" : ""}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full 
            ${
              request.type === "text"
                ? "bg-blue-500/20"
                : request.type === "image"
                  ? "bg-purple-500/20"
                  : request.type === "audio"
                    ? "bg-green-500/20"
                    : "bg-yellow-500/20"
            }`}
          >
            {getRequestTypeIcon(request.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{request.type} Request</span>
              {getStatusBadge(request.status)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {mode === "outgoing"
                ? "Requested"
                : mode === "incoming"
                  ? "Accepted"
                  : mode === "fulfilled"
                    ? "Fulfilled"
                    : "Created"}{" "}
              {formatDistanceToNow(request.createdAt, { addSuffix: true })}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {mode === "outgoing"
                ? "Your request"
                : `From: ${request.requesterName || truncateAddress(request.requesterAddress)}`}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-green-400 font-medium">
            <Coins className="w-3.5 h-3.5" />
            <span>{request.reward} UBI</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Model: {request.model}</div>
          <Button variant="ghost" size="sm" className="mt-1 h-7 px-2" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="mb-3">
            <div className="text-sm font-medium mb-1">Prompt:</div>
            <div className="bg-gray-800/50 p-3 rounded-md text-sm">{request.prompt}</div>
          </div>

          {request.response && (
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Response:</div>
              <div className="bg-gray-800/50 p-3 rounded-md text-sm">{request.response}</div>
            </div>
          )}

          {request.errorMessage && (
            <div className="mb-3 bg-red-900/20 border border-red-800/30 p-3 rounded-md flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-400 mb-1">Error:</div>
                <div className="text-sm">{request.errorMessage}</div>
              </div>
            </div>
          )}

          {mode === "incoming" && request.status === "processing" && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Your Response:</div>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response..."
                className="bg-gray-800/50 border-gray-700 min-h-[100px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => failRequest(request.id, "Request declined by provider")}
                  className="border-red-800/50 hover:bg-red-900/30 text-red-400"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleComplete}
                  disabled={!response.trim() || isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </Button>
              </div>
            </div>
          )}

          {mode === "available" && (
            <div className="mt-3 flex justify-end">
              <Button onClick={handleAccept} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Accept Request
              </Button>
            </div>
          )}

          {mode === "outgoing" && request.status === "pending" && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-red-800/50 hover:bg-red-900/30 text-red-400"
              >
                Cancel Request
              </Button>
            </div>
          )}

          {mode === "outgoing" && request.status === "failed" && request.retryCount < request.maxRetries && (
            <div className="mt-3 flex justify-end">
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Request</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
