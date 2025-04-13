import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { putAPIMethod } from "@/services/auth"

const profileSchema = z.object({
  first_name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Name is required'),
  status: z.string().min(1, 'Status is required'),
  city: z.string().min(1, 'Location is required'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters'),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfileEdit = ({ userData }) => {
  const [interestInput, setInterestInput] = useState("")

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data) => putAPIMethod(`users/${userData.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
    }
  })

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      status: userData.status,
      city: userData.city,
      bio: userData.bio,
      interests: userData.interests
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data)
  }

  const handleAddInterest = () => {
    if (interestInput.trim() === "") return

    const currentInterests = form.getValues("interests") || []
    if (!currentInterests.includes(interestInput.trim())) {
      form.setValue("interests", [...currentInterests, interestInput.trim()])
      form.trigger("interests")
    }
    setInterestInput("")
  }

  const handleRemoveInterest = (interest: string) => {
    const currentInterests = form.getValues("interests") || []
    form.setValue(
      "interests",
      currentInterests.filter((i: string) => i !== interest),
    )
    form.trigger("interests")
  }

  return (
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-80 overflow-y-scroll">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OPEN TO MEET">Open to meetups</SelectItem>
                        <SelectItem value="BUSY">Busy</SelectItem>
                        <SelectItem value="EXPLORING">Away</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add an interest"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddInterest()
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddInterest}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {form.getValues("interests")?.map((interest: string, index: number) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {interest}
                              <button
                                type="button"
                                className="ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveInterest(interest)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {form.getValues("interests")?.length === 0 && (
                            <div className="text-sm text-muted-foreground">No interests added yet</div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose>
                  <Button
                    className={mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}
                    type="submit"
                    disabled={mutation.isPending} // Disable the button while loading
                  >
                    {mutation.isPending ? (
                      <span>Saving Changes...</span>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                </DialogClose>

              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfileEdit