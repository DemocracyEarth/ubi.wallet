"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NetworkSelectorProps {
  compact?: boolean
}

type Network = {
  id: string
  name: string
  icon: React.ReactNode
  testnet: boolean
}

const networks: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum Mainnet",
    icon: <div className="w-3 h-3 rounded-full bg-blue-500" />,
    testnet: false,
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: <div className="w-3 h-3 rounded-full bg-purple-500" />,
    testnet: false,
  },
  {
    id: "optimism",
    name: "Optimism",
    icon: <div className="w-3 h-3 rounded-full bg-red-500" />,
    testnet: false,
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: <div className="w-3 h-3 rounded-full bg-blue-700" />,
    testnet: false,
  },
  {
    id: "goerli",
    name: "Goerli Testnet",
    icon: <div className="w-3 h-3 rounded-full bg-gray-500" />,
    testnet: true,
  },
  {
    id: "sepolia",
    name: "Sepolia Testnet",
    icon: <div className="w-3 h-3 rounded-full bg-gray-500" />,
    testnet: true,
  },
]

export function NetworkSelector({ compact = false }: NetworkSelectorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])

  return (
    <div className={cn(compact ? "" : "space-y-1")}>
      {!compact && <div className="text-sm font-medium text-gray-400">Network</div>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between border-gray-700 bg-gray-800 hover:bg-gray-700",
              compact ? "h-8 px-2" : "",
            )}
          >
            <div className="flex items-center gap-2">
              {selectedNetwork.icon}
              <span className={cn(compact ? "text-xs" : "text-sm")}>
                {compact ? selectedNetwork.name.split(" ")[0] : selectedNetwork.name}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <div className="font-medium text-xs px-2 py-1.5 text-gray-400">Mainnets</div>
          {networks
            .filter((n) => !n.testnet)
            .map((network) => (
              <DropdownMenuItem
                key={network.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setSelectedNetwork(network)}
              >
                {network.icon}
                <span>{network.name}</span>
                {selectedNetwork.id === network.id && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          <div className="font-medium text-xs px-2 py-1.5 text-gray-400 border-t border-gray-800 mt-1 pt-1">
            Testnets
          </div>
          {networks
            .filter((n) => n.testnet)
            .map((network) => (
              <DropdownMenuItem
                key={network.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setSelectedNetwork(network)}
              >
                {network.icon}
                <span>{network.name}</span>
                {selectedNetwork.id === network.id && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
