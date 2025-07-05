import {Image} from '@shopify/hydrogen';
import type {Image as ShopifyImageType} from '@shopify/hydrogen/storefront-api-types';

interface ShopifyImageProps {
  data?: ShopifyImageType | null;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackText?: string;
}

export function ShopifyImage({
  data,
  className = '',
  sizes = '(min-width: 768px) 50vw, 100vw',
  loading = 'lazy',
  aspectRatio,
  objectFit = 'cover',
  fallbackText = 'No image available',
}: ShopifyImageProps) {
  const containerStyles = {
    aspectRatio,
  };

  if (!data?.url) {
    return (
      <div
        className={`relative bg-gray-200 flex items-center justify-center ${className}`}
        style={containerStyles}
      >
        <div className="text-gray-400 text-sm text-center p-4">
          {fallbackText}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={containerStyles}
    >
      <Image
        data={data}
        sizes={sizes}
        loading={loading}
        className="w-full h-full"
        style={{
          objectFit,
          objectPosition: 'center',
        }}
      />
    </div>
  );
}
