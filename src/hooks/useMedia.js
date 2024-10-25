import { useState, useEffect } from 'react'
import { MediaOptimizer } from '../lib/mediaOptimizer'

export function useMedia(url, options = {}) {
  const [optimizedUrl, setOptimizedUrl] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = MediaOptimizer.getImageDimensions(window.innerWidth)
      setDimensions(newDimensions)
      setOptimizedUrl(
        MediaOptimizer.getOptimizedImageUrl(url, newDimensions.width)
      )
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [url])

  return {
    url: optimizedUrl,
    dimensions,
    srcSet: MediaOptimizer.generateSrcSet(url),
    sizes: '(max-width: 640px) 320px, (max-width: 768px) 480px, 800px'
  }
}