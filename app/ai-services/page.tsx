"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, FileText, Code, Rocket } from "lucide-react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ContractBuilder } from "@/components/contract-builder"
import { ContractBrowser } from "@/components/contract-browser"
import { ContractDeployer } from "@/components/contract-deployer"

export default function AIServicesPage() {
  const { balance } = useWalletStore()
  const [activeTab, setActiveTab] = useState("build")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Sidebar content for desktop layout
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <div className="text-sm font-medium text-gray-400">Quick Links</div>
      <div className="space-y-2">
        <div
          className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          onClick={() => setActiveTab("build")}
        >
          Create Token Contract
        </div>
        <div
          className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          onClick={() => setActiveTab("build")}
        >
          Create NFT Collection
        </div>
        <div
          className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          onClick={() => setActiveTab("browse")}
        >
          Browse Popular Contracts
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 text-xs text-gray-300">
        <p className="font-medium text-blue-300 mb-1">Natural Language Contracts</p>
        <p>
          Describe your smart contract in plain English, and our AI will generate the code for you. No coding experience
          required!
        </p>
      </div>

      <div className="text-sm font-medium text-gray-400">Resources</div>
      <div className="space-y-2">
        <div className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700">
          Contract Writing Guide
        </div>
        <div className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700">
          Security Best Practices
        </div>
        <div className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700">Deployment Tutorial</div>
      </div>
    </div>
  )

  // Right panel content for desktop layout
  const rightPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Network Status</h3>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Wallet Balance</span>
          <span className="text-blue-400 font-bold">{balance.toFixed(2)} UBI</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-750 rounded-lg p-2">
            <div className="text-xs text-gray-400">Gas Price</div>
            <div className="text-lg font-bold">12 Gwei</div>
          </div>
          <div className="bg-gray-750 rounded-lg p-2">
            <div className="text-xs text-gray-400">Network</div>
            <div className="text-lg font-bold">Ethereum</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium mb-2">Recent Activity</h4>
        <div className="space-y-2">
          <div className="p-2 bg-gray-750 rounded-md">
            <div className="text-sm">Contract Deployed</div>
            <div className="text-xs text-gray-400 mt-1">10:24 AM • UBI Token</div>
          </div>
          <div className="p-2 bg-gray-750 rounded-md">
            <div className="text-sm">Contract Generated</div>
            <div className="text-xs text-gray-400 mt-1">9:15 AM • NFT Collection</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
        <div>
          <p className="text-sm text-blue-300 font-medium mb-1">Need Help?</p>
          <p className="text-xs text-gray-300">
            Our AI assistant can help you create, customize, and deploy smart contracts. Just describe what you need in
            plain English.
          </p>
          <Button variant="outline" size="sm" className="mt-2 border-blue-800 text-blue-400 hover:bg-blue-900/20">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Get AI Assistance
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <DesktopLayout
      sidebar={isDesktop ? sidebarContent : undefined}
      rightPanel={rightPanelContent}
      showRightPanel={isDesktop}
    >
      <div className={isDesktop ? "w-full" : "w-full"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Smart Contract Platform</h1>
          <p className="text-gray-400 mt-1">
            Create, browse, and deploy smart contracts using natural language - no coding required
          </p>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="build" className="flex items-center gap-1">
              <Code className="w-3.5 h-3.5" />
              <span>Build</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center gap-1">
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-4">
            <Card className="p-4 bg-gray-900/80 border-gray-800">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Build Smart Contracts</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Describe your smart contract in natural language and our AI will generate the code for you
                </p>
              </div>

              <ContractBuilder />
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-4">
            <Card className="p-4 bg-gray-900/80 border-gray-800">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Browse Smart Contracts</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Explore our curated collection of smart contracts, all described in natural language
                </p>
              </div>

              <ContractBrowser />
            </Card>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-4">
            <Card className="p-4 bg-gray-900/80 border-gray-800">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Deploy Smart Contracts</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Deploy your generated contracts to the blockchain with a few simple steps
                </p>
              </div>

              <ContractDeployer />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}

