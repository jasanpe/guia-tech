import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import ProductComparisonTable from '../../components/ProductComparisonTable'
import { useRouter } from 'next/router'

const CATEGORY_INFO = {
  smartphones: {
    title: 'Comparar Smartphones',
    description: 'Compara las características y precios de los últimos smartphones'
  },
  laptops: {
    title: 'Comparar Portátiles',
    description: 'Encuentra el portátil perfecto comparando especificaciones y precios'
  }
}

export default function ComparePage() {
  const router = useRouter()
  const { category } = router.query

  const info = CATEGORY_INFO[category] || {
    title: 'Comparador de Productos',
    description: 'Compara productos y encuentra la mejor opción'
  }

  return (
    <Layout>
      <SEO 
        title={`${info.title} | Guía Tech`}
        description={info.description}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 font-geist-sans">
            {info.title}
          </h1>
          <p className="text-gray-600 font-geist-sans">
            {info.description}
          </p>
        </div>

        <ProductComparisonTable category={category} />
      </div>
    </Layout>
  )
}