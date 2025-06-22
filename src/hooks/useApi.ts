"use client"

import { useState, useEffect } from "react"
import type { ApiResponse } from "@/lib/api"

export function useApi<T>(apiCall: () => Promise<ApiResponse<T>>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const response = await apiCall()

      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error || "Failed to fetch data")
      }

      setLoading(false)
    }

    fetchData()
  }, dependencies)

  const refetch = async () => {
    setLoading(true)
    const response = await apiCall()

    if (response.success && response.data) {
      setData(response.data)
      setError(null)
    } else {
      setError(response.error || "Failed to fetch data")
    }

    setLoading(false)
  }

  return { data, loading, error, refetch }
}

export function useApiMutation<T, P>(apiCall: (params: P) => Promise<ApiResponse<T>>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (params: P): Promise<T | null> => {
    setLoading(true)
    setError(null)

    const response = await apiCall(params)

    setLoading(false)

    if (response.success && response.data) {
      return response.data
    } else {
      setError(response.error || "Operation failed")
      return null
    }
  }

  return { mutate, loading, error }
}
