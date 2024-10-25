export const AffiliateConfig = {
    amazon: {
      trackingId: 'guiatech-21', // Tu ID de afiliado de Amazon
      baseUrl: 'https://www.amazon.es',
      regions: {
        ES: {
          domain: 'amazon.es',
          trackingId: 'guiatech-21'
        },
        // Añadir más regiones cuando escalemos
      },
      categories: {
        smartphones: {
          commission: 3,
          cookieLength: 24 // horas
        },
        laptops: {
          commission: 2.5,
          cookieLength: 24
        },
        accessories: {
          commission: 4,
          cookieLength: 24
        }
      },
      // URLs específicas que necesitamos para la API
      apiEndpoints: {
        search: '/s',
        product: '/dp'
      },
      // Parámetros de tracking
      trackingParams: {
        tag: 'tag',
        linkCode: 'linkCode',
        ref: 'ref',
        language: 'language'
      }
    },
    // Otros afiliados que añadiremos después
    pccomponentes: {
      trackingId: 'guiatech',
      baseUrl: 'https://www.pccomponentes.com'
    },
    mediamarkt: {
      trackingId: 'guiatech',
      baseUrl: 'https://www.mediamarkt.es'
    }
  }
  
  export const generateAffiliateLink = (store, productId, options = {}) => {
    const config = AffiliateConfig[store]
    if (!config) throw new Error(`Store ${store} not found`)
  
    const {
      customParams = {},
      campaign = 'default',
      position = null
    } = options
  
    switch (store) {
      case 'amazon':
        const baseUrl = `${config.baseUrl}/dp/${productId}`
        const params = new URLSearchParams({
          tag: config.trackingId,
          linkCode: 'ogi',
          language: 'es_ES',
          ref: campaign,
          ...customParams
        })
        if (position) params.append('pos', position)
        return `${baseUrl}?${params.toString()}`
  
      case 'pccomponentes':
        return `${config.baseUrl}/${productId}?afil=${config.trackingId}`
  
      case 'mediamarkt':
        return `${config.baseUrl}/${productId}?igcref=${config.trackingId}`
  
      default:
        return null
    }
  }
  
  export const getCommissionRate = (store, category) => {
    const config = AffiliateConfig[store]
    if (!config || !config.categories) return null
    return config.categories[category]?.commission || config.defaultCommission || 3
  }
  
  export const validateAffiliateLink = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }