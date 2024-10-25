import { useState, useEffect } from 'react';
import { AnalyticsManager } from '../lib/analyticsManager';
import { AffiliateManager } from '../lib/affiliateManager';

export const useProductTracking = (product) => {
  const [metrics, setMetrics] = useState({
    views: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0
  });

  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;

    // Registrar vista del producto
    AnalyticsManager.trackEvent(AnalyticsManager.events.PRODUCT_VIEW, {
      product_id: product.id,
      product_name: product.title,
      product_category: product.category,
      price: product.price
    });

    // Cargar métricas históricas
    loadMetrics();
  }, [product]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Obtener clicks del AffiliateManager
      const clickStats = AffiliateManager.getClickStats();
      const productClicks = clickStats.byStore;

      // Calcular métricas
      const totalClicks = Object.values(productClicks).reduce((a, b) => a + b, 0);
      const productViews = await getProductViews();
      
      setMetrics({
        views: productViews,
        clicks: totalClicks,
        ctr: productViews ? (totalClicks / productViews) * 100 : 0,
        conversions: Math.floor(totalClicks * 0.15) // Estimación de conversión del 15%
      });

    } catch (error) {
      console.error('Error loading metrics:', error);
    }
    setLoading(false);
  };

  const handleClick = async (store) => {
    try {
      // Registrar click en AffiliateManager
      const clickData = AffiliateManager.trackClick(product.id, store, {
        price: product.price,
        category: product.category,
        position: product.position
      });

      // Registrar evento en AnalyticsManager
      AnalyticsManager.trackAffiliateClick({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        store: store,
        position: product.position
      });

      // Actualizar métricas locales
      setMetrics(prev => ({
        ...prev,
        clicks: prev.clicks + 1,
        ctr: ((prev.clicks + 1) / prev.views) * 100
      }));

      return clickData;
    } catch (error) {
      console.error('Error tracking click:', error);
      throw error;
    }
  };

  const getProductViews = async () => {
    // Implementar lógica para obtener vistas del producto
    // Por ahora retornamos un número aleatorio para simular
    return Math.floor(Math.random() * 1000) + 100;
  };

  return {
    metrics,
    loading,
    handleClick,
    priceHistory,
    refresh: loadMetrics
  };
};