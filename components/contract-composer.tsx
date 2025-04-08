"use client"

import type React from "react"

import { useState } from "react"
import { useContractStore } from "@/lib/stores/contract-store"
import { Input } from "@/components/ui/input"
import { MessageSquare } from "lucide-react"

export default function ContractComposer() {
  const [contractText, setContractText] = useState("")
  const { generateContract, currentContract } = useContractStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contractText.trim()) {
      generateContract(contractText)
    }
  }

  return (
    <div className="w-full mb-6">
      <h2 className="text-2xl font-bold mb-4">New Smart Contract</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <Input
            className="w-full p-4 bg-gradient-to-r from-blue-900/40 to-pink-900/40 border-blue-500/30 border rounded-xl text-white"
            placeholder="Describe your smart contract in plain language..."
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
          />
        </div>
      </form>

      {currentContract && (
        <div className="relative">
          <div className="rounded-xl p-4 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-orange-600/30 text-white">
            <p>{currentContract.description}</p>
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-2">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
