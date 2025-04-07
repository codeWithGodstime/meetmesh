import MapComponent from "@/components/map-component"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "@/services/auth"

const fetchUserFeed = async () => {
  const accessToken = localStorage.getItem("accessToken")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const response = await fetch(`${API_ENDPOINT}/users/feeds/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user feed")
  }

  const data = await response.json()
  return { data, currentUser }
}

export default function UserMapFeed() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feeds"],
    queryFn: fetchUserFeed,
  })

  const handleUserClick = (user: any) => {
    console.log("Clicked user:", user)
    // You can navigate to a profile page or open a modal here
  }

  if (isLoading) return <p className="text-center">Loading feed...</p>
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>

  const users = data?.data?.data ?? [] // adjust according to your API shape
  const currentUser = data?.currentUser

  return (
    <main className="h-screen w-full">
      <MapComponent
        users={users}
        onUserClick={handleUserClick}
        currentUser={currentUser}
      />
    </main>
  )
}
