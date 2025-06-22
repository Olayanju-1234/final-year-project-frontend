"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useApiMutation } from "@/hooks/useApi"
import { authApi } from "@/lib/api"
import { Home, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function AuthPages() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("tenant")
  const [currentView, setCurrentView] = useState("auth")

  // TODO: Connect to your backend auth endpoints
  const { mutate: login, loading: loginLoading, error: loginError } = useApiMutation(authApi.login)
  const { mutate: register, loading: registerLoading, error: registerError } = useApiMutation(authApi.register)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await login({ email, password })
    if (result) {
      // TODO: Handle successful login (store token, redirect, etc.)
      console.log("Login successful:", result)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const userData = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      userType: userType as "tenant" | "landlord",
      preferences:
        userType === "tenant"
          ? {
              preferredLocation: formData.get("location") as string,
            }
          : undefined,
    }

    const result = await register(userData)
    if (result) {
      // TODO: Handle successful registration
      console.log("Registration successful:", result)
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: Implement password reset
                console.log("Password reset requested")
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">RentMatch</span>
          </div>
          <CardTitle className="text-2xl">Welcome to RentMatch</CardTitle>
          <CardDescription>Linear Programming Optimization for Property Matching</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView("forgot-password")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                {loginError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{loginError}</div>}
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant (Looking for property)</SelectItem>
                      <SelectItem value="landlord">Property Owner/Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="first-name" name="firstName" placeholder="John" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="phone" name="phone" placeholder="+234 801 234 5678" className="pl-10" required />
                  </div>
                </div>

                {userType === "tenant" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Select name="location">
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select preferred area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="victoria-island">Victoria Island</SelectItem>
                          <SelectItem value="lekki">Lekki</SelectItem>
                          <SelectItem value="ikeja">Ikeja</SelectItem>
                          <SelectItem value="surulere">Surulere</SelectItem>
                          <SelectItem value="yaba">Yaba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                {registerError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{registerError}</div>}

                <Button type="submit" className="w-full" disabled={registerLoading}>
                  {registerLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    `Create ${userType === "tenant" ? "Tenant" : "Property Manager"} Account`
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
