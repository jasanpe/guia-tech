// pages/perfil/index.js
import { useState } from 'react'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import Breadcrumbs from '../../components/Breadcrumbs'
import useProtectedRoute from '../../hooks/useProtectedRoute'
import { useAuth } from '../../context/AuthContext'

const ProfilePage = () => {
  const { isLoading } = useProtectedRoute()
  const { user } = useAuth()
  const [userData, setUserData] = useState({
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    notifications: true,
    newsletter: true
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Cargando...</p>
        </div>
      </Layout>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Profile updated:', userData)
  }

  return (
    <Layout>
      <SEO 
        title="Mi Perfil | Guía Tech"
        description="Gestiona tu perfil y preferencias"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Mi Perfil
        </h1>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-geist-sans">
                Nombre
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-geist-sans">
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={userData.notifications}
                  onChange={(e) => setUserData({...userData, notifications: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 font-geist-sans">
                  Recibir notificaciones de nuevas reviews
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={userData.newsletter}
                  onChange={(e) => setUserData({...userData, newsletter: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700 font-geist-sans">
                  Suscribirse al newsletter
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-geist-sans"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage