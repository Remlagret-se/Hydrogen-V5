import {useMoney} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useLocale} from '@remix-run/react';

export function ProductPrice({
  price,
  compareAtPrice,
  currencyCode,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  currencyCode?: string;
}) {
  const locale = useLocale();
  
  // If no price is provided, return null
  if (!price) return null;

  // Format the price using the current locale and currency
  const formattedPrice = useMoney(price, {
    locale: locale.language,
    currency: currencyCode,
  });

  // Format the compare at price if it exists
  const formattedCompareAtPrice = compareAtPrice
    ? useMoney(compareAtPrice, {
        locale: locale.language,
        currency: currencyCode,
      })
    : null;

  // Calculate discount percentage if there's a compare at price
  const discount = compareAtPrice
    ? Math.round(
        ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
          100,
      )
    : 0;

  return (
    <div className="product-price">
      <div className="flex items-center space-x-3">
        {/* Regular price */}
        <span
          className={`text-lg font-medium ${
            compareAtPrice ? 'text-red-600' : 'text-gray-900'
          }`}
        >
          {formattedPrice.withoutTrailingZeros}
        </span>

        {/* Compare at price and discount badge */}
        {compareAtPrice && (
          <>
            <span className="text-gray-500 line-through text-sm">
              {formattedCompareAtPrice?.withoutTrailingZeros}
            </span>
            <span className="text-red-600 text-sm font-medium">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Price per unit if available */}
      {price.unitPrice && (
        <div className="text-gray-500 text-sm mt-1">
          {useMoney(price.unitPrice, {
            locale: locale.language,
            currency: currencyCode,
          }).withoutTrailingZeros}
          /{price.unitPriceMeasurement?.referenceUnit}
        </div>
      )}

      {/* Tax information */}
      <div className="text-gray-500 text-sm mt-1">
        {locale.language.startsWith('sv')
          ? 'Inkl. moms'
          : locale.language.startsWith('en')
          ? 'VAT included'
          : 'Inkl. MVA'}
      </div>
    </div>
  );
}
