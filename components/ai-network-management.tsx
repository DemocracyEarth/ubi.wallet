"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wifi,
  Users,
  Clock,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  Network,
  Activity,
  RefreshCw,
  MessageSquare,
  FileText,
  Cpu,
} from "lucide-react"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"
import AIRequestCard from "@/components/ai-request-card"

export default function AINetworkManagement() {
  const {
    isProviding,
    toggleProviding,
    totalEarned,
    totalSpent,
    incomingRequests,
    outgoingRequests,
    availableRequests,
    fulfilledRequests,
    fetchAvailableRequests,
    mockNetworkActivity,
  } = useAIRequestStore()

  // Network stats
  const [networkNodes, setNetworkNodes] = useState(24)
  const [activeProviders, setActiveProviders] = useState(18)
  const [avgResponseTime, setAvgResponseTime] = useState(45) // seconds
  const [networkLoad, setNetworkLoad] = useState(62) // percent

  // Network settings
  const [maxBandwidth, setMaxBandwidth] = useState(70)
  const [priorityMode, setPriorityMode] = useState("balanced")
  const [autoAccept, setAutoAccept] = useState(false)
  const [minReward, setMinReward] = useState("0.10")
  const [maxQueueSize, setMaxQueueSize] = useState(5)
  const [preferredModels, setPreferredModels] = useState<string[]>(["gpt-4o", "claude-3-opus"])

  // Connection settings
  const [maxConnections, setMaxConnections] = useState(20)
  const [connectionTimeout, setConnectionTimeout] = useState(30)
  const [peerDiscovery, setPeerDiscovery] = useState(true)
  const [networkRegion, setNetworkRegion] = useState("global")

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      mockNetworkActivity()

      // Simulate fluctuations in network stats
      setNetworkNodes((prev) => Math.max(20, Math.min(30, prev + Math.floor(Math.random() * 3) - 1)))
      setActiveProviders((prev) => Math.max(15, Math.min(25, prev + Math.floor(Math.random() * 3) - 1)))
      setAvgResponseTime((prev) => Math.max(30, Math.min(60, prev + Math.floor(Math.random() * 5) - 2)))
      setNetworkLoad((prev) => Math.max(40, Math.min(85, prev + Math.floor(Math.random() * 6) - 3)))
    }, 5000)

    return () => clearInterval(interval)
  }, [mockNetworkActivity])

  // Fetch available requests when the component mounts
  useEffect(() => {
    if (isProviding) {
      fetchAvailableRequests()
    }
  }, [isProviding, fetchAvailableRequests])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="text-xs">
            Outgoing
          </TabsTrigger>
          <TabsTrigger value="incoming" className="text-xs">
            Incoming
          </TabsTrigger>
          <TabsTrigger value="connections" className="text-xs">
            Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="w-full p-5 bg-gray-900/80 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-medium">Network Status</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Provide AI Services</span>
                <Switch checked={isProviding} onCheckedChange={toggleProviding} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Network Nodes</span>
                </div>
                <div className="text-xl font-bold">{networkNodes}</div>
                <div className="text-xs text-gray-400 mt-1">{activeProviders} active providers</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Avg Response</span>
                </div>
                <div className="text-xl font-bold">{avgResponseTime}s</div>
                <div className="text-xs text-gray-400 mt-1">Network-wide average</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Network Load</span>
                <span>{networkLoad}%</span>
              </div>
              <Progress value={networkLoad} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Earned</div>
                <div className="text-xl font-bold text-green-400">{totalEarned.toFixed(2)} UBI</div>
                <div className="text-xs text-gray-400 mt-1">From {fulfilledRequests.length} requests</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Spent</div>
                <div className="text-xl font-bold text-yellow-400">{totalSpent.toFixed(2)} UBI</div>
                <div className="text-xs text-gray-400 mt-1">On {outgoingRequests.length} requests</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {availableRequests.length} Available
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {incomingRequests.filter((r) => r.status === "processing").length} Processing
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {fulfilledRequests.length} Fulfilled
              </Badge>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {incomingRequests.filter((r) => r.status === "failed").length +
                  outgoingRequests.filter((r) => r.status === "failed").length}{" "}
                Failed
              </Badge>
            </div>
          </Card>

          <Card className="w-full p-5 bg-gray-900/80">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-medium">Network Activity</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Request Types (Last 24h)</h3>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Text</span>
                    </div>
                    <span className="text-sm">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5 mb-2" />

                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Image</span>
                    </div>
                    <span className="text-sm">22%</span>
                  </div>
                  <Progress value={22} className="h-1.5 mb-2" />

                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Code</span>
                    </div>
                    <span className="text-sm">10%</span>
                  </div>
                  <Progress value={10} className="h-1.5" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Earnings Trend</h3>
                <div className="bg-gray-800 p-3 rounded-lg h-32 flex items-end justify-between">
                  {/* Mock chart bars */}
                  {[35, 42, 28, 65, 53, 48, 72].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-700 flex items-center justify-center gap-2"
                onClick={() => fetchAvailableRequests()}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Network Stats</span>
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing">
          <Card className="w-full p-5 bg-gray-900/80 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-medium">Outgoing Requests</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Request Settings</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="priority-mode">Priority Mode</Label>
                      <span className="text-xs text-gray-400 capitalize">{priorityMode}</span>
                    </div>
                    <Select value={priorityMode} onValueChange={setPriorityMode}>
                      <SelectTrigger id="priority-mode" className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select priority mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speed">Speed (Higher Cost)</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="economy">Economy (Lower Cost)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">
                      Determines how your requests are prioritized in the network
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="max-cost">Maximum Cost per Request</Label>
                      <span className="text-xs text-gray-400">0.50 UBI</span>
                    </div>
                    <Slider id="max-cost" min={0.05} max={1} step={0.05} value={[0.5]} className="my-2" />
                    <p className="text-xs text-gray-400 mt-1">Limits the maximum UBI spent on a single request</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-retry" className="font-medium">
                        Auto-retry Failed Requests
                      </Label>
                      <p className="text-xs text-gray-400">Automatically retry if a request fails</p>
                    </div>
                    <Switch id="auto-retry" checked={true} />
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">Request Routing</p>
                  <p className="text-xs text-gray-300">
                    Your requests are automatically routed to the most suitable providers based on your priority
                    settings, model requirements, and current network conditions.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <h3 className="text-sm font-medium px-1">Recent Outgoing Requests</h3>

            {outgoingRequests.length === 0 ? (
              <Card className="p-4 bg-gray-900/80 text-center">
                <p className="text-gray-400">No outgoing requests yet</p>
                <p className="text-sm text-gray-500 mt-1">Use the AI Services page to create requests</p>
              </Card>
            ) : (
              outgoingRequests
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((request) => <AIRequestCard key={request.id} request={request} mode="outgoing" />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="incoming">
          <Card className="w-full p-5 bg-gray-900/80 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-medium">Incoming Requests</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Provider Status</h3>
                  <p className="text-sm text-gray-400">Accept and process requests from the network</p>
                </div>
                <Switch checked={isProviding} onCheckedChange={toggleProviding} />
              </div>

              {isProviding && (
                <>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Provider Settings</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-accept" className="font-medium">
                            Auto-accept Requests
                          </Label>
                          <p className="text-xs text-gray-400">Automatically accept incoming requests</p>
                        </div>
                        <Switch id="auto-accept" checked={autoAccept} onCheckedChange={setAutoAccept} />
                      </div>

                      <div>
                        <Label htmlFor="min-reward">Minimum Reward</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="min-reward"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={minReward}
                            onChange={(e) => setMinReward(e.target.value)}
                            className="bg-gray-700 border-gray-600"
                          />
                          <span className="flex items-center text-sm">UBI</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Only show requests with rewards above this amount</p>
                      </div>

                      <div>
                        <Label htmlFor="max-queue">Maximum Queue Size</Label>
                        <Input
                          id="max-queue"
                          type="number"
                          min="1"
                          max="20"
                          value={maxQueueSize}
                          onChange={(e) => setMaxQueueSize(Number(e.target.value))}
                          className="bg-gray-700 border-gray-600 mt-1"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Maximum number of requests to process simultaneously
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="bandwidth">Bandwidth Allocation</Label>
                          <span className="text-xs text-gray-400">{maxBandwidth}%</span>
                        </div>
                        <Slider
                          id="bandwidth"
                          min={10}
                          max={90}
                          step={5}
                          value={[maxBandwidth]}
                          onValueChange={(value) => setMaxBandwidth(value[0])}
                          className="my-2"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Percentage of network bandwidth allocated to processing requests
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-800/30 rounded-md p-3 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-300 font-medium mb-1">Earning Potential</p>
                      <p className="text-xs text-gray-300">
                        With your current settings, you can earn approximately 0.75-1.25 UBI per hour by processing
                        network requests.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {!isProviding ? (
              <Card className="p-4 bg-gray-900/80 text-center">
                <p className="text-gray-400">Provider mode is disabled</p>
                <Button
                  onClick={() => toggleProviding(true)}
                  className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  Enable Provider Mode
                </Button>
              </Card>
            ) : availableRequests.length === 0 && incomingRequests.length === 0 ? (
              <Card className="p-4 bg-gray-900/80 text-center">
                <p className="text-gray-400">No available or incoming requests</p>
                <p className="text-sm text-gray-500 mt-1">
                  Requests will appear here when they're available on the network
                </p>
              </Card>
            ) : (
              <>
                {availableRequests.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium px-1">Available Requests</h3>
                    {availableRequests.map((request) => (
                      <AIRequestCard key={request.id} request={request} mode="available" />
                    ))}
                  </>
                )}

                {incomingRequests.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium px-1 mt-4">Processing Requests</h3>
                    {incomingRequests
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((request) => (
                        <AIRequestCard key={request.id} request={request} mode="incoming" />
                      ))}
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="connections">
          <Card className="w-full p-5 bg-gray-900/80 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-medium">Network Connections</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Connection Settings</h3>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="max-connections">Maximum Connections</Label>
                    <Input
                      id="max-connections"
                      type="number"
                      min="5"
                      max="50"
                      value={maxConnections}
                      onChange={(e) => setMaxConnections(Number(e.target.value))}
                      className="bg-gray-700 border-gray-600 mt-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">Maximum number of peer connections to maintain</p>
                  </div>

                  <div>
                    <Label htmlFor="connection-timeout">Connection Timeout (seconds)</Label>
                    <Input
                      id="connection-timeout"
                      type="number"
                      min="5"
                      max="120"
                      value={connectionTimeout}
                      onChange={(e) => setConnectionTimeout(Number(e.target.value))}
                      className="bg-gray-700 border-gray-600 mt-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">Time to wait before dropping unresponsive connections</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="peer-discovery" className="font-medium">
                        Automatic Peer Discovery
                      </Label>
                      <p className="text-xs text-gray-400">Automatically find and connect to new peers</p>
                    </div>
                    <Switch id="peer-discovery" checked={peerDiscovery} onCheckedChange={setPeerDiscovery} />
                  </div>

                  <div>
                    <Label htmlFor="network-region">Network Region</Label>
                    <Select value={networkRegion} onValueChange={setNetworkRegion}>
                      <SelectTrigger id="network-region" className="bg-gray-700 border-gray-600 mt-1">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global (All Regions)</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">Prioritize connections to nodes in specific regions</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Active Connections</h3>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-gray-750 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${i < 6 ? "bg-green-500" : "bg-yellow-500"}`}></div>
                        <span className="text-sm">Node-{(Math.random() * 1000).toFixed(0)}</span>
                      </div>
                      <div className="text-xs text-gray-400">{Math.floor(Math.random() * 100)}ms</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">Connection Security</p>
                  <p className="text-xs text-gray-300">
                    All network connections are end-to-end encrypted and authenticated using your node's cryptographic
                    identity.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

