import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Link from 'next/link'

export default function SearchResults() {
  const router = useRouter()
  const { q } = router.query

  // Aquí implementaremos la lógica de búsqueda real más adelante
  const mockResults = [
    {
      type: 'review',
      title: 'iPhone 15 Pro Max - Análisis en profundidad',
      excerpt: 'Una revisión detallada del último buque insignia de Apple...',
      url: '/reviews/iphone-15-pro-max'
    },
    // Más resultados mock...
  ]

  return (
    <Layout>
      <SEO 
        title={`Resultados de búsqueda para: ${q} | Guía Tech`}
        description={`Resultados de búsqueda para ${q} en Guía Tech`}
      />
      
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 font-geist-sans">
          Resultados para: {q}
        </h1>
        
        <div className="grid gap-6">
          {mockResults.map((result, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <span className="text-sm text-gray-500 uppercase font-geist-sans">
                {result.type}
              </span>
              <h2 className="text-xl font-semibold mt-2 mb-3 font-geist-sans">
                {result.title}
              </h2>
              <p className="text-gray-600 mb-4 font-geist-sans">
                {result.excerpt}
              </p>
              <Link 
                href={result.url}
                className="text-blue-600 hover:text-blue-800 font-geist-sans"
              >
                Leer más →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}