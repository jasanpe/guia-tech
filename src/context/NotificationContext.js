import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const NotificationContext = createContext()

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [isPaused, setIsPaused] = useState(false)

  // Limpiar notificaciones cuando el componente se desmonta
  useEffect(() => {
    return () => setNotifications([])
  }, [])

  const showNotification = useCallback(({ type = 'info', message, duration = 5000 }) => {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      type = 'info'
    }

    const id = Date.now()
    
    setNotifications(current => [
      ...current,
      {
        id,
        type,
        message,
        duration,
        timestamp: new Date().toISOString()
      }
    ])

    if (duration !== Infinity) {
      setTimeout(() => {
        setNotifications(current =>
          current.filter(notification => notification.id !== id)
        )
      }, duration)
    }

    return id // Retornar el ID para poder eliminar la notificación manualmente
  }, [])

  const hideNotification = useCallback((id) => {
    setNotifications(current =>
      current.filter(notification => notification.id !== id)
    )
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const pauseNotifications = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeNotifications = useCallback(() => {
    setIsPaused(false)
  }, [])

  const getNotificationStyle = (type) => {
    const baseStyle = "mb-2 p-4 rounded-lg shadow-lg text-white flex justify-between items-center"
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return `${baseStyle} bg-green-500`
      case NOTIFICATION_TYPES.ERROR:
        return `${baseStyle} bg-red-500`
      case NOTIFICATION_TYPES.WARNING:
        return `${baseStyle} bg-yellow-500`
      default:
        return `${baseStyle} bg-blue-500`
    }
  }

  const value = {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications,
    pauseNotifications,
    resumeNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {!isPaused && notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={getNotificationStyle(notification.type)}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => hideNotification(notification.id)}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                aria-label="Cerrar notificación"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider')
  }
  return context
}

export { NOTIFICATION_TYPES }