export class PriceMonitor {
    static priceHistory = new Map()
    static priceAlerts = new Map()
    static monitoredProducts = new Set()
  
    static priceThresholds = {
      DROP_SMALL: 5,    // 5% de bajada
      DROP_MEDIUM: 10,  // 10% de bajada
      DROP_LARGE: 20,   // 20% de bajada
      HISTORICAL_LOW: 0 // Mínimo histórico
    }
  
    static async initMonitoring(productId, initialData = {}) {
      try {
        const {
          currentPrice,
          store,
          title,
          category,
          lastUpdated = Date.now()
        } = initialData
  
        const productData = {
          id: productId,
          title,
          store,
          category,
          priceHistory: [{
            price: currentPrice,
            timestamp: lastUpdated
          }],
          stats: {
            highestPrice: currentPrice,
            lowestPrice: currentPrice,
            averagePrice: currentPrice,
            priceDrops: 0,
            lastChecked: lastUpdated
          },
          monitoring: {
            active: true,
            interval: 3600000, // 1 hora por defecto
            lastUpdate: lastUpdated,
            errors: 0
          }
        }
  
        this.priceHistory.set(productId, productData)
        this.monitoredProducts.add(productId)
  
        return productData
      } catch (error) {
        console.error(`Error initializing price monitoring for ${productId}:`, error)
        return null
      }
    }
  
