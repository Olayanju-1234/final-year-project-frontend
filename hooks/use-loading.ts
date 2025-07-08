import { useState, useCallback } from 'react'

interface UseLoadingReturn {
  loading: boolean
  startLoading: () => void
  stopLoading: () => void
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>
}

export const useLoading = (initialState = false): UseLoadingReturn => {
  const [loading, setLoading] = useState(initialState)

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading()
      return await asyncFn()
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  }
} 