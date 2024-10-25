import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import RelatedArticles from '../../components/RelatedArticles'
import AffiliateDisclosure from '../../components/AffiliateDisclosure'
import ProductCard from '../../components/ProductCard'
import AdBanner from '../../components/AdBanner'
import SocialShare from '../../components/SocialShare'
import Comments from '../../components/Comments'

const reviewsData = {
  'iphone-15-pro-max': {
    title: 'iPhone 15 Pro Max - Análisis en profundidad',
    date: '23 Oct 2024',
    content: `
      <h2 class="text-2xl font-bold mb-4">Introducción</h2>
      <p class="mb-4">El iPhone 15 Pro Max representa la última innovación de Apple...</p>
      
      <h2 class="text-2xl font-bold mb-4">Diseño y construcción</h2>
      <p class="mb-4">Con su nuevo chasis de titanio y diseño refinado...</p>
      
      <h2 class="text-2xl font-bold mb-4">Rendimiento</h2>
      <p class="mb-4">El chip A17 Pro establece nuevos estándares...</p>
      
      <h2 class="text-2xl font-bold mb-4">Cámara</h2>
      <p class="mb-4">El sistema de cámara renovado ofrece...</p>
    `,
    metaDescription: 'Análisis detallado del iPhone 15 Pro Max. Rendimiento, cámara, batería y más en nuestra review completa.',
    metaKeywords: 'iPhone 15 Pro Max, review iPhone, análisis iPhone 15',
    recommendedProducts: [
      {
        title: "iPhone 15 Pro Max 256GB",
        description: "La última generación del iPhone con chip A17 Pro",
        price: 1399,
        rating: 4.8,
        affiliateUrl: "https://www.amazon.es/...",
        store: "Amazon"
      },
      {
        title: "Funda oficial de cuero",
        description: "Protección premium para tu iPhone",
        price: 59,
        rating: 4.5,
        affiliateUrl: "https://www.amazon.es/...",
        store: "Apple Store"
      }
    ]
  },
  'samsung-s24-ultra': {
    title: 'Samsung S24 Ultra - Primera impresión',
    date: '22 Oct 2024',
    content: `
      <h2 class="text-2xl font-bold mb-4">Introducción</h2>
      <p class="mb-4">El nuevo Samsung S24 Ultra llega con grandes promesas...</p>
      
      <h2 class="text-2xl font-bold mb-4">Diseño y construcción</h2>
      <p class="mb-4">Samsung mantiene su línea de diseño premium...</p>
    `,
    metaDescription: 'Primeras impresiones del Samsung S24 Ultra. Todo sobre el nuevo buque insignia de Samsung.',
    metaKeywords: 'Samsung S24 Ultra, review Samsung, análisis S24',
    recommendedProducts: [
      {
        title: "Samsung S24 Ultra 512GB",
        description: "El smartphone más potente de Samsung",
        price: 1499,
        rating: 4.7,
        affiliateUrl: "https://www.amazon.es/...",
        store: "Amazon"
      }
    ]
  }
}

export default function ReviewPost() {
  const router = useRouter()
  const { slug } = router.query
  
  if (router.isFallback) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">Cargando...</p>
        </div>
      </Layout>
    )
  }

  const review = reviewsData[slug]

  if (!review) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Review no encontrada</h1>
          <p>Lo sentimos, la review que buscas no existe.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={`${review.title} | Guía Tech`}
        description={review.metaDescription}
        keywords={review.metaKeywords}
      />
      
      <article className="max-w-4xl mx-auto p-4">
        <Breadcrumbs />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 font-geist-sans">
            {review.title}
          </h1>
          <p className="text-gray-500 font-geist-sans">
            Publicado: {review.date}
          </p>
        </header>

        <AffiliateDisclosure />
        
        <AdBanner position="article" />

        <div 
          className="prose prose-lg max-w-none font-geist-sans"
          dangerouslySetInnerHTML={{ __html: review.content }}
        />

        {review.recommendedProducts && review.recommendedProducts.length > 0 && (
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6 font-geist-sans">Productos Recomendados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {review.recommendedProducts.map((product, index) => (
                <ProductCard 
                  key={index}
                  {...product}
                />
              ))}
            </div>
          </section>
        )}

        <AdBanner position="article" />
        
        <RelatedArticles currentSlug={slug} type="reviews" />
        
        <SocialShare 
          url={`https://guia-tech.com/reviews/${slug}`} 
          title={review.title} 
        />
        
        <Comments postId={slug} />
      </article>
    </Layout>
  )
}