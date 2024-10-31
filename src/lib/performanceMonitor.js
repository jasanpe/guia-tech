export class PerformanceMonitor {
  static metrics = {
    FPS: new Array(60).fill(0),
    memory: new Array(60).fill(0),
    networkRequests: new Map(),
    interactions: [],
    errors: []
  };

  static thresholds = {
    FPS: 30,
    memoryUsage: 0.8,
    loadTime: 3000,
    interactionDelay: 100
  };

  static init() {
    if (typeof window === 'undefined') return;

    this.startMonitoring();
    this.setupEventListeners();
    this.monitorNetworkRequests();
  }
  
    static startMonitoring() {
      let lastTime = performance.now()
      let frames = 0
  
      const measure = () => {
        const now = performance.now()
        frames++
  
        if (now >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (now - lastTime))
          this.metrics.FPS.push(fps)
          this.metrics.FPS.shift()
  
          if (performance.memory) {
            const memory = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit
            this.metrics.memory.push(memory)
            this.metrics.memory.shift()
          }
  
          frames = 0
          lastTime = now
  
          this.checkPerformance()
        }
  
        requestAnimationFrame(measure)
      }
  
      requestAnimationFrame(measure)
    }
  
    static setupEventListeners() {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            this.reportIssue('longtask', {
              duration: entry.duration,
              startTime: entry.startTime
            })
          }
        }
      })
  
      observer.observe({ entryTypes: ['longtask'] })
  
      // Monitor user interactions
      const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart']
      interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, (e) => {
          const startTime = performance.now()
          requestAnimationFrame(() => {
            const duration = performance.now() - startTime
            if (duration > this.thresholds.interactionDelay) {
              this.reportIssue('slowInteraction', {
                type: eventType,
                duration,
                target: e.target.tagName
              })
            }
          })
        }, { passive: true })
      })
    }
  
    static monitorNetworkRequests() {
      if (!window.fetch) return
  
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const startTime = performance.now()
        const requestId = Math.random().toString(36).substring(7)
  
        try {
          const response = await originalFetch(...args)
          const duration = performance.now() - startTime
  
          this.metrics.networkRequests.set(requestId, {
            url: args[0],
            duration,
            status: response.status,
            timestamp: Date.now()
          })
  
          if (duration > this.thresholds.loadTime) {
            this.reportIssue('slowRequest', {
              url: args[0],
              duration,
              status: response.status
            })
          }
  
          return response
        } catch (error) {
          this.reportError(error, 'networkError', args[0])
          throw error
        }
      }
    }
  
    static checkPerformance() {
      const currentFPS = this.metrics.FPS[this.metrics.FPS.length - 1]
      if (currentFPS < this.thresholds.FPS) {
        this.reportIssue('lowFPS', { fps: currentFPS })
      }
  
      const currentMemory = this.metrics.memory[this.metrics.memory.length - 1]
      if (currentMemory > this.thresholds.memoryUsage) {
        this.reportIssue('highMemory', { usage: currentMemory })
      }
    }
  
    static reportIssue(type, data) {
      console.warn(`Performance Issue [${type}]:`, data)
      // Aquí implementaremos el envío a un servicio de monitoreo
    }
  
    static reportError(error, context, extra = {}) {
      const errorData = {
        message: error.message,
        stack: error.stack,
        context,
        extra,
        timestamp: Date.now()
      }
  
      this.metrics.errors.push(errorData)
      console.error('Application Error:', errorData)
      // Aquí implementaremos el envío a un servicio de monitoreo
    }

    static reportMetric(name, data) {
      try {
        const metricData = {
          name,
          value: data.value,
          timestamp: Date.now(),
          context: {
            page: typeof window !== 'undefined' ? window.location.pathname : null, // <-- Corrección
            deviceType: this.getDeviceType(), // <-- Asegúrate de que esta función esté definida
            ...data.context
          }
        };
    
        // ... (lógica de categorización de métricas - sin cambios)
    
        // Enviar a Analytics
        if (typeof window !== 'undefined' && window.gtag) { // <-- Corrección
          window.gtag('event', name, {
            ...metricData,
            metric_category: this.getMetricCategory(name)
          });
        }
    
    
      } catch (error) {
        console.error("Error en reportMetric:", error);
        // Manejo adicional de errores, como enviar el error a un servicio de logging
      }
    }
    
    static getDeviceType() { // <-- Función añadida
      if (typeof window === 'undefined') return 'server';
  
      const ua = navigator.userAgent;
      if (/Mobile|Android|iP(hone|od|ad)/i.test(ua)) {
        return 'mobile';
      } else if (/Tablet|iPad/i.test(ua)) {
        return 'tablet';     } else {
        return 'desktop';
      }
    }
    
    // ... Implementa las funciones faltantes: getDeviceType, calculateEngagementTime, etc.
  
    static getMetrics() {
      return {
        fps: {
          current: this.metrics.FPS[this.metrics.FPS.length - 1],
          average: this.metrics.FPS.reduce((a, b) => a + b, 0) / this.metrics.FPS.length
        },
        memory: {
          current: this.metrics.memory[this.metrics.memory.length - 1],
          average: this.metrics.memory.reduce((a, b) => a + b, 0) / this.metrics.memory.length
        },
        network: {
          requests: Array.from(this.metrics.networkRequests.values()),
          averageLoadTime: Array.from(this.metrics.networkRequests.values())
            .reduce((acc, req) => acc + req.duration, 0) / this.metrics.networkRequests.size
        },
        errors: this.metrics.errors
      }
    }
  }