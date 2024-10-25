import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data para demostración
const MOCK_STORES = [
  { id: 'amazon', name: 'Amazon' },
  { id: 'pccomponentes', name: 'PcComponentes' },
  { id: 'aliexpress', name: 'AliExpress' }
]

const MOCK_TESTS = [
  {
    id: 'product_card_button',
    progress: 65.4,
    results: {
      results: {
        'Ver Precio': { views: 1200, clicks: 180, ctr: 15, conversionRate: 3.2 },
        'Comprar Ahora': { views: 1150, clicks: 160, ctr: 13.9, conversionRate: 2.8 },
        'Ver Oferta': { views: 1180, clicks: 170, ctr: 14.4, conversionRate: 3.0 }
      }
    }
  },
  {
    id: 'product_card_layout',
    progress: 45.2,
    results: {
      results: {
        'standard': { views: 800, clicks: 120, ctr: 15, conversionRate: 3.5 },
        'compact': { views: 780, clicks: 125, ctr: 16, conversionRate: 3.8 },
        'detailed': { views: 820, clicks: 115, ctr: 14, conversionRate: 3.2 }
      }
    }
  }
]

const MOCK_STATS = {
  total: 2500,
  lastDay: 150,
  byStore: {
    amazon: 1200,
    pccomponentes: 800,
    aliexpress: 500
  }
}

export default function ConversionDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTests, setActiveTests] = useState(MOCK_TESTS)
  const [affiliateStats, setAffiliateStats] = useState(MOCK_STATS)
  
  useEffect(() => {
    // En una implementación real, aquí obtendríamos los datos del backend
    const updateData = () => {
      // Simular actualización de datos
      setActiveTests(MOCK_TESTS)
      setAffiliateStats(MOCK_STATS)
    }
    
    updateData()
    const interval = setInterval(updateData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!affiliateStats) {
    return <div className="p-8 text-center">Cargando datos...</div>
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Panel de Conversiones
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="24h">Últimas 24h</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Clicks Totales
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {affiliateStats.total}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Último Día
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {affiliateStats.lastDay}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Tests Activos
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {activeTests.length}
          </p>
        </div>
      </div>

      {/* Gráfico de Conversiones */}
      <div className="h-80 bg-gray-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeTests.map(test => ({
            name: test.id,
            ctr: test.results ? Object.values(test.results.results)[0].ctr : 0,
            conversion: test.results ? Object.values(test.results.results)[0].conversionRate : 0
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ctr" stroke="#2563eb" name="CTR %" />
            <Line type="monotone" dataKey="conversion" stroke="#16a34a" name="Conversión %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tests A/B Activos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Tests A/B Activos
        </h3>
        <div className="space-y-4">
          {activeTests.map(test => (
            <div key={test.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg">{test.id}</h4>
                <span className="text-sm text-gray-500">
                  Progreso: {test.progress.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(test.results.results).map(([variant, data]) => (
                  <div key={variant} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium mb-2">{variant}</p>
                    <div className="space-y-1 text-sm">
                      <p>Views: {data.views}</p>
                      <p>Clicks: {data.clicks}</p>
                      <p>CTR: {data.ctr.toFixed(2)}%</p>
                      <p>Conv: {data.conversionRate.toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendimiento por Tienda */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Rendimiento por Tienda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_STORES.map(store => {
            const storeStats = affiliateStats.byStore[store.id] || 0
            return (
              <div key={store.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{store.name}</h4>
                  <span className="text-sm text-gray-500">
                    {((storeStats / affiliateStats.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {storeStats}
                </p>
                <p className="text-sm text-gray-500">clicks totales</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}