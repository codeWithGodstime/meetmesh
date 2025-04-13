import { useState } from "react"
import MapComponent from "@/components/map-component"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
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


function UserProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  const navigate = useNavigate()
  if (!user) return null

  const getConversation = async (receiver_id: string) => {

    const accessToken = localStorage.getItem("accessToken")

    const response = await fetch(`${API_ENDPOINT}/conversations/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ "receiver": receiver_id })
    })

    if (!response.ok) {
      throw new Error("Something happenend")
    }

    const data = await response.json()

    console.log(data, "for conversation")
    navigate(`/messages/${data.uid}`)

    return { data }
  }

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          ✕
        </button>

        <div className="text-center">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <h2 className="text-xl font-bold mb-1">{user.fullname}</h2>
          <p className="text-gray-500 text-sm mb-2 capitalize">{user.status}</p>

          {/* Interest */}
          {user.interest && (
            <p className="text-sm text-blue-600 font-medium mb-1">
              Interest: {user.interest}
            </p>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-gray-600 italic mb-4">
              "{user.bio}"
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              className="bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
              onClick={() => getConversation(user.id)}
            >
              Message
            </button>

            <button
              className="border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserMapFeed() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feeds"],
    queryFn: fetchUserFeed,
  })

  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  if (isLoading) return <p className="text-center">Loading feed...</p>
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>

  const users = data?.data?.data ?? []
  const currentUser = data?.currentUser

  return (
    <main className="h-screen w-full">
      <MapComponent
        users={users}
        onUserClick={handleUserClick}
        currentUser={currentUser}
      />
      {selectedUser && <UserProfileModal user={selectedUser} onClose={handleCloseModal} />}
    </main>
  )
}
