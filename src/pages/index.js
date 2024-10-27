// pages/index.js
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
import { useCallback } from 'react'

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

const Home = () => {
  const { showNotification } = useNotification()

  const handleNewsletterSuccess = useCallback(() => {
    showNotification({
      type: 'success',
      message: '¡Gracias por suscribirte! Revisa tu email para confirmar.'
    })
  }, [showNotification])

  const handleOfferClose = useCallback(() => {
    // Implementar lógica de cierre
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
    <Layout>
      <SEO 
        title="Guía Tech - Reviews y Análisis de Tecnología"
        description="Tu fuente confiable de análisis tecnológicos, comparativas y guías de compra para tomar las mejores decisiones."
        keywords="reviews tecnología, comparativas tech, guías de compra, análisis gadgets"
      />
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 font-geist-sans">
            Bienvenido a Guía Tech
          </h1>
          <p className="text-xl text-gray-600 font-geist-sans">
            Tu fuente confiable de análisis y reviews tecnológicos
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <CategoryCard 
              key={`category-${index}`}
              {...category} 
              className="font-geist-sans"
            />
          ))}
        </section>

        <section className="mb-16">
          <LatestArticles />
        </section>

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
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Análisis imparciales y detallados
                  </li>
                  <li className="flex items-center text-gray-600 font-geist-sans">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Comparativas exhaustivas
                  </li>
                  <li className="flex items-center text-gray-600 font-geist-sans">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
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
                </p> <a href="/metodologia" className="text-blue-600 hover:text-blue-800 font-geist-sans">
                  Conoce más sobre nuestro proceso →
                </a>
              </div>
            </div>
          </div>
        </section>

        <OfferAlert
          isOpen={true}
          offer={{
            title: "iPhone 15 Pro Max 256GB",
            originalPrice: 1499,
            currentPrice: 1299,
            store: "Amazon",
            stock: 5,
            expiresIn: 24,
            category: "smartphone",
            description: "¡Precio mínimo histórico! Incluye envío gratis y 2 años de garantía Apple.",
            url: "https://www.amazon.es/..."
          }}
          onClose={handleOfferClose}
        />
      </div>
    </Layout>
  )
}

export default Home