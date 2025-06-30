import apiClient from "./api"
import type { ITenant, ApiResponse } from "@/src/types"

export const tenantsApi = {
  getProfile: async (id: string): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.get<ApiResponse<ITenant>>(`/tenants/${id}`)
    return response.data
  },

  updateProfile: async (id: string, tenantData: Partial<ITenant>): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.put<ApiResponse<ITenant>>(`/tenants/${id}`, tenantData)
    return response.data
  },

  updatePreferences: async (
    id: string,
    data: { preferences: Partial<ITenant["preferences"]> }
  ): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.put<ApiResponse<ITenant>>(`/tenants/${id}/preferences`, data)
    return response.data
  },

  getSavedProperties: async (
    id: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<any>> => {
    const params = { ...(page && { page }), ...(limit && { limit }) }
    const response = await apiClient.get<ApiResponse<any>>(`/tenants/${id}/saved-properties`, { params })
    return response.data
  },

  addSavedProperty: async (id: string, propertyId: string): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.post<ApiResponse<ITenant>>(`/tenants/${id}/saved-properties`, { propertyId })
    return response.data
  },

  removeSavedProperty: async (id: string, propertyId: string): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.delete<ApiResponse<ITenant>>(`/tenants/${id}/saved-properties/${propertyId}`)
    return response.data
  },

  getSearchHistory: async (
    id: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<any>> => {
    const params = { ...(page && { page }), ...(limit && { limit }) }
    const response = await apiClient.get<ApiResponse<any>>(`/tenants/${id}/search-history`, { params })
    return response.data
  },

  // Request viewing for a property
  requestViewing: async (id: string, propertyId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/tenants/${id}/viewing-requests`, { propertyId })
    return response.data
  },
} 