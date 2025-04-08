"use client"

import type React from "react"

import { useState } from "react"
import { useSocialStore } from "@/lib/stores/social-store"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function SocialFeed() {
  const [newPost, setNewPost] = useState("")
  const { posts, addPost } = useSocialStore()
  const { publicKey } = useWalletStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim()) {
      addPost({
        id: Date.now().toString(),
        author: publicKey,
        authorName: "You",
        content: newPost,
        timestamp: new Date(),
        comments: 0,
      })
      setNewPost("")
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Social Feed</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            className="bg-gray-800/50 border-gray-700"
            placeholder="What's happening?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Post
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {posts &&
          posts.map((post) => (
            <div key={post.id} className="rounded-xl p-4 bg-gray-900/80">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{post.authorName}</div>
                  <div className="text-sm text-gray-400">
                    {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
              <p className="mb-3">{post.content}</p>
              <div className="flex justify-between text-gray-400">
                <button className="flex items-center gap-1">
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
                <button>
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
