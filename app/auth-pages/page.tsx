"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowLeft, Terminal } from "lucide-react"
import { useAuth } from "@/src/context/AuthContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthPages() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const modeParam = searchParams?.get("mode");

  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"tenant" | "landlord">("tenant")
  const [currentView, setCurrentView] = useState("auth") // auth, forgot-password
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { login, register } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")

  // Auto-switch authMode based on ?mode=login or ?mode=signup
  useEffect(() => {
    if (modeParam === "signup" && authMode !== "register") {
      setAuthMode("register");
    } else if (modeParam === "login" && authMode !== "login") {
      setAuthMode("login");
    }
  }, [modeParam]);

  const toggleAuthMode = () => {
    const newMode = authMode === "login" ? "register" : "login";
    setAuthMode(newMode);
    
    // Update the URL to reflect the new mode
    const newModeParam = newMode === "register" ? "signup" : "login";
    router.push(`/auth-pages?mode=${newModeParam}`);
    
    // Clear form data when switching modes
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setError(null);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      if (authMode === "login") {
        await login({ email, password })
        // Show success toast for login
        toast({
          title: "Login Successful!",
          description: "Welcome back to RentMatch. Redirecting you to your dashboard...",
          variant: "default",
        })
      } else {
        await register({ name, email, password, phone, userType })
        // Show success toast for registration
        toast({
          title: "Registration Successful!",
          description: `Welcome to RentMatch! Your ${userType} account has been created successfully.`,
          variant: "default",
        })
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  if (currentView === "forgot-password") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => setCurrentView("auth")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">RentMatch</span>
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="reset-email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>
            <Button className="w-full">Send Reset Link</Button>
            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <button onClick={() => setCurrentView("auth")} className="text-blue-600 hover:underline">
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{authMode === "login" ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {authMode === "login" ? "Enter your email below to login to your account" : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthAction}>
            <div className="grid gap-4">
              {authMode === "register" && (
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="John Doe" required value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              {authMode === "register" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1234567890" required value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="user-type">I am a</Label>
                    <Select onValueChange={(value: "tenant" | "landlord") => setUserType(value)} defaultValue={userType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {isLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="text-red-500 mb-2">{error}</span>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : authMode === "login" ? "Login" : "Create an account"}
                </Button>
              )}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Button variant="link" onClick={toggleAuthMode} className="p-0">
              {authMode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 