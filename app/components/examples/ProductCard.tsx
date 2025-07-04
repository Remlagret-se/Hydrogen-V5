'use client';

// Produktkort - Anpassad från Tailwind UI Plus för Hydrogen
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { StarIcon } from '@heroicons/react/20/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import type { Product } from '@shopify/hydrogen/storefront-api-types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ProductCardProps {
  product: Product;
  loading?: 'eager' | 'lazy';
  variant?: 'default' | 'simple' | 'detailed';
}

export function ProductCard({ product, loading = 'lazy', variant = 'default' }: ProductCardProps) {
  const firstVariant = product.variants?.nodes?.[0];
  
  // Early return if no variant or price data
  if (!firstVariant || !firstVariant.price) {
    return (
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
          {product.featuredImage?.url ? (
            <Image
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 1536px) 12.5vw, (min-width: 1280px) 16.66vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.33vw, 50vw"
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">Ingen bild</span>
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            <Link to={`/products/${product.handle}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>
          <p className="text-xs text-gray-500">{product.vendor}</p>
          <p className="text-sm text-gray-500">Pris ej tillgängligt</p>
        </div>
      </div>
    );
  }
  
  // Simulera produktdata - i verkligheten kommer detta från GraphQL/metafields
  const rating = 4.5;
  const reviewCount = 38;
  const colors = ['bg-gray-900', 'bg-blue-600', 'bg-red-600'];
  
  if (variant === 'simple') {
    return (
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
          {product.featuredImage?.url ? (
            <Image
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 1536px) 12.5vw, (min-width: 1280px) 16.66vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.33vw, 50vw"
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">Ingen bild</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <Link to={`/products/${product.handle}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-gray-500">{product.vendor}</p>
          </div>
          <div className="text-sm font-medium text-gray-900">
            <Money data={firstVariant.price} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
          {product.featuredImage?.url ? (
            <Image
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 1536px) 12.5vw, (min-width: 1280px) 16.66vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.33vw, 50vw"
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">Ingen bild</span>
            </div>
          )}
          <div className="absolute top-0 inset-x-0 p-4 flex items-start justify-between">
            {firstVariant.compareAtPrice && (
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                REA
              </span>
            )}
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 bg-white rounded-full shadow-sm"
            >
              <span className="sr-only">Lägg till i önskelista</span>
              <HeartIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/products/${product.handle}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </Link>
            </h3>
            <p className="text-xs text-gray-500">{product.vendor}</p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <StarIcon
                  key={index}
                  className={classNames(
                    rating > index ? 'text-yellow-400' : 'text-gray-200',
                    'h-4 w-4 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-xs text-gray-500">({reviewCount})</p>
          </div>

          {/* Color options */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Färger:</span>
            <div className="flex space-x-1">
              {colors.map((color) => (
                <span
                  key={color}
                  className={classNames(
                    color,
                    'h-3 w-3 rounded-full border border-black border-opacity-10'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <div className="text-sm font-semibold text-gray-900">
              <Money data={firstVariant.price} />
            </div>
            {firstVariant.compareAtPrice && (
              <div className="text-xs text-gray-500 line-through">
                <Money data={firstVariant.compareAtPrice} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
        {product.featuredImage?.url ? (
          <Image
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 1536px) 12.5vw, (min-width: 1280px) 16.66vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.33vw, 50vw"
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-xs">Ingen bild</span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          <Link to={`/products/${product.handle}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        <p className="text-xs text-gray-500">{product.vendor}</p>
        <div className="text-sm font-medium text-gray-900">
          <Money data={firstVariant.price} />
        </div>
      </div>
    </div>
  );
}

// Product Grid komponent som använder ProductCard
interface ProductGridProps {
  products: Product[];
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ProductGrid({ 
  products, 
  columns = { mobile: 1, tablet: 2, desktop: 5 } 
}: ProductGridProps) {
  const gridClasses = classNames(
    'grid gap-x-4 gap-y-8',
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-4',
    'xl:grid-cols-5',
    '2xl:grid-cols-5'
  );

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <div key={product.id} className="group relative">
          <ProductCard
            product={product}
            loading={index < 4 ? 'eager' : 'lazy'}
            variant="detailed"
          />
        </div>
      ))}
    </div>
  );
}

// Skeleton loader för produktkort
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
} 