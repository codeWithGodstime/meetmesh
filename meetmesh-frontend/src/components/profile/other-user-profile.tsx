import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Coffee,
  Flag,
  Globe,
  MapPin,
  MessageCircle,
  Music,
  PenTool,
  Plane,
  Shield,
  Star,
  ThumbsUp,
  Users,
  Zap,
  Check,
} from "lucide-react"


export default function OtherUserProfile({data}) {

  console.log("DATA", data)
  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-16 md:mb-24 bg-muted">
          <img src={data.bannerimage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />

          {/* Profile Image - Positioned to overlap the cover and content */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={data.profileimage} alt={data.fullname} />
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
              {data.isverified ? 
                <Badge variant="secondary" className="gap-1 md:ml-auto">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge> : <Badge variant="destructive" className="gap-1 md:ml-auto">
                  <Shield className="h-3 w-3" />
                  Unverified
                </Badge>
              }
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
          <Button variant="outline" className="gap-2 flex-1">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      {/* Real-World Stats */}
      {/* <Card className="mb-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x">
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{data.realWorldEngagement.totalMeetups}</div>
              <div className="text-xs text-muted-foreground">Meetups</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{data.realWorldEngagement.uniquePeopleMet}</div>
              <div className="text-xs text-muted-foreground">People Met</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-sm font-medium">Last Active</div>
              <div className="text-xs text-muted-foreground">{data.realWorldEngagement.lastMeetupDate}</div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Tabs defaultValue="about" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="badges">Recognition</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
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
{/* 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((language) => (
                    <Badge key={language} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      <Globe className="h-3 w-3 mr-1" />
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ideal Hangouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.idealHangouts.map((hangout) => (
                    <Badge key={hangout} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      <Coffee className="h-3 w-3 mr-1" />
                      {hangout}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Trust & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    Phone Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    Email Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <Users className="h-3 w-3 mr-1" />
                    {data.mutualConnections} Mutual Connections
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card> */}
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

          {/* <Card>
            <CardHeader>
              <CardTitle>Looking to Connect With</CardTitle>
              <CardDescription>People Jamie wants to meet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.lookingToConnect.map((type) => (
                  <Badge key={type} variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    <Users className="h-3 w-3 mr-1" />
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Meetup Zones</CardTitle>
              <CardDescription>Areas where Jamie typically meets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.meetupZones.map((zone) => (
                  <Badge key={zone} variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {zone}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          {/* <Card>
            <CardHeader>
              <CardTitle>Recognition & Badges</CardTitle>
              <CardDescription>Achievements in real-world connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.badges.map((badge) => (
                  <div key={badge.name} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <badge.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
          <h2>Coming soon....</h2>

        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          {/* <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Availability This Week</CardTitle>
                <Badge variant={data.availableThisWeek ? "success" : "secondary"}>
                  {data.availableThisWeek ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <CardDescription>
                {data.availableThisWeek
                  ? "Jamie is open to meetups this week"
                  : "Jamie is not available for meetups this week"}
              </CardDescription>
            </CardHeader>
            <CardContent className={data.availableThisWeek ? "" : "opacity-50 pointer-events-none"}>
              <div className="space-y-4">
                {data.availabilityBlocks.map((block) => (
                  <div key={block.day} className="flex items-center justify-between">
                    <div className="font-medium">{block.day}</div>
                    <div className="flex gap-2">
                      {block.times.map((time) => (
                        <Badge key={time} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground mt-4">
                  Request a meetup to suggest specific times that work for both of you.
                </div>
              </div>
            </CardContent>
          </Card> */}

          <h2>Coming soon....</h2>
        </TabsContent>
      </Tabs>

      {/* User Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <Flag className="h-4 w-4" />
          Report User
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          Recommend
        </Button>
      </div>
    </div>
  )
}
