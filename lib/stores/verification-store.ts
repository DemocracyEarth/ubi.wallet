import { create } from "zustand"
import { persist } from "zustand/middleware"

type VerificationMethod = "id" | "biometric" | "poh" | null

interface VerificationState {
  isVerified: boolean
  verificationMethod: VerificationMethod
  verifiedAt: Date | null
  setVerified: (status: boolean, method: VerificationMethod) => void
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      isVerified: false,
      verificationMethod: null,
      verifiedAt: null,
      setVerified: (status, method) =>
        set({
          isVerified: status,
          verificationMethod: method,
          verifiedAt: status ? new Date() : null,
        }),
    }),
    {
      name: "verification-storage",
    },
  ),
)

