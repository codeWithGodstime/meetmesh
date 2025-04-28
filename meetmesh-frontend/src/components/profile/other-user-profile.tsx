import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_ENDPOINT } from "@/services/auth"
import {
  Calendar,
  Coffee,
  Flag,
  MapPin,
  MessageCircle,
  Music,
  PenTool,
  Plane,
  Shield,
  Star,
  ThumbsUp,
  Zap,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Github,
  Youtube,
  Twitch,
  ExternalLink,
} from "lucide-react"
import { useNavigate } from "react-router"

export default function OtherUserProfile({ data }) {
  const navigate = useNavigate()

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


  // Function to get the appropriate icon for each social media platform
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

  console.log("DATA", data)
  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="relative w-full h-48 md:h-64 rounded-lg mb-16 md:mb-24 bg-muted">
          <img src={data.bannerimage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />

          {/* Profile Image - Positioned to overlap the cover and content */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={data.profileimage || "/placeholder.svg"} alt={data.fullname} />
              <AvatarFallback>{data.fullname.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:pl-40">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{data.fullname}</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 md:ml-2">
                {data.status}
              </Badge>
              {data.isverified ? (
                <Badge variant="secondary" className="gap-1 md:ml-auto">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 md:ml-auto">
                  <Shield className="h-3 w-3" />
                  Unverified
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{data.city}</span>
              {/* <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{data.distance}</span> */}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button className="gap-2 flex-1">
            <Calendar className="h-4 w-4" />
            Request Meetup
          </Button>
          <Button onClick={() => getConversation(data.id)} variant="outline" className="gap-2 flex-1">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      {/* Real-World Stats */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x">
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{0}</div>
              <div className="text-xs text-muted-foreground">Meetups</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{0}</div>
              <div className="text-xs text-muted-foreground">People Met</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-sm font-medium">Last Active</div>
              <div className="text-xs text-muted-foreground">{0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{data.bio}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Topics Jamie enjoys discussing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest) => {
                  let icon = <Star className="h-3 w-3 mr-1" />
                  if (interest.includes("Art")) icon = <PenTool className="h-3 w-3 mr-1" />
                  if (interest.includes("Tech")) icon = <Zap className="h-3 w-3 mr-1" />
                  if (interest.includes("Travel")) icon = <Plane className="h-3 w-3 mr-1" />
                  if (interest.includes("Music")) icon = <Music className="h-3 w-3 mr-1" />
                  if (interest.includes("Coffee")) icon = <Coffee className="h-3 w-3 mr-1" />

                  return (
                    <Badge key={interest} variant="secondary">
                      {icon}
                      {interest}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social Media Links */}
      {data.social_links && data.social_links.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect</CardTitle>
            <CardDescription>Find {data.fullname} on social media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {data.social_links.map((social, index) => (
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
          </CardContent>
        </Card>
      )}

    </div>
  )
}
