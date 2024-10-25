import { useState, useCallback } from 'react'
import { ErrorRecovery } from '../lib/errorRecovery'

export function useErrorHandling(type = 'component') {
  const [error, setError] = useState(null)
  const [isRecovering, setIsRecovering] = useState(false)

  const handleError = useCallback(async (error, context = {}) => {
    setError(error)
    setIsRecovering(true)

    try {
      const recovered = await ErrorRecovery.handleError(error, type, context)
      if (recovered) {
        setError(null)
      }
    } finally {
      setIsRecovering(false)
    }
  }, [type])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    isRecovering,
    handleError,
    clearError
  }
}