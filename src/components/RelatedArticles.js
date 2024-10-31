import Link from 'next/link'

export default function RelatedArticles({ currentSlug, type }) {
  // En un caso real, esto vendría de una base de datos o API
  const mockRelated = {
    reviews: [
      {
        title: "Samsung S24 Ultra - Primera impresión",
        slug: "samsung-s24-ultra",
        excerpt: "Todo sobre el nuevo tope de gama de Samsung..."
      },
      {
        title: "MacBook Pro M3 - Review",
        slug: "macbook-pro-m3",
        excerpt: "El portátil más potente de Apple..."
      }
    ],
    comparativas: [
      {
        title: "iPhone 15 Pro vs Pixel 8 Pro",
        slug: "iphone-15-pro-vs-pixel-8-pro",
        excerpt: "Enfrentamos a los mejores teléfonos de Apple y Google..."
      }
    ],
    guias: [
      {
        title: "Mejor móvil por menos de 300€",
        slug: "mejor-movil-gama-media",
        excerpt: "Las mejores opciones en relación calidad-precio..."
      }
    ]
  }

  const relatedArticles = mockRelated[type]?.filter(article => article.slug !== currentSlug) || []

  if (relatedArticles.length === 0) return null

  return (
    <aside className="mt-12 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-6 font-geist-sans">Artículos Relacionados</h2>
      <div className="grid gap-6">
        {relatedArticles?.map((article, index) => (
          <article key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 font-geist-sans">
              <Link 
                href={type && article?.slug ? `/${type}/${article.slug}` : '/'}
                className="text-blue-600 hover:text-blue-800"
              >
                {article?.title || 'Artículo relacionado'}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 font-geist-sans">{article?.excerpt}</p>
          </article>
        ))}
      </div>
    </aside>
  )
}