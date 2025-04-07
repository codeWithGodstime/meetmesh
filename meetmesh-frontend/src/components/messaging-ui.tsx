"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MoreVertical, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"

// Sample data for messages
const messages = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Hey, are we still meeting tomorrow for coffee?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: true,
    conversation: [
      {
        id: 1,
        senderId: 101,
        text: "Hey there! How's your day going?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: 2,
        senderId: "me",
        text: "Pretty good! Just finishing up some work. How about you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      },
      {
        id: 3,
        senderId: 101,
        text: "I'm doing well! Just wondering if we're still on for coffee tomorrow?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 4,
        senderId: "me",
        text: "Yes, definitely! Let's meet at the usual place at 10am?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      },
      {
        id: 5,
        senderId: 101,
        text: "Hey, are we still meeting tomorrow for coffee?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
    ],
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "The project files have been updated. Check them out when you get a chance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: false,
    conversation: [
      {
        id: 1,
        senderId: 102,
        text: "Hi there, I've been working on the project files.",
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      },
      {
        id: 2,
        senderId: "me",
        text: "Great! How's it coming along?",
        timestamp: new Date(Date.now() - 1000 * 60 * 115), // 1 hour 55 minutes ago
      },
      {
        id: 3,
        senderId: 102,
        text: "Really well. I've made some significant improvements to the design.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: 4,
        senderId: 102,
        text: "The project files have been updated. Check them out when you get a chance.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ],
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Thanks for your help yesterday! The presentation went really well.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: false,
    conversation: [
      {
        id: 1,
        senderId: "me",
        text: "Hey Taylor, how did the presentation go?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: 2,
        senderId: 103,
        text: "It went really well! The client loved our ideas.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      },
      {
        id: 3,
        senderId: "me",
        text: "That's fantastic! Anything you need help with for the follow-up?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      },
      {
        id: 4,
        senderId: 103,
        text: "Thanks for your help yesterday! The presentation went really well.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ],
  },
]

export default function MessageUI() {
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null)
  const [newMessageText, setNewMessageText] = useState("")

  const handleSelectMessage = (message: (typeof messages)[0]) => {
    setSelectedMessage(message)
  }

  const handleBack = () => {
    setSelectedMessage(null)
  }

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !selectedMessage) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessageText)

    // Clear the input
    setNewMessageText("")
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-gray-50 rounded-lg overflow-hidden">
      {selectedMessage ? (
        <MessageDetail
          message={selectedMessage}
          onBack={handleBack}
          newMessageText={newMessageText}
          setNewMessageText={setNewMessageText}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <MessageList messages={messages} onSelectMessage={handleSelectMessage} />
      )}
    </div>
  )
}

interface MessageListProps {
  messages: typeof messages
  onSelectMessage: (message: (typeof messages)[0]) => void
}

function MessageList({ messages, onSelectMessage }: MessageListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`mb-2 cursor-pointer hover:bg-gray-100 transition-colors ${message.unread ? "border-l-4 border-l-primary" : ""}`}
            onClick={() => onSelectMessage(message)}
          >
            <div className="p-3 flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={message.user.avatar} alt={message.user.name} />
                <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{message.user.name}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-sm truncate ${message.unread ? "font-medium" : "text-muted-foreground"}`}>
                  {message.lastMessage}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface MessageDetailProps {
  message: (typeof messages)[0]
  onBack: () => void
  newMessageText: string
  setNewMessageText: (text: string) => void
  onSendMessage: () => void
}

export function MessageDetail({ message, onBack, newMessageText, setNewMessageText, onSendMessage }: MessageDetailProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-white flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={message.user.avatar} alt={message.user.name} />
          <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{message.user.name}</h3>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {message.conversation.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.senderId === "me"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <div
                className={`text-xs mt-1 ${
                  msg.senderId === "me" ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={onSendMessage} disabled={!newMessageText.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

