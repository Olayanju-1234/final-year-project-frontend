import apiClient from "./api"
import type { PropertyMatch, OptimizationResult, ApiResponse, OptimizationConstraints, OptimizationWeights } from "@/src/types"

export const optimizationApi = {
  findMatches: async (tenantId: string, maxResults: number = 10): Promise<ApiResponse<OptimizationResult>> => {
    const response = await apiClient.get<{ data: OptimizationResult }>(`/optimization/matches/${tenantId}?maxResults=${maxResults}`);
    return { success: true, data: response.data.data, message: '' };
  },

  findTenantMatchesForLandlord: async (landlordId: string, maxResults: number = 10): Promise<ApiResponse<any>> => {
    return apiClient.get(`/optimization/landlord-matches/${landlordId}?maxResults=${maxResults}`);
  },

  runOptimization: async (
    constraints: OptimizationConstraints,
    weights?: Partial<OptimizationWeights>,
    maxResults?: number
  ): Promise<ApiResponse<OptimizationResult>> => {
    const response = await apiClient.post<ApiResponse<OptimizationResult>>(
      "/optimization/linear-programming",
      { constraints, weights, maxResults }
    )
    return response.data
  },

  getOptimizationStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>("/optimization/stats")
    return response.data
  },

  testOptimization: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>("/optimization/test")
    return response.data
  },
} 