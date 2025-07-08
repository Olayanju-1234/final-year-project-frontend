import { useState, useCallback } from 'react'

interface PerformanceMetrics {
  executionTime: number
  memoryUsage?: number
  timestamp: Date
  success: boolean
  error?: string
}

interface UsePerformanceReturn {
  metrics: PerformanceMetrics[]
  trackPerformance: <T>(asyncFn: () => Promise<T>, label?: string) => Promise<T>
  getAverageExecutionTime: () => number
  getSuccessRate: () => number
  clearMetrics: () => void
}

export const usePerformance = (): UsePerformanceReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])

  const trackPerformance = useCallback(async <T>(
    asyncFn: () => Promise<T>, 
    label?: string
  ): Promise<T> => {
    const startTime = performance.now()
    const startMemory = (performance as any).memory?.usedJSHeapSize

    try {
      const result = await asyncFn()
      const endTime = performance.now()
      const endMemory = (performance as any).memory?.usedJSHeapSize

      const newMetric: PerformanceMetrics = {
        executionTime: endTime - startTime,
        memoryUsage: endMemory ? endMemory - startMemory : undefined,
        timestamp: new Date(),
        success: true,
      }

      setMetrics(prev => [...prev, newMetric])
      return result
    } catch (error) {
      const endTime = performance.now()
      const newMetric: PerformanceMetrics = {
        executionTime: endTime - startTime,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }

      setMetrics(prev => [...prev, newMetric])
      throw error
    }
  }, [])

  const getAverageExecutionTime = useCallback(() => {
    if (metrics.length === 0) return 0
    const successfulMetrics = metrics.filter(m => m.success)
    if (successfulMetrics.length === 0) return 0
    
    const totalTime = successfulMetrics.reduce((sum, m) => sum + m.executionTime, 0)
    return totalTime / successfulMetrics.length
  }, [metrics])

  const getSuccessRate = useCallback(() => {
    if (metrics.length === 0) return 0
    const successfulCount = metrics.filter(m => m.success).length
    return (successfulCount / metrics.length) * 100
  }, [metrics])

  const clearMetrics = useCallback(() => {
    setMetrics([])
  }, [])

  return {
    metrics,
    trackPerformance,
    getAverageExecutionTime,
    getSuccessRate,
    clearMetrics,
  }
} 