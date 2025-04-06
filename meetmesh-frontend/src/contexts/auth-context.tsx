"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { loginUser, signupUser, getCurrentUser } from "@/services/auth"

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const loginUser = () => null
const signupUser = () => null
const getCurrentUser = () => null

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await loginUser(email, password)
    localStorage.setItem("auth_token", token)
    setUser(user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const { user, token } = await signupUser(name, email, password)
    localStorage.setItem("auth_token", token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

