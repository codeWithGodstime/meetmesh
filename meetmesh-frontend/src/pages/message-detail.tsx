import { MessageDetail } from "@/components/messaging-ui"
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/services/auth";

const fetchConversation = async (conversationId: string) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await fetch(`${API_ENDPOINT}/conversations/${conversationId}/`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user conversations")
  }

  const data = await response.json()
  return data
};

export default function MessagesDetailPage() {

  let { id } = useParams();
  console.log("Conversation Id", id)

  const { data, error, isLoading } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => fetchConversation(id),
    // {
    //   enabled: !!id,
    // }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading conversation</div>;

  console.log(data, "message details")
  return (
    <div className="container mx-auto py-6 px-4">
      <MessageDetail data={data} />
    </div>
  )
}
