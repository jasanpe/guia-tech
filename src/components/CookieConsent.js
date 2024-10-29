import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import Link from 'next/link'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie_consent')
    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-50">
      <div className="max-w-7xl mx-auto">
        <Alert>
          <AlertTitle className="text-lg font-bold mb-2">
            🍪 Uso de Cookies
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-gray-600">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, mostrar contenido relevante
              y analizar el tráfico. También compartimos información sobre tu uso del sitio con nuestros partners
              de análisis y afiliados.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptCookies}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Aceptar todas
              </button>
              <button
                onClick={rejectCookies}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Solo esenciales
              </button>
              <Link
                href="/cookies"
                className="text-blue-600 hover:text-blue-800 px-4 py-2"
              >
                Más información
              </Link>
            </div>

            <p className="text-xs text-gray-500">
                Al hacer clic en &quot;Aceptar todas&quot;, aceptas el almacenamiento de cookies en tu dispositivo 
                para mejorar la navegación del sitio, analizar su uso y colaborar en nuestros esfuerzos de marketing. 
                Lee nuestra{' '}
              <Link href="/privacidad" className="text-blue-600 hover:text-blue-800">
                 política de privacidad
              </Link>{' '}
                  para más información.
              </p>

          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
