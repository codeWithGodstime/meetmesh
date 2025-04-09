import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import ProfileSettingsStep from "./profile-settings-step"
import UserPreferencesStep from "./user-preferences-step"
import { cn } from "@/lib/utils"
import { postAPIMethod } from "@/services/auth"

// Define the form schema
const formSchema = z.object({
  // Profile Settings
  occupation: z.string().min(2, "Occupation is required"),
  // city: z.string().min(2, "City is required"),
  // country: z.string().min(2, "Country is required"),
  location: z.tuple([z.string(), z.string().optional()]),
  bio: z.string().optional(),
  profileImage: z.any().optional(),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  gender: z.string().min(1, "Gender is required"),
  socialMediaLinks: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        url: z.string().url("Must be a valid URL"),
      }),
    )
    .optional(),

  // User Preferences
  showLocation: z.boolean().default(false),
  notifyNearby: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      occupation: "",
      bio: "",
      profileImage: undefined,
      interests: [],
      gender: "",
      socialMediaLinks: [{ name: "", url: "" }],
      showLocation: false,
      notifyNearby: false,
    },
  })

  const steps = [
    { name: "Profile Settings", description: "Set up your personal information" },
    { name: "User Preferences", description: "Configure your account preferences" },
  ]

  const onSubmit = async (data: FormValues) => {
    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }
  
    setIsSubmitting(true)
  
    const formData = new FormData()
  
    formData.append("bio", data.bio)
    formData.append("gender", data.gender)
    data.interests.forEach((interest, index) => {
      formData.append(`interests[${index}]`, interest)
    })
  
    // Assuming location is [country, city]
    formData.append("location[0]", data.location[0])
    formData.append("location[1]", data.location[1])
  
    formData.append("notifyNearby", String(data.notifyNearby))
    formData.append("occupation", data.occupation)
    formData.append("showLocation", String(data.showLocation))
  
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage)
    }
  
    // Social media links (array of objects)
    data.socialMediaLinks.forEach((link, index) => {
      formData.append(`socialMediaLinks[${index}][name]`, link.name)
      formData.append(`socialMediaLinks[${index}][profile_url]`, link.profile_url)
    })
  
    try {
      await postAPIMethod("complete_onboarding", formData)
  
      navigate("/profile")
    } catch (error) {
      console.error("Submission error:", error)
      alert("Something went wrong during submission.")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  step >= i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground text-muted-foreground",
                )}
              >
                {step > i ? <Check className="w-5 h-5" /> : <span>{i + 1}</span>}
              </div>

              {i < steps.length - 1 && <div className={cn("w-20 h-1 mx-2", step > i ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">{steps[step].name}</h2>
          <p className="text-muted-foreground">{steps[step].description}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardContent className="pt-6">
              {step === 0 && <ProfileSettingsStep form={form} />}
              {step === 1 && <UserPreferencesStep form={form} />}
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                Previous
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step < steps.length - 1 ? "Next" : "Complete Setup"}
                {!isSubmitting && step < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

