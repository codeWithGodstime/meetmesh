import OnboardingForm from "@/components/user-onboarding/on-boarding"


export default function OnboardingPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Complete, Your Profile</h1>
      <OnboardingForm />
    </main>
  )
}