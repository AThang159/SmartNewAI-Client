"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { fetchCurrentUser } from "@/lib/api/auth-api"

type AuthContextType = {
  isLoggedIn: boolean
  user: any | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  refreshUser: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      setLoading(true)
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  useEffect(() => {
    //console.log(user)
  }, [user])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!user && !loading, user, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
