import { create } from "zustand"
import { useWalletStore } from "@/lib/stores/wallet-store"

export type AIRequestStatus = "pending" | "processing" | "completed" | "failed" | "canceled"
export type AIRequestType = "text" | "image" | "audio" | "code"

export interface AIRequest {
  id: string
  type: AIRequestType
  prompt: string
  model: string
  requesterAddress: string
  requesterName?: string
  providerAddress?: string
  providerName?: string
  status: AIRequestStatus
  reward: number
  createdAt: Date
  completedAt?: Date
  response?: string
  errorMessage?: string
  retryCount: number
  maxRetries: number
}

interface AIRequestState {
  outgoingRequests: AIRequest[]
  incomingRequests: AIRequest[]
  availableRequests: AIRequest[]
  fulfilledRequests: AIRequest[]
  isProviding: boolean
  totalEarned: number
  totalSpent: number

  // Actions
  createRequest: (
    request: Omit<AIRequest, "id" | "status" | "createdAt" | "retryCount" | "maxRetries" | "requesterAddress">,
  ) => Promise<AIRequest>
  cancelRequest: (requestId: string) => void
  acceptRequest: (requestId: string) => Promise<void>
  completeRequest: (requestId: string, response: string) => void
  failRequest: (requestId: string, errorMessage: string) => void
  retryRequest: (requestId: string) => void
  toggleProviding: (isProviding: boolean) => void

  // Mock network functions
  fetchAvailableRequests: () => Promise<void>
  mockNetworkActivity: () => void
}

