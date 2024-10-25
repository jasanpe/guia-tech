export class ContentManager {
    static contentTypes = {
      REVIEW: 'review',
      COMPARISON: 'comparison',
      GUIDE: 'guide'
    }
  
    static categories = {
      smartphones: {
        name: 'Smartphones',
        slug: 'smartphones',
        priority: 1,
        affiliatePrograms: ['amazon', 'pccomponentes', 'mediamarkt'],
        priceRange: { min: 100, max: 1500 },
        mainBrands: ['Apple', 'Samsung', 'Xiaomi', 'Google'],
        mainFeatures: ['camera', 'battery', 'screen', 'processor'],
        updateFrequency: 'monthly'
      },
      laptops: {
        name: 'Portátiles',
        slug: 'portatiles',
        priority: 2,
        affiliatePrograms: ['amazon', 'pccomponentes', 'mediamarkt'],
        priceRange: { min: 300, max: 3000 },
        mainBrands: ['Apple', 'Dell', 'HP', 'Lenovo'],
        mainFeatures: ['processor', 'ram', 'storage', 'graphics'],
        updateFrequency: 'quarterly'
      },
      tablets: {
        name: 'Tablets',
        slug: 'tablets',
        priority: 3,
        affiliatePrograms: ['amazon', 'pccomponentes', 'mediamarkt'],
        priceRange: { min: 100, max: 2000 },
        mainBrands: ['Apple', 'Samsung', 'Lenovo'],
        mainFeatures: ['screen', 'battery', 'processor', 'storage'],
        updateFrequency: 'quarterly'
      }
    }
  
    static contentStructure = {
      review: {
        sections: [
          'introduction',
          'specifications',
          'design',
          'performance',
          'features',
          'camera',
          'battery',
          'price_value',
          'pros_cons',
          'verdict'
        ],
        requiredImages: [
          'main',
          'design',
          'performance',
          'camera_samples'
        ],
        schema: {
          "@type": "Product",
          required: [
            "name",
            "description",
            "brand",
            "review",
            "aggregateRating"
          ]
        }
      },
      comparison: {
        sections: [
          'introduction',
          'quick_comparison',
          'design_build',
          'display',
          'performance',
          'camera',
          'battery',
          'price',
          'verdict'
        ],
        requiredImages: [
          'products_side_by_side',
          'comparison_table'
        ],
        minProducts: 2,
        maxProducts: 4
      },
      guide: {
        sections: [
          'introduction',
          'buying_criteria',
          'top_picks',
          'budget_options',
          'premium_options',
          'recommendations',
          'faq'
        ],
        requiredImages: [
          'featured',
          'comparison_chart'
        ],
        minProducts: 5,
        maxProducts: 10
      }
    }
  
    static seoTemplates = {
      review: {
        title: "{product_name} - Review y Análisis [año] | Guía Tech",
        description: "✓ Análisis completo del {product_name} ▷ Descubre sus características, rendimiento, {features} y si vale la pena comprarlo. ¡Todo en nuestra review!",
        h1: "{product_name} - Review y Análisis Completo",
        sections: {
          introduction: "Descubre todo sobre el {product_name} en nuestra review detallada. Te contamos nuestra experiencia tras {testing_period} de uso.",
          verdict: "¿Vale la pena comprar el {product_name}? Te damos nuestra opinión final tras analizarlo en profundidad."
        }
      },
      comparison: {
        title: "{product_1} vs {product_2} - Comparativa [año] | Guía Tech",
        description: "⚡ {product_1} vs {product_2} ▷ Comparamos {features} para ayudarte a elegir el mejor. ¡Descubre cuál es mejor para ti!",
        h1: "{product_1} vs {product_2} - ¿Cuál elegir?",
        sections: {
          introduction: "¿Dudas entre el {product_1} y el {product_2}? Comparamos todos sus aspectos para ayudarte a elegir el más adecuado.",
          verdict: "Tras comparar ambos dispositivos en profundidad, nuestra recomendación es..."
        }
      },
      guide: {
        title: "Mejores {category} [año] - Guía de Compra | Guía Tech",
        description: "🏆 Descubre los mejores {category} de [año] ▷ Comparamos los {top_count} modelos más destacados para todos los presupuestos.",
        h1: "Mejores {category} [año] - Guía de Compra",
        sections: {
          introduction: "Te ayudamos a elegir el mejor {category} según tus necesidades y presupuesto. Guía actualizada a {current_month} de [año].",
          recommendations: "Estas son nuestras recomendaciones según diferentes perfiles de usuario y presupuestos."
        }
      }
    }
  
    static generateMetadata(type, data) {
      const template = this.seoTemplates[type]
      const currentYear = new Date().getFullYear()
      
      let title = template.title
      let description = template.description
      
      // Reemplazar variables
      Object.entries(data).forEach(([key, value]) => {
        title = title.replace(`{${key}}`, value)
        description = description.replace(`{${key}}`, value)
      })
      
      // Reemplazar año
      title = title.replace('[año]', currentYear)
      description = description.replace('[año]', currentYear)
      
      return {
        title,
        description,
        schema: this.generateSchema(type, data)
      }
    }
  
    static generateSchema(type, data) {
      switch (type) {
        case 'review':
          return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": data.product_name,
            "brand": {
              "@type": "Brand",
              "name": data.brand
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": data.rating,
                "bestRating": "10"
              },
              "author": {
                "@type": "Organization",
                "name": "Guía Tech"
              }
            }
          }
        // Añadir más tipos según necesidad
        default:
          return {}
      }
    }
  
    static validateContent(type, content) {
      const structure = this.contentStructure[type]
      const errors = []
      
      // Validar secciones requeridas
      structure.sections.forEach(section => {
        if (!content[section]) {
          errors.push(`Falta la sección: ${section}`)
        }
      })
      
      // Validar imágenes requeridas
      structure.requiredImages.forEach(image => {
        if (!content.images?.[image]) {
          errors.push(`Falta la imagen: ${image}`)
        }
      })
      
      // Validaciones específicas por tipo
      switch (type) {
        case 'comparison':
          if (content.products.length < structure.minProducts) {
            errors.push(`Se requieren al menos ${structure.minProducts} productos`)
          }
          if (content.products.length > structure.maxProducts) {
            errors.push(`No se pueden comparar más de ${structure.maxProducts} productos`)
          }
          break
        case 'guide':
          if (content.recommendations.length < structure.minProducts) {
            errors.push(`Se requieren al menos ${structure.minProducts} recomendaciones`)
          }
          break
      }
      
      return {
        isValid: errors.length === 0,
        errors
      }
    }
  }