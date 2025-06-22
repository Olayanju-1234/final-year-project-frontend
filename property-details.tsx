"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Car,
  Wifi,
  Shield,
  Zap,
  Droplets,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"

const propertyImages = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

const similarProperties = [
  {
    id: 1,
    title: "Executive 2BR Apartment",
    location: "Victoria Island",
    rent: "₦900,000",
    image: "/placeholder.svg?height=150&width=200",
    matchScore: 89,
  },
  {
    id: 2,
    title: "Spacious 2BR Flat",
    location: "Ikoyi",
    rent: "₦750,000",
    image: "/placeholder.svg?height=150&width=200",
    matchScore: 85,
  },
  {
    id: 3,
    title: "Modern 2BR Suite",
    location: "Lekki Phase 1",
    rent: "₦950,000",
    image: "/placeholder.svg?height=150&width=200",
    matchScore: 82,
  },
]

export default function PropertyDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
  }

  const property = {
    title: "Modern 2-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    rent: "₦850,000",
    bedrooms: 2,
    bathrooms: 2,
    size: "120 sqm",
    matchScore: 92,
    description:
      "This stunning modern apartment offers the perfect blend of luxury and comfort in the heart of Victoria Island. Featuring contemporary finishes, spacious rooms, and premium amenities, it's ideal for young professionals and small families. The property boasts excellent connectivity to major business districts and entertainment hubs.",
    amenities: [
      { name: "WiFi", icon: Wifi, available: true },
      { name: "Parking", icon: Car, available: true },
      { name: "Security", icon: Shield, available: true },
      { name: "Generator", icon: Zap, available: true },
      { name: "Water Supply", icon: Droplets, available: true },
    ],
    landlord: {
      name: "Adebayo Properties",
      rating: 4.8,
      reviews: 24,
      phone: "+234 801 234 5678",
      email: "contact@adebayoproperties.com",
      avatar: "/placeholder.svg?height=60&width=60",
      responseTime: "Usually responds within 2 hours",
    },
    matchReasons: [
      "Perfect budget match (₦850k vs ₦900k max)",
      "Preferred location: Victoria Island",
      "All requested amenities available",
      "Excellent transport connectivity",
    ],
  }

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => setShowContactForm(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Property
            </Button>
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RentMatch</span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Property Owner</CardTitle>
              <CardDescription>
                Send a message to {property.landlord.name} about {property.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.landlord.avatar || "/placeholder.svg"} />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{property.landlord.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(property.landlord.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {property.landlord.rating} ({property.landlord.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{property.landlord.responseTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234 801 234 5678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Hi, I'm interested in your property. I would like to schedule a viewing..."
                  rows={4}
                  defaultValue={`Hi, I'm interested in your property "${property.title}" in ${property.location}. I would like to schedule a viewing at your earliest convenience. My budget aligns perfectly with your asking rent of ${property.rent}/year.`}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="phone-contact" name="contact" value="phone" defaultChecked />
                    <Label htmlFor="phone-contact">Phone Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="email-contact" name="contact" value="email" />
                    <Label htmlFor="email-contact">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="whatsapp-contact" name="contact" value="whatsapp" />
                    <Label htmlFor="whatsapp-contact">WhatsApp</Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
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
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RentMatch</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSaved(!isSaved)}>
              <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={propertyImages[currentImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-between px-4">
                  <Button variant="secondary" size="icon" onClick={prevImage} className="bg-white/80 hover:bg-white">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={nextImage} className="bg-white/80 hover:bg-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    {propertyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 hover:bg-green-600">{property.matchScore}% Match</Badge>
                </div>
              </div>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{property.rent}/year</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bed className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bath className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Home className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.size}</p>
                    <p className="text-sm text-gray-600">Size</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Why this matches you</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {property.matchReasons.map((reason, index) => (
                        <li key={index} className="flex items-start text-green-800">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Property</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            amenity.available
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <amenity.icon
                            className={`h-5 w-5 ${amenity.available ? "text-green-600" : "text-gray-400"}`}
                          />
                          <span className={`font-medium ${amenity.available ? "text-green-800" : "text-gray-500"}`}>
                            {amenity.name}
                          </span>
                          {amenity.available && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Neighborhood</h3>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                      <p className="text-gray-600">Interactive Map Would Go Here</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Nearby Amenities</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Tafawa Balewa Square - 5 min walk</li>
                          <li>• National Theatre - 10 min drive</li>
                          <li>• Lagos Island Club - 8 min walk</li>
                          <li>• CMS Bus Stop - 3 min walk</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Transportation</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• BRT Station - 5 min walk</li>
                          <li>• Marina - 10 min drive</li>
                          <li>• Murtala Muhammed Airport - 45 min drive</li>
                          <li>• Third Mainland Bridge - 15 min drive</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Similar Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Properties You Might Like</CardTitle>
                <CardDescription>Based on your preferences and this property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {similarProperties.map((similar) => (
                    <div
                      key={similar.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <img
                        src={similar.image || "/placeholder.svg"}
                        alt={similar.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold text-sm mb-1">{similar.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{similar.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 text-sm">{similar.rent}</span>
                          <Badge variant="outline" className="text-xs">
                            {similar.matchScore}% match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Property Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={property.landlord.avatar || "/placeholder.svg"} />
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{property.landlord.name}</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(property.landlord.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">
                        {property.landlord.rating} ({property.landlord.reviews})
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{property.landlord.responseTime}</p>
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setShowContactForm(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Match Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{property.matchScore}%</div>
                  <p className="text-sm text-gray-600">Compatibility Score</p>
                </div>
                <Progress value={property.matchScore} className="h-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Match</span>
                    <span className="font-medium text-green-600">Perfect</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenities</span>
                    <span className="font-medium text-green-600">100% Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium text-blue-600">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">45 views</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="font-medium">8 inquiries</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-medium">#RM2024001</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
