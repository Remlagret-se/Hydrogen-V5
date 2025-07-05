import {motion} from 'framer-motion';
import {ShopifyImage} from './ShopifyImage';
import {Money} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface ShopifyProductCardProps {
  product: Pick<
    Product,
    | 'id'
    | 'title'
    | 'handle'
    | 'featuredImage'
    | 'priceRange'
    | 'vendor'
    | 'productType'
  >;
  className?: string;
  loading?: 'lazy' | 'eager';
  showVendor?: boolean;
  showProductType?: boolean;
}

export function ShopifyProductCard({
  product,
  className = '',
  loading = 'lazy',
  showVendor = true,
  showProductType = false,
}: ShopifyProductCardProps) {
  return (
    <motion.div
      whileHover={{scale: 1.02}}
      whileTap={{scale: 0.98}}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <a href={`/products/${product.handle}`} className="block">
        <div className="aspect-square bg-gray-200 group-hover:opacity-95 transition-opacity">
          <ShopifyImage
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="w-full h-full"
            fallbackText="No product image"
          />
        </div>

        <div className="flex flex-1 flex-col space-y-2 p-4">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {(showVendor || showProductType) && (
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">
              {showVendor && product.vendor && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.vendor}
                </span>
              )}
              {showProductType && product.productType && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.productType}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-1 flex-col justify-end">
            <div className="text-base font-medium text-gray-900">
              <Money data={product.priceRange.minVariantPrice} />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
