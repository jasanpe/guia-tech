export class Analytics {
    static trackingEnabled = true
    static debugMode = process.env.NODE_ENV === 'development'
  
    static pageView(url) {
      try {
        if (!this.trackingEnabled) return
  
        if (this.debugMode) {
          console.log(`[Analytics] Pageview: ${url}`)
        }
        
        // Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: url,
          })
        }
  
        // Almacenar en el historial de navegación local
        this.storePageView(url)
  
      } catch (error) {
        console.error('[Analytics] Error tracking pageview:', error)
      }
    }
  
    static trackEvent(category, action, label = null, value = null) {
      try {
        if (!this.trackingEnabled) return
  
        const eventData = {
          category,
          action,
          label,
          value,
          timestamp: Date.now(),
          path: window.location.pathname
        }
  
        if (this.debugMode) {
          console.log('[Analytics] Event:', eventData)
        }
  
        // Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
          })
        }
  
        // Almacenar en el historial de eventos local
        this.storeEvent(eventData)
  
      } catch (error) {
        console.error('[Analytics] Error tracking event:', error)
      }
    }
  
    // Almacenamiento local
    static storePageView(url) {
      try {
        const pageViews = JSON.parse(localStorage.getItem('analytics_pageviews') || '[]')
        pageViews.push({
          url,
          timestamp: Date.now()
        })
        
        // Mantener solo los últimos 100 pageviews
        if (pageViews.length > 100) {
          pageViews.shift()
        }
        
        localStorage.setItem('analytics_pageviews', JSON.stringify(pageViews))
      } catch (error) {
        console.error('[Analytics] Error storing pageview:', error)
      }
    }
  
    static storeEvent(eventData) {
      try {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]')
        events.push({
          ...eventData,
          timestamp: Date.now()
        })
        
        // Mantener solo los últimos 100 eventos
        if (events.length > 100) {
          events.shift()
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events))
      } catch (error) {
        console.error('[Analytics] Error storing event:', error)
      }
    }
  
    static getPageViews(limit = 100) {
      try {
        const pageViews = JSON.parse(localStorage.getItem('analytics_pageviews') || '[]')
        return pageViews.slice(-limit)
      } catch (error) {
        console.error('[Analytics] Error getting pageviews:', error)
        return []
      }
    }
  
    static getEvents(limit = 100) {
      try {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]')
        return events.slice(-limit)
      } catch (error) {
        console.error('[Analytics] Error getting events:', error)
        return []
      }
    }
  
    static clearData() {
      try {
        localStorage.removeItem('analytics_pageviews')
        localStorage.removeItem('analytics_events')
      } catch (error) {
        console.error('[Analytics] Error clearing data:', error)
      }
    }
  
    static enableTracking(enable = true) {
      this.trackingEnabled = enable
      try {
        localStorage.setItem('analytics_enabled', enable.toString())
      } catch (error) {
        console.error('[Analytics] Error setting tracking preference:', error)
      }
    }
  
    static isTrackingEnabled() {
      try {
        return localStorage.getItem('analytics_enabled') !== 'false'
      } catch {
        return this.trackingEnabled
      }
    }
  }