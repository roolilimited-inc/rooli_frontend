"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import type { User } from "@/core/types"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  mounted: boolean
  login: (user: User, token: string, redirectUrl?: string) => void
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const mountedRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)

  const isAuthenticated = mounted && !!user && !!token

  // Initialize from localStorage / cookies on mount
  useEffect(() => {
    if (typeof window === "undefined" || mountedRef.current) return

    mountedRef.current = true

    const storedToken = window.localStorage.getItem("token")
    const storedUser = window.localStorage.getItem("user")

    if (storedToken) {
      setTokenState(storedToken)
      if (!Cookies.get("token")) {
        Cookies.set("token", storedToken, { expires: 7 })
      }
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        setUserState(parsedUser)
        if (!Cookies.get("user")) {
          Cookies.set("user", storedUser, { expires: 7 })
        }
      } catch {
        // ignore parse errors
      }
    }

    // Defer mounted flag to next tick to avoid layout thrash
    setTimeout(() => setMounted(true), 0)
  }, [])

  const setUser = (userData: User | null) => {
    setUserState(userData)
    if (typeof window === "undefined") return

    if (userData) {
      const serialized = JSON.stringify(userData)
      window.localStorage.setItem("user", serialized)
      Cookies.set("user", serialized, { expires: 7 })
    } else {
      window.localStorage.removeItem("user")
      Cookies.remove("user")
    }
  }

  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (typeof window === "undefined") return

    if (newToken) {
      window.localStorage.setItem("token", newToken)
      Cookies.set("token", newToken, { expires: 7 })
    } else {
      window.localStorage.removeItem("token")
      Cookies.remove("token")
    }
  }

  const login = (userData: User, authToken: string, redirectUrl: string = "/dashboard") => {
    setUser(userData)
    setToken(authToken)
    router.push(redirectUrl)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      window.localStorage.clear()
    }
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, mounted, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

