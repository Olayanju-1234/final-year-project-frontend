 "use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Home,
  Car,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Heart,
  Eye,
  Filter,
  Settings,
  Bell,
  Search,
  Star,
  Bath,
  Bed,
} from "lucide-react"

// Mock data for property matches
const propertyMatches = [
  {
    id: 1,
    title: "Modern 2-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    rent: "₦850,000",
    compatibility: 92,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Security", "Generator"],
    description: "Spacious apartment with modern finishes in prime location",
    landlord: "Adebayo Properties",
    matchReasons: [
      "Perfect budget match (₦850k vs ₦900k max)",
      "Preferred location: Victoria Island",
      "All requested amenities available",
    ],
  },
  {
    id: 2,
    title: "Luxury 3-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    rent: "₦1,200,000",
    compatibility: 78,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["WiFi", "Parking", "Security", "Pool", "Gym"],
    description: "Executive duplex with premium amenities",
    landlord: "Prime Estates",
    matchReasons: [
      "Slightly above budget (₦1.2M vs ₦900k max)",
      "Excellent location match",
      "Premium amenities included",
    ],
  },
  {
    id: 3,
    title: "Cozy 1-Bedroom Studio",
    location: "Ikeja GRA, Lagos",
    rent: "₦450,000",
    compatibility: 85,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "Generator"],
    description: "Perfect for young professionals",
    landlord: "Urban Living",
    matchReasons: [
      "Well within budget (₦450k vs ₦900k max)",
      "Good location accessibility",
      "Essential amenities covered",
    ],
  },
]

export default function TenantDashboard() {
  const [budget, setBudget] = useState([900000])
  const [selectedAmenities, setSelectedAmenities] = useState(["WiFi", "Parking", "Security"])
  const [location, setLocation] = useState("Victoria Island")

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "security", label: "Security", icon: Shield },
    { id: "generator", label: "Generator", icon: Zap },
    { id: "water", label: "Water Supply", icon: Droplets },
  ]

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
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">We found {propertyMatches.length} properties that match your preferences</p>
        </div>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="saved">Saved Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Matches</p>
                      <p className="text-3xl font-bold text-blue-600">{propertyMatches.length}</p>
                    </div>
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Best Match</p>
                      <p className="text-3xl font-bold text-green-600">92%</p>
                    </div>
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Compatibility</p>
                      <p className="text-3xl font-bold text-purple-600">85%</p>
                    </div>
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Matches */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Your Top Matches</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Results
                </Button>
              </div>

              {propertyMatches.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h4>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">{property.rent}/year</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant={
                                property.compatibility >= 90
                                  ? "default"
                                  : property.compatibility >= 80
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-sm"
                            >
                              {property.compatibility}% Match
                            </Badge>
                          </div>
                          <Progress value={property.compatibility} className="w-24" />
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
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-gray-600 mb-4">{property.description}</p>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <h5 className="font-medium text-green-800 mb-2">Why this matches you:</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {property.matchReasons.map((reason, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Listed by {property.landlord}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Contact Owner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Update Your Preferences
                </CardTitle>
                <CardDescription>Adjust your preferences to get better property matches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Budget Range</Label>
                  <div className="mt-2">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={2000000}
                      min={200000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>₦200k</span>
                      <span className="font-medium">₦{budget[0].toLocaleString()}</span>
                      <span>₦2M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Preferred Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Victoria Island">Victoria Island</SelectItem>
                      <SelectItem value="Lekki">Lekki</SelectItem>
                      <SelectItem value="Ikeja">Ikeja</SelectItem>
                      <SelectItem value="Surulere">Surulere</SelectItem>
                      <SelectItem value="Yaba">Yaba</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Required Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.label)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAmenities([...selectedAmenities, amenity.label])
                            } else {
                              setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity.label))
                            }
                          }}
                        />
                        <Label htmlFor={amenity.id} className="flex items-center cursor-pointer">
                          <amenity.icon className="h-4 w-4 mr-2" />
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Update Preferences & Find New Matches</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Properties Yet</h3>
                <p className="text-gray-600">Properties you save will appear here for easy access later.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
