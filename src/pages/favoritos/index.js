// pages/favoritos/index.js
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import ProductCard from '../../components/ProductCard'
import Breadcrumbs from '../../components/Breadcrumbs'
import useProtectedRoute from '../../hooks/useProtectedRoute'

const mockFavorites = [
  {
    title: "iPhone 15 Pro Max",
    description: "El iPhone más potente hasta la fecha con chip A17 Pro",
    price: 1399.99,
    rating: 4.8,
    affiliateUrl: "https://www.amazon.es/...",
    store: "Amazon",
    dateAdded: "2024-01-15"
  },
  {
    title: "MacBook Pro M3",
    description: "El portátil más potente de Apple con el nuevo chip M3",
    price: 2199.99,
    rating: 4.9,
    affiliateUrl: "https://www.amazon.es/...",
    store: "Apple Store",
    dateAdded: "2024-01-20"
  }
]

const FavoritesPage = () => {
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
        title="Mis Favoritos | Guía Tech"
        description="Productos guardados para comparar más tarde"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Mis Favoritos
        </h1>

        {mockFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFavorites.map((product, index) => (
              <div key={`favorite-${index}`} className="relative">
                <button
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                  aria-label="Eliminar de favoritos"
                >
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ProductCard {...product} />
                <p className="text-sm text-gray-500 mt-2 font-geist-sans">
                  Añadido el {new Date(product.dateAdded).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4 font-geist-sans">
              No tienes productos guardados en favoritos
            </h2>
            <p className="text-gray-500 font-geist-sans">
              Explora nuestras reviews y comparativas para encontrar los mejores productos
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default FavoritesPage