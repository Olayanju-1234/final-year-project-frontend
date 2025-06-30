import apiClient from "./api"
import type { IMessage, IViewing, ApiResponse } from "@/src/types"

export const communicationApi = {
  sendMessage: async (messageData: {
    toUserId: string
    propertyId?: string
    subject: string
    message: string
    messageType?: "inquiry" | "viewing_request" | "general" | "system"
  }): Promise<ApiResponse<IMessage>> => {
    const response = await apiClient.post<ApiResponse<IMessage>>("/communication/messages", messageData)
    return response.data
  },

  getInbox: async (page?: number, limit?: number, status?: string): Promise<ApiResponse<IMessage[]>> => {
    const params = { ...(page && { page }), ...(limit && { limit }), ...(status && { status }) }
    const response = await apiClient.get<ApiResponse<IMessage[]>>("/communication/messages/inbox", { params })
    return response.data
  },

  getSentMessages: async (page?: number, limit?: number): Promise<ApiResponse<IMessage[]>> => {
    const params = { ...(page && { page }), ...(limit && { limit }) }
    const response = await apiClient.get<ApiResponse<IMessage[]>>("/communication/messages/sent", { params })
    return response.data
  },

  getConversation: async (userId: string, page?: number, limit?: number): Promise<ApiResponse<IMessage[]>> => {
    const params = { ...(page && { page }), ...(limit && { limit }) }
    const response = await apiClient.get<ApiResponse<IMessage[]>>(`/communication/messages/conversation/${userId}`, { params })
    return response.data
  },

  markAsRead: async (messageId: string): Promise<ApiResponse<IMessage>> => {
    const response = await apiClient.put<ApiResponse<IMessage>>(`/communication/messages/${messageId}/read`)
    return response.data
  },

  requestViewing: async (viewingData: {
    propertyId: string
    requestedDate: string
    requestedTime: string
    notes?: string
  }): Promise<ApiResponse<IViewing>> => {
    const response = await apiClient.post<ApiResponse<IViewing>>("/communication/viewings", viewingData)
    return response.data
  },

  getViewings: async (
    page?: number,
    limit?: number,
    status?: string,
    role?: "tenant" | "landlord"
  ): Promise<ApiResponse<IViewing[]>> => {
    const params = { ...(page && { page }), ...(limit && { limit }), ...(status && { status }), ...(role && { role }) }
    const response = await apiClient.get<ApiResponse<IViewing[]>>("/communication/viewings", { params })
    return response.data
  },

  updateViewingStatus: async (
    viewingId: string,
    status: "pending" | "confirmed" | "cancelled" | "completed",
    notes?: string
  ): Promise<ApiResponse<IViewing>> => {
    const response = await apiClient.put<ApiResponse<IViewing>>(`/communication/viewings/${viewingId}/status`, {
      status,
      ...(notes && { notes }),
    })
    return response.data
  },
} 