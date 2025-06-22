import apiClient from "./api"
import type { ApiResponse } from "../../../final-year-project-backend/src/types"

export const communicationApi = {
  sendMessage: async (data: {
    fromUserId: string
    toUserId: string
    propertyId?: string
    subject: string
    message: string
    messageType: string
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>("/communication/send-message", data)
    return response.data
  },

  scheduleViewing: async (data: {
    tenantId: string
    propertyId: string
    landlordId: string
    requestedDate: string
    requestedTime: string
    notes?: string
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>("/communication/schedule-viewing", data)
    return response.data
  },
} 