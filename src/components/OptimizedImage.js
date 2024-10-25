import { useEffect, useRef, useState } from 'react'
import { MediaOptimizer } from '../lib/mediaOptimizer'
import { ResourceLoader } from '../lib/resourceLoader'

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  onLoad,
  onError
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const id = `image-${src}`

  useEffect(() => {
    if (!src) return

    const loadImage = async () => {
      try {
        await ResourceLoader.queueResource(id, {
          type: 'image',
          url: src,
          priority: priority ? ResourceLoader.PRIORITIES.HIGH : ResourceLoader.PRIORITIES.MEDIUM,
          element: imgRef.current
        })
        setLoaded(true)
        onLoad?.()
      } catch (err) {
        setError(true)
        onError?.(err)
      }
    }

    loadImage()
  }, [src, id, priority, onLoad, onError])

  const imageProps = MediaOptimizer.getResponsiveImage(src, alt)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Error al cargar la imagen</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          {...imageProps}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}