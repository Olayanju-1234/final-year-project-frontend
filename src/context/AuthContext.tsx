"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { loginUser, registerUser, getProfile, logoutUser as logoutUserApi } from "@/src/lib/api"
import type { LoginRequest, RegisterRequest, IUser } from "../../../final-year-project-backend/src/types"

interface AuthContextType {
  user: IUser | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('[AuthContext] useEffect running')
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token")
      console.log('[AuthContext] storedToken:', storedToken)
      
      if (storedToken) {
        setToken(storedToken)
        try {
          console.log('[AuthContext] Fetching profile...')
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
        } catch (error) {
          console.error('[AuthContext] Failed to fetch profile', error)
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
      console.log('[AuthContext] isLoading set to false')
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    console.log('[AuthContext] user:', user, 'isLoading:', isLoading)
  }, [user, isLoading])

  const login = async (credentials: LoginRequest) => {
    const response = await loginUser(credentials)
    if (response.success && response.data) {
      setToken(response.data.token)
      setUser(response.data.user)
      localStorage.setItem("token", response.data.token)
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

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
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