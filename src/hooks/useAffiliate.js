import { useCallback, useMemo } from 'react'
import { AffiliateManager } from '../lib/affiliateManager'
import { useAnalytics } from './useAnalytics'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { PriceMonitor } from '../lib/priceMonitor'

export function useAffiliate() {
  const analytics = useAnalytics()
  const { user } = useAuth()
  const { showNotification } = useNotification()

  const generateAffiliateLink = useCallback((productId, storeId, options = {}) => {
    try {
      // Generar el enlace de afiliado con datos mejorados
      const link = AffiliateManager.generateLink(productId, storeId, {
        ...options,
        userId: user?.id,
        timestamp: Date.now(),
        source: options.source || 'website',
        campaign: options.campaign || 'default',
        position: options.position,
        category: options.category,
        pricePoint: options.price ? 
          options.price > 500 ? 'high' : 
          options.price > 100 ? 'medium' : 'low' 
          : null
      })

      // Trackeo mejorado
      analytics.trackEvent('affiliate_link_generated', {
        productId,
        storeId,
        userId: user?.id,
        sessionId: AffiliateManager.getSessionId(),
        conversionPotential: options.price ? options.price * AffiliateManager.getCommissionRate(storeId, options.category) / 100 : null,
        ...options
      })

      return link
    } catch (error) {
      console.error('Error generating affiliate link:', error)
      showNotification({
        type: 'error',
        message: 'Error al generar el enlace de afiliado'
      })
      return null
    }
  }, [user, analytics, showNotification])

  const trackAffiliateClick = useCallback(async (productId, storeId, data = {}) => {
    try {
      // Validación mejorada
      const [isValidProduct, priceData] = await Promise.all([
        AffiliateManager.validateProduct(productId, storeId),
        PriceMonitor.getPriceAnalytics(productId)
      ])

      if (!isValidProduct) {
        throw new Error('Producto no válido o no disponible')
      }

      // Click data mejorado
      const clickData = AffiliateManager.trackClick(productId, storeId, {
        userId: user?.id,
        timestamp: Date.now(),
        device: navigator?.userAgent,
        referrer: document?.referrer,
        priceAtClick: priceData?.currentPrice,
        priceHistory: priceData?.history,
        competitorPrices: priceData?.competitors,
        ...data
      })

      // Analytics mejorado
      analytics.trackEvent('affiliate_link_click', {
        productId,
        storeId,
        userId: user?.id,
        sessionId: clickData.sessionId,
        conversionValue: data.price,
        priceScore: priceData ? calculatePriceScore(priceData) : null,
        purchaseIntent: calculatePurchaseIntent(clickData),
        ...data
      })

      // Atribución mejorada
      AffiliateManager.storeAttributionData({
        ...clickData,
        priceData,
        intentScore: calculatePurchaseIntent(clickData)
      })

      return true
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
      return false
    }
  }, [user, analytics])

  // Función auxiliar para calcular score de precio
  const calculatePriceScore = (priceData) => {
    if (!priceData) return null
    
    const currentPrice = priceData.currentPrice
    const lowestPrice = priceData.history.reduce((min, p) => Math.min(min, p.price), Infinity)
    const averagePrice = priceData.history.reduce((sum, p) => sum + p.price, 0) / priceData.history.length
    
    return {
      vsLowest: ((currentPrice - lowestPrice) / lowestPrice) * 100,
      vsAverage: ((currentPrice - averagePrice) / averagePrice) * 100,
      isGoodTime: currentPrice <= averagePrice
    }
  }

  // Función auxiliar para calcular intención de compra
  const calculatePurchaseIntent = (clickData) => {
    let score = 0
    
    // Factores que aumentan la intención
    if (clickData.priceAtClick < clickData.priceHistory?.average) score += 2
    if (clickData.timeOnPage > 120) score += 1
    if (clickData.pageViews > 3) score += 1
    if (clickData.returningUser) score += 1
    if (clickData.addedToWishlist) score += 2
    
    return score
  }

  // Mantener el resto de funciones existentes...
  const getStoreInfo = useCallback((storeId) => {
    return AffiliateManager.getStoreInfo(storeId)
  }, [])

  const getAffiliateStats = useCallback(() => {
    return AffiliateManager.getClickStats()
  }, [])

  const getPriceHistory = useCallback(async (productId, storeId) => {
    try {
      return await AffiliateManager.getPriceHistory(productId, storeId)
    } catch (error) {
      console.error('Error getting price history:', error)
      return []
    }
  }, [])

  const checkAvailability = useCallback(async (productId, storeId) => {
    try {
      return await AffiliateManager.checkAvailability(productId, storeId)
    } catch (error) {
      console.error('Error checking availability:', error)
      return null
    }
  }, [])

  const getBestPrice = useCallback(async (productId) => {
    try {
      const prices = await AffiliateManager.getAllStorePrices(productId)
      return prices.sort((a, b) => a.price - b.price)[0] || null
    } catch (error) {
      console.error('Error getting best price:', error)
      return null
    }
  }, [])

  // Stores memoizados
  const stores = useMemo(() => AffiliateManager.getAllStores(), [])

  // Cálculo de comisiones
  const calculateCommission = useCallback((price, storeId, category) => {
    return AffiliateManager.calculateCommission(price, storeId, category)
  }, [])

  return {
    generateAffiliateLink,
    trackAffiliateClick,
    getStoreInfo,
    getAffiliateStats,
    getPriceHistory,
    checkAvailability,
    getBestPrice,
    calculateCommission,
    stores,
    isValidStore: AffiliateManager.isValidStore,
    formatAffiliateUrl: AffiliateManager.formatUrl,
    getCommissionRate: AffiliateManager.getCommissionRate
  }
}