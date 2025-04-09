import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import MyProfile from "@/components/profile/my-profile"
import OtherUserProfile from "@/components/profile/other-user-profile"
import { Button } from "@/components/ui/button"

// mock fetchers
const fetchMyProfile = async () => {
  console.log("fetching my profile")
  const res = await fetch("/api/profile/me")
  if (!res.ok) throw new Error("Failed to fetch my profile")
  return res.json()
}

const fetchPublicProfile = async () => {
  console.log("fetching my public profile")

  const res = await fetch("/api/profile/public")
  if (!res.ok) throw new Error("Failed to fetch public profile")
  return res.json()
}

export default function ProfilePage() {
  const [viewingOwnProfile, setViewingOwnProfile] = useState(true)

  const toggleProfileView = () => setViewingOwnProfile((prev) => !prev)

  const {
    data: myProfileData,
    isLoading: loadingMyProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
    enabled: viewingOwnProfile, // only fetch when viewingOwnProfile is true
  })

  const {
    data: publicProfileData,
    isLoading: loadingPublicProfile,
  } = useQuery({
    queryKey: ["publicProfile"],
    queryFn: fetchPublicProfile,
    enabled: !viewingOwnProfile, // only fetch when viewing someone else's profile
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
