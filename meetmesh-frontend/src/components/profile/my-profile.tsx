"use client"

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

// Sample user data - in a real app, this would come from your API/database
const userData = {
  id: "user123",
  name: "Jamie Chen",
  status: "Open to meetups",
  location: "Mission District, San Francisco",
  bio: "Passionate about connecting with new people over coffee or hikes. I love discussing art, technology, and sharing travel stories. Always looking to learn something new from the people I meet!",
  profileImage: "/placeholder.svg?height=128&width=128",
  coverImage: "/placeholder.svg?height=300&width=1200",
  languages: ["English", "Mandarin", "Spanish (Basic)"],
  idealHangouts: ["Coffee chats", "Museum visits", "Neighborhood walks", "Live music"],
  interests: ["Art & Design", "Technology", "Hiking", "Photography", "Travel", "Coffee", "Live Music"],
  lookingToConnect: ["Creatives", "Travelers", "Local experts", "Tech enthusiasts"],
  realWorldEngagement: {
    totalMeetups: 27,
    uniquePeopleMet: 42,
    lastMeetupDate: "2 days ago",
  },
  badges: [
    { name: "Verified In-Person", icon: Shield, description: "Identity verified through in-person events" },
    { name: "Super Connector", icon: Users, description: "Connected 20+ people in real life" },
    { name: "Great Conversationalist", icon: MessageCircle, description: "Highly rated for meaningful conversations" },
    { name: "Local Guide", icon: MapPin, description: "Knows the best local spots" },
  ],
  verifications: {
    phone: true,
    email: true,
    photo: true,
  },
  mutualConnections: 3,
  availableThisWeek: true,
  availabilityBlocks: [
    { day: "Monday", times: ["Evening"] },
    { day: "Wednesday", times: ["Afternoon", "Evening"] },
    { day: "Saturday", times: ["Morning", "Afternoon"] },
  ],
  meetupZones: ["Mission District", "SoMa", "Hayes Valley"],
}

export default function MyProfile() {
  const [isAvailable, setIsAvailable] = useState(userData.availableThisWeek)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState(userData.bio)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-16 md:mb-24 bg-muted">
          <img src={userData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />

          {/* Edit Cover Photo Button */}
          <Button size="sm" variant="secondary" className="absolute top-4 right-4 gap-1">
            <Camera className="h-4 w-4" />
            Change Cover
          </Button>

          {/* Profile Image - Positioned to overlap the cover and content */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={userData.profileImage} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:pl-40">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 md:ml-2">
                {userData.status}
              </Badge>
              {userData.verifications.photo && (
                <Badge variant="secondary" className="gap-1 md:ml-auto">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{userData.location}</span>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Make changes to your profile information.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={userData.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" defaultValue={userData.status} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={userData.location} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" defaultValue={userData.bio} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Real-World Stats */}
      <Card className="mb-6">
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
      </Card>

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
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px]" />
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
                <p className="text-muted-foreground">{bio}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Languages</CardTitle>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.languages.map((language) => (
                    <Badge key={language} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      <Globe className="h-3 w-3 mr-1" />
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Ideal Hangouts</CardTitle>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.idealHangouts.map((hangout) => (
                    <Badge key={hangout} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      <Coffee className="h-3 w-3 mr-1" />
                      {hangout}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
          </Card>
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
                {userData.interests.map((interest) => {
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Looking to Connect With</CardTitle>
                <CardDescription>People you want to meet</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.lookingToConnect.map((type) => (
                  <Badge key={type} variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    <Users className="h-3 w-3 mr-1" />
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meetup Zones</CardTitle>
                <CardDescription>Areas where you typically meet</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.meetupZones.map((zone) => (
                  <Badge key={zone} variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {zone}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <Card>
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
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
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
          </Card>
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
