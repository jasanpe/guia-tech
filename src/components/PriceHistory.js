import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

export function PriceHistory({ priceData, currentPrice }) {
  if (!priceData?.priceHistory) return null;

  const formatData = () => {
    return priceData.priceHistory.map(record => ({
      date: new Date(record.timestamp).toLocaleDateString(),
      price: record.price,
      competitor: record.store !== priceData.store ? record.store : null
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-blue-600 font-bold">{payload[0].value.toFixed(2)}€</p>
          {payload[0].payload.competitor && (
            <p className="text-xs text-gray-500">en {payload[0].payload.competitor}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Historial de Precios
        </h3>
        
        {priceData.analytics?.trends?.month && (
          <span className="text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {Math.abs(priceData.analytics.trends.month).toFixed(1)}% último mes
          </span>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatData()} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              tick={{ fontSize: 12 }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-gray-500">Mejor momento para comprar</p>
          <p className="font-medium">
            {priceData.seasonality?.bestTimeToBuy?.dayOfWeek.name} de{' '}
            {priceData.seasonality?.bestTimeToBuy?.month.name}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Predicción a 30 días</p>
          <p className={`font-medium flex items-center gap-1 ${
            priceData.analytics?.prediction?.estimated < currentPrice 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {priceData.analytics?.prediction?.estimated.toFixed(2)}€
            {Math.abs(((priceData.analytics?.prediction?.estimated - currentPrice) / currentPrice) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      {priceData.recommendations && priceData.recommendations.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg space-y-2">
          {priceData.recommendations.map((rec, index) => (
            <p key={index} className="text-sm text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {rec.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}