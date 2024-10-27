import { useMetrics } from '../hooks/useMetrics'
import { useState, useEffect } from 'react'
import { OptimizedImage } from './OptimizedImage'
import { useMedia } from '../hooks/useMedia'
import { PriceAlertDialog } from './PriceAlertDialog'
import { PriceHistory } from './PriceHistory'
import { PriceMonitor } from '../lib/priceMonitor'
import { useAffiliate } from '../hooks/useAffiliate'
import { useNotification } from '../context/NotificationContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Bell,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  MousePointerClick,
  BadgeCheck,
  Clock,
  LineChart
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'  // Changed from ../ui/skeleton
import { Badge } from '@/components/ui/badge'  // Changed from ../ui/badge

// Rest of your component code stays exactly the same...
export default function ProductCard({
  id,
  title,
  description,
  price,
  rating = 0,
  store = "amazon",
  image = null,
  position = null,
  category = "general",
  url = null,
  isSponsored = false,
  availability = true
}) {
  const { trackUserInteraction } = useMetrics()
  const { generateAffiliateLink, trackAffiliateClick, getBestPrice } = useAffiliate()
  const { showNotification } = useNotification()
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false)
  const { url: optimizedImageUrl } = useMedia(image)
  const [priceData, setPriceData] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [affiliateLink, setAffiliateLink] = useState(null)
  const [competitorPrices, setCompetitorPrices] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        
        const [
          priceAnalytics,
          priceReport,
          bestPrice,
          newAffiliateLink
        ] = await Promise.all([
          PriceMonitor.getPriceAnalytics(id),
          PriceMonitor.generatePriceReport(id),
          getBestPrice(id),
          generateAffiliateLink(id, store, {
            price,
            category,
            position,
            isSponsored
          })
        ])
  
        setPriceData(priceReport)
        setAffiliateLink(newAffiliateLink)
        setCompetitorPrices(bestPrice ? [bestPrice, ...priceReport?.competitors?.competitors || []] : priceReport?.competitors?.competitors)
  
        await PriceMonitor.initMonitoring(id, {
          currentPrice: price,
          store,
          title,
          category
        })
  
      } catch (error) {
        console.error('Error loading product data:', error)
        showNotification({
          type: 'error',
          message: 'Error cargando datos del producto'
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    loadInitialData()
  }, [id, price, store, title, category, position, isSponsored, generateAffiliateLink, getBestPrice, showNotification])

  // Observer para tracking de visibilidad
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          trackUserInteraction('product_view', { 
            productId: id,
            title,
            position: entry.boundingClientRect.top,
            store,
            category,
            price,
            isSponsored
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const element = document.querySelector(`#product-${id}`)
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [id, title, trackUserInteraction, store, category, price, isSponsored])

  // Manejar click en el producto
  const handleProductClick = async (e) => {
    e.preventDefault()
    
    if (!availability) {
      showNotification({
        type: 'warning',
        message: 'Producto temporalmente no disponible'
      })
      return
    }

    try {
      // Trackear el click
      await trackAffiliateClick(id, store, {
        price,
        category,
        position,
        isSponsored,
        title
      })

      // Abrir en nueva pestaña
      window.open(affiliateLink || url, '_blank', 'noopener,noreferrer')
      
      // Actualizar estado local
      setHasInteracted(true)

    } catch (error) {
      console.error('Error handling product click:', error)
      showNotification({
        type: 'error',
        message: 'Error al procesar el click'
      })
    }
  }

  const PriceTag = () => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${availability ? 'text-blue-600' : 'text-gray-400'} font-geist-sans`}>
          {typeof price === 'number' ? `${price.toFixed(2)}€` : price}
        </span>
        {!isLoading && availability && priceData?.analytics?.trends?.week && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="flex items-center text-sm">
                  {priceData.analytics.trends.week > 0 ? (
                    <TrendingUp className="text-red-500 w-4 h-4" />
                  ) : (
                    <TrendingDown className="text-green-500 w-4 h-4" />
                  )}
                  {Math.abs(priceData.analytics.trends.week).toFixed(1)}%
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Variación última semana</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {isSponsored && (
          <Badge variant="outline" className="text-xs">
            Patrocinado
          </Badge>
        )}
      </div>
      {!isLoading && competitorPrices?.[0]?.price < price && (
        <span className="text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Mejor precio: {competitorPrices[0].price.toFixed(2)}€ en {competitorPrices[0].store}
        </span>
      )}
    </div>
  )

  const ProductMetrics = () => (
    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-left">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Histórico</span>
              </div>
              <p className="font-medium">
                {priceData?.analytics?.stats?.lowestPrice ? 
                  `Min: ${priceData.analytics.stats.lowestPrice.toFixed(2)}€` :
                  'Sin datos'
                }
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Precio más bajo registrado</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div className="text-left">
              <div className="flex items-center gap-1 text-gray-500">
                <LineChart className="w-4 h-4" />
                <span>Tendencia</span>
              </div>
              <p className="font-medium">
                {priceData?.analytics?.prediction ? 
                  `${priceData.analytics.prediction.estimated.toFixed(2)}€` :
                  'Sin predicción'
                }
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Predicción de precio a 30 días</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )

  return (
    <div 
      id={`product-${id}`}
      className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } hover:shadow-xl hover:-translate-y-1 ${!availability ? 'opacity-75' : ''}`}
    >
      <div className="p-4 space-y-4">
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <>
              {!availability && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                  <span className="text-white font-medium">No disponible</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {priceData?.analytics?.stats?.lowestPrice === price && (
                  <Badge className="bg-green-500">Mejor Precio</Badge>
                )}
                {isSponsored && (
                  <Badge variant="outline">Patrocinado</Badge>
                )}
              </div>
              {image ? (
                <OptimizedImage
                  src={optimizedImageUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                  priority={false}
                  onLoad={() => trackUserInteraction('product_image_loaded', { 
                    productId: id,
                    loadTime: performance.now()
                  })}
                  onError={() => trackUserInteraction('product_image_error', { 
                    productId: id,
                    imageUrl: image
                  })}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm text-gray-500 font-geist-sans">
                    Imagen no disponible
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <h3 className="text-lg font-bold font-geist-sans line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        )}

        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600 font-geist-sans">
              ({rating.toFixed(1)}/5)
            </span>
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <p className="text-gray-600 text-sm font-geist-sans line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <PriceTag />
          <span className="text-sm text-gray-500 font-geist-sans">
            en {store}
          </span>
        </div>

        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <button
            onClick={handleProductClick}
            disabled={!availability}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-geist-sans transition-all ${
              availability 
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Ver Precio
            <ExternalLink className="w-4 h-4" />
          </button>
        )}

        {!isLoading && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <button
              onClick={() => setIsPriceAlertOpen(true)}
              disabled={!availability}
              className={`w-full flex items-center justify-center gap-2 text-sm py-2 rounded-lg border transition-colors ${
                availability
                  ? 'text-gray-600 hover:text-blue-600 border-gray-200 hover:border-blue-200'
                  : 'text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <Bell className="w-4 h-4" />
              Alertas de precio
            </button>

            <button>
              <Bell className="w-4 h-4" />
              Alertas de precio
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 text-sm py-2"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver detalles
                </>
              )}
            </button>
          </div>
        )}

        {showDetails && !isLoading && (
          <div className="space-y-6 pt-4">
            {ProductMetrics}
            <PriceHistory 
              priceData={priceData} 
              currentPrice={price}
              isLoading={isLoading}
              competitorPrices={competitorPrices}
            />
            {priceData?.recommendations && (
              <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-orange-900 flex items-center gap-2">
                  Recomendaciones
                </h4>
                {priceData.recommendations.map((rec, index) => (
                  <p key={index} className={`text-sm flex items-center gap-2 ${
                    rec.type === 'warning' ? 'text-amber-700' :
                    rec.type === 'alert' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {rec.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <PriceAlertDialog
          open={isPriceAlertOpen}
          onOpenChange={setIsPriceAlertOpen}
          product={{
            id,
            title,
            price,
            store,
            category,
            availability
          }}
          priceData={priceData}
          onAlertCreate={(alertId, conditions) => {
            trackUserInteraction('price_alert_created', {
              productId: id,
              alertId,
              conditions,
              store,
              category,
              price
            });
            
            showNotification({
              type: 'success',
              message: 'Alerta de precio configurada correctamente'
            });
          }}
        />
      </div>
    </div>
  )
}