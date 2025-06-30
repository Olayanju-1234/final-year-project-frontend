"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { MessageCenter } from "@/src/components/communication/MessageCenter"
import { ProfileManager } from "@/src/components/profile/ProfileManager"
import { Header } from "@/src/components/layout/Header"
import { propertiesApi } from "@/src/lib/propertiesApi"
import { useAuth } from "@/src/context/AuthContext"
import { convertBackendToFrontend } from "@/src/utils/typeConversion"
import type { IProperty } from "@/src/types"
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
  MessageSquare,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { optimizationApi } from "@/src/lib/optimizationApi"

function getUserId(user: { _id?: string; id?: string }): string | undefined {
  return user?._id || (user as any)?.id;
}

export default function PropertyManagerDashboard() {
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [editingProperty, setEditingProperty] = useState<IProperty | null>(null)
  const [properties, setProperties] = useState<IProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('properties')
  const [tenantMatches, setTenantMatches] = useState<any[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)

  // Get initial tab from URL params
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['properties', 'matches', 'communications', 'analytics', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

    // Fetch tenant matches when tab is active
    useEffect(() => {
      const landlordId = getUserId(user || {});
      if (activeTab === 'matches' && landlordId && user?.userType === 'landlord') {
        setLoadingMatches(true);
        optimizationApi.findTenantMatchesForLandlord(landlordId)
          .then(response => {
            if (response.success && Array.isArray(response.data)) {
              setTenantMatches(response.data);
            } else {
              setTenantMatches([]);
            }
          })
          .catch(err => {
            console.error("Failed to fetch tenant matches", err);
            setTenantMatches([]);
          })
          .finally(() => setLoadingMatches(false));
      }
    }, [activeTab, user]);

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

  // Disable update if required fields are missing/invalid
  const getValidationErrors = () => {
    const errors: string[] = [];
    
    if (!formData.title) errors.push("Title is required");
    else if (formData.title.length < 5) errors.push("Title must be at least 5 characters");
    
    if (!formData.description) errors.push("Description is required");
    else if (formData.description.length < 20) errors.push("Description must be at least 20 characters");
    
    if (!formData.location.address) errors.push("Address is required");
    if (!formData.location.city) errors.push("City is required");
    if (!formData.location.state) errors.push("State is required");
    
    if (!formData.rent) errors.push("Rent is required");
    else if (isNaN(Number(formData.rent)) || Number(formData.rent) < 0) errors.push("Rent must be a positive number");
    
    if (!formData.bedrooms) errors.push("Number of bedrooms is required");
    else if (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 1 || Number(formData.bedrooms) > 20) 
      errors.push("Number of bedrooms must be between 1 and 20");
    
    if (!formData.bathrooms) errors.push("Number of bathrooms is required");
    else if (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 1 || Number(formData.bathrooms) > 20)
      errors.push("Number of bathrooms must be between 1 and 20");
    
    if (!Array.isArray(formData.amenities) || formData.amenities.length === 0)
      errors.push("At least one amenity must be selected");
    
    return errors;
  };

  const validationErrors = getValidationErrors();
  const isFormDisabled = validationErrors.length > 0;

  // Function to show validation errors
  const showValidationErrors = () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: (
          <ul className="list-disc pl-4">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
    }
  };

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add new state at the top of the component
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Image removal functions
  const removeExistingImage = (url: string) => {
    setImagesToKeep(prev => prev.filter(img => img !== url));
    setImagesToDelete(prev => [...prev, url]);
  };

  const removeNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  // Fetch properties on component mount
  useEffect(() => {
    if (!user || isLoading || user.userType !== "landlord") return;
    const landlordId = getUserId(user);
    if (!landlordId) {
      console.warn("[Dashboard] Landlord user has no id or _id!", user);
      return;
    }
    fetchProperties(landlordId);
  }, [user, isLoading]);

  const fetchProperties = async (landlordIdParam?: string) => {
    const landlordId = landlordIdParam || getUserId(user || {});
    console.log('[fetchProperties] called', user)
    if (!user || user.userType !== 'landlord' || !landlordId) {
      console.log('[fetchProperties] No user or not landlord or no landlordId')
      return
    }
    try {
      setLoading(true)
      console.log('[fetchProperties] Fetching properties for landlord:', landlordId)
      const response = await propertiesApi.getByLandlord(landlordId.toString())
      console.log('[fetchProperties] API response:', response)
      if (response.success && response.data) {
        // Always treat as array
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        console.log('[fetchProperties] Raw API data:', dataArray);
        const convertedProperties = dataArray.map((property: any) => convertBackendToFrontend.property(property));
        console.log('[fetchProperties] Converted properties:', convertedProperties);
        setProperties(convertedProperties);
        console.log('[fetchProperties] Properties set:', convertedProperties.length)
      } else {
        setError(response.message || "Failed to fetch properties")
        console.log('[fetchProperties] API failed:', response.message)
      }
    } catch (err) {
      console.error('[fetchProperties] Error:', err)
      setError("Failed to fetch properties: " + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
      console.log('[fetchProperties] completed, loading set to false')
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

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('rent', formData.rent.toString())
      formDataToSend.append('bedrooms', formData.bedrooms.toString())
      formDataToSend.append('bathrooms', formData.bathrooms.toString())
      formDataToSend.append('size', formData.size.toString())
      formDataToSend.append('location[address]', formData.location.address)
      formDataToSend.append('location[city]', formData.location.city)
      formDataToSend.append('location[state]', formData.location.state)
      // Append amenities as multiple entries
      formData.amenities.forEach(amenity => {
        formDataToSend.append('amenities', amenity)
      })
      formDataToSend.append('features[furnished]', formData.features.furnished.toString())
      formDataToSend.append('features[petFriendly]', formData.features.petFriendly.toString())
      formDataToSend.append('features[parking]', formData.features.parking.toString())
      formDataToSend.append('features[balcony]', formData.features.balcony.toString())
      formDataToSend.append('utilities[electricity]', formData.utilities.electricity.toString())
      formDataToSend.append('utilities[water]', formData.utilities.water.toString())
      formDataToSend.append('utilities[internet]', formData.utilities.internet.toString())
      formDataToSend.append('utilities[gas]', formData.utilities.gas.toString())
      selectedImages.forEach(file => {
        formDataToSend.append('images', file)
      })

      console.log("Selected images before upload (handleCreateProperty):", selectedImages)
      const response = await propertiesApi.create(formDataToSend)
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
    if (isSubmitting) return

    // Use the same validation as create
    const errors = getValidationErrors();
    if (errors.length > 0) {
      console.log('[UpdateProperty] Validation failed:', errors)
      showValidationErrors();
      return;
    }

    const currentFormData = { ...formData }
    const currentEditingProperty = editingProperty
    const currentSelectedImages = [...selectedImages]
    const currentImagesToKeep = [...imagesToKeep]
    const currentImagesToDelete = [...imagesToDelete]

    try {
      setIsSubmitting(true)
      setUploadingImages(true)
      let response
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', String(currentFormData.title))
      formDataToSend.append('description', String(currentFormData.description))
      formDataToSend.append('rent', String(currentFormData.rent))
      formDataToSend.append('bedrooms', String(currentFormData.bedrooms))
      formDataToSend.append('bathrooms', String(currentFormData.bathrooms))
      formDataToSend.append('size', String(currentFormData.size))
      formDataToSend.append('location[address]', String(currentFormData.location.address))
      formDataToSend.append('location[city]', String(currentFormData.location.city))
      formDataToSend.append('location[state]', String(currentFormData.location.state))
      currentFormData.amenities.forEach(amenity => {
        formDataToSend.append('amenities', String(amenity))
      })
      formDataToSend.append('features[furnished]', String(currentFormData.features.furnished))
      formDataToSend.append('features[petFriendly]', String(currentFormData.features.petFriendly))
      formDataToSend.append('features[parking]', String(currentFormData.features.parking))
      formDataToSend.append('features[balcony]', String(currentFormData.features.balcony))
      formDataToSend.append('utilities[electricity]', String(currentFormData.utilities.electricity))
      formDataToSend.append('utilities[water]', String(currentFormData.utilities.water))
      formDataToSend.append('utilities[internet]', String(currentFormData.utilities.internet))
      formDataToSend.append('utilities[gas]', String(currentFormData.utilities.gas))
      currentImagesToKeep.forEach(url => {
        formDataToSend.append('imagesToKeep', url)
      })
      currentSelectedImages.forEach(file => {
        formDataToSend.append('images', file)
      })
      currentImagesToDelete.forEach(url => {
        formDataToSend.append('imagesToDelete', url)
      })
      response = await propertiesApi.update(currentEditingProperty._id.toString(), formDataToSend)
      
      console.log('[UpdateProperty] API response:', response)
      
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
      console.error("Update property error:", err)
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadingImages(false)
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
    setExistingImages(property.images || [])
    setImagesToKeep(property.images || [])
    setImagesToDelete([])
    setSelectedImages([])
    setImagePreviewUrls([])
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
    console.log("File input changed (handleImageSelect):", e.target.files)
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      console.log("Selected files (handleImageSelect):", files)
      setSelectedImages(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
    } else {
      console.log("No files selected") // Debug log
    }
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

  console.log('[Dashboard] Render', { user, loading, error, isLoading: isLoading })

  // Wait for authentication to complete
  if (isLoading) {
    console.log('[Dashboard] AuthContext still loading, showing spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Check if user is logged in
  if (!user) {
    console.log('[Dashboard] No user found, showing login message')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">You must be logged in as a landlord to view this dashboard.</h2>
          <p className="text-gray-500">Please log in and try again.</p>
        </div>
      </div>
    )
  }

  console.log('[Dashboard] User found, checking if loading properties')
  
  // Show loading while fetching properties
  if (loading) {
    console.log('[Dashboard] Loading properties, showing spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (showAddProperty && editingProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          userType="landlord"
          userName={user?.name || "Property Manager"}
          onAddProperty={() => { setShowAddProperty(false); setEditingProperty(null); resetForm(); }}
        />

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
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Existing Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagesToKeep.map((url, index) => (
                          <div key={url} className="relative group">
                            <img src={url} alt={`Existing ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {imagePreviewUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label>New Images ({selectedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={url} className="relative group">
                              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Remove image"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={uploadingImages || isSubmitting || isFormDisabled}
                    onClick={(e) => {
                      if (isFormDisabled) {
                        e.preventDefault();
                        showValidationErrors();
                      }
                    }}
                  >
                    {uploadingImages || isSubmitting ? (
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

  // Only show the add property form if not editing
  if (showAddProperty && !editingProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          userType="landlord"
          userName={user?.name || "Property Manager"}
          onAddProperty={() => { setShowAddProperty(false); resetForm(); }}
        />

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
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Existing Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagesToKeep.map((url, index) => (
                          <div key={url} className="relative group">
                            <img src={url} alt={`Existing ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {imagePreviewUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label>New Images ({selectedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={url} className="relative group">
                              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Remove image"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={uploadingImages || isSubmitting}
                    onClick={(e) => {
                      if (isFormDisabled) {
                        e.preventDefault();
                        showValidationErrors();
                      }
                    }}
                  >
                    {uploadingImages || isSubmitting ? (
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        userType="landlord"
        userName={user?.name || "Property Manager"}
        onAddProperty={() => { setShowAddProperty(true); setEditingProperty(null); resetForm(); }}
      />

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="matches">Tenant Matches</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Top Tenant Matches</CardTitle>
                <CardDescription>
                  These tenants have preferences that align with your available properties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMatches ? (
                  <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                  </div>
                ) : tenantMatches.length === 0 ? (
                  <p>No tenant matches found for your properties at the moment.</p>
                ) : (
                  <div className="space-y-6">
                    {tenantMatches.map(propertyMatch => (
                      <div key={propertyMatch.property._id}>
                        <h3 className="font-bold text-lg mb-2">Matches for: {propertyMatch.property.title}</h3>
                        <div className="space-y-4">
                          {propertyMatch.matches.map((match: any) => (
                            <div key={match.tenant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-semibold">{match.tenant.name}</p>
                                <p className="text-sm text-gray-500">{match.preferencesSummary}</p>
                              </div>
                              <Badge variant="secondary">Match: {match.matchScore}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <MessageCenter userId={getUserId(user || {}) || ''} userType="landlord" />
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

          <TabsContent value="profile" className="space-y-6">
            <ProfileManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
