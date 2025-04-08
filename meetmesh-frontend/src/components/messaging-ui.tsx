import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MoreVertical, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { formatDistanceToNow } from "date-fns"


export default function MessageUI({ messages }) {

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-gray-50 rounded-lg overflow-hidden">
      <MessageList messages={messages} />
    </div>
  )
}

// interface MessageListProps {
//   messages: typeof messages
//   onSelectMessage: (message: (typeof messages)[0]) => void
// }

function MessageList({ messages }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((message) => (
          <Link to={`${message.uid}`}>
            <Card
              key={message.id}
              className={`mb-2 cursor-pointer hover:bg-gray-100 transition-colors ${message.number_of_unread_messages >= 1 ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="p-3 flex items-center">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={message.conversation_partner.avatar} alt={message.conversation_partner.fullname} />
                  <AvatarFallback>{message.conversation_partner.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{message.conversation_partner.fullname}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(message.last_message_time, { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${message.unread ? "font-medium" : "text-muted-foreground"}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

// interface MessageDetailProps {
//   message: (typeof messages)[0]
//   onBack: () => void
//   newMessageText: string
//   setNewMessageText: (text: string) => void
//   onSendMessage: () => void
// }

export function MessageDetail({data}) {

  const [newMessageText, setNewMessageText] = useState("")

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessageText)

    // Clear the input
    setNewMessageText("")
  }


  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-white flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={data.conversation_partner.avatar} alt={data.conversation_partner.fullname} />
          <AvatarFallback>{data.conversation_partner.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{data.conversation_partner.fullname}</h3>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {data.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.is_sender ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.is_sender
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-muted rounded-bl-none"
                }`}
            >
              <p>{msg.content}</p>
              <div
                className={`text-xs mt-1 ${msg.senderId === "me" ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
              >
                {formatTime(msg.created_at)}
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
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessageText.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to format time
// function formatTime(date: Date): string {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// }

function formatTime(date: Date | string): string {
  // Ensure the input is a Date object
  const parsedDate = new Date(date);
  return parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
