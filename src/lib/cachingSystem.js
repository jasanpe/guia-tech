export class CachingSystem {
  static cache = new Map()
  static maxSize = 100 // Tamaño máximo predeterminado
  
  static set(key, value, ttl = 3600000) { // TTL predeterminado: 1 hora
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  static get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  static reduceCacheSize(factor = 0.5) {
    const currentSize = this.cache.size
    const newSize = Math.floor(currentSize * factor)
    const entriesToRemove = currentSize - newSize

    if (entriesToRemove <= 0) return

    // Convertir el iterador a array para poder ordenar
    const entries = Array.from(this.cache.entries())
    
    // Ordenar por timestamp (más antiguos primero)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    // Eliminar las entradas más antiguas
    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0])
    }
  }

  static clear() {
    this.cache.clear()
  }

  static evictOldest() {
    const oldestKey = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
    this.cache.delete(oldestKey)
  }

  static setMaxSize(size) {
    this.maxSize = size
    if (this.cache.size > size) {
      this.reduceCacheSize(size / this.cache.size)
    }
  }

  static getSize() {
    return this.cache.size
  }

  static cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}