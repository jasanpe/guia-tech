import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = Date.now()
    
    setNotifications(current => [
      ...current,
      { id, type, message }
    ])

    setTimeout(() => {
      setNotifications(current =>
        current.filter(notification => notification.id !== id)
      )
    }, duration)
  }, [])

  const hideNotification = useCallback((id) => {
    setNotifications(current =>
      current.filter(notification => notification.id !== id)
    )
  }, [])

  const value = {
    notifications,
    showNotification,
    hideNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Renderizar notificaciones */}
      <div className="fixed bottom-4 right-4 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-2 p-4 rounded-lg shadow-lg ${
              notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'success' ? 'bg-green-500' :
              'bg-blue-500'
            } text-white`}
          >
            {notification.message}
            <button
              onClick={() => hideNotification(notification.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        ))}
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