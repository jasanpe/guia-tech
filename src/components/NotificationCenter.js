import { useState } from 'react'
import { Bell, Tag, PriceChange, Clock, X } from 'lucide-react'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'

// Mock de notificaciones para demostración
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'price_drop',
    title: 'Bajada de precio detectada',
    product: 'iPhone 15 Pro Max',
    message: 'El precio ha bajado 100€ (1499€ → 1399€)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    action: {
      label: 'Ver oferta',
      url: '#'
    }
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Nuevo producto recomendado',
    product: 'MacBook Pro M3',
    message: 'Basado en tu interés en portátiles Apple',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    action: {
      label: 'Ver detalles',
      url: '#'
    }
  },
  {
    id: '3',
    type: 'alert',
    title: 'Precio objetivo alcanzado',
    product: 'Samsung S24 Ultra',
    message: 'El precio ha alcanzado tu objetivo de 1200€',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: false,
    action: {
      label: 'Ver precio',
      url: '#'
    }
  }
]

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'price_drops') return n.type === 'price_drop'
    if (filter === 'alerts') return n.type === 'alert'
    return true
  })

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    )
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' años'
    
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' meses'
    
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' días'
    
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' horas'
    
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutos'
    
    return Math.floor(seconds) + ' segundos'
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_drop':
        return <PriceChange className="w-5 h-5 text-green-500" />
      case 'recommendation':
        return <Tag className="w-5 h-5 text-blue-500" />
      case 'alert':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <div className="max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Notificaciones
              </h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marcar todo como leído
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex p-2 gap-2 border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'unread', label: 'No leídas' },
                { id: 'price_drops', label: 'Bajadas de precio' },
                { id: 'alerts', label: 'Alertas' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    filter === f.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay notificaciones
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 font-medium mt-0.5">
                                {notification.product}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              hace {getTimeAgo(notification.timestamp)}
                            </span>
                            {notification.action && (
                              <a
                                href={notification.action.url}
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {notification.action.label}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}