import Image from "next/image"
import localFont from "next/font/local"
import Header from '../components/Header'
import CategoryCard from '../components/CategoryCard'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import LatestArticles from '../components/LatestArticles'
import Newsletter from '../components/Newsletter'
import { useNotification } from '../context/NotificationContext'
import OfferAlert from '../components/OfferAlert'
import ProductCard from '../components/ProductCard'
import AffiliateDisclosure from '../components/AffiliateDisclosure'
import { useState, useCallback } from 'react'
import { Zap, Trophy, ArrowRight } from 'lucide-react'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

// Productos destacados (top ventas)
const topProducts = [
  {
    id: 'iphone15promax',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'El iPhone más potente con chip A17 Pro y cámara de 48MP',
    price: 1299,
    rating: 9.3,
    store: 'Amazon',
    category: 'smartphones',
    isSponsored: false
  },
  {
    id: 's24ultra',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'El smartphone Android más avanzado con S Pen y zoom 10x',
    price: 1459,
    rating: 9.1,
    store: 'Amazon',
    category: 'smartphones',
    isSponsored: false
  },
  {
    id: 'pixel8pro',
    title: 'Google Pixel 8 Pro',
    description: 'La mejor cámara con IA y Android puro',
    price: 1099,
    rating: 9.0,
    store: 'Amazon',
    category: 'smartphones',
    isSponsored: false
  }
]

// Ofertas destacadas
const deals = [
  {
    id: 'airpodspro2',
    title: 'AirPods Pro 2ª gen USB-C',
    description: 'Cancelación de ruido adaptativa y audio espacial',
    price: 239,
    originalPrice: 279,
    rating: 9.0,
    store: 'Amazon',
    category: 'audio',
    isSponsored: true
  },
  {
    id: 'xm5',
    title: 'Sony WH-1000XM5',
    description: 'Los auriculares con mejor cancelación de ruido',
    price: 329,
    originalPrice: 399,
    rating: 9.2,
    store: 'Amazon',
    category: 'audio',
    isSponsored: false
  }
]

const Home = () => {
  const { showNotification } = useNotification()
  const [isOfferOpen, setIsOfferOpen] = useState(false)

  const handleNewsletterSuccess = useCallback(() => {
    showNotification({
      type: 'success',
      message: '¡Gracias por suscribirte! Revisa tu email para confirmar.'
    })
  }, [showNotification])

  const handleOfferClose = useCallback(() => {
    console.log('Closing offer...')
    document.body.style.pointerEvents = 'auto'
    document.body.style.overflow = 'auto'
    setIsOfferOpen(false)
  }, [])

  const categories = [
    {
      title: "Últimas Reviews",
      description: "Análisis detallados de los últimos productos tecnológicos.",
      href: "/reviews"
    },
    {
      title: "Comparativas",
      description: "Comparaciones exhaustivas para ayudarte a elegir.",
      href: "/comparativas"
    },
    {
      title: "Guías de Compra",
      description: "Recomendaciones expertas para cada presupuesto.",
      href: "/guias"
    }
  ]

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <SEO
        title="Guía Tech - Reviews y Análisis de Tecnología"
        description="Tu fuente confiable de análisis tecnológicos, comparativas y guías de compra para tomar las mejores decisiones."
        keywords="reviews tecnología, comparativas tech, guías de compra, análisis gadgets"
      />
      
      <AffiliateDisclosure />
      
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 font-geist-sans">
          Bienvenido a Guía Tech
        </h1>
        <p className="text-xl text-gray-600 font-geist-sans">
          Tu fuente confiable de análisis y reviews tecnológicos
        </p>
      </section>

      {/* Ofertas Destacadas */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 font-geist-sans">
            <Zap className="text-yellow-500" />
            Ofertas Destacadas
          </h2>
          <span className="text-sm text-red-600 font-semibold animate-pulse">
            ⏰ Tiempo limitado
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {deals.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Top Productos */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 font-geist-sans">
            <Trophy className="text-blue-500" />
            Los Más Valorados
          </h2>
          <a
            href="/guias/mejores-smartphones-2024"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-geist-sans"
          >
            Ver guía completa
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {topProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {categories.map((category, index) => (
          <CategoryCard
            key={`category-${index}`}
            {...category}
            className="font-geist-sans hover:shadow-lg transition-shadow"
          />
        ))}
      </section>

      {/* Últimos Artículos */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 font-geist-sans">
          Últimos Análisis
        </h2>
        <LatestArticles />
      </section>

      {/* Newsletter */}
      <section className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4 rounded-lg">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-8 font-geist-sans">
              Únete a nuestra comunidad
            </h2>
            <Newsletter onSuccess={handleNewsletterSuccess} />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-600 mb-4 font-geist-sans">
                ¿Por qué confiar en Guía Tech?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 font-geist-sans">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Análisis imparciales y detallados
                </li>
                <li className="flex items-center text-gray-600 font-geist-sans">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Comparativas exhaustivas
                </li>
                <li className="flex items-center text-gray-600 font-geist-sans">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Actualizaciones constantes
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-600 mb-4 font-geist-sans">
                Metodología de análisis
              </h2>
              <p className="text-gray-600 mb-4 font-geist-sans">
                Cada producto es sometido a pruebas exhaustivas durante al menos 2 semanas antes de publicar nuestras conclusiones.
              </p>
              <a href="/metodologia" className="text-blue-600 hover:text-blue-800 font-geist-sans">
                Conoce más sobre nuestro proceso &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home