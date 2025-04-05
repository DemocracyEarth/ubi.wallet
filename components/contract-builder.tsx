"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Copy, FileCode, RefreshCw, Rocket, Sparkles, Lightbulb, Zap, Shield, Eye, EyeOff } from "lucide-react"
import { useContractStore } from "@/lib/stores/contract-store"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export function ContractBuilder() {
  const { generateContract, currentContract, addContract } = useContractStore()
  const { toast } = useToast()

  const [contractText, setContractText] = useState("")
  const [contractName, setContractName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("describe")
  const [contractType, setContractType] = useState("token")
  const [showCode, setShowCode] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)
  const [securityIssues, setSecurityIssues] = useState<string[]>([])
  const [contractParameters, setContractParameters] = useState<Record<string, string>>({
    tokenName: "Universal Basic Income",
    tokenSymbol: "UBI",
    initialSupply: "1000000",
    maxSupply: "10000000",
    ownerAddress: "",
    transferable: "true",
    burnable: "true",
  })

  const codeRef = useRef<HTMLDivElement>(null)

  // Simulate security analysis when contract is generated
  useEffect(() => {
    if (currentContract) {
      // Simulate security analysis
      const timer = setTimeout(() => {
        const randomScore = Math.floor(Math.random() * 30) + 70 // Random score between 70-99
        setSecurityScore(randomScore)

        const possibleIssues = [
          "Consider adding a maximum cap to token minting",
          "Implement access control for sensitive functions",
          "Implement access control for sensitive functions",
          "Add event emissions for important state changes",
          "Consider using SafeMath for arithmetic operations",
          "Add a contract pause mechanism for emergencies",
        ]

        // Randomly select 0-2 issues based on the score
        const numIssues = randomScore > 90 ? 0 : randomScore > 80 ? 1 : 2
        const selectedIssues = []

        for (let i = 0; i < numIssues; i++) {
          const randomIndex = Math.floor(Math.random() * possibleIssues.length)
          selectedIssues.push(possibleIssues[randomIndex])
          possibleIssues.splice(randomIndex, 1)
        }

        setSecurityIssues(selectedIssues)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [currentContract])

  const handleGenerateContract = async () => {
    if (!contractText.trim()) return

    setIsGenerating(true)
    try {
      await generateContract(contractText)
      setActiveTab("review")
      toast({
        title: "Contract Generated",
        description: "Your smart contract has been successfully generated from your description.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your contract. Please try again with a more detailed description.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContract = () => {
    if (!currentContract) return

    const contractToSave = {
      ...currentContract,
      name: contractName || `Contract_${Date.now()}`,
    }

    addContract(contractToSave)

    toast({
      title: "Contract Saved",
      description: "Your contract has been saved to your collection.",
      variant: "default",
    })

    // Reset form
    setContractText("")
    setContractName("")
    setActiveTab("describe")
  }

  const handleCopyCode = () => {
    if (!currentContract) return

    navigator.clipboard.writeText(currentContract.code)

    toast({
      title: "Code Copied",
      description: "Contract code copied to clipboard.",
      variant: "default",
    })
  }

  const handleParameterChange = (key: string, value: string) => {
    setContractParameters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const contractTypes = [
    {
      value: "token",
      label: "Token Contract",
      description: "A digital currency or asset with customizable properties",
    },
    {
      value: "nft",
      label: "NFT Collection",
      description: "Unique digital assets that can represent ownership of items",
    },
    { value: "dao", label: "DAO Governance", description: "Decentralized governance system with voting and proposals" },
    { value: "defi", label: "DeFi Protocol", description: "Financial services like lending, staking, or swapping" },
    { value: "marketplace", label: "Marketplace", description: "Platform for buying and selling digital assets" },
    {
      value: "multisig",
      label: "Multi-signature Wallet",
      description: "Wallet requiring multiple approvals for transactions",
    },
    { value: "custom", label: "Custom Contract", description: "Describe any other type of contract you need" },
  ]

  const examplePrompts = {
    token:
      "Create a token called 'Universal Basic Income' with the symbol 'UBI'. It should have a fixed supply of 1 million tokens initially, but allow the owner to mint more tokens up to a maximum of 10 million. The token should be transferable between users and allow users to burn their own tokens if they want to.",
    nft: "Create an NFT collection called 'Digital Citizens' with a maximum of 10,000 unique items. Each NFT should have properties for rarity, attributes, and an image URI. The creator should receive 5% royalties on all secondary sales. Only the owner should be able to mint new NFTs.",
    dao: "Create a governance system where people who hold at least 100 tokens can submit proposals. Each proposal should have a description and a voting period of 3 days. Token holders can vote for or against proposals, with their voting power equal to the number of tokens they hold. If more than 50% of votes are in favor, the proposal passes.",
    defi: "Build a staking contract where users can deposit tokens and earn 5% APY in rewards. Users should be able to withdraw their tokens at any time, but they only earn rewards after staking for at least 7 days. The owner should be able to adjust the reward rate.",
    marketplace:
      "Create a marketplace where users can list NFTs for sale at a fixed price or auction. The marketplace should take a 2.5% fee on all sales. Auctions should last for 3 days with a minimum bid increment of 10%. Sellers should be able to cancel listings before they're sold.",
    multisig:
      "Make a wallet that requires 2 out of 3 designated addresses to approve any transaction. The wallet should be able to hold tokens and NFTs. Any of the 3 owners can propose a transaction, but it only executes after getting the required approvals.",
    custom:
      "Describe your custom smart contract requirements in detail. Explain what the contract should do, who should have access to different functions, and any specific rules or conditions that should apply.",
  }

  const getParameterFields = () => {
    switch (contractType) {
      case "token":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  value={contractParameters.tokenName}
                  onChange={(e) => handleParameterChange("tokenName", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  value={contractParameters.tokenSymbol}
                  onChange={(e) => handleParameterChange("tokenSymbol", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialSupply">Initial Supply</Label>
                <Input
                  id="initialSupply"
                  type="number"
                  value={contractParameters.initialSupply}
                  onChange={(e) => handleParameterChange("initialSupply", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="maxSupply">Maximum Supply</Label>
                <Input
                  id="maxSupply"
                  type="number"
                  value={contractParameters.maxSupply}
                  onChange={(e) => handleParameterChange("maxSupply", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="transferable"
                  checked={contractParameters.transferable === "true"}
                  onCheckedChange={(checked) => handleParameterChange("transferable", checked.toString())}
                />
                <Label htmlFor="transferable">Transferable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="burnable"
                  checked={contractParameters.burnable === "true"}
                  onCheckedChange={(checked) => handleParameterChange("burnable", checked.toString())}
                />
                <Label htmlFor="burnable">Burnable</Label>
              </div>
            </div>
          </>
        )
      case "nft":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collectionName">Collection Name</Label>
                <Input
                  id="collectionName"
                  value={contractParameters.collectionName || "Digital Citizens"}
                  onChange={(e) => handleParameterChange("collectionName", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="collectionSymbol">Collection Symbol</Label>
                <Input
                  id="collectionSymbol"
                  value={contractParameters.collectionSymbol || "DCTZEN"}
                  onChange={(e) => handleParameterChange("collectionSymbol", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxSupply">Maximum Supply</Label>
                <Input
                  id="maxSupply"
                  type="number"
                  value={contractParameters.maxSupply || "10000"}
                  onChange={(e) => handleParameterChange("maxSupply", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="royaltyPercentage">Royalty Percentage</Label>
                <Input
                  id="royaltyPercentage"
                  type="number"
                  value={contractParameters.royaltyPercentage || "5"}
                  onChange={(e) => handleParameterChange("royaltyPercentage", e.target.value)}
                  className="mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="baseURI">Base URI (for metadata)</Label>
              <Input
                id="baseURI"
                value={contractParameters.baseURI || "ipfs://"}
                onChange={(e) => handleParameterChange("baseURI", e.target.value)}
                className="mt-1 bg-gray-800/50 border-gray-700"
              />
            </div>
          </>
        )
      // Add cases for other contract types as needed
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900/80">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="describe" className="text-sm">
              1. Describe Contract
            </TabsTrigger>
            <TabsTrigger value="review" className="text-sm" disabled={!currentContract}>
              2. Review & Customize
            </TabsTrigger>
            <TabsTrigger value="finalize" className="text-sm" disabled={!currentContract}>
              3. Finalize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="describe" className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-300">How to Write Effective Descriptions</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Be specific about what your contract should do. Include details about:
                </p>
                <ul className="text-sm text-gray-300 mt-2 list-disc pl-5 space-y-1">
                  <li>What the contract should be named</li>
                  <li>Who should have permission to do what</li>
                  <li>Any specific rules or conditions</li>
                  <li>How tokens or assets should behave</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="contractText">Describe your smart contract in natural language</Label>
                <Textarea
                  id="contractText"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="E.g., Create a token called 'Universal Basic Income' with the symbol 'UBI'. It should have a fixed supply of 1 million tokens initially, but allow the owner to mint more tokens up to a maximum of 10 million..."
                  className="h-48 mt-1 bg-gray-800/50 border-gray-700"
                />
              </div>

              <div>
                <Label>Contract Type</Label>
                <Select
                  value={contractType}
                  onValueChange={(value) => {
                    setContractType(value)
                    setContractText(examplePrompts[value as keyof typeof examplePrompts])
                  }}
                >
                  <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-gray-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4 bg-gray-800 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Example Prompts</h4>
                  <div className="text-xs text-gray-400">Click on a contract type to see an example description.</div>
                </div>

                <div className="mt-4 bg-gray-800 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">AI Assistant</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-800 text-blue-400 hover:bg-blue-900/20"
                    onClick={() => {
                      toast({
                        title: "AI Suggestion",
                        description:
                          "Try adding more details about access controls and error handling to your description.",
                        variant: "default",
                      })
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest Improvements
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateContract}
                disabled={!contractText.trim() || isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Contract
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {currentContract && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="contractName">Contract Name</Label>
                    <Input
                      id="contractName"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="Enter a name for your contract"
                      className="mt-1 w-64 bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="showCode" checked={showCode} onCheckedChange={setShowCode} />
                      <Label htmlFor="showCode" className="text-sm">
                        {showCode ? (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Show Code
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-3.5 w-3.5" />
                            Hide Code
                          </span>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contract Description</h3>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <p className="text-sm">{currentContract.description}</p>
                    </div>

                    <h3 className="text-sm font-medium mt-4 mb-2">Customize Parameters</h3>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 space-y-3">
                      {getParameterFields()}
                    </div>

                    <h3 className="text-sm font-medium mt-4 mb-2">Security Analysis</h3>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium">Security Score:</span>
                        <Badge
                          className={`${
                            securityScore > 90 ? "bg-green-600" : securityScore > 80 ? "bg-yellow-600" : "bg-orange-600"
                          }`}
                        >
                          {securityScore}/100
                        </Badge>
                      </div>

                      {securityIssues.length > 0 ? (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-400 mb-1">Recommendations:</div>
                          <ul className="text-xs space-y-1 list-disc pl-4">
                            {securityIssues.map((issue, index) => (
                              <li key={index} className="text-yellow-400">
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-xs text-green-400">No security issues detected</div>
                      )}
                    </div>
                  </div>

                  {showCode && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Generated Code</h3>
                      <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-blue-400" />
                            <span className="font-mono text-sm">{contractName || "Contract.sol"}</span>
                          </div>
                          <Badge variant="outline" className="text-xs border-blue-800 text-blue-400">
                            Solidity
                          </Badge>
                        </div>

                        <Separator className="my-2 bg-gray-800" />

                        <div
                          ref={codeRef}
                          className="font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto"
                        >
                          {currentContract.code}
                        </div>

                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm" onClick={handleCopyCode} className="border-gray-700">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("describe")} className="border-gray-700">
                    Back to Description
                  </Button>

                  <Button
                    onClick={() => setActiveTab("finalize")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Continue to Finalize
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="finalize" className="space-y-4">
            {currentContract && (
              <>
                <div className="bg-green-900/20 border border-green-800/30 rounded-md p-4 flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-300">Contract Ready</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Your contract has been generated and is ready to be saved. You can deploy it immediately or save
                      it for later deployment.
                    </p>
                  </div>
                </div>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="font-medium mb-3">Contract Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="bg-gray-750 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Name:</span>
                            <span>{contractName || "Unnamed Contract"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Type:</span>
                            <span>{contractTypes.find((t) => t.value === contractType)?.label || "Custom"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Security Score:</span>
                            <span
                              className={`${
                                securityScore > 90
                                  ? "text-green-400"
                                  : securityScore > 80
                                    ? "text-yellow-400"
                                    : "text-orange-400"
                              }`}
                            >
                              {securityScore}/100
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Created:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-750 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-400 mt-0.5" />
                            <span>Save your contract to your collection</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-400 mt-0.5" />
                            <span>Deploy your contract to a blockchain network</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-400 mt-0.5" />
                            <span>Share your contract with others</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("review")} className="border-gray-700">
                    Back to Review
                  </Button>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveContract} className="bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Save Contract
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Rocket className="mr-2 h-4 w-4" />
                      Deploy Now
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

