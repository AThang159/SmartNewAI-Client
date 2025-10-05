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
    const maxRetry = 3
    for (let i = 0; i < maxRetry; i++) {
      try {
        const currentUser = await fetchCurrentUser() // fetch với credentials: "include"
        setUser(currentUser)
        break
      } catch (err: any) {
        if (i < maxRetry - 1) {
          // chờ 0.5s trước khi retry
          await new Promise((r) => setTimeout(r, 500))
        } else {
          setUser(null)
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!user, user, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
