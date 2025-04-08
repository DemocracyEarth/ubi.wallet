"use client"

import { useWalletStore } from "@/lib/stores/wallet-store"
import { truncateAddress } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export default function WalletCard() {
  const { balance, publicKey } = useWalletStore()

  return (
    <div className="w-full mb-6">
      <div className="rounded-xl p-6 relative overflow-hidden">
        {/* Gradient background with enhanced 3D effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHBzOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxwYXRoIGQ9Ik0zNiAzNHY2aDZ2LTZoLTZ6bTAgMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        {/* Highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10"></div>

        {/* Border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/20"></div>

        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-xl shadow-inner"></div>

        <Badge variant="demo" className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <AlertTriangle className="h-3 w-3" />
          <span>Demo Data</span>
        </Badge>

        <div className="relative z-10">
          <div className="text-6xl font-bold mb-2 text-white">{balance.toFixed(2)}</div>
          <div className="flex justify-between items-center">
            <div className="text-xl text-white">Wallet</div>
            <div className="text-sm text-white/80">{truncateAddress(publicKey)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
