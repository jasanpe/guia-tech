export const generateMetaTags = (page = {}) => {
    const defaults = {
      siteName: 'Guía Tech',
      title: 'Guía Tech - Reviews y Análisis de Tecnología',
      description: 'Tu fuente confiable de análisis tecnológicos y reviews',
      image: '/og-image.jpg',
      url: 'https://guia-tech.com'
    }
  
    const meta = { ...defaults, ...page }
  
    return {
      title: meta.title,
      meta: [
        { name: 'description', content: meta.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: meta.title },
        { property: 'og:description', content: meta.description },
        { property: 'og:image', content: meta.image },
        { property: 'og:url', content: meta.url },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: meta.title },
        { name: 'twitter:description', content: meta.description },
        { name: 'twitter:image', content: meta.image }
      ]
    }
  }