import MessageUI from "@/components/messaging-ui"
import { API_ENDPOINT } from "@/services/auth"
import { useQuery } from "@tanstack/react-query"


const getUserConversation = async () => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await fetch(`${API_ENDPOINT}/conversations/`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })
  if (!response.ok) {
    throw new Error("Failed to fetch user conversations")
  }

  const data = await response.json()
  console.log(data)
  return data.results
}

export default function MessagesPage() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: getUserConversation
  })

  if (isLoading) return <p className="text-center">Loading conversations...</p>
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Messages</h1>
      <MessageUI messages={data} />
    </div>
  )
}
