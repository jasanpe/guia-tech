import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import AdvancedSearch from '../components/AdvancedSearch'

export default function SearchPage() {
  return (
    <Layout>
      <SEO 
        title="Búsqueda Avanzada | Guía Tech"
        description="Encuentra el producto perfecto con nuestro buscador avanzado"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 font-geist-sans">
            Búsqueda Avanzada
          </h1>
          <p className="text-gray-600 font-geist-sans">
            Filtra y compara productos para encontrar la mejor opción
          </p>
        </div>

        <AdvancedSearch />
      </div>
    </Layout>
  )
}