import { useEffect, useRef, useState } from 'react'
import { MediaOptimizer } from '../lib/mediaOptimizer'
import { ResourceLoader } from '../lib/resourceLoader'
import Image from 'next/image'

export function OptimizedImage({ src, alt = '', className = '', priority = false, onLoad, onError }) {
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

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <span className="text-sm text-gray-500">Error al cargar la imagen</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      
      <Image
        {...imageProps}
        ref={imgRef}
        src={src}
        alt={alt}
        fill={true}
        sizes="100vw"
        priority={priority}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        onLoadingComplete={() => {
          setLoaded(true)
          onLoad?.()
        }}
        onError={() => {
          setError(true)
          onError?.()
        }}
      />
    </div>
  )
}