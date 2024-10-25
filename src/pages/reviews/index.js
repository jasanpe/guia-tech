import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Link from 'next/link'
import Breadcrumbs from '../../components/Breadcrumbs'

export default function Reviews() {
  const reviews = [
    {
      date: "23 Oct 2024",
      title: "iPhone 15 Pro Max - Análisis en profundidad",
      excerpt: "Una revisión detallada del último buque insignia de Apple...",
      slug: "iphone-15-pro-max"
    },
    {
      date: "22 Oct 2024", 
      title: "Samsung S24 Ultra - Primera impresión",
      excerpt: "Todo sobre el nuevo tope de gama de Samsung...",
      slug: "samsung-s24-ultra"
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Reviews de Productos Tecnológicos | Guía Tech"
        description="Análisis detallados y reviews de los últimos productos tecnológicos. Smartphones, laptops, gadgets y más."
        keywords="reviews tecnología, análisis productos, smartphones, laptops, gadgets"
      />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Reviews de Productos
        </h1>
        <div className="grid gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <span className="text-sm text-gray-500 font-geist-sans">
                Última actualización: {review.date}
              </span>
              <h2 className="text-xl font-semibold mt-2 mb-3 font-geist-sans">
                {review.title}
              </h2>
              <p className="text-gray-600 font-geist-sans">
                {review.excerpt}
              </p>
              <Link 
                href={`/reviews/${review.slug}`}
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-geist-sans"
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