import { useState, useEffect } from 'react'
import { LocalCache } from '../lib/cache'

const cache = new LocalCache()

export default function useDataFetching(key, fetchFn, options = {}) {
  const { ttl = 3600, deps = [] } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
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
    }

    fetchData()
  }, [key, ttl, ...deps])

  return { data, loading, error }
}