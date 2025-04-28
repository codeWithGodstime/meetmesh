import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { API_ENDPOINT } from "@/services/auth"
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Github,
  Youtube,
  Twitch,
  ExternalLink,
} from "lucide-react"

const fetchUserFeed = async () => {
  const accessToken = localStorage.getItem("accessToken")

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
  const res = data.results.data
  return res
}

function SingleUserCard({ user }: { user: any; }) {

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
    navigate(`/messages/${data.id}`)

    return { data }
  }

  const getSocialIcon = (name) => {
    const platform = name.toLowerCase()

    if (platform.includes("twitter") || platform.includes("x")) return <Twitter className="h-5 w-5" />
    if (platform.includes("instagram")) return <Instagram className="h-5 w-5" />
    if (platform.includes("facebook")) return <Facebook className="h-5 w-5" />
    if (platform.includes("linkedin")) return <Linkedin className="h-5 w-5" />
    if (platform.includes("github")) return <Github className="h-5 w-5" />
    if (platform.includes("youtube")) return <Youtube className="h-5 w-5" />
    if (platform.includes("twitch")) return <Twitch className="h-5 w-5" />

    // Default icon for other platforms
    return <ExternalLink className="h-5 w-5" />
  }

  return (
    <div className="bg-transparent bg-opacity-40 flex w-full max-w-full">
      <div className="bg-white rounded-lg p-6 shadow-lg relative w-full">

        <div className="">
          <div className="flex gap-2 items-start">
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-20 h-20 aspect-square rounded-full mx-auto mb-4 object-cover"
            />
            <div className="grow">
              <div>
                <h2 className="text-xl font-bold mb-1">{user.fullname}</h2>
                <p className="text-gray-500 text-sm mb-2 capitalize">{user.status}</p>
              </div>

              <p>{user.occupation}</p>
            </div>

            {/* social links */}
            <div className="flex flex-wrap gap-4">
              {user.social_links.map((social, index) => (
                <a
                  key={index}
                  href={social.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
                  title={social.name}
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>

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
          <div className="flex gap-2 w-full">
            <button
              className="bg-primary text-white py-2 rounded hover:bg-primary/90 transition w-full"
              onClick={() => getConversation(user.id)}
            >
              Message
            </button>

            <button
              className="border border-gray-300 py-2 rounded hover:bg-gray-100 transition w-full"
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

function RecommdatationMeetUps() {
  return <div className="shadow-md rounded-md p-3">
    <h3>Meetup Recommendation</h3>
  </div>
}

function SimilarOccupations() {
  return <div className="shadow-md rounded-md p-3">
    <h3>Similar Occupations</h3>
  </div>
}

export default function UserFeed() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feeds"],
    queryFn: fetchUserFeed,
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    throw Error("Something Happened! \n Try reloading the page")
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
      <div className="space-y-5 px-4 pt-20">
        <h2 className="text-xl md:text-3xl font-semibold">Other User in your location..</h2>
        {
          data ? (
            data.map((singleUser) => <SingleUserCard user={singleUser} />)
          )
            : <p>...</p>
        }
      </div>

      {/* sidebar */}
      <div className="flex flex-col justify-start gap-3 pt-20 px-5">
        <RecommdatationMeetUps />
        <SimilarOccupations />
      </div>
    </main>
  )
}



