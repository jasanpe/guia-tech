import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Camera } from "lucide-react"

export default function OfferAlert({ isOpen = false, onClose = () => {}, offer }) {
  const [shouldRender, setShouldRender] = useState(false)
  
  useEffect(() => {
    // Solo mostrar alertas durante el horario comercial (9-22h)
    const now = new Date()
    const hour = now.getHours()
    setShouldRender(hour >= 9 && hour <= 22)
  }, [])

  if (!shouldRender || !offer) return null

  const savings = ((offer.originalPrice - offer.currentPrice) / offer.originalPrice * 100).toFixed(0)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-red-600">🔥</span>
            ¡Oferta Destacada!
          </AlertDialogTitle>
          
          <AlertDialogDescription className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-blue-900">
                  {offer.title}
                </h3>
                {offer.category === 'smartphone' && (
                  <Camera className="text-blue-500" size={24} />
                )}
              </div>
              
              <div className="flex gap-2 items-baseline">
                <span className="text-2xl font-bold text-blue-600">
                  {offer.currentPrice}€
                </span>
                <span className="text-gray-500 line-through">
                  {offer.originalPrice}€
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  -{savings}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Tienda: {offer.store}
              </span>
              <span>
                Quedan: {offer.stock} unidades
              </span>
            </div>

            {offer.expiresIn && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 text-center">
                ⏰ Oferta válida durante las próximas {offer.expiresIn} horas
              </div>
            )}

            <p className="text-sm text-gray-600">
              {offer.description}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogAction
            className="bg-blue-600 text-white hover:bg-blue-700 px-6"
            onClick={() => {
              window.open(offer.url, '_blank')
              onClose()
            }}
          >
            Ver Oferta
          </AlertDialogAction>
          <AlertDialogAction
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Ahora no
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}