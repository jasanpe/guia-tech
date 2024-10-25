import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true)
      // Aquí implementaremos la lógica real de login
      const mockUser = {
        id: '1',
        name: 'Usuario Demo',
        email: email,
        favorites: []
      }
      setUser(mockUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      setIsLoading(true)
      // Aquí implementaremos la lógica real de registro
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        favorites: []
      }
      setUser(mockUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const toggleFavorite = useCallback((productId) => {
    setUser(currentUser => {
      if (!currentUser) return null

      const favorites = currentUser.favorites || []
      const newFavorites = favorites.includes(productId)
        ? favorites.filter(id => id !== productId)
        : [...favorites, productId]

      return {
        ...currentUser,
        favorites: newFavorites
      }
    })
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    toggleFavorite
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}