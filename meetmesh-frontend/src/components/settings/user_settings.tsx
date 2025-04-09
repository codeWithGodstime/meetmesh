import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bell, Globe, MapPin, Search, Shield, User, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "@/services/auth"
import { toast } from "sonner"


const getUserPreference = async () => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await fetch(`${API_ENDPOINT}/users/user_preferences/`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Something happenend ${data}`)
  }

  return data
}

// Define the form schema
const formSchema = z.object({
  // Location Preferences
  notify_radius_km: z.number().min(1).max(1000),

  // Discovery Preferences
  who_can_discover_me: z.enum(["EVERYONE", "VERIFIED_USER", "ONLY_ME"]),
  meetup_periods: z.array(z.string()).min(1, "Select at least one preferred time"),

  // Profile Visibility
  show_profile_of_people_meet: z.boolean().default(true),

  // Notification Settings
  notify_on_proximity: z.boolean().default(true),
  notify_on_meetup_invites: z.boolean().default(true),
  notify_on_profile_view: z.boolean().default(true),

  // Meetup Preferences
  auto_accept_meetup_request: z.boolean().default(false),
  require_profile_completion: z.boolean().default(true),

  // Privacy & Safety
  only_verified_user_can_message: z.boolean().default(false),

  // Language & Accessibility
  dark_theme: z.boolean().default(false),
})

type SettingsFormValues = z.infer<typeof formSchema>

export default function UserSettingsPage() {
  // get user_id
  const user = JSON.parse(localStorage.getItem("user")|| {})
    // Initialize form with default values
    const form = useForm<SettingsFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        notify_radius_km: 10,
        who_can_discover_me: "EVERYONE",
        meetup_periods: ["evening", "weekend"],
        notify_on_proximity: true,
        notify_on_meetup_invites: true,
        notify_on_profile_view: false,
        auto_accept_meetup_request: false,
        require_profile_completion: true,
        only_verified_user_can_message: false,
        dark_theme: false
      },
    })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user_preferences'],
    queryFn: ()=> getUserPreference()
  })

  if (isLoading) {
    return <h2>Loading ....</h2>
  }

  if (isError) {
    toast("Something happeend, Reload the page!")
    console.log(error)
  }

  console.log(data)
  form.reset(data)

  function onSubmit(data: SettingsFormValues) {
    console.log("Settings updated:", data)
    // In a real app, you would save these settings to your backend

  }

  return (
    <div className="max-w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="multiple" collapsible='true' className="w-full" defaultValue="location">
            {/* 1. Location Preferences */}
            <AccordionItem value="location">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Location Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">
                <FormField
                  control={form.control}
                  name="notify_radius_km"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Radius for Nearby Users/Meetups (km)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={1}
                            max={500}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 km</span>
                            <span>{field.value} km</span>
                            <span>500 km</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set your preferred distance for discovering nearby users and meetups
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Discovery Preferences */}
            <AccordionItem value="discovery">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <span>Discovery Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">
                <FormField
                  control={form.control}
                  name="who_can_discover_me"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Who Can Discover Me</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="EVERYONE" />
                            </FormControl>
                            <FormLabel className="font-normal">Everyone</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="VERIFIED_USER" />
                            </FormControl>
                            <FormLabel className="font-normal">Only Verified Users</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ONLY_ME" />
                            </FormControl>
                            <FormLabel className="font-normal">Only me</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetup_periods"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Preferred Time for Meetups</FormLabel>
                        <FormDescription>Select your preferred times for meetups</FormDescription>
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="meetup_periods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("morning")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "morning"])
                                      : field.onChange(field.value?.filter((value) => value !== "morning"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Morning</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="meetup_periods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("afternoon")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "afternoon"])
                                      : field.onChange(field.value?.filter((value) => value !== "afternoon"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Afternoon</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="meetup_periods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("evening")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "evening"])
                                      : field.onChange(field.value?.filter((value) => value !== "evening"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Evening</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="meetup_periods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("weekend")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "weekend"])
                                      : field.onChange(field.value?.filter((value) => value !== "weekend"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Weekends</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 3. Profile Visibility */}
            <AccordionItem value="visibility">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Profile Visibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">

                <FormField
                  control={form.control}
                  name="show_profile_of_people_meet"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Profile to People I've Met</FormLabel>
                        <FormDescription>
                          Automatically share your full profile with people after meeting them
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 4. Notification Settings */}
            <AccordionItem value="notifications">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>Notification Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Push Notifications</h3>

                  <FormField
                    control={form.control}
                    name="notify_on_proximity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel className="font-normal">New nearby users</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notify_on_meetup_invites"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel className="font-normal">Meetup invites</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notify_on_profile_view"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel className="font-normal">Profile views or interests</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
              </AccordionContent>
            </AccordionItem>

            {/* 5. Meetup Preferences */}
            <AccordionItem value="meetups">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Meetup Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">
                <FormField
                  control={form.control}
                  name="auto_accept_meetup_request"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Accept Meetup Requests</FormLabel>
                        <FormDescription>
                          Automatically accept meetup requests from users with mutual interests
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="require_profile_completion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Profile Completion for Invites</FormLabel>
                        <FormDescription>
                          Only receive meetup invites from users with completed profiles
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

              </AccordionContent>
            </AccordionItem>

            {/* 6. Privacy & Safety */}
            <AccordionItem value="privacy">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Privacy & Safety</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">

                <FormField
                  control={form.control}
                  name="only_verified_user_can_message"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Verification to Contact Me</FormLabel>
                        <FormDescription>Only allow verified profiles to send you messages</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 7. Language & Accessibility */}
            <AccordionItem value="language">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Language & Accessibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">

                <FormField
                  control={form.control}
                  name="dark_theme"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Dark Mode</FormLabel>
                        <FormDescription>Enable dark mode for the app interface</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 8. Account Preferences */}
            {/* <AccordionItem value="account">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Account Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="mt-2">Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Account Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Deactivate Account Temporarily
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Delete My Data & Account
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
