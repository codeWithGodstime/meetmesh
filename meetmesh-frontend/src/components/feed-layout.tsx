import React, { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { Home, MessageSquare, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

const FeedLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return

    // 1. Check if user is not logged in
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    // 2. Check if user hasn't completed onboarding
    // if (!user.has_completed_onboarding) {
    //   navigate("/profile-setup")
    //   return
    // }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return <h2>Loading ....</h2>
  }

  return (
    <>
      <div className="p-4  bg-white w-full shadow-lg">
        <nav className="h-full">
          <ul className="flex items-center justify-around h-full">
            <li>
              <NavItem to="/feed" icon={<Home />} label="Feeds" />
            </li>
            <li>
              <NavItem to="/messages" icon={<MessageSquare />} label="Messages" />
            </li>
            <li>
              <NavItem to="/settings" icon={<Settings />} label="Settings" />
            </li>
            <li>
              <NavItem to="/profile" icon={<User />} label="Profile" />
            </li>
          </ul>
        </nav>
      </div>

      <Outlet />

    </>
  )
}

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  // You can add logic here to determine if the route is active
  // For example: const isActive = useLocation().pathname === to;

  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
    >
      <div className="text-gray-700">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  )
}

export default FeedLayout

