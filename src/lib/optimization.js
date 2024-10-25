export class Optimization {
    static CACHE_VERSION = 1
    static imageCache = new Map()
    static dataCache = new Map()
  
    static init() {
      if (typeof window === 'undefined') return
      
      // Prefetch de recursos críticos
      this.prefetchCriticalResources()
      
      // Limpieza periódica de caché
      this.setupCacheCleanup()
    }
  
    static prefetchCriticalResources() {
      const criticalPaths = [
        '/api/categories',
        '/api/latest-articles'
      ]
  
      criticalPaths.forEach(path => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = path
        document.head.appendChild(link)
      })
    }
  
    static setupCacheCleanup() {
      setInterval(() => {
        this.cleanCache(this.imageCache, 300) // 5 minutos
        this.cleanCache(this.dataCache, 1800) // 30 minutos
      }, 60000) // Revisar cada minuto
    }
  
    static cleanCache(cache, maxAge) {
      const now = Date.now()
      for (const [key, { timestamp }] of cache.entries()) {
        if (now - timestamp > maxAge * 1000) {
          cache.delete(key)
        }
      }
    }
  
    static async preloadImage(src) {
      if (this.imageCache.has(src)) {
        return this.imageCache.get(src).data
      }
  
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          this.imageCache.set(src, {
            data: img,
            timestamp: Date.now()
          })
          resolve(img)
        }
        img.onerror = reject
        img.src = src
      })
    }
  
    static memoize(fn, options = {}) {
      const { maxAge = 300, key = (...args) => args.join('-') } = options
      
      return async (...args) => {
        const cacheKey = key(...args)
        const cached = this.dataCache.get(cacheKey)
        
        if (cached && Date.now() - cached.timestamp < maxAge * 1000) {
          return cached.data
        }
  
        const result = await fn(...args)
        this.dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        })
        
        return result
      }
    }
  }