export class AffiliateManager {
    static stores = {
      amazon: {
        id: 'amazon',
        name: 'Amazon',
        trackingId: 'guiatech-21',
        baseUrl: 'https://www.amazon.es',
        generateUrl: (asin) => 
          `https://www.amazon.es/dp/${asin}?tag=guiatech-21&linkCode=ogi&th=1&psc=1`
      },
      pccomponentes: {
        id: 'pccomponentes',
        name: 'PcComponentes',
        trackingId: 'guiatech',
        baseUrl: 'https://www.pccomponentes.com',
        generateUrl: (slug) => 
          `https://www.pccomponentes.com/${slug}?afil=guiatech`
      },
      aliexpress: {
        id: 'aliexpress',
        name: 'AliExpress',
        trackingId: 'guiatech',
        baseUrl: 'https://s.click.aliexpress.com',
        generateUrl: (productId) =>
          `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=guiatech&dl_target_url=https://www.aliexpress.com/item/${productId}.html`
      }
    }
  
    static clickTracking = new Map()
  
    static trackClick(productId, storeId, data = {}) {
      const click = {
        timestamp: Date.now(),
        productId,
        storeId,
        ...data,
        sessionId: this.getSessionId(),
        referrer: document?.referrer || 'direct'
      }
  
      this.clickTracking.set(`${productId}_${Date.now()}`, click)
      this.saveClickData(click)
  
      return click
    }
  
    static getSessionId() {
      let sessionId = sessionStorage.getItem('affiliate_session')
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('affiliate_session', sessionId)
      }
      return sessionId
    }
  
    static saveClickData(click) {
      try {
        const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]')
        clicks.push(click)
        
        // Mantener solo los últimos 100 clicks
        if (clicks.length > 100) clicks.shift()
        
        localStorage.setItem('affiliate_clicks', JSON.stringify(clicks))
      } catch (error) {
        console.error('Error saving affiliate click:', error)
      }
    }
  
    static generateLink(productId, storeId, options = {}) {
      const store = this.stores[storeId]
      if (!store) throw new Error(`Store ${storeId} not found`)
  
      const url = store.generateUrl(productId)
      
      // Añadir parámetros de tracking
      const urlObj = new URL(url)
      urlObj.searchParams.append('utm_source', 'guiatech')
      urlObj.searchParams.append('utm_medium', options.medium || 'web')
      urlObj.searchParams.append('utm_campaign', options.campaign || 'product')
      
      if (options.position) {
        urlObj.searchParams.append('utm_content', options.position)
      }
  
      return urlObj.toString()
    }
  
    static async validateLink(url) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        return response.ok
      } catch {
        return false
      }
    }
  
    static getStoreInfo(storeId) {
      return this.stores[storeId] || null
    }
  
    static getAllStores() {
      return Object.values(this.stores)
    }
  
    static getClickStats() {
      try {
        const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]')
        return {
          total: clicks.length,
          byStore: clicks.reduce((acc, click) => {
            acc[click.storeId] = (acc[click.storeId] || 0) + 1
            return acc
          }, {}),
          lastDay: clicks.filter(click => 
            Date.now() - click.timestamp < 24 * 60 * 60 * 1000
          ).length
        }
      } catch {
        return { total: 0, byStore: {}, lastDay: 0 }
      }
    }
  

  static getCommissionRate(storeId, category) {
    // Tasas de comisión por tienda y categoría
    const rates = {
      amazon: {
        smartphones: 3,
        audio: 4,
        computers: 2.5,
        default: 3
      },
      pccomponentes: {
        smartphones: 2,
        audio: 3,
        computers: 4,
        default: 2.5
      },
      aliexpress: {
        default: 5
      }
    }

    return rates[storeId]?.[category] || rates[storeId]?.default || 0
  }

  static validateProduct(productId, storeId) {
    // Por ahora retornamos true, implementar validación real cuando tengamos APIs
    return Promise.resolve(true)
  }

  static storeAttributionData(data) {
    try {
      const attributions = JSON.parse(localStorage.getItem('affiliate_attributions') || '[]')
      attributions.push({
        ...data,
        timestamp: Date.now()
      })
      
      // Mantener solo las últimas 50 atribuciones
      if (attributions.length > 50) attributions.shift()
      
      localStorage.setItem('affiliate_attributions', JSON.stringify(attributions))
    } catch (error) {
      console.error('Error storing attribution data:', error)
    }
  }

  static isValidStore(storeId) {
    return !!this.stores[storeId]
  }

  static formatUrl(url, options = {}) {
    try {
      const urlObj = new URL(url)
      Object.entries(options).forEach(([key, value]) => {
        if (value) urlObj.searchParams.append(key, value)
      })
      return urlObj.toString()
    } catch {
      return url
    }
  }

  static async getPriceHistory(productId, storeId) {
    // Mock de historial de precios por ahora
    return Promise.resolve([
      { date: Date.now() - 86400000 * 30, price: 1499 },
      { date: Date.now() - 86400000 * 20, price: 1399 },
      { date: Date.now() - 86400000 * 10, price: 1299 },
      { date: Date.now(), price: 1299 }
    ])
  }

  static async checkAvailability(productId, storeId) {
    // Mock de disponibilidad por ahora
    return Promise.resolve({
      available: true,
      stock: 5,
      shipping: "Envío gratis"
    })
  }

  static async getAllStorePrices(productId) {
    // Mock de precios por tienda
    return Promise.resolve([
      { store: 'amazon', price: 1299, available: true },
      { store: 'pccomponentes', price: 1349, available: true },
      { store: 'aliexpress', price: 1199, available: false }
    ])
  }

  static calculateCommission(price, storeId, category) {
    const rate = this.getCommissionRate(storeId, category)
    return (price * rate) / 100
  }
}
