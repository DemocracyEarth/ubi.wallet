"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Check,
  Clock,
  Copy,
  ExternalLink,
  RefreshCw,
  Rocket,
  Wallet,
  HardDrive,
  Zap,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useContractStore } from "@/lib/stores/contract-store"

// Example saved contract data
interface SavedContract {
  id: string
  name: string
  description: string
  naturalLanguage: string
  createdAt: Date
  securityScore: number
}

// Example deployment data
interface Deployment {
  id: string
  contractId: string
  contractName: string
  address: string
  network: string
  deployedAt: Date
  transactionHash: string
  status: "success" | "pending" | "failed"
  gasUsed?: number
}

export function ContractDeployer() {
  const { toast } = useToast()
  const { contracts } = useContractStore()

  const [activeTab, setActiveTab] = useState("saved")
  const [selectedContract, setSelectedContract] = useState<SavedContract | null>(null)
  const [deploymentStep, setDeploymentStep] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentNetwork, setDeploymentNetwork] = useState("ethereum")
  const [deploymentParams, setDeploymentParams] = useState<Record<string, string>>({})
  const [deploymentResult, setDeploymentResult] = useState<Deployment | null>(null)

  // Example saved contracts
  const savedContracts: SavedContract[] = [
    {
      id: "1",
      name: "UBI Token",
      description: "A standard ERC-20 token with minting and burning capabilities.",
      naturalLanguage:
        "A token called 'Universal Basic Income' with the symbol 'UBI'. It has a fixed supply of 1 million tokens initially, but allows the owner to mint more tokens up to a maximum of 10 million.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      securityScore: 95,
    },
    {
      id: "2",
      name: "Community Voting",
      description: "A governance contract for community proposals and voting.",
      naturalLanguage:
        "A governance system where people who hold at least 100 tokens can submit proposals. Each proposal has a description and a voting period of 3 days.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      securityScore: 92,
    },
    ...contracts.map((contract) => ({
      id: contract.id,
      name: contract.name || "Unnamed Contract",
      description: contract.description,
      naturalLanguage: contract.prompt,
      createdAt: contract.createdAt,
      securityScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-99
    })),
  ]

  // Example deployments
  const deployments: Deployment[] = [
    {
      id: "1",
      contractId: "1",
      contractName: "UBI Token",
      address: "0x1234567890123456789012345678901234567890",
      network: "ethereum",
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      status: "success",
      gasUsed: 2450000,
    },
    {
      id: "2",
      contractId: "2",
      contractName: "Community Voting",
      address: "0x0987654321098765432109876543210987654321",
      network: "polygon",
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      transactionHash: "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
      status: "success",
      gasUsed: 3120000,
    },
    {
      id: "3",
      contractId: "3",
      contractName: "Token Staking",
      address: "0x5678901234567890123456789012345678901234",
      network: "arbitrum",
      deployedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      transactionHash: "0x1122334455667788990011223344556677889900112233445566778899001122",
      status: "pending",
    },
  ]

  const handleSelectContract = (contract: SavedContract) => {
    setSelectedContract(contract)
    setDeploymentStep(1)
    setDeploymentParams({})
    setDeploymentResult(null)
  }

  const handleDeployContract = async () => {
    if (!selectedContract) return

    setIsDeploying(true)

    try {
      // Simulate deployment process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result: Deployment = {
        id: Date.now().toString(),
        contractId: selectedContract.id,
        contractName: selectedContract.name,
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        network: deploymentNetwork,
        deployedAt: new Date(),
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: "success",
        gasUsed: Math.floor(Math.random() * 2000000) + 1000000,
      }

      setDeploymentResult(result)
      setDeploymentStep(3)

      toast({
        title: "Deployment Successful",
        description: `Your contract has been deployed to ${getNetworkName(deploymentNetwork)}.`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const getNetworkName = (networkId: string) => {
    const networks: Record<string, string> = {
      ethereum: "Ethereum Mainnet",
      polygon: "Polygon",
      optimism: "Optimism",
      arbitrum: "Arbitrum",
      goerli: "Goerli Testnet",
      sepolia: "Sepolia Testnet",
    }

    return networks[networkId] || networkId
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900/80">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="saved" className="text-sm">
              Saved Contracts
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              Deployment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-4">
            {selectedContract ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {selectedContract.name}
                      <Badge
                        className={`${
                          selectedContract.securityScore > 90
                            ? "bg-green-600"
                            : selectedContract.securityScore > 80
                              ? "bg-yellow-600"
                              : "bg-orange-600"
                        }`}
                      >
                        Security: {selectedContract.securityScore}/100
                      </Badge>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{selectedContract.description}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-700"
                    onClick={() => setSelectedContract(null)}
                  >
                    Change Contract
                  </Button>
                </div>

                <Separator className="bg-gray-800" />

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium mb-3">Deployment Process</h4>

                  <div className="flex mb-6">
                    <div className={`flex-1 text-center ${deploymentStep >= 1 ? "text-blue-400" : "text-gray-500"}`}>
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${
                          deploymentStep >= 1
                            ? "bg-blue-900/50 border-2 border-blue-500"
                            : "bg-gray-800 border border-gray-700"
                        }`}
                      >
                        1
                      </div>
                      <div className="text-xs">Configure</div>
                    </div>
                    <div
                      className={`h-0.5 flex-1 self-center ${deploymentStep >= 2 ? "bg-blue-500" : "bg-gray-700"}`}
                    ></div>
                    <div className={`flex-1 text-center ${deploymentStep >= 2 ? "text-blue-400" : "text-gray-500"}`}>
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${
                          deploymentStep >= 2
                            ? "bg-blue-900/50 border-2 border-blue-500"
                            : "bg-gray-800 border border-gray-700"
                        }`}
                      >
                        2
                      </div>
                      <div className="text-xs">Deploy</div>
                    </div>
                    <div
                      className={`h-0.5 flex-1 self-center ${deploymentStep >= 3 ? "bg-blue-500" : "bg-gray-700"}`}
                    ></div>
                    <div className={`flex-1 text-center ${deploymentStep >= 3 ? "text-blue-400" : "text-gray-500"}`}>
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${
                          deploymentStep >= 3
                            ? "bg-blue-900/50 border-2 border-blue-500"
                            : "bg-gray-800 border border-gray-700"
                        }`}
                      >
                        3
                      </div>
                      <div className="text-xs">Complete</div>
                    </div>
                  </div>

                  {deploymentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="network">Target Network</Label>
                        <select
                          id="network"
                          value={deploymentNetwork}
                          onChange={(e) => setDeploymentNetwork(e.target.value)}
                          className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded-md p-2 text-sm"
                        >
                          <option value="ethereum">Ethereum Mainnet</option>
                          <option value="polygon">Polygon</option>
                          <option value="optimism">Optimism</option>
                          <option value="arbitrum">Arbitrum</option>
                          <option value="goerli">Goerli Testnet</option>
                          <option value="sepolia">Sepolia Testnet</option>
                        </select>
                      </div>

                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-300">
                          <p className="font-medium text-blue-300 mb-1">Deployment Parameters</p>
                          <p>
                            We've automatically configured your contract based on your natural language description. You
                            can review and adjust the parameters below if needed.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="param-name">Token Name</Label>
                          <Input
                            id="param-name"
                            value={deploymentParams.name || "Universal Basic Income"}
                            onChange={(e) => setDeploymentParams((prev) => ({ ...prev, name: e.target.value }))}
                            className="mt-1 bg-gray-700/50 border-gray-600"
                          />
                        </div>

                        <div>
                          <Label htmlFor="param-symbol">Token Symbol</Label>
                          <Input
                            id="param-symbol"
                            value={deploymentParams.symbol || "UBI"}
                            onChange={(e) => setDeploymentParams((prev) => ({ ...prev, symbol: e.target.value }))}
                            className="mt-1 bg-gray-700/50 border-gray-600"
                          />
                        </div>

                        <div>
                          <Label htmlFor="param-supply">Initial Supply</Label>
                          <Input
                            id="param-supply"
                            type="number"
                            value={deploymentParams.supply || "1000000"}
                            onChange={(e) => setDeploymentParams((prev) => ({ ...prev, supply: e.target.value }))}
                            className="mt-1 bg-gray-700/50 border-gray-600"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => setDeploymentStep(2)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Continue to Deployment
                        </Button>
                      </div>
                    </div>
                  )}

                  {deploymentStep === 2 && (
                    <div className="space-y-4">
                      <div className="bg-gray-750 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Deployment Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Contract:</span>
                            <span>{selectedContract.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network:</span>
                            <span>{getNetworkName(deploymentNetwork)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimated Gas:</span>
                            <span>~2,500,000 gas units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimated Cost:</span>
                            <span>~0.05 ETH</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-md p-3 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-300">
                          <p className="font-medium text-yellow-300 mb-1">Important</p>
                          <p>
                            Deploying a contract to mainnet will incur gas fees. Make sure you have enough funds in your
                            wallet. Consider deploying to a testnet first to verify functionality.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setDeploymentStep(1)} className="border-gray-700">
                          Back
                        </Button>

                        <Button
                          onClick={handleDeployContract}
                          disabled={isDeploying}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {isDeploying ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Deploying...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              Deploy Contract
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {deploymentStep === 3 && deploymentResult && (
                    <div className="space-y-4">
                      <div className="bg-green-900/20 border border-green-800/30 rounded-md p-3 flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium text-green-300 mb-1">Deployment Successful!</p>
                          <p>
                            Your contract has been successfully deployed to {getNetworkName(deploymentResult.network)}.
                            You can now interact with your contract using the address below.
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-750 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Deployment Details</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Contract Address:</div>
                            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                              <code className="text-xs flex-1 overflow-hidden text-ellipsis">
                                {deploymentResult.address}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(deploymentResult.address)
                                  toast({
                                    title: "Address Copied",
                                    description: "Contract address copied to clipboard.",
                                    variant: "default",
                                  })
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-400 mb-1">Transaction Hash:</div>
                            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                              <code className="text-xs flex-1 overflow-hidden text-ellipsis">
                                {deploymentResult.transactionHash}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(deploymentResult.transactionHash)
                                  toast({
                                    title: "Hash Copied",
                                    description: "Transaction hash copied to clipboard.",
                                    variant: "default",
                                  })
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">Network:</span>
                            <span>{getNetworkName(deploymentResult.network)}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">Gas Used:</span>
                            <span>{deploymentResult.gasUsed?.toLocaleString() || "Pending"}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">Deployed At:</span>
                            <span>{formatDate(deploymentResult.deployedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          className="border-gray-700"
                          onClick={() => {
                            window.open(`https://etherscan.io/address/${deploymentResult.address}`, "_blank")
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on Explorer
                        </Button>

                        <Button
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                          onClick={() => {
                            setSelectedContract(null)
                            setDeploymentStep(1)
                            setDeploymentResult(null)
                            toast({
                              title: "Ready for Next Deployment",
                              description: "You can now deploy another contract.",
                              variant: "default",
                            })
                          }}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Deploy Another Contract
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4 flex items-start gap-3">
                  <Rocket className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-300">Deploy Your Smart Contract</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Select a contract from your saved contracts to deploy to the blockchain. You can deploy to mainnet
                      or testnet networks.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedContracts.length === 0 ? (
                    <div className="md:col-span-2 text-center py-8 text-gray-400">
                      No saved contracts found. Build a contract first.
                    </div>
                  ) : (
                    savedContracts.map((contract) => (
                      <Card
                        key={contract.id}
                        className="p-4 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                        onClick={() => handleSelectContract(contract)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{contract.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{contract.description}</p>
                          </div>
                          <Badge
                            className={`${
                              contract.securityScore > 90
                                ? "bg-green-600"
                                : contract.securityScore > 80
                                  ? "bg-yellow-600"
                                  : "bg-orange-600"
                            }`}
                          >
                            {contract.securityScore}/100
                          </Badge>
                        </div>

                        <div className="mt-3 text-xs text-gray-400">Created: {formatDate(contract.createdAt)}</div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium mb-3">Deployment History</h3>

              <div className="space-y-3">
                {deployments.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">No deployment history found.</div>
                ) : (
                  deployments.map((deployment) => (
                    <div key={deployment.id} className="bg-gray-750 rounded-md p-3 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{deployment.contractName}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <HardDrive className="h-3.5 w-3.5" />
                            <span>{getNetworkName(deployment.network)}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            deployment.status === "success"
                              ? "outline"
                              : deployment.status === "pending"
                                ? "default"
                                : "destructive"
                          }
                          className={cn(
                            "text-xs",
                            deployment.status === "success"
                              ? "border-green-800 text-green-400"
                              : deployment.status === "pending"
                                ? "bg-yellow-600"
                                : "",
                          )}
                        >
                          {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-400 mb-1">Address:</div>
                            <div className="font-mono truncate">{deployment.address}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Deployed:</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDate(deployment.deployedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700 text-xs">
                        <a
                          href="#"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View on Explorer</span>
                        </a>

                        <Button variant="outline" size="sm" className="h-7 text-xs border-gray-700">
                          <Wallet className="mr-1 h-3.5 w-3.5" />
                          Interact
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

