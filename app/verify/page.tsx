"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, AlertCircle, Lock, FileText, User, AtSign, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVerificationStore } from "@/lib/stores/verification-store"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DesktopLayout from "@/components/desktop-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Separator } from "@/components/ui/separator"

export default function VerifyPage() {
  const router = useRouter()
  const { isVerified, setVerified, verificationMethod } = useVerificationStore()
  const [verifying, setVerifying] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(verificationMethod || "id")
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  // Check if we're on a desktop screen
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px)")

  // Ref for the main container to ensure proper padding
  const mainContainerRef = useRef<HTMLDivElement>(null)

  // Adjust padding to account for bottom menu
  useEffect(() => {
    const adjustPadding = () => {
      if (mainContainerRef.current) {
        // Add padding to ensure content isn't hidden behind the bottom menu
        mainContainerRef.current.style.paddingBottom = "80px"
      }
    }

    adjustPadding()
    window.addEventListener("resize", adjustPadding)

    return () => {
      window.removeEventListener("resize", adjustPadding)
    }
  }, [])

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

  // Compact Benefits component with horizontal layout on desktop
  const BenefitsCard = () => (
    <Card className="w-full p-4 bg-blue-900/20 border border-blue-800/30 mb-6">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-400" />
        Benefits of verification
      </h3>

      {isDesktop ? (
        // Horizontal layout for desktop
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Access to UBI claims</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Personalized @username</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Verification badge</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Send & receive tips</span>
            </div>
          </div>
        </div>
      ) : (
        // Vertical layout for mobile
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
      )}

      <Separator className="my-3" />

      <div className="flex items-center gap-2">
        <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-400">
          Verification is processed by decentralized oracles with privacy protection.
        </p>
      </div>
    </Card>
  )

  // Privacy info component
  const PrivacyInfo = () => (
    <Card className="w-full p-4 bg-purple-900/20 border border-purple-800/30 mb-6">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-purple-400" />
        Privacy Protection
      </h3>

      {isDesktop ? (
        // Horizontal layout for desktop
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Data processed locally</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Zero-knowledge proofs</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">No personal data stored</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">End-to-end encryption</span>
            </div>
          </div>
        </div>
      ) : (
        // Vertical layout for mobile
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">All verification data is processed locally on your device</span>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">
              Only cryptographic proofs are stored on-chain, not your personal information
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">Your biometric data never leaves your device</span>
          </div>
        </div>
      )}
    </Card>
  )

  // FAQ component for desktop
  const VerificationFAQ = () => (
    <Card className="w-full p-4 bg-gray-900/50 border border-gray-800/50 max-h-[200px] overflow-y-auto">
      <h3 className="font-medium mb-2 flex items-center gap-2 sticky top-0 bg-gray-900/50 py-1">
        <Shield className="w-4 h-4 text-blue-400" />
        Verification FAQ
      </h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-200">How long does verification take?</h4>
          <p className="text-xs text-gray-400 mt-1">
            Most verifications complete within 2-5 minutes, depending on the method chosen.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-200">Can I change my verification method later?</h4>
          <p className="text-xs text-gray-400 mt-1">
            Yes, you can update your verification method at any time from your account settings.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-200">What if verification fails?</h4>
          <p className="text-xs text-gray-400 mt-1">
            You can retry with the same method or choose a different verification option.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-200">Is verification required?</h4>
          <p className="text-xs text-gray-400 mt-1">
            Verification is required to access UBI claims and certain social features, but basic wallet functionality
            works without it.
          </p>
        </div>
      </div>
    </Card>
  )

  return (
    <DesktopLayout>
      <div className="w-full max-w-7xl mx-auto" ref={mainContainerRef}>
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-6">Verification</h1>

        {isVerified ? (
          <div className="px-4 md:px-6">
            <Card className="w-full p-6 bg-gray-900/80 flex flex-col items-center text-center max-w-xl mx-auto">
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
          </div>
        ) : (
          <div className={`grid ${isDesktop ? "grid-cols-3 gap-6" : "grid-cols-1 gap-4"} px-4 md:px-6`}>
            {/* Main verification form - takes 2/3 of space on desktop */}
            <div className={`${isDesktop ? "col-span-2" : ""}`}>
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
                    Verified users receive a personalized handle (@username) instead of using a chain address. This
                    makes it easier for others to recognize and interact with you in the network.
                  </p>
                  <div className={`${isTablet ? "flex gap-4 items-end" : "space-y-3"}`}>
                    <div className={`${isTablet ? "flex-1" : ""}`}>
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
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-700"
                          onClick={checkUsernameAvailability}
                        >
                          Check
                        </Button>
                      </div>
                      {usernameAvailable !== null && (
                        <p className={`text-xs mt-1 ${usernameAvailable ? "text-green-400" : "text-red-400"}`}>
                          {usernameAvailable
                            ? "Username is available!"
                            : "Username is already taken. Please try another."}
                        </p>
                      )}
                    </div>
                    <div className={`text-xs text-gray-400 flex items-start gap-2 ${isTablet ? "max-w-xs" : ""}`}>
                      <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Your handle will be permanently linked to your verified identity and cannot be transferred.
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">
                  To access UBI claims and create native streams, you need to verify your identity using zero-knowledge
                  proofs. This prevents duplicate accounts while protecting your privacy.
                </p>

                {error && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Tabs defaultValue={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                  <TabsList className={`${isDesktop ? "flex justify-start gap-2 mb-4" : "grid grid-cols-3 mb-4"}`}>
                    <TabsTrigger value="id" className={`${isDesktop ? "px-6" : "text-xs"}`}>
                      ID Verification
                    </TabsTrigger>
                    <TabsTrigger value="biometric" className={`${isDesktop ? "px-6" : "text-xs"}`}>
                      Biometric
                    </TabsTrigger>
                    <TabsTrigger value="poh" className={`${isDesktop ? "px-6" : "text-xs"}`}>
                      Proof of Humanity
                    </TabsTrigger>
                  </TabsList>

                  <div className={`${isDesktop ? "grid grid-cols-1 lg:grid-cols-3 gap-4" : ""}`}>
                    <TabsContent value="id" className={`${isDesktop ? "col-span-3" : ""}`}>
                      <div className={`${isDesktop ? "grid grid-cols-3 gap-4" : ""}`}>
                        <Card className={`border border-gray-800 p-4 mb-4 ${isDesktop ? "col-span-3" : ""}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <h3 className="font-medium">ID Document Verification</h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Upload your ID document. A zero-knowledge proof will be generated to verify your identity
                            without storing your personal data.
                          </p>
                          <div className={`${isDesktop ? "grid grid-cols-2 gap-4" : ""}`}>
                            <div className="bg-gray-800 rounded-lg p-6 border border-dashed border-gray-700 text-center mb-2 flex flex-col items-center justify-center">
                              <FileText className="w-12 h-12 text-gray-600 mb-2" />
                              <p className="text-sm text-gray-400">Drag and drop your ID document or click to browse</p>
                              <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                            </div>
                            <div className={`${isDesktop ? "flex flex-col justify-center" : "mt-4"}`}>
                              <h4 className="font-medium text-sm mb-2">ID Verification Process</h4>
                              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                <li>Upload a valid government-issued ID</li>
                                <li>Our system will extract the necessary information</li>
                                <li>A zero-knowledge proof is generated locally</li>
                                <li>Only the proof is submitted to verify your uniqueness</li>
                              </ol>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="biometric" className={`${isDesktop ? "col-span-3" : ""}`}>
                      <div className={`${isDesktop ? "grid grid-cols-3 gap-4" : ""}`}>
                        <Card className={`border border-gray-800 p-4 mb-4 ${isDesktop ? "col-span-3" : ""}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-purple-400" />
                            <h3 className="font-medium">Biometric Verification</h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Use facial recognition to verify your uniqueness. Your biometric data never leaves your
                            device.
                          </p>
                          <div className={`${isDesktop ? "grid grid-cols-2 gap-4" : ""}`}>
                            <div className="bg-gray-800 rounded-lg p-6 border border-dashed border-gray-700 text-center mb-2 flex flex-col items-center">
                              <div className="w-24 h-24 rounded-full bg-gray-700 mb-2 flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-500" />
                              </div>
                              <p className="text-sm text-gray-400 mt-2">Click to start facial scan</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Requires camera access. Data processed locally.
                              </p>
                            </div>
                            <div className={`${isDesktop ? "flex flex-col justify-center" : "mt-4"}`}>
                              <h4 className="font-medium text-sm mb-2">Biometric Verification Process</h4>
                              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                <li>Complete a brief facial scan using your device's camera</li>
                                <li>Your device processes the biometric data locally</li>
                                <li>A unique cryptographic proof is generated</li>
                                <li>The proof verifies your humanity without storing personal data</li>
                              </ol>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="poh" className={`${isDesktop ? "col-span-3" : ""}`}>
                      <div className={`${isDesktop ? "grid grid-cols-3 gap-4" : ""}`}>
                        <Card className={`border border-gray-800 p-4 mb-4 ${isDesktop ? "col-span-3" : ""}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-green-400" />
                            <h3 className="font-medium">Proof of Humanity</h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Connect to the Proof of Humanity registry to verify your status as a unique human.
                          </p>
                          <div className={`${isDesktop ? "grid grid-cols-2 gap-4" : ""}`}>
                            <div className="bg-gray-800 rounded-lg p-6 border border-dashed border-gray-700 text-center mb-2 flex flex-col items-center justify-center">
                              <Shield className="w-12 h-12 text-gray-600 mb-2" />
                              <p className="text-sm text-gray-400">Connect your PoH-verified wallet to proceed</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Requires an existing Proof of Humanity registration.
                              </p>
                            </div>
                            <div className={`${isDesktop ? "flex flex-col justify-center" : "mt-4"}`}>
                              <h4 className="font-medium text-sm mb-2">Proof of Humanity Process</h4>
                              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                <li>Connect your wallet that is registered with Proof of Humanity</li>
                                <li>Sign a message to verify wallet ownership</li>
                                <li>Our system checks your PoH status on-chain</li>
                                <li>Your verification is completed automatically</li>
                              </ol>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                <div className="flex items-center gap-2 mb-4 mt-4">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400">
                    Your data is protected using zero-knowledge proofs. We only store verification status, not your
                    personal information.
                  </p>
                </div>

                <Button onClick={handleVerify} disabled={verifying} className="w-full bg-green-600 hover:bg-green-700">
                  {verifying ? "Verifying..." : "Verify Now"}
                </Button>
              </Card>

              {/* Show privacy info on desktop in main column, hidden on mobile */}
              {isDesktop && <PrivacyInfo />}
            </div>

            {/* Benefits section - takes 1/3 of space on desktop */}
            <div className={`${isDesktop ? "space-y-8" : ""}`}>
              {/* Benefits card with optimized height */}
              <BenefitsCard />

              {/* Show privacy info on mobile, hidden on desktop */}
              {!isDesktop && <PrivacyInfo />}

              {/* Scrollable FAQ for desktop only */}
              {isDesktop && <VerificationFAQ />}
            </div>
          </div>
        )}
      </div>
    </DesktopLayout>
  )
}
