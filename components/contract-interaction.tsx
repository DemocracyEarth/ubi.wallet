"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, Clock, Code, Copy, ExternalLink, FileText, RefreshCw, Search, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Example deployed contract data
interface DeployedContract {
  id: string
  name: string
  address: string
  network: string
  abi: any[]
  deployedAt: Date
  lastInteraction: Date
  transactionCount: number
  verified: boolean
}

// Example function data
interface ContractFunction {
  name: string
  type: "read" | "write"
  inputs: { name: string; type: string }[]
  outputs?: { name: string; type: string }[]
  stateMutability: string
}

// Example transaction data
interface Transaction {
  id: string
  hash: string
  function: string
  timestamp: Date
  status: "success" | "pending" | "failed"
  args: any[]
  result?: any
  gasUsed?: number
}

const exampleDeployedContracts: DeployedContract[] = [
  {
    id: "1",
    name: "UBI Token",
    address: "0x1234567890123456789012345678901234567890",
    network: "ethereum",
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
      {
        name: "totalSupply",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    transactionCount: 156,
    verified: true,
  },
  {
    id: "2",
    name: "Governance Contract",
    address: "0x0987654321098765432109876543210987654321",
    network: "polygon",
    abi: [
      {
        name: "propose",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "description", type: "string" }],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "castVote",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "proposalId", type: "uint256" },
          { name: "support", type: "bool" },
        ],
        outputs: [],
      },
      {
        name: "execute",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "proposalId", type: "uint256" }],
        outputs: [],
      },
      {
        name: "getProposal",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "proposalId", type: "uint256" }],
        outputs: [
          { name: "id", type: "uint256" },
          { name: "proposer", type: "address" },
          { name: "description", type: "string" },
          { name: "forVotes", type: "uint256" },
          { name: "againstVotes", type: "uint256" },
          { name: "startBlock", type: "uint256" },
          { name: "endBlock", type: "uint256" },
          { name: "executed", type: "bool" },
        ],
      },
    ],
    deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    transactionCount: 89,
    verified: true,
  },
  {
    id: "3",
    name: "Decentralized Exchange",
    address: "0x5678901234567890123456789012345678901234",
    network: "arbitrum",
    abi: [
      {
        name: "swapTokens",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
        ],
        outputs: [{ name: "amountOut", type: "uint256" }],
      },
      {
        name: "addLiquidity",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "tokenA", type: "address" },
          { name: "tokenB", type: "address" },
          { name: "amountA", type: "uint256" },
          { name: "amountB", type: "uint256" },
        ],
        outputs: [{ name: "liquidity", type: "uint256" }],
      },
      {
        name: "removeLiquidity",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "tokenA", type: "address" },
          { name: "tokenB", type: "address" },
          { name: "liquidity", type: "uint256" },
        ],
        outputs: [
          { name: "amountA", type: "uint256" },
          { name: "amountB", type: "uint256" },
        ],
      },
      {
        name: "getReserves",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [
          { name: "reserveA", type: "uint256" },
          { name: "reserveB", type: "uint256" },
        ],
      },
    ],
    deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    transactionCount: 42,
    verified: true,
  },
]

const exampleTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    function: "transfer",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "success",
    args: ["0x1234...5678", "1000000000000000000"],
    result: true,
    gasUsed: 52000,
  },
  {
    id: "2",
    hash: "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
    function: "approve",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "success",
    args: ["0x9876...4321", "5000000000000000000"],
    result: true,
    gasUsed: 46000,
  },
  {
    id: "3",
    hash: "0x1122334455667788990011223344556677889900112233445566778899001122",
    function: "propose",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    status: "success",
    args: ["Proposal to increase UBI distribution rate"],
    result: 1,
    gasUsed: 156000,
  },
  {
    id: "4",
    hash: "0x2233445566778899001122334455667788990011223344556677889900112233",
    function: "castVote",
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    status: "pending",
    args: [1, true],
  },
]

