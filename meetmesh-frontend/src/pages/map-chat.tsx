import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, LogOut } from "lucide-react"
import MapComponent from "@/components/map-component"
import ChatPanel from "@/components/chat-panel"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function MapChat() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
    setIsChatOpen(true)
  }

  // if (error) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-red-500">Error loading users</h2>
  //         <p className="mt-2">Please try again later</p>
  //         <Button className="mt-4" onClick={() => window.location.reload()}>
  //           Retry
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-md bg-white p-2 shadow-md">
        <span className="text-sm font-medium">Welcome, {user?.name}</span>
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading map...</span>
        </div>
      ) : (
        <MapComponent users={users || []} onUserClick={handleUserClick} currentUser={user} />
      )}

      {isChatOpen && selectedUser && (
        <ChatPanel user={selectedUser} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  )
}

