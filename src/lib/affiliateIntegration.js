export class AffiliateIntegration {
    static config = {
      amazon: {
        trackingId: 'guiatech-21',
        baseUrl: 'https://www.amazon.es',
        // Comisiones por categoría (%)
        commissions: {
          smartphones: 3,
          laptops: 2.5,
          tablets: 3,
          accessories: 4,
          default: 3
        }
      },
      pccomponentes: {
        trackingId: 'guiatech',
        baseUrl: 'https://www.pccomponentes.com',
        commissions: {
          smartphones: 3.5,
          laptops: 3,
          tablets: 3.5,
          accessories: 4.5,
          default: 3
        }
      }
    }
  
    static validateAsin(asin) {
      return /^[A-Z0-9]{10}$/.test(asin)
    }
  
    static generateAmazonUrl(asin, options = {}) {
      if (!this.validateAsin(asin)) {
        throw new Error('Invalid ASIN format')
      }
  
      const {
        campaign = 'default',
        customTrackingId,
        customParameters = {}
      } = options
  
      const params = new URLSearchParams({
        tag: customTrackingId || this.config.amazon.trackingId,
        linkCode: 'ogi',
        language: 'es_ES',
        camp: campaign,
        creative: options.creative || '',
        creativeASIN: asin,
        ...customParameters
      })
  
      return `${this.config.amazon.baseUrl}/dp/${asin}?${params.toString()}`
    }
  
    static calculateCommission(price, category, store = 'amazon') {
      const storeConfig = this.config[store]
      if (!storeConfig) return 0
  
      const commission = storeConfig.commissions[category] || storeConfig.commissions.default
      return (price * commission) / 100
    }
  
    static async checkPrice(asin) {
      // Implementar cuando tengamos la API de Amazon
      return {
        current: null,
        history: [],
        lastChecked: new Date()
      }
    }
  
    static enrichProductData(product, store = 'amazon') {
      if (!product.affiliate_id) return product
  
      const enriched = { ...product }
  
      if (store === 'amazon') {
        enriched.affiliate_url = this.generateAmazonUrl(product.affiliate_id, {
          campaign: product.category,
          creative: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })
      }
  
      enriched.potential_commission = this.calculateCommission(
        product.price,
        product.category,
        store
      )
  
      return enriched
    }
  
    static async batchEnrichProducts(products) {
      return Promise.all(
        products.map(async (product) => {
          try {
            return await this.enrichProductData(product, product.store)
          } catch (error) {
            console.error(`Error enriching product ${product.id}:`, error)
            return product
          }
        })
      )
    }
  
    static getTrackingScript() {
      return `
        window.onAmazonPlatformReady = function() {
          window.amazon_associate_verification = {
            tracking_id: '${this.config.amazon.trackingId}',
            region: 'ES'
          };
        };
      `
    }
  
    static generateProductWidget(asin, type = 'responsive') {
      return `
        <div class="amzn-widget" data-amzn-asin="${asin}" data-amzn-type="${type}">
          <script>
            window.amznWidgets = window.amznWidgets || [];
            window.amznWidgets.push({
              asin: '${asin}',
              type: '${type}',
              trackingId: '${this.config.amazon.trackingId}'
            });
          </script>
        </div>
      `
    }
  
    // Utilidades para manejo de cookies
    static setAffiliateCookie(store, data) {
      const cookieName = `aff_${store}`
      const cookieValue = JSON.stringify({
        ...data,
        timestamp: Date.now()
      })
      
      document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=2592000` // 30 días
    }
  
    static getAffiliateCookie(store) {
      const cookieName = `aff_${store}`
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`))
      
      if (!cookie) return null
      
      try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]))
      } catch {
        return null
      }
    }
  
    // Sistema de caché de precios
    static priceCache = new Map()
  
    static async getPriceData(productId, store = 'amazon') {
      const cacheKey = `${store}_${productId}`
      const cached = this.priceCache.get(cacheKey)
  
      if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hora
        return cached.data
      }
  
      // Aquí implementaremos la obtención real de precios
      const priceData = await this.checkPrice(productId)
      
      this.priceCache.set(cacheKey, {
        data: priceData,
        timestamp: Date.now()
      })
  
      return priceData
    }
  
    // Reporting y analytics
    static async generateAffiliateReport(startDate, endDate) {
      // Implementar cuando tengamos acceso a la API de Amazon
      return {
        totalSales: 0,
        totalCommissions: 0,
        byCategory: {},
        topProducts: []
      }
    }
  }