import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import UserProgress from '../../components/UserProgress'
import useProtectedRoute from '../../hooks/useProtectedRoute'

export default function ProgressPage() {
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
        title="Mi Progreso | Guía Tech"
        description="Revisa tus logros, nivel y recompensas en Guía Tech"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 font-geist-sans">
            Mi Progreso
          </h1>
          <p className="text-gray-600 font-geist-sans">
            Revisa tus logros, nivel y recompensas disponibles
          </p>
        </div>

        <UserProgress />
      </div>
    </Layout>
  )
}