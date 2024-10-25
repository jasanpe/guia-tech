import Layout from '../../components/Layout'
import ConversionDashboard from '../../components/ConversionDashboard'
import useProtectedRoute from '../../hooks/useProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardPage() {
  const { isLoading } = useProtectedRoute()
  const { user } = useAuth()

  if (isLoading || !user) {
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Dashboard de Monetización
        </h1>
        <ConversionDashboard />
      </div>
    </Layout>
  )
}

// Proteger la ruta a nivel de servidor
export async function getServerSideProps(context) {
  // Aquí implementaremos la validación del rol de admin
  // Por ahora, permitimos el acceso
  return {
    props: {}
  }
}