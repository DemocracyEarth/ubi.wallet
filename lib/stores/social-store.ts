import { create } from "zustand"
import type { Post, Comment, Poll } from "@/lib/types"

// Simple in-memory store that mimics CRDT behavior without using Automerge
interface SocialState {
  posts: Post[]
  polls: Poll[]
  initializeFeed: () => void
  initializePolls: () => void
  addPost: (post: Post) => void
  likePost: (postId: string) => void
  tipPost: (postId: string, amount: number) => void
  addComment: (postId: string, comment: Comment) => void
  likeComment: (postId: string, commentId: string) => void
  createPoll: (poll: Poll) => void
  votePoll: (pollId: string, optionIndex: number, voterPublicKey: string) => void
  syncWithPeers: () => void // Mock function for syncing with peers
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: [],
  polls: [],

  initializeFeed: () => {
    // Initialize with sample posts
    set({
      posts: [
        {
          id: "1",
          author: "alice-public-key",
          authorName: "Aalice",
          content:
            "Excited to join the UBI network! Looking forward to building a more equitable future together. What projects is everyone working on?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          comments: [
            {
              id: "c1",
              author: "bob-public-key",
              authorName: "Bob",
              content: "Welcome to the network! I'm working on a community garden funded by UBI streams.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
              likes: 2,
              isVerified: true,
              handle: "@bob",
            },
            {
              id: "c2",
              author: "charlie-public-key",
              authorName: "Charlie",
              content: "Great to have you here! Check out the resources section for project ideas.",
              timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
              likes: 1,
              isVerified: false,
            },
          ],
          likes: 5,
          tips: 0.5,
          attachment: null,
          isVerified: true,
          handle: "@aalice",
        },
        {
          id: "2",
          author: "bob-public-key",
          authorName: "Bob",
          content:
            "Just set up my first continuous UBI stream to fund a local community project. The process was so smooth!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          comments: [
            {
              id: "c3",
              author: "dana-public-key",
              authorName: "Dana",
              content: "That's awesome! What kind of project is it?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
              likes: 0,
              isVerified: true,
              handle: "@dana",
            },
          ],
          likes: 8,
          tips: 1.2,
          attachment: null,
          isVerified: true,
          handle: "@bob",
        },
        {
          id: "3",
          author: "charlie-public-key",
          authorName: "Charlie",
          content:
            "Check out this visualization of UBI distribution across our network. The growth has been incredible!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          comments: [],
          likes: 15,
          tips: 2.5,
          attachment: {
            type: "image",
            url: "/placeholder.svg?height=400&width=600",
          },
          isVerified: false,
        },
        {
          id: "4",
          author: "dana-public-key",
          authorName: "Dana",
          content: "I created a short explainer video about how UBI works on our network. Hope this helps newcomers!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          comments: [
            {
              id: "c4",
              author: "alice-public-key",
              authorName: "Aalice",
              content: "This is super helpful, thanks for making this!",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
              likes: 3,
              isVerified: true,
              handle: "@aalice",
            },
            {
              id: "c5",
              author: "bob-public-key",
              authorName: "Bob",
              content: "Great explanation. I've shared it with my friends who were curious about the system.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
              likes: 2,
              isVerified: true,
              handle: "@bob",
            },
          ],
          likes: 24,
          tips: 3.8,
          attachment: {
            type: "video",
            url: "https://example.com/video.mp4",
          },
          isVerified: true,
          handle: "@dana",
        },
        {
          id: "5",
          author: "evan-public-key",
          authorName: "Evan",
          content:
            "Just completed my verification process. The zero-knowledge proof system is impressive - secure yet privacy-preserving!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
          comments: [
            {
              id: "c6",
              author: "charlie-public-key",
              authorName: "Charlie",
              content: "The verification system is one of my favorite parts of this network. Privacy by design!",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 35), // 35 hours ago
              likes: 4,
              isVerified: false,
            },
          ],
          likes: 12,
          tips: 0.8,
          attachment: null,
          isVerified: true,
          handle: "@evan",
        },
        {
          id: "6",
          author: "fiona-public-key",
          authorName: "Fiona",
          content:
            "I'm organizing a virtual meetup for UBI recipients next week. Let's share ideas on how we're using our UBI to create positive change!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          comments: [
            {
              id: "c7",
              author: "dana-public-key",
              authorName: "Dana",
              content: "Count me in! What time is the meetup?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47 hours ago
              likes: 1,
              isVerified: true,
              handle: "@dana",
            },
            {
              id: "c8",
              author: "evan-public-key",
              authorName: "Evan",
              content: "Great initiative! I'll be there.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46), // 46 hours ago
              likes: 1,
              isVerified: true,
              handle: "@evan",
            },
          ],
          likes: 18,
          tips: 2.0,
          attachment: {
            type: "image",
            url: "/placeholder.svg?height=400&width=600",
          },
          isVerified: false,
        },
      ],
    })
  },

  initializePolls: () => {
    // Initialize with sample polls
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    set({
      polls: [
        {
          id: "poll1",
          author: "alice-public-key",
          authorName: "Aalice",
          handle: "@aalice",
          isVerified: true,
          question: "How should we allocate the community treasury this month?",
          description:
            "We have 1000 UBI in the treasury this month. Let's decide together how to allocate these funds.",
          options: [
            {
              text: "Fund local development projects",
              votes: 24,
              voters: ["user1", "user2", "user3"],
            },
            {
              text: "Support educational initiatives",
              votes: 18,
              voters: ["user4", "user5"],
            },
            {
              text: "Invest in network infrastructure",
              votes: 12,
              voters: ["user6"],
            },
            {
              text: "Save for future use",
              votes: 6,
              voters: [],
            },
          ],
          totalVotes: 60,
          poolAmount: 50,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
          endDate: yesterday,
          status: "completed",
        },
        {
          id: "poll2",
          author: "bob-public-key",
          authorName: "Bob",
          handle: "@bob",
          isVerified: true,
          question: "Which feature should we prioritize next?",
          description: "We're planning our next development sprint and want community input on priorities.",
          options: [
            {
              text: "Enhanced privacy features",
              votes: 15,
              voters: [],
            },
            {
              text: "Mobile app improvements",
              votes: 12,
              voters: [],
            },
            {
              text: "Integration with more services",
              votes: 8,
              voters: [],
            },
          ],
          totalVotes: 35,
          poolAmount: 25,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          endDate: tomorrow,
          status: "active",
        },
        {
          id: "poll3",
          author: "dana-public-key",
          authorName: "Dana",
          handle: "@dana",
          isVerified: true,
          question: "Should we implement quadratic voting for future polls?",
          description:
            "Quadratic voting would allow users to express strength of preference by spending more on votes they care about.",
          options: [
            {
              text: "Yes, implement quadratic voting",
              votes: 5,
              voters: [],
            },
            {
              text: "No, keep one-person-one-vote",
              votes: 3,
              voters: [],
            },
            {
              text: "Try it as an experiment first",
              votes: 7,
              voters: [],
            },
          ],
          totalVotes: 15,
          poolAmount: 30,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          endDate: nextWeek,
          status: "active",
        },
      ],
    })
  },

  addPost: (post: Post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }))
  },

  likePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
    }))
  },

  tipPost: (postId: string, amount: number) => {
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, tips: post.tips + amount } : post)),
    }))
  },

  addComment: (postId: string, comment: Comment) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
      ),
    }))
  },

  likeComment: (postId: string, commentId: string) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
              ),
            }
          : post,
      ),
    }))
  },

  createPoll: (poll: Poll) => {
    set((state) => ({
      polls: [poll, ...state.polls],
    }))
  },

  votePoll: (pollId: string, optionIndex: number, voterPublicKey: string) => {
    set((state) => {
      const updatedPolls = state.polls.map((poll) => {
        if (poll.id !== pollId) return poll

        // Check if user already voted
        const alreadyVoted = poll.options.some((opt) => opt.voters.includes(voterPublicKey))
        if (alreadyVoted) return poll

        // Update the selected option
        const updatedOptions = poll.options.map((option, index) => {
          if (index === optionIndex) {
            return {
              ...option,
              votes: option.votes + 1,
              voters: [...option.voters, voterPublicKey],
            }
          }
          return option
        })

        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        }
      })

      return { polls: updatedPolls }
    })
  },

  syncWithPeers: () => {
    // Mock function for syncing with peers
    console.log("Syncing with peers...")
  },
}))
