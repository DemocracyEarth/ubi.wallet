"use client"

import { Card } from "@/components/ui/card"
import { Server, Activity, ExternalLink } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import PersistentDemoNotice from "@/components/persistent-demo-notice"

export default function NodePage() {
  const [lightNodeEnabled, setLightNodeEnabled] = useState(true)
  const [syncProgress, setSyncProgress] = useState(78)
  const [peerCount, setPeerCount] = useState(12)

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      <PersistentDemoNotice className="w-full mb-4" />
      <h1 className="text-2xl font-bold mb-4 self-start">Node Settings</h1>

      <Card className="w-full p-5 bg-gray-900/80 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-medium">Light Node</h2>
          </div>
          <Switch checked={lightNodeEnabled} onCheckedChange={setLightNodeEnabled} />
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Run a light node to contribute to the network while using minimal resources.
        </p>

        <div className="bg-gray-800 p-3 rounded-lg text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400">Running</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Peers:</span>
            <span>{peerCount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Sync:</span>
            <span>{syncProgress}%</span>
          </div>
          <div className="mt-2">
            <Progress value={syncProgress} className="h-1.5" />
          </div>
        </div>
      </Card>

      <Card className="w-full p-5 bg-gray-900/80">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-medium">Network Stats</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span>ubi.eth Mainnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Latest Block:</span>
            <span>#1,342,567</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">TPS:</span>
            <span>24.3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gas Price:</span>
            <span>12 gwei</span>
          </div>
        </div>

        <Link href="/explorer">
          <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2 border-gray-700">
            Open Block Explorer <ExternalLink size={14} />
          </Button>
        </Link>
      </Card>
    </main>
  )
}

