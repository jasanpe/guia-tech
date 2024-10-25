import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Analytics } from '../lib/analytics'
import { PerformanceMonitor } from '../lib/performanceMonitor'

export function useAnalytics() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      Analytics.pageView(url)

      // Reportar métricas de navegación
      PerformanceMonitor.reportMetric('navigation', {
        url,
        timing: performance.now()
      })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    // Registrar la vista de página inicial
    handleRouteChange(window.location.pathname)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const trackEvent = useCallback((category, action, label = null, value = null) => {
    Analytics.trackEvent(category, action, label, value)
  }, [])

  const trackConversion = useCallback((type, data = {}) => {
    Analytics.trackEvent('conversion', type, null, data.value)
    PerformanceMonitor.reportMetric('conversion', {
      type,
      ...data
    })
  }, [])

  const trackEngagement = useCallback((data = {}) => {
    Analytics.trackEvent('engagement', 'user_interaction', null, data.duration)
  }, [])

  return {
    Analytics,
    trackEvent,
    trackConversion,
    trackEngagement
  }
}