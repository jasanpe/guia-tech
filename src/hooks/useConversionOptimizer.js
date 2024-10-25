import { useCallback, useEffect, useState } from 'react'
import { ConversionOptimizer } from '../lib/conversionOptimizer'
import { useAuth } from '../contexts/AuthContext'
import { useMetrics } from './useMetrics'

export function useConversionOptimizer(testId, variants, options = {}) {
  const { user } = useAuth()
  const { trackUserInteraction } = useMetrics()
  const [variant, setVariant] = useState(null)

  useEffect(() => {
    // Inicializar test si no existe
    if (!ConversionOptimizer.tests.has(testId)) {
      ConversionOptimizer.startTest(testId, variants, options)
    }

    // Obtener y establecer variante
    const selectedVariant = ConversionOptimizer.getVariant(testId, user?.id)
    setVariant(selectedVariant)
  }, [testId, variants, options, user])

  const trackView = useCallback(() => {
    if (variant) {
      ConversionOptimizer.trackView(testId, variant, {
        userId: user?.id,
        timestamp: Date.now()
      })
      trackUserInteraction('test_view', {
        testId,
        variant,
        userId: user?.id
      })
    }
  }, [testId, variant, user, trackUserInteraction])

  const trackClick = useCallback(() => {
    if (variant) {
      ConversionOptimizer.trackClick(testId, variant, {
        userId: user?.id,
        timestamp: Date.now()
      })
      trackUserInteraction('test_click', {
        testId,
        variant,
        userId: user?.id
      })
    }
  }, [testId, variant, user, trackUserInteraction])

  const trackConversion = useCallback((data = {}) => {
    if (variant) {
      ConversionOptimizer.trackConversion(testId, variant, {
        userId: user?.id,
        timestamp: Date.now(),
        ...data
      })
      trackUserInteraction('test_conversion', {
        testId,
        variant,
        userId: user?.id,
        ...data
      })
    }
  }, [testId, variant, user, trackUserInteraction])

  const getTestResults = useCallback(() => {
    return ConversionOptimizer.getTestResults(testId)
  }, [testId])

  return {
    variant,
    trackView,
    trackClick,
    trackConversion,
    getTestResults
  }
}