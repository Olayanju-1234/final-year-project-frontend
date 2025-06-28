import axios from "axios"
import type { LoginRequest, RegisterRequest, ApiResponse } from "../../../final-year-project-backend/src/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  },
})

// Function to get the token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Only set Content-Type for JSON requests
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json"
    } else {
      // Let Axios/browser set Content-Type for FormData
      delete config.headers["Content-Type"]
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/register", userData)
    return response.data
  } catch (error: any) {
    return error.response?.data || { success: false, message: "An unknown error occurred" }
  }
}

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/login", credentials)
    return response.data
  } catch (error: any) {
    return error.response?.data || { success: false, message: "An unknown error occurred" }
  }
}

export const getProfile = async (): Promise<ApiResponse> => {
  try {
    const timestamp = new Date().getTime()
    const response = await apiClient.get<ApiResponse>(`/auth/me?t=${timestamp}`)
    return response.data
  } catch (error: any) {
    return error.response?.data || { success: false, message: "An unknown error occurred" }
  }
}

export const logoutUser = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/logout")
    // Client-side cleanup
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    return response.data
  } catch (error: any) {
    return error.response?.data || { success: false, message: "An unknown error occurred" }
  }
}

export default apiClient
