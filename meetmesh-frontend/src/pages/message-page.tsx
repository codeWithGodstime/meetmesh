import MessageUI from "@/components/messaging-ui"

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Messages</h1>
      <MessageUI />
    </div>
  )
}
