import { useState, useEffect, useCallback } from 'react'
import { LocalCache } from '../lib/cache'

const cache = new LocalCache()

export default function useDataFetching(key, fetchFn, options = {}) {
  const { ttl = 3600, deps = [] } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Intentar obtener datos del caché
      const cachedData = cache.get(key)
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }

      // Si no hay caché, hacer la petición
      const result = await fetchFn()
      cache.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [key, ttl, fetchFn])

  useEffect(() => {
    fetchData()
  }, [fetchData]) // Elimina el spread operator y solo usa fetchData

  return { data, loading, error }
}