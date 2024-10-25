import { useState, useEffect } from 'react'
import { CachingSystem } from '../lib/cachingSystem'

export function useCache(key, fetchFn, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Intentar obtener del caché
        const cached = CachingSystem.getData(key)
        if (cached) {
          setData(cached)
          setLoading(false)
          // Refetch en background si está cerca de expirar
          if (cached.expires - Date.now() < 300000) { // 5 minutos
            const fresh = await fetchFn()
            CachingSystem.cacheData(key, fresh, options)
            setData(fresh)
          }
          return
        }

        // Si no hay caché, fetch normal
        const fresh = await fetchFn()
        CachingSystem.cacheData(key, fresh, options)
        setData(fresh)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [key, fetchFn, options])

  return { data, loading, error }
}