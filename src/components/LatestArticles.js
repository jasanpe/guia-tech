import Link from 'next/link'
import { useEffect, useState } from 'react'
import useDataFetching from '../hooks/useDataFetching'
import { API } from '../lib/api'

const mockArticles = [
  {
    type: 'review',
    title: 'iPhone 15 Pro Max',
    excerpt: 'Análisis en profundidad del último buque insignia de Apple...',
    date: '23 Oct 2024',
    url: '/reviews/iphone-15-pro-max',
    image: '/images/iphone-15-pro-max.jpg'
  },
  {
    type: 'comparativa',
    title: 'MacBook Pro M3 vs Dell XPS 14',
    excerpt: '¿Cuál es el mejor portátil premium de 2024?',
    date: '22 Oct 2024',
    url: '/comparativas/macbook-pro-m3-vs-dell-xps-14',
    image: '/images/laptops-comparison.jpg'
  },
  {
    type: 'guia',
    title: 'Mejores Portátiles 2024',
    excerpt: 'Guía definitiva para elegir el portátil perfecto...',
    date: '21 Oct 2024',
    url: '/guias/mejores-portatiles-2024',
    image: '/images/laptops-guide.jpg'
  }
]

export default function LatestArticles() {
  const { data: articles, loading, error } = useDataFetching(
    'latest-articles',
    () => API.fetchLatestArticles(),
    { ttl: 1800, fallback: mockArticles }
  )

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const section = document.querySelector('#latest-articles')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  if (error) {
    return (
      <section className="my-12">
        <div className="text-center text-gray-600 font-geist-sans">
          No se pudieron cargar los artículos. Por favor, inténtalo más tarde.
        </div>
      </section>
    )
  }

  return (
    <section id="latest-articles" className={`my-12 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-geist-sans">
        Últimos Artículos
        {loading && <span className="ml-2 text-sm text-gray-400">(Actualizando...)</span>}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(articles || mockArticles).map((article, index) => (
          <article 
            key={index} 
            className={`bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 ${
              loading ? 'animate-pulse' : ''
            }`}
          >
            <div className="p-6">
              <span className="inline-block px-2 py-1 text-sm text-blue-600 bg-blue-50 rounded font-geist-sans uppercase">
                {article.type}
              </span>
              
              <h3 className="text-xl font-semibold mt-2 mb-3 font-geist-sans line-clamp-2">
                <Link href={article.url} className="hover:text-blue-600 transition-colors">
                  {article.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm font-geist-sans line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex justify-between items-center">
                <time className="text-sm text-gray-500 font-geist-sans">
                  {article.date}
                </time>
                <Link 
                  href={article.url}
                  className="text-blue-600 hover:text-blue-800 text-sm font-geist-sans group flex items-center"
                >
                  Leer más
                  <span className="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}