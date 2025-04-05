import { create } from "zustand"
import { mockGenerateContract } from "@/lib/ai"
import type { Contract } from "@/lib/types"

interface ContractState {
  currentContract: Contract | null
  contracts: Contract[]
  generateContract: (prompt: string) => Promise<void>
  addContract: (contract: Contract) => void
  removeContract: (contractId: string) => void
  getContract: (contractId: string) => Contract | undefined
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
  removeContract: (contractId: string) => {
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== contractId),
    }))
  },
  getContract: (contractId: string) => {
    return get().contracts.find((contract) => contract.id === contractId)
  },
}))

