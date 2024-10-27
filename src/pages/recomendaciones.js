import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import PersonalizedRecommendations from '../components/PersonalizedRecommendations'
import { useAuth } from '../context/AuthContext'

export default function RecommendationsPage() {
  const { user } = useAuth()

  return (
    <Layout>
      <SEO 
        title="Recomendaciones Personalizadas | Guía Tech"
        description="Descubre productos seleccionados especialmente para ti"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 font-geist-sans">
            Recomendaciones para ti
          </h1>
          <p className="text-gray-600 font-geist-sans">
            {user ? 
              `Productos seleccionados según tus intereses y historial` : 
              `Descubre las últimas tendencias y productos destacados`
            }
          </p>
        </div>

        <PersonalizedRecommendations />
      </div>
    </Layout>
  )
}