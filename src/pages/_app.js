import { useEffect } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { Metrics } from '../lib/metrics'
import { Performance } from '../lib/performance'
import { Optimization } from '../lib/optimization'
import { ResourceLoader } from '../lib/resourceLoader'
import { ErrorBoundary } from '../lib/errorBoundary'
import { ErrorRecovery } from '../lib/errorRecovery'
import { PerformanceMonitor } from '../lib/performanceMonitor'
import { AutoOptimizer } from '../lib/autoOptimizer'
import { Analytics } from '../lib/analytics'
import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import { NotificationProvider } from '../context/NotificationContext'
import { TooltipProvider } from '../components/ui/tooltip'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Inicializar sistemas
    const initializeSystems = () => {
      try {
        Metrics.trackPerformance()
        Performance.init()
        Optimization.init()
        ResourceLoader.init()
        PerformanceMonitor.init()
        AutoOptimizer.init()
        ErrorRecovery.init()
        Analytics.enableTracking(true)

        trackEvent('system', 'initialization', 'success')
      } catch (error) {
        console.error('Error initializing systems:', error)
        trackEvent('system', 'initialization', 'error')
      }
    }

    initializeSystems()

    // Optimizar basado en la conexión
    AutoOptimizer.optimizeForConnection()

    // Precargar recursos críticos
    ResourceLoader.preloadCriticalResources([
      {
        id: 'layout-styles',
        type: 'style',
        url: '/styles/layout.css',
        priority: ResourceLoader.PRIORITIES.CRITICAL
      },
      {
        id: 'fonts',
        type: 'style',
        url: '/styles/fonts.css',
        priority: ResourceLoader.PRIORITIES.HIGH
      }
    ])

    // Reportar métricas iniciales
    Performance.reportMetric('AppInit', {
      timestamp: Date.now(),
      userAgent: window.navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        type: navigator.connection.type,
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : undefined
    })

    // Observar cambios en la conexión
    const handleConnectionChange = () => {
      if (navigator.connection) {
        Performance.reportMetric('ConnectionChange', {
          type: navigator.connection.type,
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink
        })
        
        trackEvent('system', 'connection_change', navigator.connection.effectiveType)
      }
    }

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange)
    }

    // Limpiar al desmontar
    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange)
      }

      // Reportar métricas finales
      const endMetrics = {
        duration: Date.now() - Metrics.sessionStart,
        pageViews: window.performance.getEntriesByType('navigation').length,
        resourcesLoaded: ResourceLoader.loadedResources.size,
        cacheHits: Optimization.dataCache.size
      }

      Metrics.trackMetric('session_end', endMetrics)
      trackEvent('session', 'end', null, endMetrics.duration)

      // Limpiar caches
      Optimization.cleanCache(Optimization.imageCache, 0)
      Optimization.cleanCache(Optimization.dataCache, 0)
    }
  }, [trackEvent])

  return (
    <ErrorBoundary componentName="App">
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Layout>  {/* Envuelve todo con Layout */}
              <div className="min-h-screen bg-background text-foreground">
                <Component {...pageProps} />
                <div id="portal-root" />
              </div>
            </Layout>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}