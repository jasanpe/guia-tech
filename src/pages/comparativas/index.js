import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Link from 'next/link'

export default function Comparativas() {
  const comparativas = [
    {
      date: "23 Oct 2024",
      title: "iPhone 15 Pro vs Samsung S24 Ultra",
      excerpt: "Comparativa exhaustiva entre los dos mejores smartphones del mercado...",
      slug: "iphone-15-pro-vs-s24-ultra"
    },
    {
      date: "22 Oct 2024",
      title: "MacBook Pro M3 vs Dell XPS 14",
      excerpt: "¿Cuál es el mejor portátil premium de 2024?",
      slug: "macbook-pro-m3-vs-dell-xps-14"
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Comparativas de Productos | Guía Tech"
        description="Comparativas detalladas de productos tecnológicos. Encuentra el dispositivo perfecto para ti."
        keywords="comparativas tech, versus tecnología, comparar productos"
      />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">Comparativas</h1>
        <div className="grid gap-6">
          {comparativas.map((comparativa, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <span className="text-sm text-gray-500 font-geist-sans">
                Última actualización: {comparativa.date}
              </span>
              <h2 className="text-xl font-semibold mt-2 mb-3 font-geist-sans">
                {comparativa.title}
              </h2>
              <p className="text-gray-600 font-geist-sans">
                {comparativa.excerpt}
              </p>
              <Link 
                href={`/comparativas/${comparativa.slug}`}
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-geist-sans"
              >
                Ver comparativa →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}