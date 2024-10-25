import Layout from '../../components/Layout'
import SavedProductsManager from '../../components/SavedProductsManager'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import useProtectedRoute from '../../hooks/useProtectedRoute'

export default function SavedProductsPage() {
  const { isLoading } = useProtectedRoute()

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Cargando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title="Productos Guardados | Guía Tech"
        description="Gestiona tus productos guardados y alertas de precio"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Productos Guardados
        </h1>

        <SavedProductsManager />
      </div>
    </Layout>
  )
}