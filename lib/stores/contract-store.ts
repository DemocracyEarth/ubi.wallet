import { create } from "zustand"
import { mockGenerateContract } from "@/lib/ai"
import type { Contract } from "@/lib/types"

interface ContractState {
  currentContract: Contract | null
  contracts: Contract[]
  generateContract: (prompt: string) => void
  addContract: (contract: Contract) => void
}

export const useContractStore = create<ContractState>((set, get) => ({
  currentContract: null,
  contracts: [],
  generateContract: async (prompt: string) => {
    // Mock AI contract generation
    const contract = await mockGenerateContract(prompt)
    set({ currentContract: contract })
  },
  addContract: (contract: Contract) => {
    set((state) => ({
      contracts: [...state.contracts, contract],
      currentContract: null,
    }))
  },
}))

