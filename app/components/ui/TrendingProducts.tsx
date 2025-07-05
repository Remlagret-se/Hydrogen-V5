import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface TrendingProductsProps {
  products: Product[];
  currentMarket?: any;
}

export default function TrendingProducts({
  products,
  currentMarket,
}: TrendingProductsProps) {
  // Take first 4 products for trending display
  const trendingProducts = products.slice(0, 4);

  if (!trendingProducts.length) {
    return null;
  }

  const marketPathPrefix = currentMarket?.pathPrefix || '';

  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Populära produkter
          </h2>
          <Link
            to={`${marketPathPrefix}/collections/all`}
            className="hidden text-sm font-semibold text-blue-600 hover:text-blue-500 sm:block group"
          >
            Se alla produkter
            <ArrowRightIcon className="ml-1 w-4 h-4 inline group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="relative mt-8">
          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
            <ul
              role="list"
              className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
            >
              {trendingProducts.map((product) => {
                const firstVariant = product.variants?.nodes?.[0];
                if (!firstVariant) return null;

                return (
                  <li
                    key={product.id}
                    className="inline-flex w-64 flex-col text-center lg:w-auto"
                  >
                    <div className="group relative">
                      <div className="aspect-square w-full rounded-md bg-gray-200 overflow-hidden">
                        {product.featuredImage?.url ? (
                          <Image
                            data={product.featuredImage}
                            loading="lazy"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm">
                              Ingen bild
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-gray-500">
                          {product.vendor}
                        </p>
                        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
                          <Link
                            to={`${marketPathPrefix}/products/${product.handle}`}
                          >
                            <span className="absolute inset-0" />
                            {product.title}
                          </Link>
                        </h3>
                        <div className="mt-1 text-gray-900">
                          {firstVariant.price && (
                            <Money data={firstVariant.price} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product specifications for bearings */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300">
                          <span className="sr-only">Standard</span>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-blue-500 border border-gray-300">
                          <span className="sr-only">Precisionsklassad</span>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-gray-300">
                          <span className="sr-only">Högprecision</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Tillgängliga klasser
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex px-4 sm:hidden">
          <Link
            to={`${marketPathPrefix}/collections/all`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 group"
          >
            Se alla produkter
            <ArrowRightIcon className="ml-1 w-4 h-4 inline group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}

