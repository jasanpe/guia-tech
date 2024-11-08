import React from 'react'

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
    <div className="relative h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
    </div>
  </div>
)

export default ProductCardSkeleton