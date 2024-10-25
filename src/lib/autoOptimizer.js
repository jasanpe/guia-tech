import { PerformanceMonitor } from './performanceMonitor'
import { CachingSystem } from './cachingSystem'
import { ResourceLoader } from './resourceLoader'

export class AutoOptimizer {
  static optimizationLevels = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  }

  static currentLevel = 'low'
  static autoOptimizing = false

  static init() {
    if (typeof window === 'undefined') return

    this.startMonitoring()
    this.applyInitialOptimizations()
  }

  static startMonitoring() {
    setInterval(() => {
      const metrics = PerformanceMonitor.getMetrics()
      this.adjustOptimizationLevel(metrics)
    }, 5000) // Revisar cada 5 segundos
  }

  static adjustOptimizationLevel(metrics) {
    const {
      fps: { current: currentFPS },
      memory: { current: memoryUsage },
      network: { averageLoadTime }
    } = metrics

    let newLevel = this.optimizationLevels.LOW

    if (currentFPS < 30 || memoryUsage > 0.8 || averageLoadTime > 3000) {
      newLevel = this.optimizationLevels.HIGH
    } else if (currentFPS < 45 || memoryUsage > 0.6 || averageLoadTime > 2000) {
      newLevel = this.optimizationLevels.MEDIUM
    }

    if (newLevel !== this.currentLevel) {
      this.currentLevel = newLevel
      this.applyOptimizations()
    }
  }

  static applyInitialOptimizations() {
    // Optimizaciones básicas iniciales
    this.optimizeImages()
    this.optimizeNetworkRequests()
    this.optimizeAnimations()
  }

  static applyOptimizations() {
    switch (this.currentLevel) {
      case this.optimizationLevels.HIGH:
        this.applyHighOptimizations()
        break
      case this.optimizationLevels.MEDIUM:
        this.applyMediumOptimizations()
        break
      case this.optimizationLevels.LOW:
        this.applyLowOptimizations()
        break
    }
  }

  static applyHighOptimizations() {
    this.disableNonEssentialAnimations()
    this.reduceCacheSize()
    this.pauseNonEssentialNetworkRequests()
    this.unloadNonVisibleImages()
  }

  static applyMediumOptimizations() {
    this.reduceAnimationQuality()
    this.optimizeImageQuality()
    this.limitConcurrentRequests()
  }

  static applyLowOptimizations() {
    this.restoreDefaultSettings()
    this.enablePrefetching()
  }

  static optimizeImages() {
    const imageElements = document.querySelectorAll('img[data-optimizable]')
    imageElements.forEach(img => {
      const originalSrc = img.src
      switch (this.currentLevel) {
        case this.optimizationLevels.HIGH:
          img.src = this.getLowQualityImage(originalSrc)
          break
        case this.optimizationLevels.MEDIUM:
          img.src = this.getMediumQualityImage(originalSrc)
          break
        default:
          img.src = originalSrc
      }
    })
  }

  static optimizeNetworkRequests() {
    const maxConcurrent = {
      [this.optimizationLevels.LOW]: 6,
      [this.optimizationLevels.MEDIUM]: 4,
      [this.optimizationLevels.HIGH]: 2
    }

    ResourceLoader.setMaxConcurrentRequests(maxConcurrent[this.currentLevel])
  }

  static optimizeAnimations() {
    const animatedElements = document.querySelectorAll('[data-animated]')
    animatedElements.forEach(el => {
      switch (this.currentLevel) {
        case this.optimizationLevels.HIGH:
          el.style.transition = 'none'
          break
        case this.optimizationLevels.MEDIUM:
          el.style.transition = 'all 0.3s linear'
          break
        default:
          el.style.transition = ''
      }
    })
  }

  static getLowQualityImage(originalSrc) {
    return originalSrc.replace(/\.(jpg|png)/, '-low.$1')
  }

  static getMediumQualityImage(originalSrc) {
    return originalSrc.replace(/\.(jpg|png)/, '-medium.$1')
  }

  static disableNonEssentialAnimations() {
    document.body.classList.add('reduce-motion')
  }

  static reduceCacheSize() {
    CachingSystem.reduceCacheSize(0.5) // Reducir al 50%
  }

  static pauseNonEssentialNetworkRequests() {
    ResourceLoader.pauseNonEssentialRequests()
  }

  static unloadNonVisibleImages() {
    const images = document.querySelectorAll('img[data-optimizable]')
    images.forEach(img => {
      if (!this.isElementInViewport(img)) {
        img.dataset.src = img.src
        img.src = ''
      }
    })
  }

  static isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  }

  static optimizeForConnection() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      switch (connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          this.currentLevel = this.optimizationLevels.HIGH
          break
        case '3g':
          this.currentLevel = this.optimizationLevels.MEDIUM
          break
        case '4g':
          this.currentLevel = this.optimizationLevels.LOW
          break
      }
      this.applyOptimizations()
    }
  }
}