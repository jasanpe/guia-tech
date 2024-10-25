import { useState } from 'react'
import { Camera } from 'lucide-react'

// Mock data - En una implementación real vendría de la API
const MOCK_SAVED_PRODUCTS = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB',
    currentPrice: 1299,
    originalPrice: 1499,
    targetPrice: 1200,
    notifyOnAnyDrop: true,
    store: 'Amazon',
    image: null,
    category: 'smartphone',
    lastUpdated: '2024-10-23T14:30:00'
  },
  {
    id: '2',
    title: 'MacBook Pro M3 14"',
    currentPrice: 1999,
    originalPrice: 1999,
    targetPrice: 1800,
    notifyOnAnyDrop: false,
    store: 'Apple Store',
    image: null,
    lastUpdated: '2024-10-23T15:45:00'
  }
]

export default function SavedProductsManager() {
  const [savedProducts, setSavedProducts] = useState(MOCK_SAVED_PRODUCTS)
  const [activeTab, setActiveTab] = useState('all') // all, alerts, dropped

  const filteredProducts = savedProducts.filter(product => {
    if (activeTab === 'alerts') return product.notifyOnAnyDrop
    if (activeTab === 'dropped') return product.currentPrice < product.originalPrice
    return true
  })

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es', { 
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getPriceChangeIndicator = (current, original) => {
    if (current === original) return null
    const percentChange = ((current - original) / original * 100).toFixed(1)
    const isDown = current < original

    return (
      <span className={`text-sm font-medium ${isDown ? 'text-green-600' : 'text-red-600'}`}>
        {isDown ? '↓' : '↑'} {Math.abs(percentChange)}%
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', name: 'Todos' },
            { id: 'alerts', name: 'Con Alertas' },
            { id: 'dropped', name: 'Bajadas de Precio' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                {product.category === 'smartphone' ? (
                  <Camera className="w-8 h-8 text-gray-400" />
                ) : (
                  <span className="text-sm text-gray-400">Sin imagen</span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {getFormattedDate(product.lastUpdated)}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">
                    {product.currentPrice}€
                  </span>
                  {product.currentPrice !== product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}€
                    </span>
                  )}
                  {getPriceChangeIndicator(product.currentPrice, product.originalPrice)}
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    en {product.store}
                  </span>
                  {product.targetPrice && (
                    <span className="text-gray-600">
                      Alerta: {product.targetPrice}€
                    </span>
                  )}
                  {product.notifyOnAnyDrop && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      Notificar bajadas
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Aquí iría la lógica para editar la alerta
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para eliminar el producto
                    setSavedProducts(prev => prev.filter(p => p.id !== product.id))
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500">
              No hay productos guardados en esta categoría
            </div>
          </div>
        )}
      </div>
    </div>
  )
}