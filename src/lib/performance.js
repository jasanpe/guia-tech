export class Performance {
  static metrics = {
    FCP: null,  // First Contentful Paint
    LCP: null,  // Largest Contentful Paint
    FID: null,  // First Input Delay
    CLS: null,  // Cumulative Layout Shift
    TTI: null   // Time to Interactive
  };

  static init() {
    if (typeof window === 'undefined') return;

    // Observar Web Vitals
    this.observeWebVitals();

    // Observar métricas de navegación
    this.observeNavigation();

    // Observar carga de recursos
    this.observeResources();
  }

  static observeWebVitals() {
    if (typeof window === 'undefined') return;

    import('web-vitals')
      .then(({ onLCP, onFID, onCLS }) => {
        onLCP((metric) => {
          this.metrics.LCP = metric.value;
          this.reportMetric('LCP', metric);
        });

        onFID((metric) => {
          this.metrics.FID = metric.value;
          this.reportMetric('FID', metric);
        });

        onCLS((metric) => {
          this.metrics.CLS = metric.value;
          this.reportMetric('CLS', metric);
        });
      })
      .catch((error) => {
        console.error('Error importing web-vitals:', error);
      });
  }

  static observeNavigation() {
    if (typeof window === 'undefined' || !performance || !performance.getEntriesByType) return;

    window.addEventListener('load', () => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      this.reportMetric('Navigation', {
        dnsTime: navEntry.domainLookupEnd - navEntry.domainLookupStart,
        connectTime: navEntry.connectEnd - navEntry.connectStart,
        responseTime: navEntry.responseEnd - navEntry.responseStart,
        domLoadTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
        loadTime: navEntry.loadEventEnd - navEntry.loadEventStart
      });
    });
  }

  static observeResources() {
    if (typeof window === 'undefined' || !performance || !performance.getEntriesByType) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
          this.reportMetric('APICall', {
            url: entry.name,
            duration: entry.duration,
            size: entry.transferSize
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  static reportMetric(name, data) {
    console.log(`[Performance] ${name}:`, data);
    // Implementa aquí el envío a un servicio de monitoreo si lo deseas
  }
}
