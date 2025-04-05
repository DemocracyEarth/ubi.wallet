"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Search, Rocket, BookOpen, Shield, HelpCircle } from "lucide-react"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ContractBuilder } from "@/components/contract-builder"
import { ContractBrowser } from "@/components/contract-browser"
import { ContractDeployer } from "@/components/contract-deployer"
import { NetworkSelector } from "@/components/network-selector"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SmartContractsPage() {
  const [activeTab, setActiveTab] = useState("build")
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [showDocumentation, setShowDocumentation] = useState(false)

  // Sidebar content for desktop layout
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <NetworkSelector />

      <div className="text-sm font-medium text-gray-400 mt-4">Recent Contracts</div>
      <div className="space-y-2">
        <div className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700">
          <div className="font-medium">Token Distribution</div>
          <div className="text-gray-400 mt-1 text-xs">A contract that distributes tokens to a list of addresses</div>
        </div>
        <div className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700">
          <div className="font-medium">Community Voting</div>
          <div className="text-gray-400 mt-1 text-xs">A voting system for community proposals</div>
        </div>
      </div>

      <div className="text-sm font-medium text-gray-400 mt-4">Learning Resources</div>
      <div className="space-y-1">
        <div className="text-xs flex items-center gap-1 text-blue-400 cursor-pointer hover:underline">
          <BookOpen className="h-3 w-3" />
          <span>Smart Contract Basics</span>
        </div>
        <div className="text-xs flex items-center gap-1 text-blue-400 cursor-pointer hover:underline">
          <BookOpen className="h-3 w-3" />
          <span>Natural Language Tips</span>
        </div>
        <div className="text-xs flex items-center gap-1 text-blue-400 cursor-pointer hover:underline">
          <BookOpen className="h-3 w-3" />
          <span>Deployment Guide</span>
        </div>
      </div>
    </div>
  )

  // Right panel content for desktop layout
  const rightPanelContent = showDocumentation ? (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documentation</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowDocumentation(false)} className="h-8 px-2">
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-blue-400">Creating Contracts with Natural Language</h4>
          <p className="text-xs text-gray-300 mt-1">
            Describe your contract in plain English. Be specific about what you want the contract to do, who should have
            access, and any conditions that should trigger actions.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-400">Example Prompts</h4>
          <ul className="text-xs text-gray-300 mt-1 space-y-2">
            <li className="bg-gray-750 p-2 rounded">
              "Create a token that has a fixed supply of 1 million, called 'Universal Basic Income' with the symbol
              'UBI'"
            </li>
            <li className="bg-gray-750 p-2 rounded">
              "Make an NFT collection with 10,000 items where creators get 5% royalties on all sales"
            </li>
            <li className="bg-gray-750 p-2 rounded">
              "Build a voting system where only token holders can vote, with one vote per address"
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-400">Security Best Practices</h4>
          <ul className="text-xs text-gray-300 mt-1 list-disc pl-4 space-y-1">
            <li>Always review the generated code before deployment</li>
            <li>Test contracts on testnets before mainnet deployment</li>
            <li>Consider a professional audit for high-value contracts</li>
            <li>Use access controls to restrict sensitive functions</li>
            <li>Implement emergency pause functionality for critical contracts</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-sm font-medium mb-2">Popular Contract Templates</h3>
        <div className="space-y-2">
          <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
            <div className="text-sm font-medium">Token with Vesting</div>
            <div className="text-xs text-gray-400 mt-1">A token that gradually unlocks for recipients over time</div>
          </div>
          <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
            <div className="text-sm font-medium">Community Treasury</div>
            <div className="text-xs text-gray-400 mt-1">A shared fund that requires multiple approvals to spend</div>
          </div>
          <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
            <div className="text-sm font-medium">Membership NFT</div>
            <div className="text-xs text-gray-400 mt-1">An NFT that grants access to exclusive features</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3">
        <div className="flex items-start gap-2">
          <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-300">Need Help?</h3>
            <p className="text-xs text-gray-300 mt-1">
              Check out our documentation for tips on creating effective natural language prompts.
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowDocumentation(true)}
              className="h-6 px-0 text-blue-400 text-xs"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-sm font-medium mb-2">Security Verification</h3>
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <Shield className="h-4 w-4" />
          <span>All generated contracts undergo automated security scanning</span>
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
      <div className={cn("max-w-full mx-auto", isDesktop ? "w-full" : "w-full")}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Natural Language Smart Contracts</h1>
          {!isDesktop && <NetworkSelector compact />}
        </div>

        <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4 mb-4">
          <h2 className="text-lg font-medium text-blue-300">Create Smart Contracts Using Plain English</h2>
          <p className="text-sm text-gray-300 mt-1">
            Describe what you want your smart contract to do in natural language. Our AI will generate, customize, and
            deploy your contract without requiring any coding knowledge.
          </p>
        </div>

        <Tabs defaultValue="build" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="build" className="flex items-center gap-1">
              <Code className="w-3.5 h-3.5" />
              <span>Build</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center gap-1">
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-4">
            <ContractBuilder />
          </TabsContent>

          <TabsContent value="browse" className="space-y-4">
            <ContractBrowser />
          </TabsContent>

          <TabsContent value="deploy" className="space-y-4">
            <ContractDeployer />
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}

