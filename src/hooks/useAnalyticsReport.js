import { useState, useEffect } from 'react'
import { AnalyticsReporter } from '../lib/analytics/reporter'

export function useAnalyticsReport(type, options = {}) {
  const [report, setReport] = useState(null)

  useEffect(() => {
    const initialReport = AnalyticsReporter.getReport(type, options)
    setReport(initialReport)

    const unsubscribe = AnalyticsReporter.subscribe(type, (updatedReport) => {
      setReport(updatedReport)
    })

    return unsubscribe
  }, [type, options])

  return {
    data: report?.data || [],
    lastUpdated: report?.lastUpdated,
    aggregated: options.aggregate ? 
      AnalyticsReporter.aggregateData(type, options.aggregate) : 
      null
  }
}