export const useAIRequestStore = create<AIRequestState>((set, get) => ({
  outgoingRequests: [],
  incomingRequests: [],
  availableRequests: [],
  fulfilledRequests: [],
  isProviding: false,
  totalEarned: 0,
  totalSpent: 0,

  createRequest: async (requestData) => {
    const { publicKey } = useWalletStore.getState()
    const { updateBalance } = useWalletStore.getState()
    const { balance } = useWalletStore.getState()

    // Check if user has enough balance
    if (balance < requestData.reward) {
      throw new Error("Insufficient balance to create request")
    }

    // Create new request
    const newRequest: AIRequest = {
      id: `req_${Date.now()}`,
      ...requestData,
      requesterAddress: publicKey,
      status: "pending",
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
    }

    // Deduct reward from balance
    updateBalance(balance - requestData.reward)

    // Add to outgoing requests
    set((state) => ({
      outgoingRequests: [newRequest, ...state.outgoingRequests],
      totalSpent: state.totalSpent + requestData.reward,
    }))

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return newRequest
  },

  cancelRequest: (requestId) => {
    const { outgoingRequests } = get()
    const request = outgoingRequests.find((r) => r.id === requestId)

    if (!request || request.status !== "pending") return

    // Refund the reward
    const { updateBalance, balance } = useWalletStore.getState()
    updateBalance(balance + request.reward)

    // Update request status
    set((state) => ({
      outgoingRequests: state.outgoingRequests.map((r) => (r.id === requestId ? { ...r, status: "canceled" } : r)),
      totalSpent: state.totalSpent - request.reward,
    }))
  },

  acceptRequest: async (requestId) => {
    const { availableRequests } = get()
    const request = availableRequests.find((r) => r.id === requestId)

    if (!request || request.status !== "pending") return

    const { publicKey } = useWalletStore.getState()

    // Update request status
    set((state) => ({
      availableRequests: state.availableRequests.filter((r) => r.id !== requestId),
      incomingRequests: [
        {
          ...request,
          status: "processing",
          providerAddress: publicKey,
          providerName: "You",
        },
        ...state.incomingRequests,
      ],
    }))

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
  },

  completeRequest: (requestId, response) => {
    const { incomingRequests } = get()
    const request = incomingRequests.find((r) => r.id === requestId)

    if (!request || request.status !== "processing") return

    // Update balance with reward
    const { updateBalance, balance } = useWalletStore.getState()
    updateBalance(balance + request.reward)

    // Update request status
    set((state) => ({
      incomingRequests: state.incomingRequests.filter((r) => r.id !== requestId),
      fulfilledRequests: [
        {
          ...request,
          status: "completed",
          response,
          completedAt: new Date(),
        },
        ...state.fulfilledRequests,
      ],
      totalEarned: state.totalEarned + request.reward,
    }))
  },

  failRequest: (requestId, errorMessage) => {
    const { incomingRequests } = get()
    const request = incomingRequests.find((r) => r.id === requestId)

    if (!request || request.status !== "processing") return

    // Update request status
    set((state) => ({
      incomingRequests: state.incomingRequests.map((r) =>
        r.id === requestId ? { ...r, status: "failed", errorMessage, completedAt: new Date() } : r,
      ),
    }))
  },

  retryRequest: (requestId) => {
    const { outgoingRequests } = get()
    const request = outgoingRequests.find((r) => r.id === requestId)

    if (!request || request.status !== "failed" || request.retryCount >= request.maxRetries) return

    // Update request status
    set((state) => ({
      outgoingRequests: state.outgoingRequests.map((r) =>
        r.id === requestId ? { ...r, status: "pending", retryCount: r.retryCount + 1 } : r,
      ),
    }))
  },

  toggleProviding: (isProviding) => {
    set({ isProviding })

    // If turning on providing, fetch available requests
    if (isProviding) {
      get().fetchAvailableRequests()
    }
  },

  fetchAvailableRequests: async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock available requests
    const mockRequests: AIRequest[] = [
      {
        id: `req_${Date.now() - 5000}`,
        type: "text",
        prompt: "Explain quantum computing in simple terms",
        model: "gpt-4o",
        requesterAddress: "0x1a2b3c4d5e6f7g8h9i0j",
        requesterName: "Alice",
        status: "pending",
        reward: 0.15,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: `req_${Date.now() - 10000}`,
        type: "image",
        prompt: "A futuristic city with flying cars and neon lights",
        model: "stable-diffusion-xl",
        requesterAddress: "0x2b3c4d5e6f7g8h9i0j1a",
        requesterName: "Bob",
        status: "pending",
        reward: 0.25,
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: `req_${Date.now() - 15000}`,
        type: "text",
        prompt: "Write a short story about a robot learning to paint",
        model: "claude-3-sonnet",
        requesterAddress: "0x3c4d5e6f7g8h9i0j1a2b",
        requesterName: "Charlie",
        status: "pending",
        reward: 0.18,
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        retryCount: 0,
        maxRetries: 3,
      },
    ]

    set({ availableRequests: mockRequests })
  },

  mockNetworkActivity: () => {
    const { isProviding } = get()

    // Only generate activity if providing is enabled
    if (!isProviding) return

    // 20% chance to add a new available request
    if (Math.random() < 0.2) {
      const { availableRequests } = get()
      const prompts = [
        "Explain the concept of blockchain in simple terms",
        "Generate a poem about digital identity",
        "What are the ethical implications of AI?",
        "Design a system for decentralized governance",
        "How does zero-knowledge proof work?",
      ]

      const models = ["gpt-4o", "claude-3-sonnet", "mistral-large"]
      const names = ["David", "Emma", "Frank", "Grace", "Henry"]

      const newRequest: AIRequest = {
        id: `req_${Date.now()}`,
        type: "text",
        prompt: prompts[Math.floor(Math.random() * prompts.length)],
        model: models[Math.floor(Math.random() * models.length)],
        requesterAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        requesterName: names[Math.floor(Math.random() * names.length)],
        status: "pending",
        reward: Math.round(Math.random() * 20 + 10) / 100, // 0.10 to 0.30
        createdAt: new Date(),
        retryCount: 0,
        maxRetries: 3,
      }

      set({ availableRequests: [newRequest, ...availableRequests] })
    }
  },
}))

