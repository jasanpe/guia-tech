import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext()

const STORAGE_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true)
      // Aquí implementaremos la lógica real de login
      const mockUser = {
        id: '1',
        name: 'Usuario Demo',
        email: email,
        favorites: [],
        lastLogin: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: true
        }
      }
      setUser(mockUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
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
        favorites: [],
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: true
        }
      }
      setUser(mockUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const toggleFavorite = useCallback((productId) => {
    setUser(currentUser => {
      if (!currentUser) return null

      const favorites = currentUser.favorites || []
      const newFavorites = favorites.includes(productId)
        ? favorites.filter(id => id !== productId)
        : [...favorites, productId]

      const updatedUser = {
        ...currentUser,
        favorites: newFavorites
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  const updateUserPreferences = useCallback((preferences) => {
    setUser(currentUser => {
      if (!currentUser) return null

      const updatedUser = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...preferences
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    toggleFavorite,
    updateUserPreferences
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