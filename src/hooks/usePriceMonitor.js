import { useCallback, useEffect, useState } from 'react'
import { PriceMonitor } from '../lib/priceMonitor'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

export function usePriceMonitor(productId) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [priceData, setPriceData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      if (!productId) return

      try {
        const history = await PriceMonitor.getProductHistory(productId)
        if (mounted) {
          setPriceData(history)
          
          if (user) {
            const userAlerts = await PriceMonitor.getUserAlerts(user.id)
            setAlerts(userAlerts.filter(alert => alert.productId === productId))
          }
        }
      } catch (error) {
        console.error('Error loading price data:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => { mounted = false }
  }, [productId, user])

  const createAlert = useCallback(async (conditions) => {
    if (!user) {
      showNotification({
        type: 'warning',
        message: 'Necesitas iniciar sesión para crear alertas de precio'
      })
      return null
    }

    try {
      const alertId = await PriceMonitor.createPriceAlert(user.id, productId, conditions)
      showNotification({
        type: 'success',
        message: 'Alerta de precio creada correctamente'
      })

      const updatedAlerts = await PriceMonitor.getUserAlerts(user.id)
      setAlerts(updatedAlerts.filter(alert => alert.productId === productId))

      return alertId
    } catch (error) {
      console.error('Error creating price alert:', error)
      showNotification({
        type: 'error',
        message: 'Error al crear la alerta de precio'
      })
      return null
    }
  }, [user, productId, showNotification])

  const getPriceAnalytics = useCallback(() => {
    if (!productId) return null
    return PriceMonitor.getPriceAnalytics(productId)
  }, [productId])

  return {
    priceData,
    alerts,
    isLoading,
    createAlert,
    getPriceAnalytics
  }
}