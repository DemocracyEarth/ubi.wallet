"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Key, ExternalLink, Cpu, Zap, Shield, AlertTriangle } from "lucide-react"
import { useAIRequestStore } from "@/lib/stores/ai-request-store"

// Mock AI service providers
const aiProviders = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Access GPT models for text generation and more",
    apiKeyConfigured: false,
    models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    capabilities: ["text", "image", "audio"],
    earningRate: 0.05, // UBI per request
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Use Claude models for helpful, harmless, and honest AI",
    apiKeyConfigured: false,
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    capabilities: ["text"],
    earningRate: 0.04,
  },
  {
    id: "stability",
    name: "Stability AI",
    description: "Generate high-quality images with Stable Diffusion",
    apiKeyConfigured: false,
    models: ["stable-diffusion-xl", "stable-diffusion-3"],
    capabilities: ["image"],
    earningRate: 0.06,
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Efficient and powerful open models",
    apiKeyConfigured: false,
    models: ["mistral-large", "mistral-medium", "mistral-small"],
    capabilities: ["text"],
    earningRate: 0.03,
  },
]

export default function AIConfigurationSettings() {
  const { isProviding, toggleProviding } = useAIRequestStore()

  const [providers, setProviders] = useState(aiProviders)
  const [configureProvider, setConfigureProvider] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState("")

  // Resource allocation settings
  const [cpuAllocation, setCpuAllocation] = useState(50)
  const [memoryAllocation, setMemoryAllocation] = useState(40)
  const [maxConcurrentRequests, setMaxConcurrentRequests] = useState(3)
  const [defaultProvider, setDefaultProvider] = useState("openai")
  const [defaultModel, setDefaultModel] = useState("gpt-4o")

  // Privacy settings
  const [privacyMode, setPrivacyMode] = useState(true)
  const [encryptResponses, setEncryptResponses] = useState(true)
  const [allowAnonymousRequests, setAllowAnonymousRequests] = useState(false)

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim() || !configureProvider) return

    // Update provider API key status
    setProviders(
      providers.map((provider) =>
        provider.id === configureProvider ? { ...provider, apiKeyConfigured: true } : provider,
      ),
    )

    // Reset form
    setApiKeyInput("")
    setConfigureProvider(null)
  }

  const handleDeleteApiKey = (providerId: string) => {
    // Update provider API key status
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, apiKeyConfigured: false } : provider)),
    )
  }

  const getProviderById = (id: string) => {
    return providers.find((p) => p.id === id)
  }

  const getDefaultModelOptions = () => {
    const provider = getProviderById(defaultProvider)
    return provider ? provider.models : []
  }

  return (
    <Card className="w-full p-5 bg-gray-900/80 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-medium">AI Service Configuration</h2>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="providers">API Keys</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">Service Providers</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm">Provide AI Services</span>
              <Switch checked={isProviding} onCheckedChange={toggleProviding} />
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{provider.name}</div>
                  {provider.apiKeyConfigured ? (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <Shield className="w-3 h-3" />
                      <span>Configured</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Not configured</div>
                  )}
                </div>

                <div className="text-xs text-gray-400 mb-3">{provider.description}</div>

                {configureProvider === provider.id ? (
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder={`Enter ${provider.name} API Key`}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveApiKey}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!apiKeyInput.trim()}
                      >
                        Save Key
                      </Button>
                      <Button variant="outline" onClick={() => setConfigureProvider(null)} className="border-gray-700">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {provider.apiKeyConfigured ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-800/50 hover:bg-red-900/30 text-red-400"
                        onClick={() => handleDeleteApiKey(provider.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove Key
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700"
                        onClick={() => setConfigureProvider(provider.id)}
                      >
                        <Key className="w-3.5 h-3.5 mr-1" />
                        Add Key
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700"
                      onClick={() => window.open(`https://${provider.id}.com/api-keys`, "_blank")}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Get Key
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="default-provider">Default Provider</Label>
              <Select value={defaultProvider} onValueChange={setDefaultProvider}>
                <SelectTrigger id="default-provider" className="bg-gray-800/50 border-gray-700 mt-1">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id} disabled={!provider.apiKeyConfigured}>
                      {provider.name} {!provider.apiKeyConfigured && "(API Key Required)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="default-model">Default Model</Label>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger id="default-model" className="bg-gray-800/50 border-gray-700 mt-1">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {getDefaultModelOptions().map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="cpu-allocation">CPU Allocation</Label>
                <span className="text-sm text-gray-400">{cpuAllocation}%</span>
              </div>
              <Slider
                id="cpu-allocation"
                min={10}
                max={90}
                step={5}
                value={[cpuAllocation]}
                onValueChange={(value) => setCpuAllocation(value[0])}
                className="my-2"
              />
              <p className="text-xs text-gray-400">Percentage of CPU resources allocated to AI request processing</p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="memory-allocation">Memory Allocation</Label>
                <span className="text-sm text-gray-400">{memoryAllocation}%</span>
              </div>
              <Slider
                id="memory-allocation"
                min={10}
                max={90}
                step={5}
                value={[memoryAllocation]}
                onValueChange={(value) => setMemoryAllocation(value[0])}
                className="my-2"
              />
              <p className="text-xs text-gray-400">Percentage of memory resources allocated to AI request processing</p>
            </div>

            <div>
              <Label htmlFor="max-concurrent">Maximum Concurrent Requests</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="max-concurrent"
                  type="number"
                  min={1}
                  max={10}
                  value={maxConcurrentRequests}
                  onChange={(e) => setMaxConcurrentRequests(Number(e.target.value))}
                  className="bg-gray-800/50 border-gray-700"
                />
                <Button variant="outline" className="border-gray-700" onClick={() => setMaxConcurrentRequests(3)}>
                  Reset
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Maximum number of AI requests to process simultaneously</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">Resource Management</p>
                <p className="text-xs text-gray-300">
                  Higher resource allocation will allow you to process more requests and earn more UBI, but may affect
                  other applications running on your node.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="privacy-mode" className="font-medium">
                  Privacy Mode
                </Label>
                <p className="text-xs text-gray-400">Don't store prompts and responses</p>
              </div>
              <Switch id="privacy-mode" checked={privacyMode} onCheckedChange={setPrivacyMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="encrypt-responses" className="font-medium">
                  Encrypt Responses
                </Label>
                <p className="text-xs text-gray-400">End-to-end encryption for all AI responses</p>
              </div>
              <Switch id="encrypt-responses" checked={encryptResponses} onCheckedChange={setEncryptResponses} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymous-requests" className="font-medium">
                  Allow Anonymous Requests
                </Label>
                <p className="text-xs text-gray-400">Process requests from unverified nodes</p>
              </div>
              <Switch
                id="anonymous-requests"
                checked={allowAnonymousRequests}
                onCheckedChange={setAllowAnonymousRequests}
              />
            </div>

            {allowAnonymousRequests && (
              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-md p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-300 font-medium mb-1">Security Warning</p>
                  <p className="text-xs text-gray-300">
                    Allowing anonymous requests may increase your earnings but could expose your node to potential
                    abuse. Consider enabling additional security measures.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

