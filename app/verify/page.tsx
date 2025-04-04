"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, AlertCircle, Lock, FileText, User, AtSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVerificationStore } from "@/lib/stores/verification-store"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PersistentDemoNotice from "@/components/persistent-demo-notice"

export default function VerifyPage() {
  const router = useRouter()
  const { isVerified, setVerified, verificationMethod } = useVerificationStore()
  const [verifying, setVerifying] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(verificationMethod || "id")
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const handleVerify = async () => {
    if (!username.trim()) {
      setError("Please choose a username to continue with verification")
      return
    }

    setVerifying(true)
    setError(null)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // 90% success rate for the mock
    if (Math.random() > 0.1) {
      setVerified(true, selectedMethod)
      router.push("/ubi")
    } else {
      setError("Verification failed. Please try again or select a different method.")
      setVerifying(false)
    }
  }

  const checkUsernameAvailability = () => {
    if (!username.trim()) {
      setUsernameAvailable(null)
      return
    }

    // Simulate checking username availability
    setTimeout(() => {
      // Mock check - usernames with "taken" are unavailable
      const isAvailable = !username.toLowerCase().includes("taken")
      setUsernameAvailable(isAvailable)
    }, 500)
  }

  if (isVerified) {
    return (
      <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
        <h1 className="text-2xl font-bold mb-4 self-start">Verification</h1>

        <Card className="w-full p-6 bg-gray-900/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Already Verified</h2>
          <p className="text-gray-400 mb-2">
            Your identity has been verified using{" "}
            {verificationMethod === "id"
              ? "ID verification"
              : verificationMethod === "biometric"
                ? "biometric verification"
                : "proof of humanity"}
            .
          </p>
          <div className="bg-green-900/20 border border-green-800/30 rounded-md p-3 mb-6 flex items-center justify-center gap-2">
            <AtSign className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Your personalized handle is active</span>
          </div>
          <div className="flex gap-3">
            <Link href="/ubi">
              <Button className="bg-green-600 hover:bg-green-700">Go to UBI Claims</Button>
            </Link>
            <Button variant="outline" onClick={() => setVerified(false, null)} className="border-gray-700">
              Reset Verification
            </Button>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      <PersistentDemoNotice className="w-full mb-4" />
      <h1 className="text-2xl font-bold mb-4 self-start">Verification</h1>

      <Card className="w-full p-5 bg-gray-900/80 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold">Verify Your Humanity</h2>
        </div>

        <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4 mb-4">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <AtSign className="w-4 h-4 text-blue-400" />
            Choose Your Handle
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            Verified users receive a personalized handle (@username) instead of using a chain address. This makes it
            easier for others to recognize and interact with you in the network.
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="username">Your Username</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <Input
                    id="username"
                    className="pl-7 bg-gray-800/50 border-gray-700"
                    placeholder="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setUsernameAvailable(null)
                    }}
                    onBlur={checkUsernameAvailability}
                  />
                </div>
                <Button type="button" variant="outline" className="border-gray-700" onClick={checkUsernameAvailability}>
                  Check
                </Button>
              </div>
              {usernameAvailable !== null && (
                <p className={`text-xs mt-1 ${usernameAvailable ? "text-green-400" : "text-red-400"}`}>
                  {usernameAvailable ? "Username is available!" : "Username is already taken. Please try another."}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-start gap-2">
              <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Your handle will be permanently linked to your verified identity and cannot be transferred.</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-4">
          To access UBI claims and create native streams, you need to verify your identity using zero-knowledge proofs.
          This prevents duplicate accounts while protecting your privacy.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <Tabs defaultValue={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="id" className="text-xs">
              ID Verification
            </TabsTrigger>
            <TabsTrigger value="biometric" className="text-xs">
              Biometric
            </TabsTrigger>
            <TabsTrigger value="poh" className="text-xs">
              Proof of Humanity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="id">
            <Card className="border border-gray-800 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="font-medium">ID Document Verification</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Upload your ID document. A zero-knowledge proof will be generated to verify your identity without
                storing your personal data.
              </p>
              <div className="bg-gray-800 rounded-lg p-3 border border-dashed border-gray-700 text-center mb-2">
                <p className="text-sm text-gray-400">Drag and drop your ID document or click to browse</p>
              </div>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
            </Card>
          </TabsContent>

          <TabsContent value="biometric">
            <Card className="border border-gray-800 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-purple-400" />
                <h3 className="font-medium">Biometric Verification</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Use facial recognition to verify your uniqueness. Your biometric data never leaves your device.
              </p>
              <div className="bg-gray-800 rounded-lg p-6 border border-dashed border-gray-700 text-center mb-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm text-gray-400">Click to start facial scan</p>
              </div>
              <p className="text-xs text-gray-500">Requires camera access. Data processed locally.</p>
            </Card>
          </TabsContent>

          <TabsContent value="poh">
            <Card className="border border-gray-800 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-green-400" />
                <h3 className="font-medium">Proof of Humanity</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Connect to the Proof of Humanity registry to verify your status as a unique human.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 border border-dashed border-gray-700 text-center mb-2">
                <p className="text-sm text-gray-400">Connect your PoH-verified wallet to proceed</p>
              </div>
              <p className="text-xs text-gray-500">Requires an existing Proof of Humanity registration.</p>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 mb-4 mt-4">
          <Lock className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-400">
            Your data is protected using zero-knowledge proofs. We only store verification status, not your personal
            information.
          </p>
        </div>

        <Button onClick={handleVerify} disabled={verifying} className="w-full bg-green-600 hover:bg-green-700">
          {verifying ? "Verifying..." : "Verify Now"}
        </Button>
      </Card>

      <Card className="w-full p-4 bg-blue-900/20 border border-blue-800/30">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          Benefits of verification
        </h3>
        <ul className="text-sm text-gray-300 space-y-2 mb-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Access to UBI claims and token streams</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Personalized @username instead of a chain address</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Verification badge in the social feed</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Ability to tip and receive tips from other users</span>
          </li>
        </ul>
        <p className="text-xs text-gray-400">
          The verification is processed by decentralized oracles and your data never leaves your device unencrypted.
        </p>
      </Card>
    </main>
  )
}

