"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AIServicesRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Contracts page
    router.replace("/contracts")
  }, [router])

  // Return empty div while redirecting
  return <div></div>
}
