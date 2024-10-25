import { useState, useEffect } from 'react'
import { ResourceLoader } from '../lib/resourceLoader'

export function useResource(id, config) {
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    ResourceLoader.queueResource(id, {
      ...config,
      onLoad: (result) => {
        setResource(result)
        setLoading(false)
      },
      onError: (err) => {
        setError(err)
        setLoading(false)
      }
    })
  }, [id, config])

  return { resource, loading, error }
}