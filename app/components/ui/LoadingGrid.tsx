import React from 'react';

interface LoadingGridProps {
  count?: number;
}

export function LoadingGrid({ count = 12 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          {/* Product Image Skeleton */}
          <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
          
          {/* Product Title Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Price Skeleton */}
          <div className="mt-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingFiltersProps {}

export function LoadingFilters({}: LoadingFiltersProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j} className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 