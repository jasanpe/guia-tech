import { Analytics } from '../analytics'

export class AnalyticsReporter {
  static reports = new Map()
  static activeSubscriptions = new Set()

  static init() {
    this.setupRealtimeReporting()
    this.startPeriodicReports()
  }

  static setupRealtimeReporting() {
    Analytics.on('pageView', (data) => {
      this.processRealtimeData('pageView', data)
    })

    Analytics.on('event', (data) => {
      this.processRealtimeData('event', data)
    })
  }

  static processRealtimeData(type, data) {
    const report = this.getOrCreateReport(type)
    report.data.push({
      ...data,
      timestamp: Date.now()
    })

    // Mantener solo los últimos 1000 registros
    if (report.data.length > 1000) {
      report.data.shift()
    }

    this.notifySubscribers(type)
  }

  static getOrCreateReport(type) {
    if (!this.reports.has(type)) {
      this.reports.set(type, {
        type,
        data: [],
        lastUpdated: Date.now()
      })
    }
    return this.reports.get(type)
  }

  static startPeriodicReports() {
    // Reportes cada hora
    setInterval(() => {
      this.generatePeriodicReport()
    }, 3600000)
  }

  static generatePeriodicReport() {
    const now = Date.now()
    const hourAgo = now - 3600000

    const report = {
      timestamp: now,
      metrics: {
        pageViews: 0,
        events: 0,
        uniqueUsers: new Set(),
        topPages: new Map(),
        eventTypes: new Map()
      }
    }

    // Analizar datos de pageViews
    const pageViews = this.getOrCreateReport('pageView').data
      .filter(pv => pv.timestamp > hourAgo)

    pageViews.forEach(pv => {
      report.metrics.pageViews++
      report.metrics.uniqueUsers.add(pv.userId)
      
      const pageCount = report.metrics.topPages.get(pv.url) || 0
      report.metrics.topPages.set(pv.url, pageCount + 1)
    })

    // Analizar eventos
    const events = this.getOrCreateReport('event').data
      .filter(e => e.timestamp > hourAgo)

    events.forEach(event => {
      report.metrics.events++
      const eventCount = report.metrics.eventTypes.get(event.type) || 0
      report.metrics.eventTypes.set(event.type, eventCount + 1)
    })

    // Convertir Sets y Maps a objetos para almacenamiento
    report.metrics.uniqueUsers = report.metrics.uniqueUsers.size
    report.metrics.topPages = Object.fromEntries(report.metrics.topPages)
    report.metrics.eventTypes = Object.fromEntries(report.metrics.eventTypes)

    this.saveReport(report)
  }

  static saveReport(report) {
    // Aquí implementaremos el almacenamiento persistente
    console.log('Report saved:', report)
  }

  static subscribe(type, callback) {
    const subscription = { type, callback }
    this.activeSubscriptions.add(subscription)
    return () => this.activeSubscriptions.delete(subscription)
  }

  static notifySubscribers(type) {
    const report = this.getOrCreateReport(type)
    this.activeSubscriptions.forEach(sub => {
      if (sub.type === type) {
        sub.callback(report)
      }
    })
  }

  static getReport(type, options = {}) {
    const report = this.getOrCreateReport(type)
    const { startTime, endTime } = options

    if (!startTime && !endTime) {
      return report
    }

    return {
      ...report,
      data: report.data.filter(item => 
        (!startTime || item.timestamp >= startTime) &&
        (!endTime || item.timestamp <= endTime)
      )
    }
  }

  static aggregateData(type, aggregation = 'hour') {
    const report = this.getOrCreateReport(type)
    const aggregated = new Map()

    report.data.forEach(item => {
      const key = this.getAggregationKey(item.timestamp, aggregation)
      if (!aggregated.has(key)) {
        aggregated.set(key, [])
      }
      aggregated.get(key).push(item)
    })

    return Array.from(aggregated.entries()).map(([key, items]) => ({
      timestamp: key,
      count: items.length,
      data: items
    }))
  }

  static getAggregationKey(timestamp, aggregation) {
    const date = new Date(timestamp)
    switch (aggregation) {
      case 'minute':
        return new Date(date.setSeconds(0, 0)).getTime()
      case 'hour':
        return new Date(date.setMinutes(0, 0, 0)).getTime()
      case 'day':
        return new Date(date.setHours(0, 0, 0, 0)).getTime()
      default:
        return timestamp
    }
  }
}