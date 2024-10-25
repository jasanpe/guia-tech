import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    
    // Simular envío
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus(''), 3000)
    }, 1000)
  }

  return (
    <div className="bg-blue-50 p-8 rounded-lg">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-blue-600 mb-4 font-geist-sans">
          Mantente actualizado
        </h3>
        <p className="text-gray-600 mb-6 font-geist-sans">
          Suscríbete para recibir las últimas reviews, comparativas y ofertas exclusivas
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="Tu email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-geist-sans"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'sending'}
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-geist-sans disabled:opacity-50"
          >
            {status === 'sending' ? 'Enviando...' : 'Suscribirse'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-600 mt-4 font-geist-sans">
            ¡Gracias por suscribirte! Revisa tu email para confirmar la suscripción.
          </p>
        )}
      </div>
    </div>
  )
}