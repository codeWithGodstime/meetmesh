"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Send, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { fetchMessages, sendMessage } from "@/services/api"

interface ChatPanelProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export default function ChatPanel({ user, isOpen, onClose }: ChatPanelProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", user.id],
    queryFn: () => fetchMessages(user.id),
    enabled: isOpen,
  })

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => sendMessage(user.id, text),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messages", user.id], (oldMessages: any) => [...oldMessages, newMessage])
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessageMutation.mutate(message)
    setMessage("")
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      className={`fixed right-0 top-0 z-10 h-full w-full transform transition-transform duration-300 md:w-1/3 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <Card className="flex h-full flex-col rounded-none md:rounded-l-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="font-semibold">{user.name}</h3>
              <div className="flex items-center">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-500"
                  }`}
                ></span>
                <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading messages...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-right text-xs ${
                          msg.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

