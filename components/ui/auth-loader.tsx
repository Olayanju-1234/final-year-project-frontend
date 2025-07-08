"use client"

import { useAuth } from "@/src/context/AuthContext"
import { LoadingSpinner } from "./loading-spinner"

interface AuthLoaderProps {
  children: React.ReactNode
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({ children }) => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 