import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bell, Globe, MapPin, Search, Shield, User, Users } from "lucide-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { API_ENDPOINT, putAPIMethod } from "@/services/auth"
import { toast } from "sonner"
import { useEffect } from "react"


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
  notify_radius_km: z.number().min(1).max(1000),

  who_can_discover_me: z.enum(["EVERYONE", "VERIFIED_USER", "ONLY_ME"]),

  show_profile_of_people_meet: z.boolean().default(true),

  notify_on_proximity: z.boolean().default(true),
  notify_on_meetup_invites: z.boolean().default(true),
  notify_on_profile_view: z.boolean().default(true),

  auto_accept_meetup_request: z.boolean().default(false),
  require_profile_completion: z.boolean().default(true),

  only_verified_user_can_message: z.boolean().default(false),

  dark_theme: z.boolean().default(false),
})

type SettingsFormValues = z.infer<typeof formSchema>

export default function UserSettingsPage() {

  const user = JSON.parse(localStorage.getItem("user") || {})

  const mutation = useMutation({
    mutationFn: (data) => putAPIMethod(`users/${user['id']}/update_user_preferences`, data),
    onSuccess: () => {
      toast.success("Your preferernce have been updated successfully")
    },
    onError: () => {
      toast.error("Something Happenned try again!")
    }
  })

  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notify_radius_km: 10,
      who_can_discover_me: "EVERYONE",
      notify_on_proximity: true,
      notify_on_meetup_invites: true,
      notify_on_profile_view: false,
      auto_accept_meetup_request: false,
      require_profile_completion: true,
      only_verified_user_can_message: false,
      dark_theme: false
    },
  })

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['user_preferences'],
    queryFn: () => getUserPreference(),
    retry: false
  })

  useEffect(() => {
    if (data) {
      form.reset(data) // This will only reset once the data is available
    }
    console.log(form)
  }, [data, form]) // Only run when data changes

  if (isLoading) {
    return <h2>Loading ....</h2>
  }

  if (isError) {
    console.log(error)
  }

  function onSubmit(data: SettingsFormValues) {
    console.log("Settings updated:", data)
    mutation.mutate(data)
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
                            value={[field.value ?? 1]}
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
          </Accordion>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              className={mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}
              type="submit"
              disabled={mutation.isPending} // Disable the button while loading
            >
              {mutation.isPending ? (
                <span>Saving...</span>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
