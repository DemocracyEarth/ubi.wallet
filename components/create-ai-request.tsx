"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, MessageSquare, ImageIcon, FileText, Code, AlertCircle } from "lucide-react"
import { useAIRequestStore, type AIRequestType } from "@/lib/stores/ai-request-store"
import { useWalletStore } from "@/lib/stores/wallet-store"

export default function CreateAIRequest() {
  const { balance } = useWalletStore()
  const { createRequest } = useAIRequestStore()

  const [requestType, setRequestType] = useState<AIRequestType>("text")
  const [model, setModel] = useState("gpt-4o")
  const [prompt, setPrompt] = useState("")
  const [reward, setReward] = useState("0.15")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Model options based on request type
  const modelOptions = {
    text: ["gpt-4o", "gpt-3.5-turbo", "claude-3-opus", "claude-3-sonnet", "mistral-large", "mistral-medium"],
    image: ["stable-diffusion-xl", "stable-diffusion-3", "dall-e-3"],
    audio: ["whisper-large", "whisper-medium"],
    code: ["gpt-4o", "claude-3-opus", "mistral-large"],
  }

  const handleTypeChange = (type: AIRequestType) => {
    setRequestType(type)
    // Set default model for the selected type
    setModel(modelOptions[type][0])
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    if (isNaN(Number(reward)) || Number(reward) <= 0) {
      setError("Please enter a valid reward amount")
      return
    }

    if (Number(reward) > balance) {
      setError("Insufficient balance for this reward amount")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createRequest({
        type: requestType,
        prompt,
        model,
        reward: Number(reward),
      })

      // Reset form
      setPrompt("")
      setReward("0.15")
    } catch (error: any) {
      setError(error.message || "Failed to create request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full p-5 bg-gray-900/80">
      <h2 className="text-xl font-bold mb-4">Create AI Request</h2>

      <div className="space-y-4">
        <div>
          <Label>Request Type</Label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            <Button
              type="button"
              variant={requestType === "text" ? "default" : "outline"}
              className={`flex flex-col items-center py-2 ${requestType === "text" ? "bg-blue-600" : "border-gray-700"}`}
              onClick={() => handleTypeChange("text")}
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Text</span>
            </Button>

            <Button
              type="button"
              variant={requestType === "image" ? "default" : "outline"}
              className={`flex flex-col items-center py-2 ${requestType === "image" ? "bg-purple-600" : "border-gray-700"}`}
              onClick={() => handleTypeChange("image")}
            >
              <ImageIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Image</span>
            </Button>

            <Button
              type="button"
              variant={requestType === "audio" ? "default" : "outline"}
              className={`flex flex-col items-center py-2 ${requestType === "audio" ? "bg-green-600" : "border-gray-700"}`}
              onClick={() => handleTypeChange("audio")}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Audio</span>
            </Button>

            <Button
              type="button"
              variant={requestType === "code" ? "default" : "outline"}
              className={`flex flex-col items-center py-2 ${requestType === "code" ? "bg-yellow-600" : "border-gray-700"}`}
              onClick={() => handleTypeChange("code")}
            >
              <Code className="w-5 h-5 mb-1" />
              <span className="text-xs">Code</span>
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model" className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions[requestType].map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              requestType === "text"
                ? "Enter your text prompt..."
                : requestType === "image"
                  ? "Describe the image you want to generate..."
                  : requestType === "audio"
                    ? "Describe the audio processing task..."
                    : "Describe the code you need..."
            }
            className="bg-gray-800/50 border-gray-700 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="reward" className="flex justify-between">
            <span>Reward (UBI)</span>
            <span className="text-xs text-gray-400">Balance: {balance.toFixed(2)} UBI</span>
          </Label>
          <div className="flex gap-2 items-center">
            <Coins className="w-5 h-5 text-green-400" />
            <Input
              id="reward"
              type="number"
              step="0.01"
              min="0.01"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="bg-gray-800/50 border-gray-700"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Higher rewards may attract faster responses</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-md p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {isSubmitting ? "Creating Request..." : "Create Request"}
        </Button>
      </div>
    </Card>
  )
}

