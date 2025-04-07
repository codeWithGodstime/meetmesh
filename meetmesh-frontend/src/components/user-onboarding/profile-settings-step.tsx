"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { X, Plus, Upload, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LocationSelector from "@/components/ui/location-input"

export default function ProfileSettingsStep({ form }: { form: UseFormReturn<any> }) {
  const [interestInput, setInterestInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [countryName, setCountryName] = useState < string > ('')
  const [stateName, setStateName] = useState < string > ('')

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

  const handleAddSocialMedia = () => {
    const currentLinks = form.getValues("socialMediaLinks") || []
    form.setValue("socialMediaLinks", [...currentLinks, { name: "", url: "" }])
  }

  const handleRemoveSocialMedia = (index: number) => {
    const currentLinks = form.getValues("socialMediaLinks") || []
    form.setValue(
      "socialMediaLinks",
      currentLinks.filter((_: any, i: number) => i !== index),
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("profileImage", file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    form.setValue("profileImage", undefined)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Occupation */}
      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input placeholder="Enter your occupation" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Country</FormLabel>
            <FormControl>
              <LocationSelector
                onCountryChange={(country) => {
                  setCountryName(country?.name || '')
                  form.setValue(field.name, [country?.name || '', stateName || ''])
                }}
                onStateChange={(state) => {
                  setStateName(state?.name || '')
                  form.setValue(field.name, [form.getValues(field.name)[0] || '', state?.name || ''])
                }}
              />
            </FormControl>
            <FormDescription>If your country has states, it will be appear after selecting country</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bio */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about yourself" className="resize-none min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Profile Image */}
      <FormField
        control={form.control}
        name="profileImage"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Profile Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview} alt="Profile preview" />
                      <AvatarFallback>{form.getValues("username")?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      // ref={fileInputRef}
                      onChange={handleImageChange}
                      {...fieldProps}
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>

                    {imagePreview && (
                      <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Interests */}
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

      {/* Gender */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="male" />
                  </FormControl>
                  <FormLabel className="font-normal">Male</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="female" />
                  </FormControl>
                  <FormLabel className="font-normal">Female</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="other" />
                  </FormControl>
                  <FormLabel className="font-normal">Other</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="prefer-not-to-say" />
                  </FormControl>
                  <FormLabel className="font-normal">Prefer not to say</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Social Media Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Social Media Links</div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddSocialMedia}>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>

        {form.getValues("socialMediaLinks")?.map((_, index: number) => (
          <div key={index} className="flex items-end gap-2">
            <FormField
              control={form.control}
              name={`socialMediaLinks.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Platform</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Twitter, Instagram" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`socialMediaLinks.${index}.url`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSocialMedia(index)}
              className="mb-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

