import UserSettingsPage from "@/components/settings/user_settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto w-full py-6 px-4 pb-28">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <UserSettingsPage />
    </div>
  )
}
