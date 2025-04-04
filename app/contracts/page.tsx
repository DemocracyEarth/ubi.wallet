"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Clock, Zap, BookOpen, ChevronRight, Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Add the PersistentDemoNotice component to the contracts page
import PersistentDemoNotice from "@/components/persistent-demo-notice"

// Example contracts data
const exampleContracts = [
  {
    id: "service-agreement",
    title: "Service Agreement",
    description: "A contract for providing professional services",
    examples: [
      {
        title: "Freelance Development",
        text: "I will develop a website for @client with 5 pages including home, about, services, portfolio, and contact. The work will be completed within 30 days for 50 UBI tokens, with 25 UBI paid upfront and 25 UBI upon completion.",
      },
      {
        title: "Design Services",
        text: "I agree to create a logo and brand identity for @startup. Deliverables include 1 logo, 3 color variations, and a style guide. The project will be completed in 14 days for 35 UBI tokens.",
      },
      {
        title: "Content Creation",
        text: "I will write 10 blog articles for @company on the topic of decentralized finance. Each article will be 1000-1500 words and delivered weekly. Payment is 5 UBI per article, paid upon delivery of each article.",
      },
    ],
  },
  {
    id: "sales-contract",
    title: "Sales Contract",
    description: "Agreements for selling goods or digital assets",
    examples: [
      {
        title: "Digital Asset Sale",
        text: "I will sell my digital artwork titled 'Decentralized Dreams' to @buyer for 75 UBI tokens. Transfer of ownership will occur immediately upon payment.",
      },
      {
        title: "Subscription Service",
        text: "I will provide @subscriber with access to my premium content library for 3 UBI per month, billed automatically on the 1st of each month. Subscription can be canceled anytime.",
      },
      {
        title: "Product Sale with Delivery",
        text: "I will sell and deliver 5 handcrafted items to @customer for 100 UBI total. Delivery will be completed within 7 days of payment. A refund will be provided if items arrive damaged.",
      },
    ],
  },
  {
    id: "partnership-agreement",
    title: "Partnership Agreement",
    description: "Contracts for collaborative ventures",
    examples: [
      {
        title: "Revenue Sharing",
        text: "I will collaborate with @partner on the development and marketing of a mobile app. Costs will be split equally, and revenue will be shared 50/50, distributed weekly based on app earnings.",
      },
      {
        title: "Joint Venture",
        text: "I will form a joint venture with @collaborator to create and sell an online course. I will create content, they will handle marketing. Profits will be split 60/40 in my favor.",
      },
      {
        title: "Community Project",
        text: "I will contribute 20 hours per month to @community's open source project. In return, I will receive 15 UBI monthly from the community treasury and appropriate attribution for my contributions.",
      },
    ],
  },
  {
    id: "conditional-agreements",
    title: "Conditional Agreements",
    description: "Contracts with specific conditions or milestones",
    examples: [
      {
        title: "Performance-Based Payment",
        text: "I will optimize @client's website for performance. Base payment is 30 UBI, with an additional 20 UBI bonus if page load time improves by at least 50%.",
      },
      {
        title: "Escrow Agreement",
        text: "I will place 100 UBI in escrow for @seller's rare digital collectible. Funds will be released when the asset is transferred to my wallet. If not received within 48 hours, the escrow will be canceled.",
      },
      {
        title: "Milestone-Based Project",
        text: "I will develop a dApp for @client with payment released in 3 milestones: 20 UBI at project start, 30 UBI when smart contracts are completed, and 50 UBI upon final delivery and testing.",
      },
    ],
  },
]

