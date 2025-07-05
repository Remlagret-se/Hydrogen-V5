import {useCallback} from 'react';
import {useNavigate, useRouteLoaderData} from '@remix-run/react';
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
  languages: Array<{
    code: string;
    label: string;
  }>;
  paymentMethods: Array<{
    name: string;
    icon: string;
  }>;
}

const REGIONS: Region[] = [
  {
    label: 'Sverige',
    language: 'sv-SE',
    currency: 'SEK',
    country: 'SE',
    flag: '🇸🇪',
    languages: [
      {code: 'sv-SE', label: 'Svenska'},
      {code: 'en-SE', label: 'English'},
    ],
    paymentMethods: [
      {name: 'Klarna', icon: '💳'},
      {name: 'Swish', icon: '📱'},
      {name: 'Kort', icon: '💳'},
    ],
  },
  {
    label: 'Norge',
    language: 'nb-NO',
    currency: 'NOK',
    country: 'NO',
    flag: '🇳🇴',
    languages: [
      {code: 'nb-NO', label: 'Norsk'},
      {code: 'en-NO', label: 'English'},
    ],
    paymentMethods: [
      {name: 'Klarna', icon: '💳'},
      {name: 'Vipps', icon: '📱'},
      {name: 'Kort', icon: '💳'},
    ],
  },
  {
    label: 'Danmark',
    language: 'da-DK',
    currency: 'DKK',
    country: 'DK',
    flag: '🇩🇰',
    languages: [
      {code: 'da-DK', label: 'Dansk'},
      {code: 'en-DK', label: 'English'},
    ],
    paymentMethods: [
      {name: 'Klarna', icon: '💳'},
      {name: 'MobilePay', icon: '📱'},
      {name: 'Kort', icon: '💳'},
    ],
  },
  {
    label: 'Finland',
    language: 'fi-FI',
    currency: 'EUR',
    country: 'FI',
    flag: '🇫🇮',
    languages: [
      {code: 'fi-FI', label: 'Suomi'},
      {code: 'sv-FI', label: 'Svenska'},
      {code: 'en-FI', label: 'English'},
    ],
    paymentMethods: [
      {name: 'Klarna', icon: '💳'},
      {name: 'MobilePay', icon: '📱'},
      {name: 'Kort', icon: '💳'},
    ],
  },
  {
    label: 'United States',
    language: 'en-US',
    currency: 'USD',
    country: 'US',
    flag: '🇺🇸',
    languages: [
      {code: 'en-US', label: 'English'},
      {code: 'es-US', label: 'Español'},
    ],
    paymentMethods: [
      {name: 'Credit Card', icon: '💳'},
      {name: 'PayPal', icon: '📱'},
      {name: 'Apple Pay', icon: '📱'},
    ],
  },
];

export function RegionSidebar() {
  const rootData = useRouteLoaderData('root') as any;
  const currentMarket = rootData?.currentMarket;
  const navigate = useNavigate();

  const currentRegion =
    REGIONS.find(
      (region) => region.language === currentMarket?.isoCode || 'SE',
    ) || REGIONS[0];

  const handleRegionChange = useCallback(
    (region: Region) => {
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

  const handleLanguageChange = useCallback(
    (languageCode: string) => {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(
        /^\/[a-zA-Z]{2}-[a-zA-Z]{2}/,
        languageCode,
      );

      navigate(newPath, {
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Välj region och språk</h2>
        </div>

        {/* Region List */}
        <div className="flex-1 overflow-y-auto">
          {REGIONS.map((region) => (
            <div
              key={region.country}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                region.country === currentRegion.country ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleRegionChange(region)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{region.flag}</span>
                  <div>
                    <h3 className="font-medium">{region.label}</h3>
                    <p className="text-sm text-gray-500">
                      {region.currency} · {region.languages[0].label}
                    </p>
                  </div>
                </div>
                {region.country === currentRegion.country && (
                  <CheckIcon className="h-5 w-5 text-primary" />
                )}
              </div>

              {/* Language Options */}
              {region.country === currentRegion.country && (
                <div className="mt-3 ml-9">
                  <p className="text-sm text-gray-500 mb-2">
                    Tillgängliga språk:
                  </p>
                  <div className="space-y-2">
                    {region.languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLanguageChange(language.code);
                        }}
                        className={`block text-sm ${
                          language.code === (currentMarket?.isoCode || 'SE')
                            ? 'text-primary font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {language.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {region.country === currentRegion.country && (
                <div className="mt-3 ml-9">
                  <p className="text-sm text-gray-500 mb-2">
                    Betalningsmetoder:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {region.paymentMethods.map((method) => (
                      <div
                        key={method.name}
                        className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            Priser och tillgänglighet kan variera mellan regioner
          </p>
        </div>
      </div>
    </div>
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

