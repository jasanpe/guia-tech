export class CachingSystem {
    static cacheStore = new Map()
    static prefetchQueue = new Set()
    static networkStatus = {
      type: 'unknown',
      effectiveType: '4g',
      isOnline: true
    }
  
    static init() {
      if (typeof window === 'undefined') return
  
      // Monitorear conexión
      this.setupNetworkMonitoring()
      
      // Iniciar procesamiento de prefetch
      this.processPrefetchQueue()
  
      // Limpiar caché periódicamente
      this.setupCacheCleanup()
    }
  
    static setupNetworkMonitoring() {
      if ('connection' in navigator) {
        const connection = navigator.connection
  
        this.networkStatus = {
          type: connection.type,
          effectiveType: connection.effectiveType,
          isOnline: navigator.onLine
        }
  
        connection.addEventListener('change', () => {
          this.networkStatus = {
            type: connection.type,
            effectiveType: connection.effectiveType,
            isOnline: navigator.onLine
          }
          this.adjustPrefetchStrategy()
        })
      }
  
      window.addEventListener('online', () => {
        this.networkStatus.isOnline = true
        this.processPrefetchQueue()
      })
  
      window.addEventListener('offline', () => {
        this.networkStatus.isOnline = false
      })
    }
  
    static async cacheData(key, data, options = {}) {
      const {
        ttl = 3600,
        priority = 'normal',
        tags = []
      } = options
  
      const cacheItem = {
        data,
        timestamp: Date.now(),
        expires: Date.now() + (ttl * 1000),
        priority,
        tags,
        hits: 0
      }
  
      this.cacheStore.set(key, cacheItem)
      
      // Si es de alta prioridad, persistir en localStorage
      if (priority === 'high') {
        try {
          localStorage.setItem(
            `cache_${key}`, 
            JSON.stringify(cacheItem)
          )
        } catch (error) {
          console.warn('Error persisting cache:', error)
        }
      }
    }
  
    static getData(key) {
      const item = this.cacheStore.get(key)
      
      if (!item) {
        // Intentar recuperar de localStorage
        try {
          const persisted = localStorage.getItem(`cache_${key}`)
          if (persisted) {
            const item = JSON.parse(persisted)
            if (Date.now() < item.expires) {
              this.cacheStore.set(key, item)
              return item.data
            }
          }
        } catch (error) {
          console.warn('Error reading persisted cache:', error)
        }
        return null
      }
  
      if (Date.now() > item.expires) {
        this.cacheStore.delete(key)
        return null
      }
  
      item.hits++
      return item.data
    }
  
    static prefetch(url, options = {}) {
      if (!this.networkStatus.isOnline) {
        this.prefetchQueue.add({ url, options })
        return
      }
  
      const {
        priority = 'low',
        type = 'data'
      } = options
  
      // No prefetch en conexiones lentas si no es prioritario
      if (
        this.networkStatus.effectiveType === 'slow-2g' && 
        priority !== 'high'
      ) {
        return
      }
  
      switch (type) {
        case 'data':
          this.prefetchData(url, options)
          break
        case 'image':
          this.prefetchImage(url, options)
          break
        case 'page':
          this.prefetchPage(url, options)
          break
      }
    }
  
    static async prefetchData(url, options) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Purpose': 'prefetch' }
        })
        const data = await response.json()
        this.cacheData(url, data, options)
      } catch (error) {
        console.warn('Prefetch failed:', error)
      }
    }
  
    static prefetchImage(url, options) {
      const img = new Image()
      img.src = url
    }
  
    static prefetchPage(url, options) {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    }
  
    static processPrefetchQueue() {
      if (!this.networkStatus.isOnline) return
  
      for (const item of this.prefetchQueue) {
        this.prefetch(item.url, item.options)
        this.prefetchQueue.delete(item)
      }
    }
  
    static setupCacheCleanup() {
      setInterval(() => {
        const now = Date.now()
        
        for (const [key, item] of this.cacheStore) {
          if (now > item.expires) {
            this.cacheStore.delete(key)
            localStorage.removeItem(`cache_${key}`)
          }
        }
  
        // Limpiar items menos usados si el caché es muy grande
        if (this.cacheStore.size > 1000) {
          const items = Array.from(this.cacheStore.entries())
            .sort((a, b) => a[1].hits - b[1].hits)
          
          // Eliminar el 20% menos usado
          items.slice(0, Math.floor(items.length * 0.2))
            .forEach(([key]) => {
              this.cacheStore.delete(key)
              localStorage.removeItem(`cache_${key}`)
            })
        }
      }, 300000) // Cada 5 minutos
    }
  }