import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  Camera, 
  History, 
  Star,
  TrendingUp // Changed from Trending to TrendingUp
} from 'lucide-react'

const MOCK_RECOMMENDATIONS = {
  trending: [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      price: 1399,
      store: 'Amazon',
      category: 'smartphones',
      trend: 'up',
      trendReason: 'Bajada de precio reciente',
      rating: 4.8,
      priceHistory: [1499, 1459, 1399]
    },
    {
      id: '2',
      title: 'MacBook Pro M3',
      price: 1999,
      store: 'Apple Store',
      category: 'laptops',
      trend: 'stable',
      trendReason: 'Mejor valorado en su categoría',
      rating: 4.9,
      priceHistory: [1999, 1999, 1999]
    }
  ],
  based_on_history: [
    {
      id: '3',
      title: 'Samsung S24 Ultra',
      price: 1459,
      store: 'PcComponentes',
      category: 'smartphones',
      matchReason: 'Similar a productos que has visto',
      rating: 4.7,
      priceHistory: [1499, 1479, 1459]
    }
  ],
  similar_interests: [
    {
      id: '4',
      title: 'Sony WH-1000XM5',
      price: 349,
      store: 'Amazon',
      category: 'audio',
      matchReason: 'Basado en tus intereses en tecnología',
      rating: 4.8,
      priceHistory: [399, 379, 349]
    }
  ]
}

export default function PersonalizedRecommendations() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('trending')
  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de recomendaciones
    setIsLoading(true)
    setTimeout(() => {
      setRecommendations(MOCK_RECOMMENDATIONS)
      setIsLoading(false)
    }, 1000)
  }, [user])

  const getPriceChangeIndicator = (priceHistory) => {
    if (priceHistory.length < 2) return null
    const latest = priceHistory[priceHistory.length - 1]
    const previous = priceHistory[priceHistory.length - 2]
    const change = ((latest - previous) / previous) * 100
    
    if (Math.abs(change) < 1) return null
    
    return (
      <span className={`text-sm font-medium ${change < 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change < 0 ? '↓' : '↑'} {Math.abs(change).toFixed(1)}%
      </span>
    )
  }

  const tabs = [
    { id: 'trending', name: 'Tendencias', icon: TrendingUp }, // Changed from Trending to TrendingUp
    { id: 'based_on_history', name: 'Para ti', icon: History },
    { id: 'similar_interests', name: 'Relacionados', icon: Star }
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations[activeTab]?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg flex items-center justify-center">
                {(() => {
                  const Icon = product.category === 'smartphones' ? Camera : Trending
                  return <Icon className="w-12 h-12 text-gray-400" />
                })()}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {getPriceChangeIndicator(product.priceHistory)}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price}€
                  </span>
                  <span className="text-sm text-gray-500">
                    en {product.store}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {product.matchReason || product.trendReason}
                </p>

                <div className="mt-4 flex gap-2">
                  <a
                    href="#"
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Ver Precio
                  </a>
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    title="Guardar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}