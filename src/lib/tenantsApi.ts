import apiClient from "./api"
import type { ITenant, ApiResponse } from "../../../final-year-project-backend/src/types"

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
    preferences: Partial<ITenant["preferences"]>
  ): Promise<ApiResponse<ITenant>> => {
    const response = await apiClient.put<ApiResponse<ITenant>>(`/tenants/${id}/preferences`, preferences)
    return response.data
  },
} 