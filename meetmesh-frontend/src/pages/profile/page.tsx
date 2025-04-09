import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import MyProfile from "@/components/profile/my-profile"
import OtherUserProfile from "@/components/profile/other-user-profile"
import { Button } from "@/components/ui/button"
import { API_ENDPOINT } from "@/services/auth"

// mock fetchers
const fetchMyProfile = async () => {
  const accessToken = localStorage.getItem("accessToken")
  console.log("fetching my profile")
  const res = await fetch(`${API_ENDPOINT}/users/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  if (!res.ok) throw new Error("Failed to fetch my profile")
  return res.json()
}

const fetchPublicProfile = async (user_id: string) => {
  console.log("fetching my public profile")

  const accessToken = localStorage.getItem("accessToken")
  const res = await fetch(`${API_ENDPOINT}/users/${user_id}/public/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  if (!res.ok) throw new Error("Failed to fetch my profile")
  return res.json()
}

export default function ProfilePage() {
  const [viewingOwnProfile, setViewingOwnProfile] = useState(true)
  const user = JSON.parse(localStorage.getItem("user") || {})

  const toggleProfileView = () => setViewingOwnProfile((prev) => !prev)

  const {
    data: myProfileData,
    isLoading: loadingMyProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
    enabled: viewingOwnProfile,
  })

  const {
    data: publicProfileData,
    isLoading: loadingPublicProfile,
  } = useQuery({
    queryKey: ["publicProfile"],
    queryFn: ()=> fetchPublicProfile(user['id']),
    enabled: !viewingOwnProfile,
  })

  return (
    <div className="container mx-auto py-6 px-4 pb-28">
      <div className="mb-6 flex justify-end">
        <Button onClick={toggleProfileView} variant="outline">
          {viewingOwnProfile ? "View as other user" : "View as my profile"}
        </Button>
      </div>

      {viewingOwnProfile ? (
        loadingMyProfile ? <p>Loading...</p> : <MyProfile data={myProfileData} />
      ) : (
        loadingPublicProfile ? <p>Loading...</p> : <OtherUserProfile data={publicProfileData} />
      )}
    </div>
  )
}
