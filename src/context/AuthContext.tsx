"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loginUser, registerUser, getProfile, logoutUser as logoutUserApi, updateProfile } from "@/src/lib/api"
import type { LoginRequest, RegisterRequest, IUser } from "@/src/types"

interface AuthContextType {
  user: IUser | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  updateUserProfile: (userData: IUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Routes that don't require redirection
const PUBLIC_ROUTES = ['/auth-pages', '/', '/landing-page']

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('[AuthContext] useEffect running')
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token")
      console.log('[AuthContext] storedToken:', storedToken)
      
      if (storedToken) {
        setToken(storedToken)
        try {
          console.log('[AuthContext] Fetching profile...')
          console.log('[AuthContext] API URL:', process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1")
          const response = await getProfile()
          console.log('[AuthContext] getProfile response:', response)
          
          if (response.success && response.data) {
            setUser(response.data)
            console.log('[AuthContext] User set:', response.data)
          } else {
            console.log('[AuthContext] Profile fetch failed:', response.message)
            // Token is invalid, log out
            setToken(null)
            setUser(null)
            localStorage.removeItem("token")
            console.log('[AuthContext] Token invalid, user logged out')
          }
        } catch (error: any) {
          console.error('[AuthContext] Failed to fetch profile', error)
          console.error('[AuthContext] Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
          })
          setToken(null)
          setUser(null)
          localStorage.removeItem("token")
        }
      } else {
        console.log('[AuthContext] No token found, user set to null')
        setUser(null)
        setToken(null)
      }
      
      setIsLoading(false)
      setIsInitialized(true)
      console.log('[AuthContext] isLoading set to false')
    }

    initializeAuth()
  }, [])

  // Auto-redirect logic when user is loaded and auth is initialized
  useEffect(() => {
    if (!isInitialized || isLoading) return

    // If user is logged in and on a public route, redirect to appropriate dashboard
    if (user && pathname && PUBLIC_ROUTES.includes(pathname)) {
      console.log('[AuthContext] User logged in, redirecting to dashboard')
      if (user.userType === "tenant") {
        router.push("/tenant-dashboard")
      } else if (user.userType === "landlord") {
        router.push("/property-manager-dashboard")
      }
    }
  }, [user, isInitialized, isLoading, pathname, router])

  useEffect(() => {
    console.log('[AuthContext] user:', user, 'isLoading:', isLoading)
  }, [user, isLoading])

  const login = async (credentials: LoginRequest) => {
    const response = await loginUser(credentials)
    if (response.success && response.data) {
      setToken(response.data.token)
      setUser(response.data.user)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      // Redirect based on userType
      if (response.data.user.userType === "tenant") {
        router.push("/tenant-dashboard")
      } else if (response.data.user.userType === "landlord") {
        router.push("/property-manager-dashboard")
      } else {
        router.push("/")
      }
    } else {
      throw new Error(response.message || "Login failed")
    }
  }

  const register = async (userData: RegisterRequest) => {
    const response = await registerUser(userData)
    if (response.success && response.data) {
      setToken(response.data.token)
      setUser(response.data.user)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      // Redirect based on userType
      if (response.data.user.userType === "tenant") {
        router.push("/tenant-dashboard")
      } else if (response.data.user.userType === "landlord") {
        router.push("/property-manager-dashboard")
      } else {
        router.push("/")
      }
    } else {
      throw new Error(response.message || "Registration failed")
    }
  }

  const logout = async () => {
    await logoutUserApi()
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    router.push("/")
  }

  const updateUserProfile = (userData: IUser) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 