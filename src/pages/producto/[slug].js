import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import PriceAnalytics from '../../components/PriceAnalytics'
import ProductCard from '../../components/ProductCard'
import { Camera } from 'lucide-react'

// Mock data - En producción vendría de la API
const MOCK_PRODUCT = {
  id: '1',
  slug: 'iphone-15-pro-max',
  title: 'iPhone 15 Pro Max',
  description: `El iPhone 15 Pro Max representa el máximo exponente de la innovación 
    de Apple. Con su nuevo diseño en titanio, el potente chip A17 Pro y un sistema 
    de cámara revolucionario, establece nuevos estándares en el mundo de los smartphones.`,
  price: 1399,
  rating: 4.8,
  category: 'smartphones',
  brand: 'Apple',
  mainFeatures: [
    'Pantalla Super Retina XDR de 6,7"',
    'Chip A17 Pro',
    'Sistema de cámaras Pro de 48MP',
    'Diseño en titanio',
    'Dynamic Island',
    'USB-C'
  ],
  specs: {
    display: '6.7" OLED (2796 x 1290)',
    processor: 'A17 Pro',
    ram: '8GB',
    storage: '256GB',
    camera: '48MP + 12MP + 12MP',
    battery: '4422 mAh',
    os: 'iOS 17'
  },
  stores: [
    { name: 'Amazon', price: 1399, stock: true },
    { name: 'MediaMarkt', price: 1419, stock: true },
    { name: 'Apple Store', price: 1399, stock: true }
  ],
  alternatives: [
    {
      id: '2',
      title: 'Samsung Galaxy S24 Ultra',
      price: 1459,
      rating: 4.7,
      store: 'Amazon'
    },
    {
      id: '3',
      title: 'Google Pixel 8 Pro',
      price: 1099,
      rating: 4.6,
      store: 'MediaMarkt'
    }
  ]
}

export default function ProductDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [activeTab, setActiveTab] = useState('overview')

  if (router.isFallback) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={`${MOCK_PRODUCT.title} - Análisis y Mejor Precio | Guía Tech`}
        description={MOCK_PRODUCT.description.slice(0, 160)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-geist-sans">
              {MOCK_PRODUCT.title}
            </h1>

            {/* Product Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <Camera className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Características principales</h2>
                    <ul className="space-y-2">
                      {MOCK_PRODUCT.mainFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-2">Especificaciones</h2>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {Object.entries(MOCK_PRODUCT.specs).map(([key, value]) => (
                        <div key={key} className="col-span-1">
                          <dt className="text-gray-500 capitalize">{key}</dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', name: 'General' },
                    { id: 'prices', name: 'Análisis de Precios' },
                    { id: 'reviews', name: 'Reviews' }
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

              <div className="py-8">
                {activeTab === 'overview' && (
                  <div className="prose max-w-none">
                    <p>{MOCK_PRODUCT.description}</p>
                  </div>
                )}
                
                {activeTab === 'prices' && (
                  <PriceAnalytics 
                    productId={MOCK_PRODUCT.id} 
                    productName={MOCK_PRODUCT.title}
                  />
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center text-gray-500 py-12">
                    Reviews próximamente
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">Dónde Comprar</h2>
              <div className="space-y-4">
                {MOCK_PRODUCT.stores.map((store, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{store.name}</h3>
                      {store.stock ? (
                        <span className="text-sm text-green-600">En stock</span>
                      ) : (
                        <span className="text-sm text-red-600">Sin stock</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">{store.price}€</p>
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ver oferta →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">Alternativas</h2>
              <div className="space-y-4">
                {MOCK_PRODUCT.alternatives.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}