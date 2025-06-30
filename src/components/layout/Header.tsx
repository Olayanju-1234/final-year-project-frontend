"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Bell, Settings, LogOut, User, Edit } from "lucide-react"
import { useAuth } from "@/src/context/AuthContext"

interface HeaderProps {
  userType?: "tenant" | "landlord"
  userName?: string
  onAddProperty?: () => void
}

export function Header({ userType, userName = "User", onAddProperty }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleViewProfile = () => {
    if (userType === "tenant") {
      router.push("/tenant-dashboard?tab=profile")
    } else if (userType === "landlord") {
      router.push("/property-manager-dashboard?tab=profile")
    }
  }

  const handleEditProfile = () => {
    if (userType === "tenant") {
      router.push("/tenant-dashboard?tab=profile")
    } else if (userType === "landlord") {
      router.push("/property-manager-dashboard?tab=profile")
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">RentMatch</h1>
          </div>
          {userType && (
            <Badge variant="secondary" className="capitalize">
              {userType}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {userType === "landlord" && onAddProperty && (
            <Button onClick={onAddProperty}>Add Property</Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.profileImage || undefined} 
                    alt={user?.name || userName}
                  />
                  <AvatarFallback>
                    {(user?.name || userName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || userName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditProfile}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
