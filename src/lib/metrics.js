export class Metrics {
    static sessionStart = Date.now()
  
    static async trackMetric(name, value, metadata = {}) {
      try {
        const metric = {
          name,
          value,
          timestamp: Date.now(),
          sessionDuration: Date.now() - this.sessionStart,
          ...metadata
        }
  
        // Aquí implementaremos el envío real a un servicio de métricas
        console.log('[Metrics]', metric)
      } catch (error) {
        console.error('[Metrics] Error:', error)
      }
    }
  
    static trackPerformance() {
      if (typeof window === 'undefined') return
  
      // Métricas web vitals
      const { getLCP, getFID, getCLS } = require('web-vitals')
  
      getLCP(metric => this.trackMetric('LCP', metric.value))
      getFID(metric => this.trackMetric('FID', metric.value))
      getCLS(metric => this.trackMetric('CLS', metric.value))
    }
  }