"use client"

import { useWalletStore } from "@/lib/stores/wallet-store"
import { truncateAddress } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export default function WalletCard() {
  const { balance, publicKey } = useWalletStore()

  return (
    <div className="w-full mb-6">
      <div className="rounded-xl p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative">
        <Badge variant="demo" className="absolute top-2 right-2 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Demo Data</span>
        </Badge>
        <div className="text-6xl font-bold mb-2">{balance.toFixed(2)}</div>
        <div className="flex justify-between items-center">
          <div className="text-xl">Wallet</div>
          <div className="text-sm opacity-80">{truncateAddress(publicKey)}</div>
        </div>
      </div>
    </div>
  )
}

