export class Metrics {
  static sessionStart = Date.now();
  static defaultSettings = {}; // Configuración por defecto

  static restoreDefaultSettings() {
    // Implementación del método
    Object.assign(this, this.defaultSettings);
  }

  static async trackMetric(name, value, metadata = {}) {
    try {
      const metric = {
        name,
        value,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.sessionStart,
        ...metadata,
      };
      console.log('[Metrics]', metric);
      // Aquí puedes enviar las métricas a tu servicio de monitoreo
    } catch (error) {
      console.error('[Metrics] Error:', error);
    }
  }

  static trackPerformance() {
    if (typeof window === 'undefined') return;

    // Importación dinámica de web-vitals
    import('web-vitals')
      .then(({ onLCP, onFID, onCLS }) => {
        onLCP((metric) => this.trackMetric('LCP', metric.value));
        onFID((metric) => this.trackMetric('FID', metric.value));
        onCLS((metric) => this.trackMetric('CLS', metric.value));
      })
      .catch((error) => {
        console.error('[Metrics] Error importing web-vitals:', error);
      });
  }
}
