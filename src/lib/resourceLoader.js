export class ResourceLoader {
    static PRIORITIES = {
      CRITICAL: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4
    }
  
    static resourceQueue = new Map()
    static loadedResources = new Set()
    static observer = null
  
    static init() {
      if (typeof window === 'undefined') return
  
      this.setupIntersectionObserver()
      this.startQueueProcessor()
    }
  
    static setupIntersectionObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const resourceId = entry.target.dataset.resourceId
              if (resourceId && this.resourceQueue.has(resourceId)) {
                this.loadResource(resourceId)
              }
            }
          })
        },
        { threshold: 0.1 }
      )
    }
  
    static startQueueProcessor() {
      setInterval(() => {
        this.processQueue()
      }, 1000)
    }
  
    static processQueue() {
      const now = Date.now()
      let processed = 0
  
      for (const [id, resource] of this.resourceQueue) {
        if (processed >= 3) break // Limitar procesamiento por batch
  
        if (
          resource.priority === this.PRIORITIES.CRITICAL ||
          (now - resource.queueTime > 5000 && resource.priority === this.PRIORITIES.HIGH)
        ) {
          this.loadResource(id)
          processed++
        }
      }
    }
  
    static async loadResource(id) {
      if (this.loadedResources.has(id)) return
  
      const resource = this.resourceQueue.get(id)
      if (!resource) return
  
      try {
        const result = await this.fetchResource(resource)
        this.loadedResources.add(id)
        this.resourceQueue.delete(id)
        
        if (resource.onLoad) {
          resource.onLoad(result)
        }
      } catch (error) {
        console.error(`Error loading resource ${id}:`, error)
        
        if (resource.onError) {
          resource.onError(error)
        }
      }
    }
  
    static async fetchResource(resource) {
      const { type, url, options = {} } = resource
  
      switch (type) {
        case 'image':
          return this.loadImage(url)
        case 'script':
          return this.loadScript(url)
        case 'style':
          return this.loadStyle(url)
        case 'data':
          return this.loadData(url, options)
        default:
          throw new Error(`Unknown resource type: ${type}`)
      }
    }
  
    static loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })
    }
  
    static loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.async = true
        script.onload = () => resolve(script)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
  
    static loadStyle(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.onload = () => resolve(link)
        link.onerror = reject
        document.head.appendChild(link)
      })
    }
  
    static async loadData(url, options) {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    }
  
    static queueResource(id, resource) {
      if (this.loadedResources.has(id)) return
  
      this.resourceQueue.set(id, {
        ...resource,
        queueTime: Date.now()
      })
  
      if (resource.element && this.observer) {
        this.observer.observe(resource.element)
      }
    }
  
    static preloadCriticalResources(resources) {
      resources.forEach(resource => {
        this.queueResource(resource.id, {
          ...resource,
          priority: this.PRIORITIES.CRITICAL
        })
      })
    }
  }