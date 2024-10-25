import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Link from 'next/link'

export default function Guias() {
  const guias = [
    {
      date: "23 Oct 2024",
      title: "Mejores Portátiles 2024",
      excerpt: "Guía completa para elegir el portátil perfecto según tus necesidades...",
      slug: "mejores-portatiles-2024"
    },
    {
      date: "21 Oct 2024",
      title: "Guía de Compra: Smartphones Gama Media",
      excerpt: "Los mejores móviles calidad-precio de 2024...",
      slug: "smartphones-gama-media-2024"
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Guías de Compra Tecnológica | Guía Tech"
        description="Guías expertas para elegir los mejores productos tecnológicos. Consejos y recomendaciones para cada presupuesto."
        keywords="guía compra tecnología, consejos compra tech, recomendaciones"
      />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">Guías de Compra</h1>
        <div className="grid gap-6">
          {guias.map((guia, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <span className="text-sm text-gray-500 font-geist-sans">
                Última actualización: {guia.date}
              </span>
              <h2 className="text-xl font-semibold mt-2 mb-3 font-geist-sans">
                {guia.title}
              </h2>
              <p className="text-gray-600 font-geist-sans">
                {guia.excerpt}
              </p>
              <Link 
                href={`/guias/${guia.slug}`}
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-geist-sans"
              >
                Ver guía →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}