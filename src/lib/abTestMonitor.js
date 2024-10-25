export class ABTestMonitor {
    static getActiveTests() {
      return Array.from(ConversionOptimizer.tests.entries()).map(([testId, test]) => {
        const results = ConversionOptimizer.getTestResults(testId)
        return {
          id: testId,
          startDate: test.startDate,
          duration: test.options.duration,
          sampleSize: test.options.sampleSize,
          progress: this.calculateProgress(test),
          significance: this.calculateSignificance(results),
          winner: this.determineWinner(results),
          ...results
        }
      })
    }
  
    static calculateProgress(test) {
      const totalViews = Object.values(test.results)
        .reduce((sum, data) => sum + data.views, 0)
      return (totalViews / test.options.sampleSize) * 100
    }
  
    static calculateSignificance(results) {
      // Implementar cálculo de significancia estadística
      // Retorna un valor entre 0 y 1
      return 0.95 // Placeholder
    }
  
    static determineWinner(results) {
      if (!results) return null
  
      let winner = null
      let bestRate = 0
  
      Object.entries(results.results).forEach(([variant, data]) => {
        const conversionRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
        if (conversionRate > bestRate) {
          bestRate = conversionRate
          winner = {
            variant,
            conversionRate,
            improvement: winner ? ((conversionRate - bestRate) / bestRate) * 100 : 0
          }
        }
      })
  
      return winner
    }
  
    static generateReport() {
      const tests = this.getActiveTests()
      return {
        timestamp: Date.now(),
        tests,
        summary: {
          activeTests: tests.length,
          completedTests: tests.filter(t => t.progress >= 100).length,
          totalImprovement: this.calculateTotalImprovement(tests)
        }
      }
    }
  
    static calculateTotalImprovement(tests) {
      return tests
        .filter(t => t.winner)
        .reduce((sum, test) => sum + (test.winner.improvement || 0), 0)
    }
  }