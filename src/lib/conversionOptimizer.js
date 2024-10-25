export class ConversionOptimizer {
    static tests = new Map()
    static conversions = new Map()
    static currentVariants = new Map()
    
    static templates = {
      buttonText: [
        'Ver Precio',
        'Comprar Ahora',
        'Ver Oferta',
        'Mejor Precio',
        'Ver en {store}'
      ],
      priceDisplay: [
        'simple', // 99.99€
        'withSave', // 99.99€ (Ahorra 20€)
        'withTax', // 99.99€ (IVA incluido)
        'withShipping' // 99.99€ (Envío gratis)
      ],
      layout: [
        'standard',
        'compact',
        'detailed',
        'minimal'
      ]
    }
  
    static startTest(testId, variants, options = {}) {
      const test = {
        id: testId,
        variants,
        startDate: Date.now(),
        options: {
          distributionMethod: 'random', // random, percentage, userBased
          sampleSize: options.sampleSize || 1000,
          duration: options.duration || 7 * 24 * 60 * 60 * 1000, // 1 semana por defecto
          ...options
        },
        results: variants.reduce((acc, variant) => {
          acc[variant] = { views: 0, clicks: 0, conversions: 0 }
          return acc
        }, {})
      }
  
      this.tests.set(testId, test)
      return test
    }
  
    static getVariant(testId, userId = null) {
      const test = this.tests.get(testId)
      if (!test) return null
  
      // Si el usuario ya tiene una variante asignada, mantenerla
      const existingVariant = this.currentVariants.get(`${testId}_${userId}`)
      if (existingVariant) return existingVariant
  
      let variant
      switch (test.options.distributionMethod) {
        case 'userBased':
          variant = this.getUserBasedVariant(test, userId)
          break
        case 'percentage':
          variant = this.getPercentageBasedVariant(test)
          break
        default:
          variant = this.getRandomVariant(test)
      }
  
      this.currentVariants.set(`${testId}_${userId}`, variant)
      return variant
    }
  
    static trackView(testId, variant, data = {}) {
      const test = this.tests.get(testId)
      if (!test || !test.results[variant]) return
  
      test.results[variant].views++
      this.saveTestData(test)
    }
  
    static trackClick(testId, variant, data = {}) {
      const test = this.tests.get(testId)
      if (!test || !test.results[variant]) return
  
      test.results[variant].clicks++
      this.saveTestData(test)
    }
  
    static trackConversion(testId, variant, data = {}) {
      const test = this.tests.get(testId)
      if (!test || !test.results[variant]) return
  
      test.results[variant].conversions++
      this.saveTestData(test)
  
      // Registrar la conversión para análisis
      const conversion = {
        testId,
        variant,
        timestamp: Date.now(),
        value: data.value,
        ...data
      }
      this.conversions.set(`${testId}_${Date.now()}`, conversion)
    }
  
    static getTestResults(testId) {
      const test = this.tests.get(testId)
      if (!test) return null
  
      const results = {}
      for (const [variant, data] of Object.entries(test.results)) {
        results[variant] = {
          ...data,
          ctr: data.views > 0 ? (data.clicks / data.views) * 100 : 0,
          conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
        }
      }
  
      return {
        testId,
        startDate: test.startDate,
        duration: test.options.duration,
        sampleSize: test.options.sampleSize,
        results
      }
    }
  
    static getBestVariant(testId) {
      const results = this.getTestResults(testId)
      if (!results) return null
  
      let bestVariant = null
      let bestConversionRate = 0
  
      for (const [variant, data] of Object.entries(results.results)) {
        if (data.conversionRate > bestConversionRate) {
          bestConversionRate = data.conversionRate
          bestVariant = variant
        }
      }
  
      return bestVariant
    }
  
    static getRandomVariant(test) {
      const index = Math.floor(Math.random() * test.variants.length)
      return test.variants[index]
    }
  
    static getUserBasedVariant(test, userId) {
      if (!userId) return this.getRandomVariant(test)
      const hash = this.hashCode(userId)
      return test.variants[hash % test.variants.length]
    }
  
    static getPercentageBasedVariant(test) {
      const totalViews = Object.values(test.results)
        .reduce((sum, data) => sum + data.views, 0)
      
      // Distribuir equitativamente si no hay suficientes datos
      if (totalViews < test.options.sampleSize * 0.1) {
        return this.getRandomVariant(test)
      }
  
      // Encontrar variantes con menos vistas
      const sortedVariants = Object.entries(test.results)
        .sort(([,a], [,b]) => a.views - b.views)
      
      return sortedVariants[0][0]
    }
  
    static hashCode(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }
  
    static saveTestData(test) {
      try {
        localStorage.setItem(`test_${test.id}`, JSON.stringify(test))
      } catch (error) {
        console.error('Error saving test data:', error)
      }
    }
  
    static loadTestData() {
      try {
        const keys = Object.keys(localStorage)
        for (const key of keys) {
          if (key.startsWith('test_')) {
            const test = JSON.parse(localStorage.getItem(key))
            this.tests.set(test.id, test)
          }
        }
      } catch (error) {
        console.error('Error loading test data:', error)
      }
    }
  
    static getRecommendedTemplate(productType, price, store) {
      // Implementar lógica de recomendación basada en datos históricos
      return {
        buttonText: this.templates.buttonText[0],
        priceDisplay: price > 100 ? 'withSave' : 'simple',
        layout: 'standard'
      }
    }
  }