export default function ContractsPage() {
  const [contractText, setContractText] = useState("")
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [contractType, setContractType] = useState<"natural" | "stream">("natural")
  const [selectedExample, setSelectedExample] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Stream contract state
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [timeUnit, setTimeUnit] = useState("hour")
  const [duration, setDuration] = useState("")

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contractText.trim()) {
      // Simulate AI response
      const responses = [
        `I'll create a smart contract to ${contractText.toLowerCase()}`,
        `Creating a contract that will ${contractText.toLowerCase()}`,
        `I've generated a smart contract based on your request to ${contractText.toLowerCase()}`,
      ]

      // Pick a random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setAiResponse(randomResponse)
    }
  }

  const handleStreamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (recipient && amount) {
      // Generate a description of the stream
      const streamDescription = `Stream ${amount} tokens to ${recipient} per ${timeUnit}${duration ? ` for ${duration} ${duration === "1" ? timeUnit : timeUnit + "s"}` : " continuously"}`

      // Set the AI response for the stream
      setAiResponse(`I've created a token stream contract: ${streamDescription}`)
    }
  }

  const executeContract = () => {
    alert("Contract execution simulated! In a real app, this would deploy your contract to the blockchain.")
  }

  const copyExample = (text: string) => {
    setContractText(text)
    setCopiedText(text)

    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedText(null)
    }, 2000)
  }

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      {/* Add this after the opening <main> tag */}
      <PersistentDemoNotice className="w-full mb-4" />
      <h1 className="text-2xl font-bold mb-4 self-start">Smart Contracts</h1>

      <Tabs
        defaultValue="natural"
        className="w-full"
        onValueChange={(value) => setContractType(value as "natural" | "stream")}
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Natural Language</span>
          </TabsTrigger>
          <TabsTrigger value="stream" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Token Stream</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="natural">
          <Card className="w-full mb-6 p-5 bg-gray-900/80">
            <h2 className="text-xl font-bold mb-3">Natural Language Contract</h2>
            <form onSubmit={handleNaturalSubmit}>
              <Textarea
                className="w-full p-4 mb-4 bg-gradient-to-r from-blue-900/40 to-pink-900/40 border-blue-500/30 border rounded-xl text-white min-h-[120px]"
                placeholder="Describe your smart contract in plain language... (e.g., 'Send 1 token to @alice every week' or 'Stream 0.1 tokens per hour to @bob')"
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Generate Contract
              </Button>
            </form>
          </Card>

          {/* Example contracts section */}
          <Card className="w-full mb-6 p-5 bg-gray-900/80">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Example Contracts</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Browse example contracts for different use cases. Click on any example to view details or use as a
              template.
            </p>

            <div className="space-y-3">
              {exampleContracts.map((category) => (
                <Collapsible key={category.id} className="border border-gray-800 rounded-lg">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 hover:bg-gray-800/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-left">{category.title}</h3>
                      <p className="text-sm text-gray-400 text-left">{category.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3 space-y-2">
                    {category.examples.map((example, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-gray-700 hover:bg-gray-800 hover:text-white"
                          >
                            <span>{example.title}</span>
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800">
                          <DialogHeader>
                            <DialogTitle>{example.title}</DialogTitle>
                            <DialogDescription>
                              Example {category.title.toLowerCase()} using natural language
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-gray-800 p-4 rounded-md my-2 text-sm">{example.text}</div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              className="border-gray-700"
                              onClick={() => copyExample(example.text)}
                            >
                              {copiedText === example.text ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy to Editor
                                </>
                              )}
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-blue-600 to-purple-600"
                              onClick={() => {
                                copyExample(example.text)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              Use as Template
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stream">
          <Card className="w-full mb-6 p-5 bg-gray-900/80">
            <h2 className="text-xl font-bold mb-3">Token Stream</h2>
            <p className="text-sm text-gray-400 mb-4">Create a continuous flow of tokens to a recipient over time.</p>
            <form onSubmit={handleStreamSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    placeholder="@username or address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      placeholder="0.01"
                      type="number"
                      step="0.000001"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeUnit">Per</Label>
                    <Select value={timeUnit} onValueChange={setTimeUnit}>
                      <SelectTrigger id="timeUnit" className="bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Time unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="second">Second</SelectItem>
                        <SelectItem value="minute">Minute</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="flex items-center justify-between">
                    <span>Duration (optional)</span>
                    <span className="text-xs text-gray-400">Leave empty for continuous</span>
                  </Label>
                  <Input
                    id="duration"
                    placeholder="Number of time units"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                  Create Stream
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {aiResponse && (
        <Card className="w-full mb-6 relative">
          <div className="rounded-xl p-4 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-orange-600/30 text-white">
            <p>{aiResponse}</p>
            <div className="mt-4 bg-gray-800/50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {contractType === "natural"
                  ? `{
  "type": "contract",
  "action": "${contractText}",
  "created": "${new Date().toISOString()}",
  "status": "ready"
}`
                  : `{
  "type": "stream",
  "recipient": "${recipient}",
  "rate": {
    "amount": "${amount}",
    "per": "${timeUnit}"
  },
${duration ? `  "duration": "${duration} ${timeUnit}s",` : `  "duration": "continuous",`}
  "created": "${new Date().toISOString()}",
  "status": "ready"}`}
              </pre>
            </div>
            <Button
              onClick={executeContract}
              className="mt-4 w-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              {contractType === "natural" ? "Execute Contract" : "Start Stream"}
            </Button>
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-2">
              <MessageSquare size={20} />
            </div>
          </div>
        </Card>
      )}
    </main>
  )
}

