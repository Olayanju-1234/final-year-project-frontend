import apiClient from "./api"
import type { PropertyMatch, OptimizationResult, ApiResponse, OptimizationConstraints, OptimizationWeights } from "../../../final-year-project-backend/src/types"

export const optimizationApi = {
  findMatches: async (tenantId: string): Promise<ApiResponse<OptimizationResult>> => {
    const response = await apiClient.get<ApiResponse<OptimizationResult>>(`/optimization/matches/${tenantId}`)
    return response.data
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
} 