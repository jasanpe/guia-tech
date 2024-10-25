import { useEffect, useState } from 'react'
import { AutoOptimizer } from '../lib/autoOptimizer'

export function useAutoOptimize(options = {}) {
  const [optimizationLevel, setOptimizationLevel] = useState(AutoOptimizer.currentLevel)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setOptimizationLevel(AutoOptimizer.currentLevel)
      setIsOptimizing(AutoOptimizer.autoOptimizing)
    }, options.interval || 1000)

    return () => clearInterval(interval)
  }, [options.interval])

  return {
    optimizationLevel,
    isOptimizing,
    forceOptimize: AutoOptimizer.applyOptimizations.bind(AutoOptimizer)
  }
}