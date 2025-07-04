import React from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';

export function ProductCard({
  product,
  loading = 'lazy',
}: {
  product: Product;
  loading?: HTMLImageElement['loading'];
}) {
  const variant = product.variants?.nodes?.[0];

  if (!variant) {
    return null;
  }

  return (
    <Link
      className="group text-sm"
      key={product.id}
      to={`/products/${product.handle}`}
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg border group-hover:opacity-75 transition-opacity" style={{ borderColor: 'var(--gray-6)' }}>
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>
      <h3 className="mt-4 font-medium" style={{ color: 'var(--gray-12)' }}>
        {product.title}
      </h3>
      <div className="mt-2 flex items-center justify-between">
        <div style={{ color: 'var(--gray-11)' }}>
          <Money data={variant.price || { amount: '0', currencyCode: 'SEK' }} />
        </div>
      </div>
      {variant?.compareAtPrice && (
        <div className="mt-1 text-sm line-through" style={{ color: 'var(--gray-9)' }}>
          <Money data={variant.compareAtPrice} />
        </div>
      )}
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full rounded-lg" style={{ backgroundColor: 'var(--gray-4)' }} />
      <div className="mt-4 h-4 rounded" style={{ backgroundColor: 'var(--gray-4)' }} />
      <div className="mt-2 h-4 w-1/2 rounded" style={{ backgroundColor: 'var(--gray-4)' }} />
    </div>
  );
} 