import {useCallback, useState} from 'react';
import {useNavigate, useRouteLoaderData} from '@remix-run/react';
import {Listbox} from '@headlessui/react';
import {useMoney} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';

interface Region {
  label: string;
  language: string;
  currency: CurrencyCode;
  country: CountryCode;
  flag: string;
}

const AVAILABLE_REGIONS: Region[] = [
  {
    label: 'Sverige',
    language: 'sv-SE',
    currency: 'SEK',
    country: 'SE',
    flag: '🇸🇪',
  },
  {
    label: 'Norge',
    language: 'nb-NO',
    currency: 'NOK',
    country: 'NO',
    flag: '🇳🇴',
  },
  {
    label: 'Danmark',
    language: 'da-DK',
    currency: 'DKK',
    country: 'DK',
    flag: '🇩🇰',
  },
  {
    label: 'Finland',
    language: 'fi-FI',
    currency: 'EUR',
    country: 'FI',
    flag: '🇫🇮',
  },
  {
    label: 'United States',
    language: 'en-US',
    currency: 'USD',
    country: 'US',
    flag: '🇺🇸',
  },
];

export function RegionBanner() {
  const rootData = useRouteLoaderData('root') as any;
  const currentMarket = rootData?.currentMarket;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentRegion =
    AVAILABLE_REGIONS.find(
      (region) => region.language === currentMarket?.isoCode || 'SE',
    ) || AVAILABLE_REGIONS[0];

  const handleRegionChange = useCallback(
    (region: Region) => {
      // Update the URL to include the new locale
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(
        /^\/[a-zA-Z]{2}-[a-zA-Z]{2}/,
        region.language,
      );

      navigate(newPath, {
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <div className="bg-gray-100 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center space-x-4">
            {/* Region Selector */}
            <div className="relative">
              <Listbox value={currentRegion} onChange={handleRegionChange}>
                <Listbox.Button className="flex items-center space-x-2 hover:text-gray-600">
                  <span className="text-lg">{currentRegion.flag}</span>
                  <span>{currentRegion.label}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-56 bg-white rounded-md shadow-lg overflow-hidden">
                  {AVAILABLE_REGIONS.map((region) => (
                    <Listbox.Option
                      key={region.country}
                      value={region}
                      className={({active}) =>
                        `cursor-pointer select-none relative py-2 px-4 ${
                          active ? 'bg-gray-100' : ''
                        }`
                      }
                    >
                      {({selected}) => (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{region.flag}</span>
                            <span
                              className={`${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {region.label}
                            </span>
                          </div>
                          {selected && (
                            <CheckIcon className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            <span className="text-gray-300">|</span>

            {/* Currency Display */}
            <div className="flex items-center space-x-1">
              <CurrencySymbol currency={currentRegion.currency} />
              <span>{currentRegion.currency}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="hidden sm:flex items-center space-x-4 text-gray-500">
            <span>Fri frakt över 499 kr</span>
            <span>•</span>
            <span>Express leverans</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrencySymbol({currency}: {currency: CurrencyCode}) {
  const symbols: Record<CurrencyCode, string> = {
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    EUR: '€',
    USD: '$',
  };
  return <span>{symbols[currency] || currency}</span>;
}

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

