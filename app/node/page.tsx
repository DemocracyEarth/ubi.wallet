"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Server,
  Activity,
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Copy,
  AlertTriangle,
  Download,
  Upload,
  SettingsIcon,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { generateKeyPair } from "@/lib/crypto"
import { encodeBase64 } from "@/lib/utils"
import Link from "next/link"
import AIConfigurationSettings from "@/components/ai-configuration-settings"
import AINetworkManagement from "@/components/ai-network-management"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function NodePage() {
  const { publicKey, secretKey, initializeWallet } = useWalletStore()

  const [lightNodeEnabled, setLightNodeEnabled] = useState(true)
  const [syncProgress, setSyncProgress] = useState(78)
  const [peerCount, setPeerCount] = useState(12)

  // Wallet security state
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [securityCheck, setSecurityCheck] = useState(false)
  const [securityWarningAcknowledged, setSecurityWarningAcknowledged] = useState(false)
  const [importSeed, setImportSeed] = useState("")
  const [importError, setImportError] = useState<string | null>(null)

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Format private key for display
  const formatPrivateKey = () => {
    if (!secretKey || secretKey.length === 0) return "No private key available"

    const base64Key = encodeBase64(secretKey)
    if (!showPrivateKey) {
      return base64Key.substring(0, 6) + "..." + base64Key.substring(base64Key.length - 4)
    }
    return base64Key
  }

  const copyPrivateKey = () => {
    if (!secretKey || secretKey.length === 0) return

    const base64Key = encodeBase64(secretKey)
    navigator.clipboard.writeText(base64Key)
    alert("Private key copied to clipboard! Keep it secure.")
  }

  const handleImportWallet = () => {
    if (!importSeed.trim()) {
      setImportError("Please enter a valid seed phrase or private key")
      return
    }

    try {
      // In a real app, this would properly decode and validate the private key
      // For this demo, we'll just simulate a successful import

      // Generate a new keypair (in a real app, this would use the imported seed)
      const keyPair = generateKeyPair()
      initializeWallet(keyPair)

      setImportSeed("")
      setImportError(null)
      alert("Wallet imported successfully!")
    } catch (error) {
      setImportError("Invalid seed phrase or private key")
    }
  }

  // Sidebar content
  const sidebarContent = (
    <div className="space-y-4 px-2">
      <div className="text-sm font-medium text-gray-400">Node Status</div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Status:</span>
          <span className="text-green-400">Running</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Peers:</span>
          <span>{peerCount}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Sync:</span>
          <span>{syncProgress}%</span>
        </div>
        <Progress value={syncProgress} className="h-1.5" />
      </div>
    </div>
  )

  // Right panel content
  const rightPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Quick Settings</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Light Node</div>
            <div className="text-xs text-gray-400">Minimal resource usage</div>
          </div>
          <Switch checked={lightNodeEnabled} onCheckedChange={setLightNodeEnabled} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">AI Services</div>
            <div className="text-xs text-gray-400">Provide AI to the network</div>
          </div>
          <Switch checked={true} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Auto-update</div>
            <div className="text-xs text-gray-400">Keep node software updated</div>
          </div>
          <Switch checked={true} />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-300 font-medium mb-1">Network Notice</p>
          <p className="text-xs text-gray-300">
            A network upgrade is scheduled for next week. Your node will automatically update when ready.
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
          <div className="text-xs text-gray-400">Latest Block</div>
          <div className="text-lg font-bold">#1,342,567</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-xs text-gray-400">Gas Price</div>
          <div className="text-lg font-bold">12 gwei</div>
        </div>
      </div>
    </div>
  )

  return (
    <DesktopLayout
      sidebar={isDesktop ? sidebarContent : undefined}
      rightPanel={rightPanelContent}
      showRightPanel={true}
    >
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Node Settings</h1>

        <Tabs defaultValue="node" className="w-full mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="node">Node Status</TabsTrigger>
            <TabsTrigger value="ai">AI Network</TabsTrigger>
            <TabsTrigger value="wallet">Wallet Security</TabsTrigger>
          </TabsList>

          <TabsContent value="node">
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
                <Button
                  variant="outline"
                  className="w-full mt-4 flex items-center justify-center gap-2 border-gray-700"
                >
                  Open Block Explorer <ExternalLink size={14} />
                </Button>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <AIConfigurationSettings />
            <AINetworkManagement />
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="w-full p-5 bg-gray-900/80 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-medium">Wallet Security</h2>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-md p-3 mb-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-300 mb-1">Security Warning</p>
                    <p className="text-gray-300">
                      Your private key gives complete control over your wallet. Never share it with anyone and store it
                      securely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-1 block">Public Address</Label>
                  <div className="flex gap-2">
                    <Input value={publicKey} readOnly className="bg-gray-800/50 border-gray-700 font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                      onClick={() => navigator.clipboard.writeText(publicKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-sm text-gray-400">Private Key</Label>
                    <div className="flex items-center">
                      <label className="text-xs text-gray-400 mr-2">
                        <input
                          type="checkbox"
                          checked={securityCheck}
                          onChange={(e) => setSecurityCheck(e.target.checked)}
                          className="mr-1"
                        />
                        I understand the risks
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => securityCheck && setShowPrivateKey(!showPrivateKey)}
                        disabled={!securityCheck}
                      >
                        {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={formatPrivateKey()}
                      readOnly
                      type={showPrivateKey ? "text" : "password"}
                      className="bg-gray-800/50 border-gray-700 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                      onClick={copyPrivateKey}
                      disabled={!securityCheck}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-red-400 mt-1">
                    {!securityCheck && "Check the box to view or copy your private key"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 flex items-center gap-1"
                    disabled={!securityCheck}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Wallet</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 flex items-center gap-1"
                    onClick={() => {
                      // Generate a new keypair
                      const keyPair = generateKeyPair()
                      initializeWallet(keyPair)
                      alert("New wallet generated!")
                    }}
                  >
                    <Key className="w-4 h-4" />
                    <span>Generate New</span>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="w-full p-5 bg-gray-900/80">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-medium">Import Existing Wallet</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="seed-phrase" className="mb-1 block">
                    Private Key or Seed Phrase
                  </Label>
                  <Textarea
                    id="seed-phrase"
                    placeholder="Enter your private key or seed phrase"
                    value={importSeed}
                    onChange={(e) => setImportSeed(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 min-h-[80px]"
                  />
                  {importError && <p className="text-xs text-red-400 mt-1">{importError}</p>}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="security-warning"
                    checked={securityWarningAcknowledged}
                    onChange={(e) => setSecurityWarningAcknowledged(e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="security-warning" className="text-sm text-gray-400">
                    I understand that importing a wallet will replace my current wallet and I have backed up my existing
                    private key if needed.
                  </Label>
                </div>

                <Button
                  onClick={handleImportWallet}
                  disabled={!importSeed.trim() || !securityWarningAcknowledged}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Import Wallet
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}

