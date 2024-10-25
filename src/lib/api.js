export class API {
    static async fetchLatestArticles() {
      // Simular llamada a API
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: 'iPhone 15 Pro Max Review',
              excerpt: 'Análisis detallado del último iPhone...',
              date: '2024-01-23',
              slug: 'iphone-15-pro-max-review'
            },
            // ... más artículos
          ])
        }, 300)
      })
    }
  
    static async fetchCategoryProducts(category) {
      // Simular llamada a API
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: 'iPhone 15 Pro Max',
              price: 1399.99,
              rating: 4.8,
              // ... más datos
            },
            // ... más productos
          ])
        }, 300)
      })
    }
  }