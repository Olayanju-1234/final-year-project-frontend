import apiClient from "./api"
import type { IProperty, ApiResponse } from "../../../final-year-project-backend/src/types"

export const propertiesApi = {
  getAll: async (filters?: {
    location?: string
    minRent?: number
    maxRent?: number
    bedrooms?: number
    amenities?: string[]
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<IProperty[]>> => {
    const params = { ...filters }
    const response = await apiClient.get<ApiResponse<IProperty[]>>("/properties", { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<IProperty>> => {
    const response = await apiClient.get<ApiResponse<IProperty>>(`/properties/${id}`)
    return response.data
  },

  getByLandlord: async (landlordId: string, filters?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<IProperty[]>> => {
    const params = { ...filters }
    const response = await apiClient.get<ApiResponse<IProperty[]>>(`/properties/landlord/${landlordId}`, { params })
    return response.data
  },

  create: async (propertyData: Partial<IProperty>, images?: File[]): Promise<ApiResponse<IProperty>> => {
    const formData = new FormData()
    
    // Add property data
    formData.append("title", propertyData.title || "")
    formData.append("description", propertyData.description || "")
    formData.append("rent", propertyData.rent?.toString() || "")
    formData.append("bedrooms", propertyData.bedrooms?.toString() || "")
    formData.append("bathrooms", propertyData.bathrooms?.toString() || "")
    
    if (propertyData.size) {
      formData.append("size", propertyData.size.toString())
    }
    
    if (propertyData.location) {
      formData.append("location.address", propertyData.location.address || "")
      formData.append("location.city", propertyData.location.city || "")
      formData.append("location.state", propertyData.location.state || "")
    }
    
    // Handle amenities as array - send each amenity as a separate field
    if (propertyData.amenities && Array.isArray(propertyData.amenities)) {
      propertyData.amenities.forEach(amenity => {
        formData.append("amenities", amenity)
      })
    }
    
    // Handle features as object - send each feature as a separate field
    if (propertyData.features) {
      formData.append("features.furnished", propertyData.features.furnished?.toString() || "false")
      formData.append("features.petFriendly", propertyData.features.petFriendly?.toString() || "false")
      formData.append("features.parking", propertyData.features.parking?.toString() || "false")
      formData.append("features.balcony", propertyData.features.balcony?.toString() || "false")
    }
    
    // Handle utilities as object - send each utility as a separate field
    if (propertyData.utilities) {
      formData.append("utilities.electricity", propertyData.utilities.electricity?.toString() || "true")
      formData.append("utilities.water", propertyData.utilities.water?.toString() || "true")
      formData.append("utilities.internet", propertyData.utilities.internet?.toString() || "false")
      formData.append("utilities.gas", propertyData.utilities.gas?.toString() || "false")
    }
    
    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file)
      })
    }
    
    const response = await apiClient.post<ApiResponse<IProperty>>("/properties", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  update: async (id: string, propertyData: Partial<IProperty>): Promise<ApiResponse<IProperty>> => {
    const response = await apiClient.put<ApiResponse<IProperty>>(`/properties/${id}`, propertyData)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/properties/${id}`)
    return response.data
  },

  deleteImage: async (propertyId: string, imageIndex: number): Promise<ApiResponse<{ deletedImage: string, remainingImages: number }>> => {
    const response = await apiClient.delete<ApiResponse<{ deletedImage: string, remainingImages: number }>>(
      `/properties/${propertyId}/images/${imageIndex}`
    )
    return response.data
  },
} 