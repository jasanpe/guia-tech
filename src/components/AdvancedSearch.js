import { useState } from 'react'
import { Camera, Laptop, Headphones } from 'lucide-react'

const PRICE_RANGES = [
  { id: '0-300', label: 'Hasta 300€', min: 0, max: 300 },
  { id: '300-600', label: '300€ - 600€', min: 300, max: 600 },
  { id: '600-1000', label: '600€ - 1000€', min: 600, max: 1000 },
  { id: '1000+', label: 'Más de 1000€', min: 1000, max: null }
]

const CATEGORIES = [
  { 
    id: 'smartphones',
    name: 'Smartphones',
    icon: Camera,
    filters: ['marca', 'pantalla', 'almacenamiento', 'ram']
  },
  { 
    id: 'laptops', 
    name: 'Portátiles',
    icon: Laptop,
    filters: ['marca', 'procesador', 'grafica', 'ram']
  },
  { 
    id: 'audio', 
    name: 'Audio',
    icon: Headphones,
    filters: ['tipo', 'marca', 'conectividad']
  }
]

// Mock de resultados para demostración
const MOCK_RESULTS = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    description: 'El iPhone más potente con chip A17 Pro',
    price: 1399,
    category: 'smartphones',
    rating: 4.8,
    store: 'Amazon',
    specs: {
      marca: 'Apple',
      pantalla: '6.7"',
      almacenamiento: '256GB',
      ram: '8GB'
    }
  },
  {
    id: '2',
    title: 'MacBook Pro M3',
    description: 'Portátil profesional con el nuevo chip M3',
    price: 1999,
    category: 'laptops',
    rating: 4.9,
    store: 'Apple Store',
    specs: {
      marca: 'Apple',
      procesador: 'M3',
      ram: '16GB',
      grafica: 'Integrada'
    }
  }
]

export default function AdvancedSearch() {
  const [category, setCategory] = useState(null)
  const [priceRange, setPriceRange] = useState(null)
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({})
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simular búsqueda
    setTimeout(() => {
      setResults(MOCK_RESULTS)
      setIsSearching(false)
    }, 500)
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filtros */}
      <div className="md:col-span-1 space-y-6">
        {/* Categorías */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Categorías</h3>
          <div className="space-y-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`
                    w-full flex items-center gap-2 p-2 rounded-lg transition-colors
                    ${category === cat.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Rango de precio */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Precio</h3>
          <div className="space-y-2">
            {PRICE_RANGES.map(range => (
              <label
                key={range.id}
                className="flex items-center gap-2"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={priceRange === range.id}
                  onChange={() => setPriceRange(range.id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtros específicos por categoría */}
        {category && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-3">Especificaciones</h3>
            <div className="space-y-4">
              {CATEGORIES.find(c => c.id === category)?.filters.map(filter => (
                <div key={filter}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={filters[filter] || ''}
                    onChange={(e) => updateFilter(filter, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Resultados */}
      <div className="md:col-span-3">
        {/* Ordenación */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {results.length} resultados encontrados
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="relevance">Más relevantes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>

        {/* Lista de resultados */}
        <div className="space-y-4">
          {results.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const Icon = CATEGORIES.find(c => c.id === product.category)?.icon || Camera
                    return <Icon className="w-8 h-8 text-gray-400" />
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <span className="font-bold text-blue-600">{product.price}€</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center">
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
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      en {product.store}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Ver Precio
                  </a>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}