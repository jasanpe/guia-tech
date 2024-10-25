import { useState } from 'react'
import { Camera } from 'lucide-react'

// Mock data - en producción vendría de la API
const MOCK_COMPARISONS = {
  smartphones: {
    features: [
      { id: 'screen', name: 'Pantalla', type: 'spec' },
      { id: 'processor', name: 'Procesador', type: 'spec' },
      { id: 'ram', name: 'RAM', type: 'spec' },
      { id: 'storage', name: 'Almacenamiento', type: 'spec' },
      { id: 'camera', name: 'Cámara Principal', type: 'spec' },
      { id: 'battery', name: 'Batería', type: 'spec' },
      { id: 'price', name: 'Precio', type: 'price' },
      { id: 'performance', name: 'Rendimiento', type: 'rating' },
      { id: 'camera_quality', name: 'Calidad de Cámara', type: 'rating' },
      { id: 'battery_life', name: 'Duración Batería', type: 'rating' }
    ],
    products: [
      {
        id: '1',
        title: 'iPhone 15 Pro Max',
        image: null,
        store: 'Amazon',
        price: 1399,
        specs: {
          screen: '6.7" OLED ProMotion',
          processor: 'A17 Pro',
          ram: '8GB',
          storage: '256GB',
          camera: '48MP Principal',
          battery: '4422 mAh',
          performance: 9.5,
          camera_quality: 9.8,
          battery_life: 8.9
        }
      },
      {
        id: '2',
        title: 'Samsung S24 Ultra',
        image: null,
        store: 'PcComponentes',
        price: 1459,
        specs: {
          screen: '6.8" AMOLED QHD+',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12GB',
          storage: '256GB',
          camera: '200MP Principal',
          battery: '5000 mAh',
          performance: 9.4,
          camera_quality: 9.7,
          battery_life: 9.2
        }
      }
    ]
  }
}

export default function ProductComparisonTable({ category = 'smartphones' }) {
  const [selectedFeatures, setSelectedFeatures] = useState(() => 
    MOCK_COMPARISONS[category].features.map(f => f.id)
  )

  const comparison = MOCK_COMPARISONS[category]

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const renderValue = (feature, value) => {
    switch (feature.type) {
      case 'rating':
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(value * 10)}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {value.toFixed(1)}
            </span>
          </div>
        )
      case 'price':
        return (
          <span className="font-bold text-blue-600">
            {value}€
          </span>
        )
      default:
        return value
    }
  }

  return (
    <div className="space-y-6">
      {/* Feature Selector */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Características a comparar:
        </h3>
        <div className="flex flex-wrap gap-2">
          {comparison.features.map(feature => (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${selectedFeatures.includes(feature.id)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
              `}
            >
              {feature.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-4 text-left text-gray-600 font-medium min-w-[200px]">
                Característica
              </th>
              {comparison.products.map(product => (
                <th key={product.id} className="p-4 min-w-[250px]">
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        en {product.store}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.features
              .filter(feature => selectedFeatures.includes(feature.id))
              .map(feature => (
                <tr key={feature.id} className="border-b border-gray-200">
                  <td className="p-4 text-gray-600 font-medium">
                    {feature.name}
                  </td>
                  {comparison.products.map(product => (
                    <td key={product.id} className="p-4">
                      {renderValue(feature, 
                        feature.id === 'price' 
                          ? product.price 
                          : product.specs[feature.id]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparison.products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">{product.title}</h4>
              <span className="font-bold text-blue-600">{product.price}€</span>
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  // Aquí iría la lógica de tracking y redirección
                }}
              >
                Ver Precio
              </a>
              <button
                className="px-4 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => {
                  // Aquí iría la lógica para añadir a favoritos
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}