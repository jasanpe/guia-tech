export class MediaOptimizer {
    static BREAKPOINTS = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  
    static getImageDimensions(viewportWidth) {
      if (viewportWidth < this.BREAKPOINTS.sm) return { width: 320, height: 240 }
      if (viewportWidth < this.BREAKPOINTS.md) return { width: 480, height: 360 }
      if (viewportWidth < this.BREAKPOINTS.lg) return { width: 640, height: 480 }
      if (viewportWidth < this.BREAKPOINTS.xl) return { width: 800, height: 600 }
      return { width: 1024, height: 768 }
    }
  
    static generateSrcSet(imageUrl) {
      const sizes = [320, 480, 640, 800, 1024]
      return sizes
        .map(size => `${this.getOptimizedImageUrl(imageUrl, size)} ${size}w`)
        .join(', ')
    }
  
    static getOptimizedImageUrl(url, width) {
      // Aquí implementaremos la lógica de optimización de imágenes
      // Por ahora, simularemos una URL optimizada
      return `${url}?w=${width}&q=75&auto=format`
    }
  
    static getResponsiveImage(imageUrl, alt) {
      return {
        src: this.getOptimizedImageUrl(imageUrl, 800),
        srcSet: this.generateSrcSet(imageUrl),
        sizes: '(max-width: 640px) 320px, (max-width: 768px) 480px, 800px',
        alt,
        loading: 'lazy',
        decoding: 'async'
      }
    }
  }