    static async updatePrice(productId, newPrice, timestamp = Date.now()) {
      const productData = this.priceHistory.get(productId)
      if (!productData) return null
  
      try {
        const previousPrice = productData.priceHistory[productData.priceHistory.length - 1].price
        const priceChange = this.calculatePriceChange(previousPrice, newPrice)
  
        // Actualizar historial
        productData.priceHistory.push({
          price: newPrice,
          timestamp,
          change: priceChange
        })
  
        // Mantener solo últimos 90 días
        const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000)
        productData.priceHistory = productData.priceHistory.filter(
          record => record.timestamp > ninetyDaysAgo
        )
  
        // Actualizar estadísticas
        this.updateProductStats(productData)
  
        // Verificar alertas
        await this.checkPriceAlerts(productId, newPrice, previousPrice)
  
        // Actualizar timestamp
        productData.monitoring.lastUpdate = timestamp
        productData.monitoring.errors = 0
  
        return {
          productId,
          newPrice,
          priceChange,
          alerts: await this.getActiveAlerts(productId)
        }
      } catch (error) {
        console.error(`Error updating price for ${productId}:`, error)
        productData.monitoring.errors++
        return null
      }
    }
  
    static async createPriceAlert(userId, productId, conditions) {
      const alertId = `${userId}_${productId}_${Date.now()}`
      
      const alert = {
        id: alertId,
        userId,
        productId,
        conditions: {
          targetPrice: conditions.targetPrice,
          dropPercentage: conditions.dropPercentage,
          anyDrop: conditions.anyDrop || false,
          historicalLow: conditions.historicalLow || false
        },
        status: 'active',
        created: Date.now(),
        notifications: []
      }
  
      const userAlerts = this.priceAlerts.get(userId) || []
      userAlerts.push(alert)
      this.priceAlerts.set(userId, userAlerts)
  
      // Asegurar que el producto está siendo monitoreado
      if (!this.monitoredProducts.has(productId)) {
        await this.initMonitoring(productId)
      }
  
      return alertId
    }
  
    static async checkPriceAlerts(productId, newPrice, oldPrice) {
      const triggeredAlerts = []
      const priceChange = this.calculatePriceChange(oldPrice, newPrice)
  
      for (const [userId, userAlerts] of this.priceAlerts.entries()) {
        const relevantAlerts = userAlerts.filter(
          alert => alert.productId === productId && alert.status === 'active'
        )
  
        for (const alert of relevantAlerts) {
          const shouldTrigger = this.evaluateAlertConditions(
            alert.conditions,
            newPrice,
            oldPrice,
            priceChange
          )
  
          if (shouldTrigger) {
            triggeredAlerts.push({
              alertId: alert.id,
              userId,
              productId,
              oldPrice,
              newPrice,
              priceChange
            })
  
            alert.notifications.push({
              timestamp: Date.now(),
              price: newPrice,
              change: priceChange
            })
          }
        }
      }
  
      return triggeredAlerts
    }
  
    static evaluateAlertConditions(conditions, newPrice, oldPrice, priceChange) {
      if (conditions.targetPrice && newPrice <= conditions.targetPrice) {
        return true
      }
  
      if (conditions.dropPercentage && Math.abs(priceChange) >= conditions.dropPercentage) {
        return true
      }
  
      if (conditions.anyDrop && priceChange < 0) {
        return true
      }
  
      if (conditions.historicalLow) {
        const productData = this.priceHistory.get(productId)
        return newPrice <= productData.stats.lowestPrice
      }
  
      return false
    }
  
    static calculatePriceChange(oldPrice, newPrice) {
      return ((newPrice - oldPrice) / oldPrice) * 100
    }
  
    static updateProductStats(productData) {
      const prices = productData.priceHistory.map(record => record.price)
      
      productData.stats = {
        highestPrice: Math.max(...prices),
        lowestPrice: Math.min(...prices),
        averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        priceDrops: productData.priceHistory.filter(
          record => record.change && record.change < 0
        ).length,
        lastChecked: Date.now()
      }
    }
  
    static async getProductHistory(productId) {
      return this.priceHistory.get(productId) || null
    }
  
    static async getActiveAlerts(productId) {
      const activeAlerts = []
  
      for (const [userId, userAlerts] of this.priceAlerts.entries()) {
        const relevantAlerts = userAlerts.filter(
          alert => alert.productId === productId && alert.status === 'active'
        )
        activeAlerts.push(...relevantAlerts)
      }
  
      return activeAlerts
    }
  
    static async getUserAlerts(userId) {
      return this.priceAlerts.get(userId) || []
    }
  
    static getPriceAnalytics(productId) {
      const productData = this.priceHistory.get(productId)
      if (!productData) return null
  
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      const oneWeek = 7 * oneDay
      const oneMonth = 30 * oneDay
  
      return {
        current: productData.priceHistory[productData.priceHistory.length - 1].price,
        stats: productData.stats,
        trends: {
          day: this.calculateTrend(productData.priceHistory, now - oneDay),
          week: this.calculateTrend(productData.priceHistory, now - oneWeek),
          month: this.calculateTrend(productData.priceHistory, now - oneMonth)
        },
        prediction: this.predictPrice(productData.priceHistory)
      }
    }
  
    static calculateTrend(priceHistory, since) {
      const relevantPrices = priceHistory
        .filter(record => record.timestamp >= since)
        .map(record => record.price)
  
      if (relevantPrices.length < 2) return 0
  
      const firstPrice = relevantPrices[0]
      const lastPrice = relevantPrices[relevantPrices.length - 1]
  
      return ((lastPrice - firstPrice) / firstPrice) * 100
    }
  
    static predictPrice(priceHistory) {
      // Implementar algoritmo de predicción básico
      // Por ahora retornamos una estimación simple
      const prices = priceHistory.map(record => record.price)
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      const trend = this.calculateTrend(priceHistory, Date.now() - (30 * 24 * 60 * 60 * 1000))
  
      return {
        estimated: avg * (1 + (trend / 100)),
        confidence: 0.7,
        bestTime: this.predictBestTime(priceHistory)
      }
    }

    static async getPriceCompetitors(productId) {
        try {
            const productData = this.priceHistory.get(productId);
            if (!productData) return null;

            // Simular comparación con competidores (en producción, esto se conectaría con APIs reales)
            const competitors = [
                { store: 'Amazon', price: productData.stats.averagePrice * 0.95 },
                { store: 'PCComponentes', price: productData.stats.averagePrice * 1.02 },
                { store: 'MediaMarkt', price: productData.stats.averagePrice * 0.98 }
            ];

            return {
                timestamp: Date.now(),
                competitors: competitors.sort((a, b) => a.price - b.price)
            };
        } catch (error) {
            console.error('Error getting price competitors:', error);
            return null;
        }
    }

    static async analyzePriceSeasonality(productId) {
        const productData = this.priceHistory.get(productId);
        if (!productData) return null;

        const seasonalData = {
            byMonth: new Array(12).fill(0).map(() => ({ sum: 0, count: 0 })),
            byDayOfWeek: new Array(7).fill(0).map(() => ({ sum: 0, count: 0 })),
            bestTimeToBy: null
        };

        productData.priceHistory.forEach(record => {
            const date = new Date(record.timestamp);
            const month = date.getMonth();
            const dayOfWeek = date.getDay();

            seasonalData.byMonth[month].sum += record.price;
            seasonalData.byMonth[month].count++;
            seasonalData.byDayOfWeek[dayOfWeek].sum += record.price;
            seasonalData.byDayOfWeek[dayOfWeek].count++;
        });

        // Calcular promedios
        const monthlyAverages = seasonalData.byMonth.map((data, index) => ({
            month: index,
            average: data.count > 0 ? data.sum / data.count : null
        })).filter(data => data.average !== null);

        const dailyAverages = seasonalData.byDayOfWeek.map((data, index) => ({
            day: index,
            average: data.count > 0 ? data.sum / data.count : null
        })).filter(data => data.average !== null);

        // Encontrar mejor momento para comprar
        const bestMonth = monthlyAverages.reduce((a, b) => 
            a.average < b.average ? a : b
        );

        const bestDay = dailyAverages.reduce((a, b) => 
            a.average < b.average ? a : b
        );

        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        seasonalData.bestTimeToBuy = {
            month: {
                name: monthNames[bestMonth.month],
                index: bestMonth.month,
                averagePrice: bestMonth.average
            },
            dayOfWeek: {
                name: dayNames[bestDay.day],
                index: bestDay.day,
                averagePrice: bestDay.average
            }
        };

        return seasonalData;
    }

    static async generatePriceReport(productId) {
        try {
            const productData = this.priceHistory.get(productId);
            if (!productData) return null;

            const currentPrice = productData.priceHistory[productData.priceHistory.length - 1].price;
            const seasonality = await this.analyzePriceSeasonality(productId);
            const competitors = await this.getPriceCompetitors(productId);
            const analytics = this.getPriceAnalytics(productId);

            return {
                timestamp: Date.now(),
                currentPrice,
                analytics,
                seasonality,
                competitors,
                recommendations: this.generatePriceRecommendations(productData, seasonality, competitors)
            };
        } catch (error) {
            console.error('Error generating price report:', error);
            return null;
        }
    }

    static generatePriceRecommendations(productData, seasonality, competitors) {
        const recommendations = [];
        const currentPrice = productData.priceHistory[productData.priceHistory.length - 1].price;

        // Comparar con precio histórico más bajo
        if (currentPrice > productData.stats.lowestPrice * 1.1) {
            recommendations.push({
                type: 'warning',
                message: `El precio actual está un ${((currentPrice - productData.stats.lowestPrice) / productData.stats.lowestPrice * 100).toFixed(1)}% por encima del mínimo histórico de ${productData.stats.lowestPrice}€`
            });
        }

        // Analizar competencia
        const cheapestCompetitor = competitors.competitors[0];
        if (cheapestCompetitor && currentPrice > cheapestCompetitor.price) {
            recommendations.push({
                type: 'alert',
                message: `${cheapestCompetitor.store} ofrece un mejor precio: ${cheapestCompetitor.price}€ (${((currentPrice - cheapestCompetitor.price) / currentPrice * 100).toFixed(1)}% más barato)`
            });
        }

        // Recomendar mejor momento de compra
        if (seasonality.bestTimeToBuy) {
            recommendations.push({
                type: 'info',
                message: `El mejor momento para comprar suele ser los ${seasonality.bestTimeToBuy.dayOfWeek.name} del mes de ${seasonality.bestTimeToBuy.month.name}`
            });
        }

        return recommendations;
    }
  
    static predictBestTime(priceHistory) {
      // Análisis simple de patrones de precio
      // En una implementación real, usaríamos ML
      const weekdayAverages = new Array(7).fill(0).map(() => ({
        sum: 0,
        count: 0
      }))
  
      priceHistory.forEach(record => {
        const day = new Date(record.timestamp).getDay()
        weekdayAverages[day].sum += record.price
        weekdayAverages[day].count++
      })
  
      const averages = weekdayAverages.map(({ sum, count }) => 
        count > 0 ? sum / count : Infinity
      )
  
      const bestDay = averages.indexOf(Math.min(...averages))
      const confidence = 0.6 // Hardcoded por ahora
  
      return {
        day: bestDay,
        confidence
      }
    }
  }