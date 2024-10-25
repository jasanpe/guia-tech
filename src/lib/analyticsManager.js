import { ContentManager } from './contentManager'

export class AnalyticsManager {
  static events = {
    PAGE_VIEW: 'page_view',
    SCROLL_DEPTH: 'scroll_depth',
    AFFILIATE_CLICK: 'affiliate_click',
    PRODUCT_VIEW: 'product_view',
    COMPARISON_VIEW: 'comparison_view',
    GUIDE_VIEW: 'guide_view',
    SEARCH: 'search',
    NAVIGATION: 'navigation',
    USER_ENGAGEMENT: 'user_engagement',
    CONVERSION: 'conversion'
  }

  static conversions = {
    AFFILIATE_CLICK: 'affiliate_click',
    NEWSLETTER_SIGNUP: 'newsletter_signup',
    PRICE_ALERT: 'price_alert',
    ACCOUNT_CREATION: 'account_creation'
  }

  static init() {
    if (typeof window === 'undefined') return

    // Configurar Google Analytics 4
    this.initGA4()
    
    // Iniciar tracking de scroll
    this.initScrollTracking()
    
    // Iniciar tracking de engagement
    this.initEngagementTracking()
    
    // Iniciar tracking de afiliados
    this.initAffiliateTracking()
  }

  static initGA4() {
    // Google Analytics 4
    window.dataLayer = window.dataLayer || []
    function gtag(){window.dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      send_page_view: false // Manejaremos las vistas de página manualmente
    })
  }

  static trackPageView(url, metadata = {}) {
    const contentType = this.getContentType(url)
    const eventData = {
      page_location: url,
      page_title: document.title,
      content_type: contentType,
      ...metadata
    }

    // Google Analytics 4
    gtag('event', 'page_view', eventData)

    // Tracking interno
    this.logEvent('page_view', eventData)

    // Iniciar tracking de tiempo en página
    this.startTimeOnPage()
  }

  static trackEvent(eventName, eventData = {}) {
    const enrichedData = {
      ...eventData,
      timestamp: Date.now(),
      page_location: window.location.pathname,
      user_type: this.getUserType()
    }

    // Google Analytics 4
    gtag('event', eventName, enrichedData)

    // Tracking interno
    this.logEvent(eventName, enrichedData)
  }

  static trackConversion(type, data = {}) {
    const conversionData = {
      conversion_type: type,
      value: data.value || 0,
      currency: data.currency || 'EUR',
      ...data
    }

    // Google Analytics 4
    gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_CONVERSION_ID,
      ...conversionData
    })

    // Tracking interno
    this.logConversion(type, conversionData)
  }

  static trackAffiliateClick(productData) {
    const eventData = {
      product_id: productData.id,
      product_name: productData.title,
      product_category: productData.category,
      price: productData.price,
      store: productData.store,
      position: productData.position,
      list_name: this.getContentType(window.location.pathname)
    }

    // Track como evento
    this.trackEvent(this.events.AFFILIATE_CLICK, eventData)

    // Track como conversión
    this.trackConversion(this.conversions.AFFILIATE_CLICK, {
      value: this.calculateCommissionValue(productData),
      ...eventData
    })
  }

  static initScrollTracking() {
    let maxScroll = 0
    let trackedDepths = new Set()

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollPercent = this.getScrollDepth()
        maxScroll = Math.max(maxScroll, scrollPercent)

        // Trackear profundidad de scroll en incrementos de 25%
        const depth = Math.floor(scrollPercent / 25) * 25
        if (depth > 0 && !trackedDepths.has(depth)) {
          trackedDepths.add(depth)
          this.trackEvent(this.events.SCROLL_DEPTH, { depth })
        }
      })
    })
  }

  static initEngagementTracking() {
    let startTime = Date.now()
    let lastActive = startTime
    let isActive = true

    // Detectar si el usuario está activo
    const resetActivity = () => {
      if (!isActive) {
        isActive = true
        startTime = Date.now()
      }
      lastActive = Date.now()
    }

    // Eventos de actividad
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, resetActivity, { passive: true })
    })

    // Verificar inactividad cada 5 segundos
    setInterval(() => {
      if (isActive && Date.now() - lastActive > 30000) { // 30 segundos sin actividad
        isActive = false
        this.trackEngagementTime(startTime)
      }
    }, 5000)

    // Trackear al cerrar la página
    window.addEventListener('beforeunload', () => {
      if (isActive) {
        this.trackEngagementTime(startTime)
      }
    })
  }

  static initAffiliateTracking() {
    // Interceptar clicks en enlaces de afiliados
    document.addEventListener('click', (e) => {
      const affiliateLink = e.target.closest('a[data-affiliate]')
      if (affiliateLink) {
        e.preventDefault()
        
        const productData = JSON.parse(affiliateLink.dataset.affiliate)
        this.trackAffiliateClick(productData)

        // Redirigir después del tracking
        setTimeout(() => {
          window.open(affiliateLink.href, '_blank')
        }, 100)
      }
    })
  }

  static trackEngagementTime(startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    this.trackEvent(this.events.USER_ENGAGEMENT, {
      duration,
      page_path: window.location.pathname
    })
  }

  static getScrollDepth() {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset
    return (scrollTop / (documentHeight - windowHeight)) * 100
  }

  static getUserType() {
    // Implementar lógica de tipo de usuario
    return 'anonymous'
  }

  static getContentType(url) {
    if (url.includes('/reviews/')) return 'review'
    if (url.includes('/comparativas/')) return 'comparison'
    if (url.includes('/guias/')) return 'guide'
    return 'other'
  }

  static calculateCommissionValue(productData) {
    const commissionRates = {
      amazon: 0.03,
      pccomponentes: 0.04,
      mediamarkt: 0.02
    }
    
    return productData.price * (commissionRates[productData.store] || 0.03)
  }

  static logEvent(name, data) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${name}:`, data)
    }
    // Aquí implementaremos el almacenamiento de eventos
  }

  static logConversion(type, data) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Conversion] ${type}:`, data)
    }
    // Aquí implementaremos el almacenamiento de conversiones
  }
}