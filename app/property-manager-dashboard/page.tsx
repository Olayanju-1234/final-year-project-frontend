"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/src/components/ui/loading-spinner"
import { propertiesApi } from "@/src/lib/propertiesApi"
import { useAuth } from "@/src/context/AuthContext"
import type { IProperty } from "../../../final-year-project-backend/src/types"
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
  Clock,
} from "lucide-react"

export default function PropertyManagerDashboard() {
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [editingProperty, setEditingProperty] = useState<IProperty | null>(null)
  const [properties, setProperties] = useState<IProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Form state for adding/editing property
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    location: {
      address: "",
      city: "",
      state: "Lagos"
    },
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: [] as string[],
    features: {
      furnished: false,
      petFriendly: false,
      parking: false,
      balcony: false,
    },
    utilities: {
      electricity: true,
      water: true,
      internet: false,
      gas: false,
    }
  })

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  // Fetch properties on component mount
  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await propertiesApi.getByLandlord(user._id.toString())
      if (response.success && response.data) {
        setProperties(response.data)
      } else {
        setError(response.message || "Failed to fetch properties")
      }
    } catch (err) {
      setError("Failed to fetch properties")
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProperty) {
      await handleUpdateProperty(e)
      return
    }
    
    try {
      setUploadingImages(true)
      
      // Ensure description meets minimum length requirement
      if (formData.description.length < 20) {
        toast({
          title: "Description Too Short",
          description: "Description must be at least 20 characters long",
          variant: "destructive",
        })
        return
      }

      const propertyData = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: formData.size ? Number(formData.size) : undefined,
        // Ensure amenities is always an array
        amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
        // Ensure features and utilities are objects
        features: {
          furnished: Boolean(formData.features.furnished),
          petFriendly: Boolean(formData.features.petFriendly),
          parking: Boolean(formData.features.parking),
          balcony: Boolean(formData.features.balcony),
        },
        utilities: {
          electricity: Boolean(formData.utilities.electricity),
          water: Boolean(formData.utilities.water),
          internet: Boolean(formData.utilities.internet),
          gas: Boolean(formData.utilities.gas),
        }
      }

      console.log("Sending property data:", propertyData) // Debug log
      console.log("Selected images:", selectedImages) // Debug log

      const response = await propertiesApi.create(propertyData, selectedImages)
      if (response.success) {
        toast({
          title: "Property Created!",
          description: "Your property has been successfully listed.",
          variant: "default",
        })
        setShowAddProperty(false)
        resetForm()
        fetchProperties() // Refresh the list
      } else {
        console.log("Property creation failed:", response) // Debug log
        toast({
          title: "Error",
          description: response.message || "Failed to create property",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Property creation error:", err) // Debug log
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProperty) return
    
    try {
      const updateData = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: formData.size ? Number(formData.size) : undefined,
      }

      const response = await propertiesApi.update(editingProperty._id.toString(), updateData)
      if (response.success) {
        toast({
          title: "Property Updated!",
          description: "Property has been successfully updated.",
          variant: "default",
        })
        setShowAddProperty(false)
        setEditingProperty(null)
        resetForm()
        fetchProperties() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update property",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return
    
    try {
      const response = await propertiesApi.delete(id)
      if (response.success) {
        toast({
          title: "Property Deleted!",
          description: "Property has been successfully removed.",
          variant: "default",
        })
        fetchProperties() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete property",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  const handleEditProperty = (property: IProperty) => {
    setEditingProperty(property)
    setFormData({
      title: property.title,
      description: property.description,
      rent: property.rent.toString(),
      location: {
        address: property.location.address,
        city: property.location.city,
        state: property.location.state
      },
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      size: property.size?.toString() || "",
      amenities: property.amenities,
      features: property.features,
      utilities: property.utilities
    })
    setShowAddProperty(true)
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }))
  }

  const handleFeatureChange = (feature: keyof typeof formData.features, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }))
  }

  const handleUtilityChange = (utility: keyof typeof formData.utilities, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: checked
      }
    }))
  }

  // Image upload handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files) // Debug log
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      console.log("Selected files:", files) // Debug log
      setSelectedImages(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
    } else {
      console.log("No files selected") // Debug log
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index)
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index])
      return newUrls
    })
  }

  const handleDeleteImage = async (propertyId: string, imageIndex: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    
    try {
      const response = await propertiesApi.deleteImage(propertyId, imageIndex)
      if (response.success) {
        toast({
          title: "Image Deleted!",
          description: "Image removed successfully.",
          variant: "default",
        })
        fetchProperties() // Refresh the list
      } else {
        toast({
          title: "Delete Failed",
          description: response.message || "Failed to delete image",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  // Calculate stats
  const totalProperties = properties.length
  const occupiedProperties = properties.filter(p => p.status === "occupied").length
  const vacantProperties = properties.filter(p => p.status === "available").length
  const pendingProperties = properties.filter(p => p.status === "pending").length

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      rent: "",
      location: {
        address: "",
        city: "",
        state: "Lagos"
      },
      bedrooms: "",
      bathrooms: "",
      size: "",
      amenities: [],
      features: {
        furnished: false,
        petFriendly: false,
        parking: false,
        balcony: false,
      },
      utilities: {
        electricity: true,
        water: true,
        internet: false,
        gas: false,
      }
    })
    setSelectedImages([])
    setImagePreviewUrls([])
    setEditingProperty(null)
  }

  if (showAddProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => {
                setShowAddProperty(false)
                resetForm()
              }}>
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingProperty ? "Edit Property" : "Add New Property"}
              </h1>
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
              <form onSubmit={handleCreateProperty}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Modern 2-Bedroom Apartment"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent">Annual Rent (₦)</Label>
                    <Input 
                      id="rent" 
                      placeholder="850000" 
                      type="number"
                      value={formData.rent}
                      onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Location</Label>
                  <Select 
                    value={formData.location.city} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Enter full address"
                      value={formData.location.address}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      placeholder="Lagos"
                      value={formData.location.state}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, state: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select 
                      value={formData.bedrooms} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}
                    >
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
                    <Select 
                      value={formData.bathrooms} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}
                    >
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
                    <Input 
                      id="size" 
                      placeholder="120" 
                      type="number"
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its features, and what makes it special..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                  <div className="flex justify-between text-sm">
                    <span className={`${formData.description.length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.description.length < 20 ? `${20 - formData.description.length} more characters needed` : 'Minimum length met'}
                    </span>
                    <span className="text-gray-500">{formData.description.length}/2000</span>
                  </div>
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
                        <input 
                          type="checkbox" 
                          id={amenity.id} 
                          className="rounded"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                        />
                        <Label htmlFor={amenity.id} className="flex items-center cursor-pointer">
                          <amenity.icon className="h-4 w-4 mr-2" />
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: "furnished", label: "Furnished" },
                      { id: "petFriendly", label: "Pet Friendly" },
                      { id: "parking", label: "Parking" },
                      { id: "balcony", label: "Balcony" },
                    ].map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={feature.id} 
                          className="rounded"
                          checked={formData.features[feature.id as keyof typeof formData.features]}
                          onChange={(e) => handleFeatureChange(feature.id as keyof typeof formData.features, e.target.checked)}
                        />
                        <Label htmlFor={feature.id} className="cursor-pointer">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Utilities Included</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: "electricity", label: "Electricity" },
                      { id: "water", label: "Water" },
                      { id: "internet", label: "Internet" },
                      { id: "gas", label: "Gas" },
                    ].map((utility) => (
                      <div key={utility.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={utility.id} 
                          className="rounded"
                          checked={formData.utilities[utility.id as keyof typeof formData.utilities]}
                          onChange={(e) => handleUtilityChange(utility.id as keyof typeof formData.utilities, e.target.checked)}
                        />
                        <Label htmlFor={utility.id} className="cursor-pointer">
                          {utility.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <div className="space-y-4">
                    {/* Image upload input */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer inline-block">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              type="button" 
                              className="hover:bg-blue-50 border-blue-300 text-blue-700"
                              onClick={() => {
                                const fileInput = document.getElementById('image-upload') as HTMLInputElement
                                if (fileInput) {
                                  fileInput.click()
                                }
                              }}
                            >
                              📁 Choose Images
                            </Button>
                          </label>
                          <p className="mt-1">or drag and drop images here</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (max 10 images)</p>
                        {selectedImages.length > 0 && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700 font-medium">
                              ✅ {selectedImages.length} image(s) selected
                            </p>
                            <p className="text-xs text-blue-600">
                              Click "List Property" to upload and create your listing
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Images ({selectedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1" disabled={uploadingImages}>
                    {uploadingImages ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {editingProperty ? "Updating Property..." : "Creating Property..."}
                      </>
                    ) : (
                      editingProperty ? "Update Property" : "List Property"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddProperty(false)
                    resetForm()
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-600">{totalProperties}</p>
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
                  <p className="text-3xl font-bold text-green-600">{occupiedProperties}</p>
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
                  <p className="text-3xl font-bold text-orange-600">{vacantProperties}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-purple-600">{pendingProperties}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
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
            {properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first property to attract tenants</p>
                  <Button onClick={() => setShowAddProperty(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {properties.map((property) => (
                  <Card key={property._id.toString()} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <img
                          src={property.images?.[0] || "/placeholder.svg"}
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
                              <span className="text-sm">{property.location.address}, {property.location.city}</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">₦{property.rent.toLocaleString()}/year</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                property.status === "occupied"
                                  ? "default"
                                  : property.status === "available"
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
                          {property.size && (
                            <div className="flex items-center">
                              <span>{property.size} sqm</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{property.views} views</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{property.inquiries} inquiries</span>
                          </div>
                        </div>

                        {/* Property Images */}
                        {property.images && property.images.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Property Images</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {property.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteImage(property._id.toString(), index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Match Score:</span>
                            <Progress value={85} className="w-20" />
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProperty(property._id.toString())}
                            >
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
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Potential Tenant Matches</h3>
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Yet</h3>
                  <p className="text-gray-600">Tenant matches will appear here once tenants start showing interest in your properties</p>
                </CardContent>
              </Card>
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
                  {properties.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No properties to analyze</p>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div key={property._id.toString()} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-gray-600">
                              {property.views} views • {property.inquiries} inquiries
                            </p>
                          </div>
                          <Progress value={85} className="w-20" />
                        </div>
                      ))}
                    </div>
                  )}
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
                      <span className="font-semibold">
                        ₦{properties.length > 0 
                          ? (properties.reduce((sum, p) => sum + p.rent, 0) / properties.length).toLocaleString()
                          : '0'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Position</span>
                      <Badge variant="secondary">Above Average</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold">
                        {totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0}%
                      </span>
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
