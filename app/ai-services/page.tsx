"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Search,
  Sparkles,
  FileText,
  Code,
  ImageIcon,
  MessageSquare,
  Zap,
  ChevronDown,
  Copy,
  Bookmark,
  BookmarkPlus,
  Info,
  History,
  Clock,
} from "lucide-react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DesktopLayout from "@/components/desktop-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Message types
type MessageRole = "user" | "assistant" | "system" | "error"
type MessageType = "text" | "image" | "code" | "loading"

interface Message {
  id: string
  role: MessageRole
  content: string
  type: MessageType
  timestamp: Date
  model?: string
  cost?: number
  imageUrl?: string
  codeLanguage?: string
  isError?: boolean
  isContract?: boolean
  contractId?: string
}

// Example prompt contracts
interface PromptContract {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
  model: string
  creator: string
  usageCount: number
  cost: number
  createdAt: Date
}

const examplePromptContracts: PromptContract[] = [
  {
    id: "contract-1",
    title: "Explain Blockchain Technology",
    description: "A comprehensive explanation of blockchain technology for beginners",
    prompt:
      "Explain blockchain technology in simple terms. Cover the basic concepts, how it works, and its main applications.",
    category: "Education",
    tags: ["blockchain", "crypto", "technology", "beginner"],
    model: "gpt-4o",
    creator: "@alice",
    usageCount: 1245,
    cost: 0.15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  },
  {
    id: "contract-2",
    title: "Generate UBI Token Logo",
    description: "Creates a modern logo design for a UBI token project",
    prompt:
      "Create a modern, minimalist logo for a Universal Basic Income cryptocurrency token called 'UBI'. Use a color palette of blues and greens. The design should convey trust, community, and financial freedom.",
    category: "Design",
    tags: ["logo", "design", "UBI", "token", "branding"],
    model: "stable-diffusion-xl",
    creator: "@bob",
    usageCount: 876,
    cost: 0.25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
  },
  {
    id: "contract-3",
    title: "Smart Contract Code Review",
    description: "Reviews Solidity smart contracts for security vulnerabilities",
    prompt:
      "Review the following Solidity smart contract code for security vulnerabilities, gas optimization opportunities, and best practices. Provide a detailed analysis with specific recommendations for improvements:\n\n```solidity\n// [PASTE CONTRACT CODE HERE]\n```",
    category: "Development",
    tags: ["solidity", "smart contract", "security", "code review"],
    model: "claude-3-opus",
    creator: "@charlie",
    usageCount: 532,
    cost: 0.3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
  {
    id: "contract-4",
    title: "Decentralized Governance Proposal",
    description: "Generates a structured DAO governance proposal",
    prompt:
      "Create a detailed DAO governance proposal for [TOPIC]. Include the following sections: 1) Executive Summary, 2) Background & Motivation, 3) Specification, 4) Benefits, 5) Risks & Drawbacks, 6) Voting Options, and 7) Implementation Timeline.",
    category: "Governance",
    tags: ["DAO", "governance", "proposal", "decentralized"],
    model: "gpt-4o",
    creator: "@dana",
    usageCount: 421,
    cost: 0.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: "contract-5",
    title: "Tokenomics Analysis",
    description: "Analyzes token distribution and economic model",
    prompt:
      "Analyze the tokenomics of the following project: [PROJECT NAME]. Include an assessment of the token distribution, utility, value accrual mechanisms, inflation/deflation dynamics, and overall economic sustainability. Provide recommendations for improvement.",
    category: "Analysis",
    tags: ["tokenomics", "analysis", "crypto", "economics"],
    model: "claude-3-sonnet",
    creator: "@evan",
    usageCount: 389,
    cost: 0.18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
]

// Example chat history
const initialMessages: Message[] = [
  {
    id: "system-1",
    role: "system",
    content:
      "Welcome to the decentralized AI network. You can ask questions, generate images, review code, or use prompt contracts from the marketplace. Your requests are processed by other nodes in the network, and you earn UBI tokens by fulfilling requests.",
    type: "text",
    timestamp: new Date(),
  },
]

export default function AIServicesPage() {
  const { balance } = useWalletStore()
  const { createRequest } = useAIRequestStore()

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredContracts, setFilteredContracts] = useState(examplePromptContracts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("popular")
  const [savedContracts, setSavedContracts] = useState<string[]>([])
  const [chatHeight, setChatHeight] = useState("calc(100vh - 280px)")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Filter contracts based on search and category
  useEffect(() => {
    let filtered = examplePromptContracts

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contract) =>
          contract.title.toLowerCase().includes(query) ||
          contract.description.toLowerCase().includes(query) ||
          contract.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((contract) => contract.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Sort contracts
    if (sortOption === "popular") {
      filtered = [...filtered].sort((a, b) => b.usageCount - a.usageCount)
    } else if (sortOption === "newest") {
      filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortOption === "cheapest") {
      filtered = [...filtered].sort((a, b) => a.cost - b.cost)
    }

    setFilteredContracts(filtered)
  }, [searchQuery, selectedCategory, sortOption])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Adjust chat height based on screen size
  useEffect(() => {
    if (isDesktop) {
      setChatHeight("calc(100vh - 180px)")
    } else {
      setChatHeight("calc(100vh - 280px)")
    }
  }, [isDesktop])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isSubmitting) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      type: "text",
      timestamp: new Date(),
    }

    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: "assistant",
      content: "Generating response...",
      type: "loading",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setInput("")
    setIsSubmitting(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create AI request
      await createRequest({
        type: "text",
        prompt: input,
        model: selectedModel,
        reward: 0.15,
      })

      // Mock response
      const responseContent = generateMockResponse(input)

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: responseContent,
                type: "text",
                timestamp: new Date(),
                model: selectedModel,
                cost: 0.15,
              }
            : msg,
        ),
      )
    } catch (error) {
      // Handle error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                id: `error-${Date.now()}`,
                role: "error",
                content: "There was an error processing your request. Please try again.",
                type: "text",
                timestamp: new Date(),
                isError: true,
              }
            : msg,
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseContract = (contract: PromptContract) => {
    setInput(contract.prompt)
    setSelectedModel(contract.model)
  }

  const handleSaveContract = (contractId: string) => {
    if (savedContracts.includes(contractId)) {
      setSavedContracts((prev) => prev.filter((id) => id !== contractId))
    } else {
      setSavedContracts((prev) => [...prev, contractId])
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Mock response generator
  const generateMockResponse = (prompt: string): string => {
    const responses = [
      "Blockchain technology is a decentralized digital ledger that records transactions across multiple computers. The key innovation is that it allows digital information to be distributed but not copied, creating a transparent and verifiable record of transactions. Each block contains a timestamp and link to the previous block, forming a chain.\n\nThe main components include:\n\n1. **Distributed Ledger**: All network participants have access to the ledger and its immutable record of transactions.\n\n2. **Consensus Mechanism**: Participants agree on the validity of transactions before they're recorded.\n\n3. **Cryptography**: Secure encryption techniques protect the integrity of the data.\n\nApplications extend beyond cryptocurrency to include supply chain tracking, digital identity verification, smart contracts, and more.",
      "Universal Basic Income (UBI) represents a paradigm shift in how we approach economic security and social welfare. It's a regular payment provided to all citizens regardless of their work status or income level.\n\nThe core principles of UBI include:\n\n- **Universality**: Everyone receives it, eliminating stigma and bureaucracy\n- **Unconditionality**: No work requirements or means testing\n- **Regularity**: Payments occur at consistent intervals\n- **Cash-based**: Recipients decide how to use the funds\n\nIn a decentralized context, UBI can be implemented through cryptocurrency tokens, smart contracts, and decentralized identity verification, creating a system that's resistant to censorship and political interference.",
      "Zero-knowledge proofs are cryptographic methods that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any additional information beyond the validity of the statement itself.\n\nIn the context of blockchain and privacy:\n\n1. **Privacy Enhancement**: Users can verify transactions without exposing sensitive data\n2. **Scalability Solutions**: ZK-rollups compress multiple transactions into a single proof\n3. **Identity Verification**: Prove you're a verified human without revealing personal details\n\nThe mathematics behind zero-knowledge proofs is complex, involving interactive protocols where the prover convinces the verifier through a series of challenges and responses, all while maintaining the zero-knowledge property.",
      "Decentralized Autonomous Organizations (DAOs) represent a new paradigm in organizational structure, governance, and coordination. They are blockchain-based entities that operate through smart contracts and are collectively owned and managed by their members.\n\nKey characteristics of DAOs include:\n\n1. **Decentralized Governance**: Decision-making power is distributed among members rather than concentrated in a hierarchy\n\n2. **Transparency**: All rules, transactions, and governance activities are recorded on a blockchain\n\n3. **Autonomy**: Once deployed, DAOs operate according to their programmed rules without the need for intermediaries\n\n4. **Token-Based Membership**: Participation rights are typically represented by governance tokens\n\nDAOs are being used for investment collectives, grants programs, protocol governance, social communities, and more.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Sidebar content for desktop layout
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <div className="text-sm font-medium text-gray-400">Recent Prompts</div>
      <div className="space-y-2">
        {messages
          .filter((msg) => msg.role === "user")
          .slice(-3)
          .reverse()
          .map((msg) => (
            <div
              key={msg.id}
              className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
              onClick={() => setInput(msg.content)}
            >
              {msg.content.length > 50 ? `${msg.content.substring(0, 50)}...` : msg.content}
            </div>
          ))}
      </div>

      <Separator className="bg-gray-700" />

      <div className="text-sm font-medium text-gray-400">Saved Contracts</div>
      <div className="space-y-2">
        {savedContracts.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No saved contracts yet</div>
        ) : (
          examplePromptContracts
            .filter((contract) => savedContracts.includes(contract.id))
            .map((contract) => (
              <div
                key={contract.id}
                className="text-xs bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
                onClick={() => handleUseContract(contract)}
              >
                <div className="font-medium">{contract.title}</div>
                <div className="text-gray-400 mt-1">{contract.cost} UBI</div>
              </div>
            ))
        )}
      </div>

      <Separator className="bg-gray-700" />

      <div className="text-sm font-medium text-gray-400">Settings</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Default Model</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-6 text-xs border-0 bg-gray-800 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3</SelectItem>
              <SelectItem value="mistral-large">Mistral</SelectItem>
              <SelectItem value="stable-diffusion-xl">SDXL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // Right panel content for desktop layout
  const rightPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">History</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <History className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Today</span>
            </div>
            <span className="text-xs text-gray-400">3 conversations</span>
          </div>

          <div className="space-y-2">
            <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
              <div className="text-sm">Blockchain technology explanation</div>
              <div className="text-xs text-gray-400 mt-1">10:24 AM • 5 messages</div>
            </div>
            <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
              <div className="text-sm">UBI token distribution model</div>
              <div className="text-xs text-gray-400 mt-1">9:15 AM • 8 messages</div>
            </div>
            <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
              <div className="text-sm">Smart contract code review</div>
              <div className="text-xs text-gray-400 mt-1">8:30 AM • 4 messages</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Yesterday</span>
            </div>
            <span className="text-xs text-gray-400">2 conversations</span>
          </div>

          <div className="space-y-2">
            <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
              <div className="text-sm">DAO governance structure</div>
              <div className="text-xs text-gray-400 mt-1">3:45 PM • 12 messages</div>
            </div>
            <div className="p-2 bg-gray-750 rounded-md cursor-pointer hover:bg-gray-700">
              <div className="text-sm">Zero-knowledge proof explanation</div>
              <div className="text-xs text-gray-400 mt-1">11:20 AM • 6 messages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-300 font-medium mb-1">Conversation Privacy</p>
          <p className="text-xs text-gray-300">
            Your conversations are stored locally and encrypted. They are not shared with other nodes unless you
            explicitly choose to share them.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm">Network Stats</span>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          View Details
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-xs text-gray-400">Active Nodes</div>
          <div className="text-lg font-bold">24</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-xs text-gray-400">Avg Response</div>
          <div className="text-lg font-bold">45s</div>
        </div>
      </div>
    </div>
  )

  return (
    <DesktopLayout
      sidebar={isDesktop ? sidebarContent : undefined}
      rightPanel={rightPanelContent}
      showRightPanel={false}
    >
      <div className={cn("max-w-full mx-auto", isDesktop ? "w-full" : "w-full")}>
        <h1 className="text-2xl font-bold mb-4">AI Services</h1>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Contracts</span>
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Examples</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div
              ref={chatContainerRef}
              className="bg-gray-900/80 rounded-lg border border-gray-800 overflow-y-auto flex flex-col"
              style={{ height: chatHeight }}
            >
              <div className="flex-1 p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3 max-w-full", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role !== "user" && (
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback
                          className={cn(
                            message.role === "system"
                              ? "bg-blue-600"
                              : message.role === "error"
                                ? "bg-red-600"
                                : "bg-gradient-to-r from-purple-600 to-pink-600",
                          )}
                        >
                          {message.role === "system" ? "S" : message.role === "error" ? "!" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg p-3 max-w-[85%]",
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : message.role === "system"
                            ? "bg-blue-900/30 border border-blue-800/50 text-blue-100"
                            : message.role === "error"
                              ? "bg-red-900/30 border border-red-800/50 text-red-100"
                              : "bg-gray-800 border border-gray-700",
                      )}
                    >
                      {message.type === "loading" ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">●</div>
                          <div className="animate-pulse animation-delay-200">●</div>
                          <div className="animate-pulse animation-delay-400">●</div>
                        </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-wrap">{message.content}</div>

                          {message.role === "assistant" && message.model && (
                            <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
                              <div>
                                {message.model} • {message.cost} UBI
                              </div>

                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleCopyMessage(message.content)}
                                  className="p-1 hover:bg-gray-700 rounded"
                                  title="Copy to clipboard"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-800 bg-gray-900">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="bg-gray-800 border-gray-700 pr-24"
                      disabled={isSubmitting}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-6 text-xs border-0 bg-transparent w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3</SelectItem>
                          <SelectItem value="mistral-large">Mistral</SelectItem>
                          <SelectItem value="stable-diffusion-xl">SDXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <div>Balance: {balance.toFixed(2)} UBI</div>
                  <div>Estimated cost: 0.15 UBI</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <Card className="p-4 bg-gray-900/80">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search prompt contracts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 pl-9"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700">
                      <span className="mr-1">Sort</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortOption("popular")}>Most Popular</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("cheapest")}>Lowest Cost</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "all" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={selectedCategory === "education" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "education" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("education")}
                >
                  Education
                </Badge>
                <Badge
                  variant={selectedCategory === "design" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "design" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("design")}
                >
                  Design
                </Badge>
                <Badge
                  variant={selectedCategory === "development" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "development" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("development")}
                >
                  Development
                </Badge>
                <Badge
                  variant={selectedCategory === "governance" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "governance" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("governance")}
                >
                  Governance
                </Badge>
                <Badge
                  variant={selectedCategory === "analysis" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === "analysis" ? "bg-blue-600" : "border-gray-700 hover:bg-gray-800",
                  )}
                  onClick={() => setSelectedCategory("analysis")}
                >
                  Analysis
                </Badge>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {filteredContracts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No contracts found matching your search</div>
                ) : (
                  filteredContracts.map((contract) => (
                    <Card key={contract.id} className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{contract.title}</h3>
                        <button
                          onClick={() => handleSaveContract(contract.id)}
                          className="text-gray-400 hover:text-yellow-400"
                        >
                          {savedContracts.includes(contract.id) ? (
                            <Bookmark className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{contract.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {contract.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                        <div>Created by {contract.creator}</div>
                        <div>Used {contract.usageCount} times</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span>{contract.cost} UBI</span>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleUseContract(contract)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Use Contract
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card className="p-4 bg-gray-900/80">
              <h2 className="text-lg font-medium mb-4">Example Prompts</h2>

              <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span>Text Generation</span>
                  </h3>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput(
                        "Explain the concept of Universal Basic Income and how it could be implemented using blockchain technology.",
                      )
                    }
                  >
                    <p className="text-sm">
                      Explain the concept of Universal Basic Income and how it could be implemented using blockchain
                      technology.
                    </p>
                  </Card>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput(
                        "Write a short story about a world where all financial transactions are conducted on a decentralized network.",
                      )
                    }
                  >
                    <p className="text-sm">
                      Write a short story about a world where all financial transactions are conducted on a
                      decentralized network.
                    </p>
                  </Card>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-400" />
                    <span>Image Generation</span>
                  </h3>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() => {
                      setInput(
                        "Generate an image of a futuristic city where UBI is distributed via blockchain technology.",
                      )
                      setSelectedModel("stable-diffusion-xl")
                    }}
                  >
                    <p className="text-sm">
                      Generate an image of a futuristic city where UBI is distributed via blockchain technology.
                    </p>
                  </Card>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() => {
                      setInput("Create a logo for a decentralized AI service platform called 'NeuralNode'.")
                      setSelectedModel("stable-diffusion-xl")
                    }}
                  >
                    <p className="text-sm">
                      Create a logo for a decentralized AI service platform called "NeuralNode".
                    </p>
                  </Card>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Code className="h-4 w-4 text-yellow-400" />
                    <span>Code Generation</span>
                  </h3>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput(
                        "Write a simple Solidity smart contract for distributing UBI tokens to verified addresses.",
                      )
                    }
                  >
                    <p className="text-sm">
                      Write a simple Solidity smart contract for distributing UBI tokens to verified addresses.
                    </p>
                  </Card>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput(
                        "Create a React component that displays a user's UBI token balance and transaction history.",
                      )
                    }
                  >
                    <p className="text-sm">
                      Create a React component that displays a user's UBI token balance and transaction history.
                    </p>
                  </Card>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-400" />
                    <span>Document Generation</span>
                  </h3>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput("Draft a governance proposal for implementing a new feature in the UBI token ecosystem.")
                    }
                  >
                    <p className="text-sm">
                      Draft a governance proposal for implementing a new feature in the UBI token ecosystem.
                    </p>
                  </Card>

                  <Card
                    className="p-3 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750"
                    onClick={() =>
                      setInput(
                        "Create a comprehensive FAQ document about how the decentralized AI network works and how users can participate.",
                      )
                    }
                  >
                    <p className="text-sm">
                      Create a comprehensive FAQ document about how the decentralized AI network works and how users can
                      participate.
                    </p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}

