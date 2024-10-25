import React from 'react'
import { PerformanceMonitor } from './performanceMonitor'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })

    PerformanceMonitor.reportError(error, 'ErrorBoundary', {
      component: this.props.componentName,
      errorInfo
    })

    if (this.state.retryCount < 3) {
      setTimeout(() => {
        this.setState(state => ({
          hasError: false,
          retryCount: state.retryCount + 1
        }))
      }, 2000)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 rounded-lg">
          <h2 className="text-red-600 font-bold mb-2 font-geist-sans">
            Algo salió mal
          </h2>
          <p className="text-gray-600 mb-4 font-geist-sans">
            Estamos intentando resolver el problema
          </p>
          {this.state.retryCount < 3 && (
            <p className="text-sm text-gray-500 font-geist-sans">
              Reintentando en unos segundos...
            </p>
          )}
        </div>
      )
    }

    return this.props.children
  }
}