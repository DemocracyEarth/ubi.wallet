import { create } from "zustand"
import type { KeyPair } from "@/lib/types"

interface WalletState {
  publicKey: string
  secretKey: Uint8Array
  balance: number
  initializeWallet: (keyPair: KeyPair) => void
  updateBalance: (newBalance: number) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: "",
  secretKey: new Uint8Array(),
  balance: 5.0, // Mock initial balance
  initializeWallet: (keyPair: KeyPair) =>
    set({
      publicKey: keyPair.publicKey,
      secretKey: keyPair.secretKey,
    }),
  updateBalance: (newBalance: number) => set({ balance: newBalance }),
}))
