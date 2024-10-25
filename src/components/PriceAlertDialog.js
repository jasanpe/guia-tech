import { useState } from 'react';
import { Bell, AlertTriangle, TrendingDown, Info } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction 
} from '@/components/ui/alert-dialog';
import { PriceMonitor } from '../lib/priceMonitor';

export function PriceAlertDialog({ 
  open, 
  onOpenChange, 
  product, 
  priceData,
  onAlertCreate 
}) {
  const [targetPrice, setTargetPrice] = useState(product.price * 0.9);
  const [alertType, setAlertType] = useState('target'); // 'target' | 'any' | 'historical'
  const [notificationMethod, setNotificationMethod] = useState('email');

  const handleCreateAlert = async () => {
    try {
      const conditions = {
        targetPrice: alertType === 'target' ? targetPrice : null,
        dropPercentage: alertType === 'any' ? 5 : null,
        historicalLow: alertType === 'historical',
        anyDrop: alertType === 'any'
      };

      const alertId = await PriceMonitor.createPriceAlert('user123', product.id, conditions);
      
      if (onAlertCreate) {
        onAlertCreate(alertId, conditions);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating price alert:', error);
    }
  };

  const getBestTimeRecommendation = () => {
    if (!priceData?.seasonality?.bestTimeToBuy) return null;
    
    const { month, dayOfWeek } = priceData.seasonality.bestTimeToBuy;
    return `${dayOfWeek.name} de ${month.name}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <Bell className="w-5 h-5" />
            Configurar Alerta de Precio
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-6">
            {/* Información del Producto */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">{product.title}</h3>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-blue-700">
                  Precio actual: {product.price}€
                </span>
                {priceData?.analytics?.trends?.week && (
                  <span className="flex items-center gap-1 text-sm">
                    <TrendingDown className="w-4 h-4" />
                    {Math.abs(priceData.analytics.trends.week).toFixed(1)}% última semana
                  </span>
                )}
              </div>
            </div>

            {/* Tipo de Alerta */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Tipo de Alerta</h4>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="alertType"
                    value="target"
                    checked={alertType === 'target'}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">
                    <span className="font-medium text-gray-900">Precio objetivo</span>
                    <p className="text-sm text-gray-500">
                      Notificarme cuando el precio baje de:
                    </p>
                    <div className="mt-2">
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-24 px-2 py-1 border rounded"
                        step="0.01"
                        disabled={alertType !== 'target'}
                      />
                      <span className="ml-1">€</span>
                    </div>
                  </span>
                </label>

                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="alertType"
                    value="any"
                    checked={alertType === 'any'}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">
                    <span className="font-medium text-gray-900">Cualquier bajada</span>
                    <p className="text-sm text-gray-500">
                      Notificarme cuando haya cualquier reducción de precio
                    </p>
                  </span>
                </label>

                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="alertType"
                    value="historical"
                    checked={alertType === 'historical'}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">
                    <span className="font-medium text-gray-900">Mínimo histórico</span>
                    <p className="text-sm text-gray-500">
                      Notificarme solo cuando alcance su precio más bajo
                    </p>
                  </span>
                </label>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Método de notificación</h4>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={notificationMethod === 'email'}
                    onChange={(e) => setNotificationMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="push"
                    checked={notificationMethod === 'push'}
                    onChange={(e) => setNotificationMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notificación push</span>
                </label>
              </div>
            </div>

            {/* Recomendaciones */}
            {priceData?.recommendations && (
              <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-orange-900 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Análisis de precio
                </h4>
                {priceData.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {rec.message}
                  </p>
                ))}
                {getBestTimeRecommendation() && (
                  <p className="text-sm text-orange-800 mt-2">
                    Mejor momento para comprar: {getBestTimeRecommendation()}
                  </p>
                )}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleCreateAlert}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Crear Alerta
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}