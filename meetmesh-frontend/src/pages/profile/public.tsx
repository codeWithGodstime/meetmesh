import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import OtherUserProfile from "@/components/profile/other-user-profile"
import { API_ENDPOINT } from "@/services/auth"

const fetchPublicProfile = async (user_id: string) => {
    const accessToken = localStorage.getItem("accessToken")
    const res = await fetch(`${API_ENDPOINT}/users/${user_id}/public/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    if (!res.ok) throw new Error("Failed to fetch public profile")
    return res.json()
}

export default function PublicProfilePage() {
    const { id } = useParams<{ id: string }>()

    const {
        data: publicProfileData,
        isLoading: loadingPublicProfile,
    } = useQuery({
        queryKey: ["publicProfile", id],
        queryFn: () => fetchPublicProfile(id!),
        enabled: !!id,
    })

    return (
        <div className="container mx-auto py-6 px-4 pb-28">
            {loadingPublicProfile ? (
                <p>Loading...</p>
            ) : (
                publicProfileData && <OtherUserProfile data={publicProfileData} />
            )}
        </div>
    )
}
