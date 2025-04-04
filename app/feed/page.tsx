"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  MoreHorizontal,
  Heart,
  Send,
  AlertCircle,
  ImageIcon,
  Video,
  Share2,
  LinkIcon,
  X,
  ChevronUp,
  CheckCircle,
  Vote,
  PieChart,
  Users,
  Info,
  Plus,
  Coins,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSocialStore } from "@/lib/stores/social-store"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { useVerificationStore } from "@/lib/stores/verification-store"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FeedPage() {
  const [newPost, setNewPost] = useState("")
  const [tipAmount, setTipAmount] = useState<Record<string, string>>({})
  const [showTipInput, setShowTipInput] = useState<Record<string, boolean>>({})
  const [showComments, setShowComments] = useState<Record<string, boolean>>({})
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("all")
  const [attachmentType, setAttachmentType] = useState<string | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState("")
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [pollDialogOpen, setPollDialogOpen] = useState(false)

  // Poll creation state
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [pollDuration, setPollDuration] = useState("3")
  const [pollAmount, setPollAmount] = useState("10")
  const [pollDescription, setPollDescription] = useState("")

  // Poll voting state
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({})

  const {
    posts,
    polls,
    addPost,
    initializeFeed,
    likePost,
    tipPost,
    addComment,
    createPoll,
    votePoll,
    initializePolls,
  } = useSocialStore()

  const { publicKey, balance, updateBalance } = useWalletStore()
  const { isVerified } = useVerificationStore()

  useEffect(() => {
    // Initialize feed if empty
    if (posts.length === 0) {
      initializeFeed()
    }

    // Initialize polls if empty
    if (polls.length === 0) {
      initializePolls()
    }
  }, [posts, polls, initializeFeed, initializePolls])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() || attachmentUrl) {
      const postContent = {
        id: Date.now().toString(),
        author: publicKey,
        authorName: "You",
        content: newPost,
        timestamp: new Date(),
        comments: [],
        likes: 0,
        tips: 0,
        attachment: attachmentUrl
          ? {
              type: attachmentType || "image",
              url: attachmentUrl,
            }
          : null,
        isVerified: isVerified,
        handle: isVerified ? "@you" : null,
      }

      addPost(postContent)
      setNewPost("")
      setAttachmentType(null)
      setAttachmentUrl("")
    }
  }

  const handleLike = (postId: string) => {
    likePost(postId)
  }

  const toggleTipInput = (postId: string) => {
    setShowTipInput((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))

    if (!tipAmount[postId]) {
      setTipAmount((prev) => ({
        ...prev,
        [postId]: "0.1",
      }))
    }
  }

  const handleTip = (postId: string, amount: string) => {
    const tipValue = Number.parseFloat(amount)

    if (isNaN(tipValue) || tipValue <= 0) {
      alert("Please enter a valid tip amount")
      return
    }

    if (tipValue > balance) {
      alert("Insufficient balance")
      return
    }

    // Update balance
    updateBalance(balance - tipValue)

    // Update post tips
    tipPost(postId, tipValue)

    // Hide tip input
    setShowTipInput((prev) => ({
      ...prev,
      [postId]: false,
    }))

    // Reset tip amount
    setTipAmount((prev) => ({
      ...prev,
      [postId]: "0.1",
    }))
  }

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))

    if (!newComment[postId]) {
      setNewComment((prev) => ({
        ...prev,
        [postId]: "",
      }))
    }
  }

  const handleAddComment = (postId: string) => {
    if (newComment[postId]?.trim()) {
      addComment(postId, {
        id: Date.now().toString(),
        author: publicKey,
        authorName: "You",
        content: newComment[postId],
        timestamp: new Date(),
        likes: 0,
        isVerified: isVerified,
        handle: isVerified ? "@you" : null,
      })

      setNewComment((prev) => ({
        ...prev,
        [postId]: "",
      }))
    }
  }

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog
    alert(`Sharing post ${postId}`)
  }

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""])
    }
  }

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions]
      newOptions.splice(index, 1)
      setPollOptions(newOptions)
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
  }

  const handleCreatePoll = () => {
    // Validate poll data
    if (!pollQuestion.trim()) {
      alert("Please enter a poll question")
      return
    }

    const validOptions = pollOptions.filter((opt) => opt.trim() !== "")
    if (validOptions.length < 2) {
      alert("Please enter at least two options")
      return
    }

    const amount = Number.parseFloat(pollAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (amount > balance) {
      alert("Insufficient balance")
      return
    }

    // Create poll
    const durationDays = Number.parseInt(pollDuration)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + durationDays)

    const newPoll = {
      id: Date.now().toString(),
      author: publicKey,
      authorName: "You",
      handle: isVerified ? "@you" : null,
      isVerified: isVerified,
      question: pollQuestion,
      description: pollDescription,
      options: validOptions.map((text) => ({
        text,
        votes: 0,
        voters: [],
      })),
      totalVotes: 0,
      poolAmount: amount,
      timestamp: new Date(),
      endDate: endDate,
      status: "active",
    }

    // Update balance
    updateBalance(balance - amount)

    // Add poll to store
    createPoll(newPoll)

    // Reset form
    setPollQuestion("")
    setPollOptions(["", ""])
    setPollDuration("3")
    setPollAmount("10")
    setPollDescription("")
    setShowPollCreator(false)
    setPollDialogOpen(false)
  }

  const handleVote = (pollId: string, optionIndex: number) => {
    if (!isVerified) {
      alert("Only verified users can vote in polls")
      return
    }

    const poll = polls.find((p) => p.id === pollId)
    if (!poll) return

    // Check if user already voted
    const alreadyVoted = poll.options.some((opt) => opt.voters.includes(publicKey))
    if (alreadyVoted) {
      alert("You have already voted in this poll")
      return
    }

    // Vote
    votePoll(pollId, optionIndex, publicKey)

    // Clear selection
    setSelectedVotes((prev) => ({
      ...prev,
      [pollId]: "",
    }))
  }

  const isPollActive = (poll: any) => {
    return new Date() < new Date(poll.endDate) && poll.status === "active"
  }

  const getPollTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffMs = end.getTime() - now.getTime()

    if (diffMs <= 0) return "Ended"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${diffHours}h ${diffMinutes}m remaining`
    }
  }

  const getRandomColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"]
    return colors[index % colors.length]
  }

  const filteredContent =
    activeTab === "all"
      ? [...posts, ...polls].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      : activeTab === "media"
        ? posts.filter((post) => post.attachment)
        : activeTab === "polls"
          ? polls
          : posts.filter((post) => post.tips > 0)

  const cancelAttachment = () => {
    setAttachmentType(null)
    setAttachmentUrl("")
  }

  const setAttachment = (type: string) => {
    setAttachmentType(type)

    // Mock URLs for demo purposes
    if (type === "image") {
      setAttachmentUrl("/placeholder.svg?height=400&width=600")
    } else if (type === "video") {
      setAttachmentUrl("https://example.com/video.mp4")
    }
  }

  // Render verification badge
  const VerificationBadge = ({ tooltipText = "Verified Human" }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex ml-1">
            <CheckCircle className="h-4 w-4 text-green-400 fill-green-900" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <main className="flex flex-col items-center p-4 max-w-md mx-auto w-full flex-1">
      <h1 className="text-2xl font-bold mb-4 self-start">Social Feed</h1>

      {!isVerified && (
        <Card className="w-full mb-4 p-3 bg-yellow-900/20 border border-yellow-800/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="text-yellow-300">Verification recommended</span> to tip posts, vote in polls, and get a
            personalized handle.
            <Link href="/verify" className="text-green-400 ml-1 hover:underline">
              Verify now
            </Link>
          </div>
        </Card>
      )}

      <Card className="w-full mb-6 p-4 bg-gray-900/80">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Posting as:{" "}
                {isVerified ? (
                  <span className="text-green-400 font-semibold">
                    @you <VerificationBadge />
                  </span>
                ) : (
                  <span className="text-gray-400">Anonymous (0x...{publicKey.slice(-4)})</span>
                )}
              </span>

              {isVerified && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-700 hover:bg-gray-800 hover:text-white"
                    onClick={() => setShowPollCreator(!showPollCreator)}
                  >
                    {showPollCreator ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <Vote className="w-4 h-4 mr-1" />
                        <span>Create Poll</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {showPollCreator ? (
              <Dialog open={pollDialogOpen} onOpenChange={setPollDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="w-full h-24 border-2 border-dashed border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 flex flex-col items-center justify-center gap-2"
                  >
                    <Vote className="w-6 h-6 text-blue-400" />
                    <span>Create a new democratic poll</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a Democratic Poll</DialogTitle>
                    <DialogDescription>
                      Create a poll for verified humans to vote on. A pool of UBI will be allocated based on the
                      results.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="question">Poll Question</Label>
                      <Input
                        id="question"
                        placeholder="What would you like to ask the community?"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="bg-gray-800/50 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide more context about this poll..."
                        value={pollDescription}
                        onChange={(e) => setPollDescription(e.target.value)}
                        className="bg-gray-800/50 border-gray-700 min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Poll Options</Label>
                        {pollOptions.length < 5 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addPollOption}
                            className="h-7 px-2 border-gray-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Option
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {pollOptions.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => updatePollOption(index, e.target.value)}
                              className="bg-gray-800/50 border-gray-700"
                            />
                            {pollOptions.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePollOption(index)}
                                className="px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          max="30"
                          value={pollDuration}
                          onChange={(e) => setPollDuration(e.target.value)}
                          className="bg-gray-800/50 border-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Pool Amount (UBI)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          step="0.1"
                          value={pollAmount}
                          onChange={(e) => setPollAmount(e.target.value)}
                          className="bg-gray-800/50 border-gray-700"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-300 mb-1">How Democratic Polls Work</p>
                          <p className="text-gray-300">
                            You'll contribute {pollAmount} UBI to the poll's pool. Verified humans can vote, and the
                            winning option will determine how the pool is allocated. This creates a transparent,
                            democratic decision-making process.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPollDialogOpen(false)}
                      className="border-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreatePoll}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Create Poll
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                <Textarea
                  className="bg-gray-800/50 border-gray-700 min-h-[100px]"
                  placeholder="What's happening?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />

                {attachmentType && (
                  <div className="relative bg-gray-800/50 border border-gray-700 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium capitalize">{attachmentType} Attachment</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={cancelAttachment}
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    {attachmentType === "image" && (
                      <div className="relative h-40 w-full bg-gray-700/50 rounded-md overflow-hidden">
                        <Image
                          src={attachmentUrl || "/placeholder.svg"}
                          alt="Post attachment"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {attachmentType === "video" && (
                      <div className="relative h-40 w-full bg-gray-700/50 rounded-md flex items-center justify-center">
                        <Video size={40} className="text-gray-400" />
                        <span className="text-sm text-gray-400 mt-2">Video Preview</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      onClick={() => setAttachment("image")}
                    >
                      <ImageIcon size={18} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      onClick={() => setAttachment("video")}
                    >
                      <Video size={18} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                    >
                      <LinkIcon size={18} />
                    </Button>
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Post
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </Card>

      <Tabs defaultValue="all" className="w-full mb-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="polls" className="flex items-center gap-1">
            <Vote className="w-3 h-3" />
            <span>Polls</span>
          </TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="tipped">Tipped</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full space-y-4">
        {filteredContent.length === 0 ? (
          <Card className="p-8 bg-gray-900/80 text-center">
            <p className="text-gray-400">No content to display</p>
          </Card>
        ) : (
          filteredContent.map((item) => {
            // Check if item is a poll
            if ("options" in item) {
              const poll = item
              const isActive = isPollActive(poll)
              const userVoted = poll.options.some((opt) => opt.voters.includes(publicKey))

              return (
                <Card key={poll.id} className="p-4 bg-gray-900/80">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className={cn(
                          "bg-gradient-to-r",
                          poll.isVerified ? "from-green-500 to-emerald-500" : "from-purple-500 to-pink-500",
                        )}
                      >
                        {poll.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={cn("font-bold", poll.isVerified && "text-green-400")}>
                          {poll.handle || poll.authorName}
                        </span>
                        {poll.isVerified && <VerificationBadge />}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDistanceToNow(poll.timestamp, { addSuffix: true })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 rounded-full text-xs text-blue-300">
                      <Vote className="w-3 h-3" />
                      <span>Poll</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-lg font-bold mb-1">{poll.question}</h3>
                    {poll.description && <p className="text-gray-300 mb-3">{poll.description}</p>}

                    <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <PieChart className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">
                            {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {isActive ? (
                            <span className="text-green-400">{getPollTimeRemaining(poll.endDate)}</span>
                          ) : (
                            <span className="text-red-400">Poll ended</span>
                          )}
                        </div>
                      </div>

                      {/* Poll options */}
                      <div className="space-y-3">
                        {poll.options.map((option, index) => {
                          const percentage =
                            poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0

                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  {userVoted || !isActive ? (
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded-full",
                                        option.voters.includes(publicKey) ? "bg-blue-500" : "bg-gray-700",
                                      )}
                                    />
                                  ) : (
                                    <RadioGroup
                                      value={selectedVotes[poll.id]}
                                      onValueChange={(value) => {
                                        setSelectedVotes((prev) => ({
                                          ...prev,
                                          [poll.id]: value,
                                        }))
                                      }}
                                      className="flex"
                                    >
                                      <RadioGroupItem
                                        value={index.toString()}
                                        id={`option-${poll.id}-${index}`}
                                        className="mr-2"
                                      />
                                    </RadioGroup>
                                  )}
                                  <label htmlFor={`option-${poll.id}-${index}`} className="text-sm">
                                    {option.text}
                                  </label>
                                </div>
                                <span className="text-sm font-medium">{percentage}%</span>
                              </div>

                              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full", getRandomColor(index))}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 flex items-start gap-2">
                      <Coins className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-300 font-medium mb-1">Pool: {poll.poolAmount} UBI</p>
                        <p className="text-xs text-gray-300">
                          This poll has a pool of {poll.poolAmount} UBI that will be allocated based on voting results.
                          {isActive
                            ? " The winning option will determine how these funds are used."
                            : " The funds have been allocated according to the voting results."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isActive && !userVoted && isVerified && (
                    <Button
                      onClick={() => handleVote(poll.id, Number.parseInt(selectedVotes[poll.id] || "0"))}
                      disabled={!selectedVotes[poll.id]}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2"
                    >
                      Cast Vote
                    </Button>
                  )}

                  {!isVerified && (
                    <div className="mt-2 bg-yellow-900/20 border border-yellow-800/30 rounded-md p-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm text-yellow-300">
                        <Link href="/verify" className="underline">
                          Verify your identity
                        </Link>{" "}
                        to participate in democratic polls
                      </p>
                    </div>
                  )}

                  {userVoted && (
                    <div className="mt-2 bg-green-900/20 border border-green-800/30 rounded-md p-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-300">You've cast your vote in this poll</p>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400 border-t border-gray-800 pt-3 mt-3">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Users size={18} />
                        <span>{poll.totalVotes}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Coins size={18} className="text-blue-400" />
                        <span className="text-blue-400">{poll.poolAmount} UBI</span>
                      </div>
                    </div>

                    <button
                      className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                      onClick={() => handleShare(poll.id)}
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </Card>
              )
            } else {
              // Regular post
              const post = item
              return (
                <Card key={post.id} className="p-4 bg-gray-900/80">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className={cn(
                          "bg-gradient-to-r",
                          post.isVerified ? "from-green-500 to-emerald-500" : "from-purple-500 to-pink-500",
                        )}
                      >
                        {post.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={cn("font-bold", post.isVerified && "text-green-400")}>
                          {post.handle || post.authorName}
                        </span>
                        {post.isVerified && <VerificationBadge />}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal size={18} />
                    </Button>
                  </div>

                  {post.content && <p className="mb-3">{post.content}</p>}

                  {post.attachment && (
                    <div className="mb-3">
                      {post.attachment.type === "image" ? (
                        <div className="relative h-64 w-full rounded-md overflow-hidden">
                          <Image
                            src={post.attachment.url || "/placeholder.svg"}
                            alt="Post attachment"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : post.attachment.type === "video" ? (
                        <div className="relative h-64 w-full bg-gray-800 rounded-md flex flex-col items-center justify-center">
                          <Video size={48} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">Video Content</span>
                          <Button variant="outline" size="sm" className="mt-3 border-gray-700">
                            Play Video
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {post.tips > 0 && (
                    <div className="mb-3 bg-green-900/20 border border-green-800/30 rounded-md p-2 flex items-center justify-between">
                      <span className="text-sm text-green-400">Tipped {post.tips} UBI</span>
                      {post.tips >= 1 && (
                        <span className="text-xs bg-green-800/50 text-green-300 px-2 py-0.5 rounded-full">
                          Top Content
                        </span>
                      )}
                    </div>
                  )}

                  {showTipInput[post.id] && (
                    <div className="mb-3 flex gap-2">
                      <Input
                        type="number"
                        min="0.000001"
                        step="0.1"
                        placeholder="Amount in UBI"
                        value={tipAmount[post.id]}
                        onChange={(e) =>
                          setTipAmount((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="bg-gray-800/50 border-gray-700"
                      />
                      <Button
                        onClick={() => handleTip(post.id, tipAmount[post.id])}
                        className="bg-gradient-to-r from-green-600 to-emerald-600"
                        disabled={!isVerified}
                      >
                        <Send size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400 border-t border-gray-800 pt-3">
                    <div className="flex gap-4">
                      <button
                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart size={18} className={post.likes > 0 ? "fill-purple-400 text-purple-400" : ""} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        className={cn(
                          "flex items-center gap-1 hover:text-blue-400 transition-colors",
                          showComments[post.id] && "text-blue-400",
                        )}
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle size={18} />
                        <span>{post.comments.length}</span>
                      </button>

                      <button
                        className="flex items-center gap-1 hover:text-green-400 transition-colors"
                        onClick={() => toggleTipInput(post.id)}
                      >
                        <Send size={18} className={post.tips > 0 ? "fill-green-400 text-green-400" : ""} />
                        <span>{post.tips > 0 ? `${post.tips} UBI` : "Tip"}</span>
                      </button>
                    </div>

                    <button
                      className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                      onClick={() => handleShare(post.id)}
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  {showComments[post.id] && (
                    <div className="mt-3 border-t border-gray-800 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Comments</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleComments(post.id)}
                        >
                          <ChevronUp size={16} />
                        </Button>
                      </div>

                      <div className="space-y-3 mb-3">
                        {post.comments.length === 0 ? (
                          <p className="text-sm text-gray-500">No comments yet</p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar className="w-7 h-7">
                                <AvatarFallback
                                  className={cn(
                                    "text-xs bg-gradient-to-r",
                                    comment.isVerified
                                      ? "from-green-500 to-emerald-500"
                                      : "from-blue-500 to-purple-500",
                                  )}
                                >
                                  {comment.authorName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 bg-gray-800/50 rounded-md p-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span
                                    className={cn(
                                      "text-sm font-medium flex items-center",
                                      comment.isVerified && "text-green-400",
                                    )}
                                  >
                                    {comment.handle || comment.authorName}
                                    {comment.isVerified && (
                                      <CheckCircle className="h-3 w-3 text-green-400 fill-green-900 ml-1" />
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>

                                <div className="flex gap-3 mt-1">
                                  <button
                                    className="text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1"
                                    onClick={() => {
                                      /* Like comment */
                                    }}
                                  >
                                    <Heart size={12} />
                                    <span>{comment.likes}</span>
                                  </button>
                                  <button className="text-xs text-gray-400 hover:text-blue-400">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ""}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          className="bg-gray-800/50 border-gray-700"
                        />
                        <Button onClick={() => handleAddComment(post.id)} className="bg-blue-600">
                          <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )
            }
          })
        )}
      </div>
    </main>
  )
}

