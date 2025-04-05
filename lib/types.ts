export interface KeyPair {
  publicKey: string
  secretKey: Uint8Array
}

export interface Contract {
  id: string
  prompt: string
  description: string
  code: string
  createdAt: Date
  name?: string
}

export interface Comment {
  id: string
  author: string
  authorName: string
  content: string
  timestamp: Date
  likes: number
  isVerified?: boolean
  handle?: string | null
}

export interface Attachment {
  type: string // "image", "video", "link", etc.
  url: string
}

export interface Post {
  id: string
  author: string
  authorName: string
  content: string
  timestamp: Date
  comments: Comment[]
  likes: number
  tips: number
  attachment: Attachment | null
  isVerified?: boolean
  handle?: string | null
}

export interface PollOption {
  text: string
  votes: number
  voters: string[] // Array of voter public keys
}

export interface Poll {
  id: string
  author: string
  authorName: string
  handle?: string | null
  isVerified?: boolean
  question: string
  description?: string
  options: PollOption[]
  totalVotes: number
  poolAmount: number
  timestamp: Date
  endDate: Date
  status: "active" | "completed" | "canceled"
}

export interface DeployedContract {
  id: string
  contractId: string
  address: string
  network: string
  deployedAt: Date
  transactionHash: string
  owner: string
  verified: boolean
}

