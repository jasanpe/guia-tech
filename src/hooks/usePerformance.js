import { useState, useEffect } from 'react'
import { PerformanceMonitor } from '../lib/performanceMonitor'

export function usePerformance(options = {}) {
  const [metrics, setMetrics] = useState(PerformanceMonitor.getMetrics())
  const [isOptimized, setIsOptimized] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      const currentMetrics = PerformanceMonitor.getMetrics()
      setMetrics(currentMetrics)

      // Verificar si necesitamos optimizar
      const needsOptimization = 
        currentMetrics.fps.current < 30 ||
        currentMetrics.memory.current > 0.8 ||
        currentMetrics.network.averageLoadTime > 3000

      setIsOptimized(!needsOptimization)
    }, options.interval || 1000)

    return () => clearInterval(interval)
  }, [options.interval])

  return { metrics, isOptimized }
}