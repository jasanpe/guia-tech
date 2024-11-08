import React from 'react';
import { Camera } from 'lucide-react';

export default function OfferAlert({ isOpen, onClose, offer }) {
  if (!isOpen || !offer) return null;

  const savings = ((offer.originalPrice - offer.currentPrice) / offer.originalPrice * 100).toFixed(0);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleOfferClick = () => {
    if (offer.url) {
      window.open(offer.url, '_blank');
    }
    handleClose();
  };

  // Detener la propagación del click en el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6"
        onClick={handleModalClick}
      >
        {/* Contenido */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="fire">🔥</span>
              <h2 className="text-xl font-bold font-geist-sans">¡Oferta Destacada!</h2>
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-blue-900 font-geist-sans">{offer.title}</h3>
              {offer.category === 'smartphone' && <Camera className="text-blue-500" size={24} />}
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="text-2xl font-bold text-blue-600 font-geist-sans">{offer.currentPrice}€</span>
              <span className="text-gray-500 line-through font-geist-sans">{offer.originalPrice}€</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                -{savings}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span>Tienda: {offer.store}</span>
            <span>Quedan: {offer.stock} unidades</span>
          </div>

          {offer.expiresIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 text-center mb-4">
              ⏰ Oferta válida durante las próximas {offer.expiresIn} horas
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6">{offer.description}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ahora no
            </button>
            <button
              onClick={handleOfferClick}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}