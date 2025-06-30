import apiClient from "./api"
import type { IProperty, ApiResponse } from "@/src/types"

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

  create: async (formData: FormData) => {
    // Do not set Content-Type header, let Axios handle it
    const response = await apiClient.post<ApiResponse<IProperty>>("/properties", formData)
    return response.data
  },

  update: async (id: string, propertyData: Partial<IProperty> | FormData): Promise<ApiResponse<IProperty>> => {
    let response
    if (propertyData instanceof FormData) {
      response = await apiClient.put<ApiResponse<IProperty>>(`/properties/${id}`, propertyData, {
        headers: {}, // Let Axios/browser set Content-Type
      })
    } else {
      response = await apiClient.put<ApiResponse<IProperty>>(`/properties/${id}`, propertyData)
    }
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