import { useCallback } from 'react'
import { Metrics } from '../lib/metrics'

export function useMetrics() {
  const trackUserInteraction = useCallback((action, metadata = {}) => {
    Metrics.trackMetric('user_interaction', 1, {
      action,
      ...metadata
    })
  }, [])

  const trackEngagement = useCallback((section, duration) => {
    Metrics.trackMetric('engagement_time', duration, {
      section
    })
  }, [])

  const trackError = useCallback((error, context) => {
    Metrics.trackMetric('error', 1, {
      error: error.message,
      context
    })
  }, [])

  return {
    trackUserInteraction,
    trackEngagement,
    trackError
  }
}