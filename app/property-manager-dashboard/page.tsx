 "use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Home,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Car,
  Wifi,
  Shield,
  Zap,
  Bell,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Mock data
const properties = [
  {
    id: 1,
    title: "Modern 2-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    rent: "₦850,000",
    status: "occupied",
    tenant: "John Adebayo",
    bedrooms: 2,
    bathrooms: 2,
    image: "/placeholder.svg?height=150&width=200",
    views: 45,
    inquiries: 8,
    matchScore: 92,
  },
  {
    id: 2,
    title: "Luxury 3-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    rent: "₦1,200,000",
    status: "vacant",
    tenant: null,
    bedrooms: 3,
    bathrooms: 3,
    image: "/placeholder.svg?height=150&width=200",
    views: 67,
    inquiries: 12,
    matchScore: 88,
  },
  {
    id: 3,
    title: "Cozy 1-Bedroom Studio",
    location: "Ikeja GRA, Lagos",
    rent: "₦450,000",
    status: "pending",
    tenant: "Sarah Okafor",
    bedrooms: 1,
    bathrooms: 1,
    image: "/placeholder.svg?height=150&width=200",
    views: 23,
    inquiries: 5,
    matchScore: 85,
  },
]

const tenantMatches = [
  {
    id: 1,
    name: "Chinedu Okafor",
    email: "chinedu@email.com",
    phone: "+234 801 234 5678",
    budget: "₦800,000 - ₦900,000",
    location: "Victoria Island",
    matchScore: 94,
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    propertyInterest: "Modern 2-Bedroom Apartment",
  },
  {
    id: 2,
    name: "Fatima Abdullahi",
    email: "fatima@email.com",
    phone: "+234 802 345 6789",
    budget: "₦1,000,000 - ₦1,300,000",
    location: "Lekki",
    matchScore: 89,
    status: "approved",
    avatar: "/placeholder.svg?height=40&width=40",
    propertyInterest: "Luxury 3-Bedroom Duplex",
  },
  {
    id: 3,
    name: "Emeka Johnson",
    email: "emeka@email.com",
    phone: "+234 803 456 7890",
    budget: "₦400,000 - ₦500,000",
    location: "Ikeja",
    matchScore: 87,
    status: "rejected",
    avatar: "/placeholder.svg?height=40&width=40",
    propertyInterest: "Cozy 1-Bedroom Studio",
  },
]

export default function PropertyManagerDashboard() {
  const [showAddProperty, setShowAddProperty] = useState(false)

  if (showAddProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowAddProperty(false)}>
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Fill in the details of your property to attract the right tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="e.g., Modern 2-Bedroom Apartment" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Annual Rent (₦)</Label>
                  <Input id="rent" placeholder="850000" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="3">3 Bathrooms</SelectItem>
                      <SelectItem value="4">4+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sqm)</Label>
                  <Input id="size" placeholder="120" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, its features, and what makes it special..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "wifi", label: "WiFi", icon: Wifi },
                    { id: "parking", label: "Parking", icon: Car },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "generator", label: "Generator", icon: Zap },
                  ].map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <input type="checkbox" id={amenity.id} className="rounded" />
                      <Label htmlFor={amenity.id} className="flex items-center cursor-pointer">
                        <amenity.icon className="h-4 w-4 mr-2" />
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Property Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <Button variant="outline" size="sm">
                        Upload Images
                      </Button>
                      <p className="mt-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1">List Property</Button>
                <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">RentMatch</h1>
            </div>
            <Badge variant="secondary">Property Manager</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowAddProperty(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Manager Dashboard</h2>
          <p className="text-gray-600">Manage your properties and connect with potential tenants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-600">{properties.length}</p>
                </div>
                <Home className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-3xl font-bold text-green-600">
                    {properties.filter((p) => p.status === "occupied").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vacant</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {properties.filter((p) => p.status === "vacant").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">₦2.5M</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="matches">Tenant Matches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="grid gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/4">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/4 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">{property.rent}/year</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              property.status === "occupied"
                                ? "default"
                                : property.status === "vacant"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{property.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{property.inquiries} inquiries</span>
                        </div>
                      </div>

                      {property.tenant && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-800">
                            <strong>Current Tenant:</strong> {property.tenant}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Match Score:</span>
                          <Progress value={property.matchScore} className="w-20" />
                          <span className="text-sm font-medium">{property.matchScore}%</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Potential Tenant Matches</h3>
              {tenantMatches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {match.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{match.name}</h4>
                          <p className="text-sm text-gray-600">{match.email}</p>
                          <p className="text-sm text-gray-600">{match.phone}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <strong>Budget:</strong> {match.budget}
                            </p>
                            <p className="text-sm">
                              <strong>Preferred Location:</strong> {match.location}
                            </p>
                            <p className="text-sm">
                              <strong>Interested in:</strong> {match.propertyInterest}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant={
                              match.status === "approved"
                                ? "default"
                                : match.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {match.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-sm text-gray-600">Match:</span>
                          <Progress value={match.matchScore} className="w-20" />
                          <span className="text-sm font-medium">{match.matchScore}%</span>
                        </div>
                        {match.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Property Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-600">
                            {property.views} views • {property.inquiries} inquiries
                          </p>
                        </div>
                        <Progress value={property.matchScore} className="w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rent (Your Area)</span>
                      <span className="font-semibold">₦750,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Average Rent</span>
                      <span className="font-semibold">₦833,333</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Position</span>
                      <Badge variant="secondary">Above Average</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
