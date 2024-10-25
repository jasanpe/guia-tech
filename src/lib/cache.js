export class LocalCache {
    constructor(prefix = 'guia-tech_') {
      this.prefix = prefix
    }
  
    key(key) {
      return `${this.prefix}${key}`
    }
  
    set(key, data, ttl = 3600) {
      const item = {
        data,
        expires: Date.now() + (ttl * 1000)
      }
      localStorage.setItem(this.key(key), JSON.stringify(item))
    }
  
    get(key) {
      const item = localStorage.getItem(this.key(key))
      if (!item) return null
  
      const { data, expires } = JSON.parse(item)
      if (Date.now() > expires) {
        this.delete(key)
        return null
      }
  
      return data
    }
  
    delete(key) {
      localStorage.removeItem(this.key(key))
    }
  
    clear() {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key))
    }
  }