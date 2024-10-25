export const config = {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.guia-tech.com',
      timeout: 5000
    },
    cache: {
      ttl: {
        articles: 1800,    // 30 minutos
        products: 3600,    // 1 hora
        categories: 86400  // 24 horas
      }
    },
    seo: {
      siteName: 'Guía Tech',
      defaultImage: '/og-image.jpg',
      twitterHandle: '@guiatech'
    }
  }