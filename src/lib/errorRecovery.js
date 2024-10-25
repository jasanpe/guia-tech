export class ErrorRecovery {
    static errorLog = new Map()
    static recoveryStrategies = new Map()
    static maxRetries = 3
  
    static init() {
      this.setupGlobalErrorHandling()
      this.registerDefaultStrategies()
    }
  
    static setupGlobalErrorHandling() {
      if (typeof window === 'undefined') return
  
      window.onerror = (message, source, lineno, colno, error) => {
        this.handleError(error, 'global', { source, lineno, colno })
        return false
      }
  
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason, 'promise')
      })
    }
  
    static registerDefaultStrategies() {
      // Estrategia para errores de red
      this.registerStrategy('network', async (error, context) => {
        const maxRetries = 3
        const retryDelay = 1000
  
        for (let i = 0; i < maxRetries; i++) {
          try {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
            const response = await fetch(context.url)
            if (response.ok) return response
          } catch (retryError) {
            if (i === maxRetries - 1) throw retryError
          }
        }
      })
  
      // Estrategia para errores de recursos
      this.registerStrategy('resource', (error, context) => {
        if (context.type === 'image') {
          const img = context.element
          img.src = img.dataset.fallback || '/placeholder.jpg'
        }
      })
  
      // Estrategia para errores de estado
      this.registerStrategy('state', (error, context) => {
        if (context.store) {
          context.store.reset()
        }
      })
    }
  
    static registerStrategy(type, handler) {
      this.recoveryStrategies.set(type, handler)
    }
  
    static async handleError(error, type, context = {}) {
      const errorKey = this.getErrorKey(error, type)
      const errorEntry = this.errorLog.get(errorKey) || {
        count: 0,
        lastOccurrence: null,
        recoveryAttempts: 0
      }
  
      errorEntry.count++
      errorEntry.lastOccurrence = Date.now()
      this.errorLog.set(errorKey, errorEntry)
  
      // Reportar error
      PerformanceMonitor.reportError(error, type, context)
  
      // Intentar recuperación si hay una estrategia disponible
      if (this.recoveryStrategies.has(type) && errorEntry.recoveryAttempts < this.maxRetries) {
        try {
          await this.recoveryStrategies.get(type)(error, context)
          errorEntry.recoveryAttempts++
          return true
        } catch (recoveryError) {
          PerformanceMonitor.reportError(recoveryError, 'recovery', {
            originalError: error,
            type,
            context
          })
        }
      }
  
      return false
    }
  
    static getErrorKey(error, type) {
      return `${type}:${error.message}`
    }
  
    static async retryOperation(operation, options = {}) {
      const {
        maxRetries = 3,
        delay = 1000,
        backoff = 2,
        onRetry = null
      } = options
  
      let lastError
  
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await operation()
        } catch (error) {
          lastError = error
          
          if (attempt === maxRetries - 1) {
            throw error
          }
  
          const retryDelay = delay * Math.pow(backoff, attempt)
          if (onRetry) {
            onRetry(error, attempt, retryDelay)
          }
  
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }
  
    static clearErrorLog() {
      this.errorLog.clear()
    }
  
    static getErrorStats() {
      const stats = {
        total: 0,
        byType: {},
        recentErrors: []
      }
  
      for (const [key, entry] of this.errorLog) {
        const [type] = key.split(':')
        stats.total += entry.count
        stats.byType[type] = (stats.byType[type] || 0) + entry.count
        
        if (Date.now() - entry.lastOccurrence < 3600000) { // última hora
          stats.recentErrors.push({
            type,
            count: entry.count,
            lastOccurrence: entry.lastOccurrence
          })
        }
      }
  
      return stats
    }
  }