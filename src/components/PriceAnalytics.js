import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const MOCK_PRICE_HISTORY = [
  { date: '2023-10', price: 1499, avg: 1520, lowest: 1499, highest: 1599 },
  { date: '2023-11', price: 1459, avg: 1490, lowest: 1459, highest: 1559 },
  { date: '2023-12', price: 1499, avg: 1480, lowest: 1449, highest: 1529 },
  { date: '2024-01', price: 1399, avg: 1450, lowest: 1399, highest: 1499 },
  { date: '2024-02', price: 1459, avg: 1440, lowest: 1379, highest: 1479 },
  { date: '2024-03', price: 1399, avg: 1420, lowest: 1359, highest: 1459 }
]

const PRICE_PREDICTIONS = {
  nextMonth: { min: 1349, max: 1429, confidence: 0.85 },
  bestTime: { month: 'Mayo', predictedPrice: 1299, confidence: 0.75 }
}

export default function PriceAnalytics({ productId, productName }) {
  const [timeRange, setTimeRange] = useState('6m')
  const [showPredictions, setShowPredictions] = useState(true)
  
  const formatPrice = (price) => `${price}€`
  const formatDate = (date) => {
    const [year, month] = date.split('-')
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${months[parseInt(month) - 1]} ${year.slice(2)}`
  }

  const stats = {
    currentPrice: MOCK_PRICE_HISTORY[MOCK_PRICE_HISTORY.length - 1].price,
    lowestPrice: Math.min(...MOCK_PRICE_HISTORY.map(d => d.lowest)),
    highestPrice: Math.max(...MOCK_PRICE_HISTORY.map(d => d.highest)),
    averagePrice: Math.round(MOCK_PRICE_HISTORY.reduce((acc, d) => acc + d.avg, 0) / MOCK_PRICE_HISTORY.length)
  }

  const getPriceIndicator = (current, lowest, highest) => {
    const range = highest - lowest
    const position = ((current - lowest) / range) * 100
    
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full mt-1">
        <div
          className="absolute h-4 w-4 -mt-1 rounded-full bg-blue-600 border-2 border-white shadow-lg"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
        <div className="absolute top-5 left-0 text-xs text-gray-500">
          {formatPrice(lowest)}
        </div>
        <div className="absolute top-5 right-0 text-xs text-gray-500">
          {formatPrice(highest)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Price Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Precio Actual</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(stats.currentPrice)}
                </span>
                <span className="text-sm text-gray-500">
                  vs media {formatPrice(stats.averagePrice)}
                </span>
              </div>
              {getPriceIndicator(stats.currentPrice, stats.lowestPrice, stats.highestPrice)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Precio más bajo</span>
                <p className="font-semibold text-green-600">{formatPrice(stats.lowestPrice)}</p>
              </div>
              <div>
                <span className="text-gray-500">Precio más alto</span>
                <p className="font-semibold text-red-600">{formatPrice(stats.highestPrice)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Predicciones</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Próximo mes</span>
                <span className="text-gray-500">
                  Confianza: {(PRICE_PREDICTIONS.nextMonth.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="font-semibold">
                {formatPrice(PRICE_PREDICTIONS.nextMonth.min)} - {formatPrice(PRICE_PREDICTIONS.nextMonth.max)}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Mejor momento para comprar</span>
                <span className="text-gray-500">
                  Confianza: {(PRICE_PREDICTIONS.bestTime.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="font-semibold">
                {PRICE_PREDICTIONS.bestTime.month} - {formatPrice(PRICE_PREDICTIONS.bestTime.predictedPrice)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Predicciones basadas en histórico y tendencias del mercado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Histórico de Precios</h3>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border rounded-md px-2 py-1"
            >
              <option value="1m">1 mes</option>
              <option value="3m">3 meses</option>
              <option value="6m">6 meses</option>
              <option value="1y">1 año</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showPredictions}
                onChange={(e) => setShowPredictions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Mostrar predicciones
            </label>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_PRICE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9CA3AF"
              />
              <YAxis 
                stroke="#9CA3AF"
                tickFormatter={formatPrice}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip
                formatter={(value) => formatPrice(value)}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563EB" 
                strokeWidth={2}
                name="Precio"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="avg" 
                stroke="#9CA3AF" 
                strokeDasharray="5 5"
                name="Precio medio"
                dot={false}
              />
              {showPredictions && (
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#10B981" 
                  strokeDasharray="3 3"
                  name="Predicción"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Alerts */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">¿Esperas una mejor oferta?</h3>
            <p className="text-blue-700 text-sm mt-1">
              Configura una alerta de precio y te avisaremos cuando baje.
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Crear Alerta
          </button>
        </div>
      </div>
    </div>
  )
}