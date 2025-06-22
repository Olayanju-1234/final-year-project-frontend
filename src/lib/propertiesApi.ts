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

  create: async (propertyData: Partial<IProperty>): Promise<ApiResponse<IProperty>> => {
    const response = await apiClient.post<ApiResponse<IProperty>>("/properties", propertyData)
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
} 