export function ContractInteraction() {
  const { toast } = useToast()
  const [selectedContract, setSelectedContract] = useState<DeployedContract | null>(exampleDeployedContracts[0])
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null)
  const [functionInputs, setFunctionInputs] = useState<Record<string, string>>({})
  const [functionResult, setFunctionResult] = useState<any>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState("interact")
  const [searchAddress, setSearchAddress] = useState("")

  const handleContractSelect = (contract: DeployedContract) => {
    setSelectedContract(contract)
    setSelectedFunction(null)
    setFunctionInputs({})
    setFunctionResult(null)
  }

  const handleFunctionSelect = (func: ContractFunction) => {
    setSelectedFunction(func)
    setFunctionInputs({})
    setFunctionResult(null)
  }

  const handleInputChange = (name: string, value: string) => {
    setFunctionInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleExecuteFunction = async () => {
    if (!selectedFunction) return

    setIsExecuting(true)
    setFunctionResult(null)

    try {
      // Simulate blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock result based on function
      let result
      if (selectedFunction.name === "balanceOf") {
        result = "1000000000000000000" // 1 ETH in wei
      } else if (selectedFunction.name === "totalSupply") {
        result = "1000000000000000000000000" // 1M tokens
      } else if (selectedFunction.name === "transfer" || selectedFunction.name === "approve") {
        result = true
      } else if (selectedFunction.name === "propose") {
        result = 2 // proposal ID
      } else if (selectedFunction.name === "getProposal") {
        result = {
          id: 1,
          proposer: "0x1234...5678",
          description: "Proposal to increase UBI distribution rate",
          forVotes: 1500000,
          againstVotes: 500000,
          startBlock: 15000000,
          endBlock: 15100000,
          executed: false,
        }
      }

      setFunctionResult(result)

      toast({
        title: "Function Executed",
        description:
          selectedFunction.type === "read"
            ? "Read operation completed successfully."
            : "Transaction submitted successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "There was an error executing the function. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAddressSearch = () => {
    if (!searchAddress.trim()) return

    toast({
      title: "Searching Contract",
      description: "Looking up contract at address " + searchAddress,
      variant: "default",
    })

    // In a real app, this would query the blockchain
    setTimeout(() => {
      toast({
        title: "Contract Found",
        description: "Contract loaded successfully.",
        variant: "default",
      })
    }, 1500)
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getReadFunctions = () => {
    if (!selectedContract) return []
    return selectedContract.abi.filter((func) => func.stateMutability === "view" || func.stateMutability === "pure")
  }

  const getWriteFunctions = () => {
    if (!selectedContract) return []
    return selectedContract.abi.filter((func) => func.stateMutability !== "view" && func.stateMutability !== "pure")
  }

  const formatResult = (result: any) => {
    if (result === null || result === undefined) return "null"
    if (typeof result === "boolean") return result.toString()
    if (typeof result === "object") return JSON.stringify(result, null, 2)
    return result.toString()
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900/80">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="interact" className="text-sm">
              Interact
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="add" className="text-sm">
              Add Contract
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interact" className="space-y-4">
            {selectedContract ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {selectedContract.name}
                      {selectedContract.verified && (
                        <Badge variant="outline" className="text-xs border-green-800 text-green-400">
                          Verified
                        </Badge>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-gray-400">
                        {selectedContract.address.substring(0, 8)}...{selectedContract.address.substring(36)}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedContract.address)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View on Explorer</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">
                      {selectedContract.network.charAt(0).toUpperCase() + selectedContract.network.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-700"
                      onClick={() => setSelectedContract(null)}
                    >
                      Change Contract
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Read Functions</h4>
                      <div className="space-y-1">
                        {getReadFunctions().length === 0 ? (
                          <div className="text-xs text-gray-400 italic">No read functions available</div>
                        ) : (
                          getReadFunctions().map((func, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-mono text-xs h-auto py-1.5 border-gray-700",
                                selectedFunction?.name === func.name ? "bg-blue-900/30 border-blue-700" : "",
                              )}
                              onClick={() => handleFunctionSelect(func)}
                            >
                              {func.name}
                              {func.inputs.length > 0 && (
                                <span className="text-gray-400">({func.inputs.length} params)</span>
                              )}
                            </Button>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Write Functions</h4>
                      <div className="space-y-1">
                        {getWriteFunctions().length === 0 ? (
                          <div className="text-xs text-gray-400 italic">No write functions available</div>
                        ) : (
                          getWriteFunctions().map((func, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-mono text-xs h-auto py-1.5 border-gray-700",
                                selectedFunction?.name === func.name ? "bg-purple-900/30 border-purple-700" : "",
                              )}
                              onClick={() => handleFunctionSelect(func)}
                            >
                              {func.name}
                              {func.inputs.length > 0 && (
                                <span className="text-gray-400">({func.inputs.length} params)</span>
                              )}
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    {selectedFunction ? (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <Code className="h-4 w-4 text-blue-400" />
                              <span className="font-mono">{selectedFunction.name}</span>
                            </h4>
                            <Badge
                              variant={selectedFunction.type === "read" ? "outline" : "default"}
                              className={cn(
                                "text-xs",
                                selectedFunction.type === "read" ? "border-blue-800 text-blue-400" : "bg-purple-600",
                              )}
                            >
                              {selectedFunction.type === "read" ? "Read" : "Write"}
                            </Badge>
                          </div>

                          {selectedFunction.inputs.length > 0 ? (
                            <div className="space-y-3">
                              {selectedFunction.inputs.map((input, index) => (
                                <div key={index}>
                                  <Label htmlFor={`input-${index}`} className="text-xs flex items-center gap-1">
                                    <span className="font-mono">{input.name}</span>
                                    <span className="text-gray-400">({input.type})</span>
                                  </Label>
                                  <Input
                                    id={`input-${index}`}
                                    value={functionInputs[input.name] || ""}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    placeholder={`Enter ${input.type} value`}
                                    className="mt-1 bg-gray-700/50 border-gray-600 text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 mb-3">
                              This function does not require any parameters.
                            </div>
                          )}

                          <div className="mt-4">
                            <Button
                              onClick={handleExecuteFunction}
                              disabled={isExecuting}
                              className={cn(
                                "w-full",
                                selectedFunction.type === "read"
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-gradient-to-r from-purple-600 to-pink-600",
                              )}
                            >
                              {isExecuting ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  {selectedFunction.type === "read" ? "Reading..." : "Sending Transaction..."}
                                </>
                              ) : (
                                <>
                                  <Zap className="mr-2 h-4 w-4" />
                                  {selectedFunction.type === "read" ? "Read" : "Write"}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {functionResult !== null && (
                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h4 className="font-medium mb-2">Result</h4>
                            <div className="bg-gray-900 rounded p-3 font-mono text-sm overflow-x-auto">
                              <pre>{formatResult(functionResult)}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex flex-col items-center justify-center text-center">
                        <FileText className="h-12 w-12 text-gray-500 mb-3" />
                        <h3 className="text-lg font-medium mb-1">Select a Function</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Choose a function from the left panel to interact with this contract.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-300">Select a Contract</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Choose a contract from your deployed contracts to interact with it.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exampleDeployedContracts.map((contract) => (
                    <Card
                      key={contract.id}
                      className="p-4 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                      onClick={() => handleContractSelect(contract)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{contract.name}</h3>
                          <div className="text-xs text-gray-400 mt-1">
                            {contract.address.substring(0, 8)}...{contract.address.substring(36)}
                          </div>
                        </div>
                        <Badge className="bg-blue-600">
                          {contract.network.charAt(0).toUpperCase() + contract.network.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Deployed {formatTimestamp(contract.deployedAt)}</span>
                        </div>
                        <div>{contract.transactionCount} transactions</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium mb-3">Recent Transactions</h3>

              <div className="space-y-3">
                {exampleTransactions.map((tx) => (
                  <div key={tx.id} className="bg-gray-850 rounded-md p-3 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          <span className="font-mono">{tx.function}</span>
                          <Badge
                            variant={
                              tx.status === "success" ? "outline" : tx.status === "pending" ? "default" : "destructive"
                            }
                            className={cn(
                              "text-xs",
                              tx.status === "success"
                                ? "border-green-800 text-green-400"
                                : tx.status === "pending"
                                  ? "bg-yellow-600"
                                  : "",
                            )}
                          >
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {tx.hash.substring(0, 8)}...{tx.hash.substring(62)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{formatTimestamp(tx.timestamp)}</div>
                    </div>

                    {tx.args.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Arguments:</div>
                        <div className="font-mono text-xs">
                          {tx.args.map((arg, index) => (
                            <div key={index} className="truncate">
                              {arg.toString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tx.result !== undefined && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Result:</div>
                        <div className="font-mono text-xs">{formatResult(tx.result)}</div>
                      </div>
                    )}

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

                      {tx.gasUsed && <div className="text-gray-400">Gas Used: {tx.gasUsed.toLocaleString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card className="p-4 bg-gray-800 border-gray-700">
              <h3 className="font-medium mb-4">Add Contract by Address</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contract-address">Contract Address</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="contract-address"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-gray-700/50 border-gray-600"
                    />
                    <Button
                      onClick={handleAddressSearch}
                      disabled={!searchAddress.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contract-network">Network</Label>
                  <select
                    id="contract-network"
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

                <div>
                  <Label htmlFor="contract-name">Contract Name (Optional)</Label>
                  <Input id="contract-name" placeholder="My Contract" className="mt-1 bg-gray-700/50 border-gray-600" />
                </div>

                <div>
                  <Label htmlFor="contract-abi">ABI (Optional)</Label>
                  <textarea
                    id="contract-abi"
                    placeholder="[{...}]"
                    className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded-md p-2 text-sm h-32 font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    If not provided, we'll attempt to fetch the ABI from the blockchain explorer if the contract is
                    verified.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Check className="mr-2 h-4 w-4" />
                    Add Contract
                  </Button>
                </div>
              </div>
            </Card>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4">
              <h3 className="font-medium text-blue-300 mb-2">Import from File</h3>
              <p className="text-sm text-gray-300 mb-3">
                You can also import contracts from deployment artifacts or JSON files.
              </p>
              <Button variant="outline" className="border-blue-800/50 text-blue-300">
                Import from File
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

