import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  Check,
  Clock,
  Coffee,
  Edit,
  Globe,
  LogOut,
  MapPin,
  MessageCircle,
  Music,
  PenTool,
  Plane,
  Settings,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react"
import ProfileEdit from "./profile-edit-form"



export default function MyProfile({data}) {
  const [isEditingBio, setIsEditingBio] = useState(false)

  console.log("DATA", data)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-16 md:mb-24 bg-muted">
          <img src={data.bannerimage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />

          {/* Edit Cover Photo Button */}
          <Button size="sm" variant="secondary" className="absolute top-4 right-4 gap-1">
            <Camera className="h-4 w-4" />
            Change Cover
          </Button>

          {/* Profile Image - Positioned to overlap the cover and content */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={data.profileimage} alt={data.fullname} />
                <AvatarFallback>{data.fullname.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:pl-40">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 mr-2">
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
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-4 md:mt-0">
            <ProfileEdit userData={data} />

            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Real-World Stats */}
      {/* <Card className="mb-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x">
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{userData.realWorldEngagement.totalMeetups}</div>
              <div className="text-xs text-muted-foreground">Meetups</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{userData.realWorldEngagement.uniquePeopleMet}</div>
              <div className="text-xs text-muted-foreground">People Met</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-sm font-medium">Last Active</div>
              <div className="text-xs text-muted-foreground">{userData.realWorldEngagement.lastMeetupDate}</div>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Bio</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(!isEditingBio)}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {isEditingBio ? (
                <div className="space-y-2">
                  <Textarea value={data.bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px]" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingBio(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setIsEditingBio(false)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{data.bio}</p>
              )}
            </CardContent>
          </Card>
{/* 
          <Card>
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
                    {userData.mutualConnections} Mutual Connections
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Shield className="h-4 w-4" />
                Manage Verifications
              </Button>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Interests</CardTitle>
                <CardDescription>Topics you enjoy discussing</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
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

        {/* Badges Tab */}
        <TabsContent value="badges">
          {/* <Card>
            <CardHeader>
              <CardTitle>Recognition & Badges</CardTitle>
              <CardDescription>Your achievements in real-world connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.badges.map((badge) => (
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

          <h2>Coming soon...</h2>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          {/* <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Availability This Week</CardTitle>
                <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
              </div>
              <CardDescription>
                {isAvailable ? "You are open to meetups this week" : "You are not available for meetups this week"}
              </CardDescription>
            </CardHeader>
            <CardContent className={isAvailable ? "" : "opacity-50 pointer-events-none"}>
              <div className="space-y-4">
                {userData.availabilityBlocks.map((block) => (
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
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Availability
                </Button>
              </div>
            </CardContent>
          </Card> */}
          <h2>Coming soon...</h2>

        </TabsContent>
      </Tabs>

      {/* Account Actions */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
