import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import CategoryNavigation from '../../components/CategoryNavigation'
import ProductCard from '../../components/ProductCard'
import Breadcrumbs from '../../components/Breadcrumbs'
import AdBanner from '../../components/AdBanner'

const categoryData = {
  smartphones: {
    title: 'Smartphones',
    description: 'Los mejores teléfonos móviles analizados y comparados',
    products: [
      {
        title: 'iPhone 15 Pro Max',
        description: 'El mejor iPhone hasta la fecha con chip A17 Pro',
        price: 1399.99,
        rating: 4.8,
        affiliateUrl: 'https://www.amazon.es/...',
        store: 'Amazon'
      },
      {
        title: 'Samsung S24 Ultra',
        description: 'El buque insignia de Samsung con IA integrada',
        price: 1499.99,
        rating: 4.7,
        affiliateUrl: 'https://www.amazon.es/...',
        store: 'Samsung'
      }
      // Más productos...
    ]
  },
  portatiles: {
    title: 'Portátiles',
    description: 'Comparativas y análisis de los mejores portátiles',
    products: [
      // Productos de portátiles...
    ]
  }
  // Más categorías...
}

export default function CategoryPage() {
  const router = useRouter()
  const { category } = router.query
  
  const categoryInfo = categoryData[category]

  if (!categoryInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Categoría no encontrada</h1>
          <p>La categoría que buscas no existe.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={`${categoryInfo.title} - Guía Tech`}
        description={categoryInfo.description}
      />
      
      <CategoryNavigation currentCategory={category} />
      
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <h1 className="text-3xl font-bold text-blue-600 mb-4 font-geist-sans">
          {categoryInfo.title}
        </h1>
        
        <p className="text-gray-600 mb-8 font-geist-sans">
          {categoryInfo.description}
        </p>

        <AdBanner position="top" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {categoryInfo.products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <AdBanner position="bottom" />
      </div>
    </Layout>
  )
}