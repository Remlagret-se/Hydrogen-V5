// Country/Market selector komponent
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { ClientOnly } from './ClientOnly';
import {
  markets,
  type Market,
  type MarketKey,
  localizeUrl,
  getMarketFromRequest,
} from '~/lib/utils/localization';

interface CountrySelectorProps {
  currentMarket?: Market;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Emoji-flaggor för varje marknad (mer tillförlitliga än SVG)
const marketFlags: Record<MarketKey, string> = {
  se: '🇸🇪',
  en: '🇺🇸',
  'en-gb': '🇬🇧',
  de: '🇩🇪',
  no: '🇳🇴',
  dk: '🇩🇰',
};

export function CountrySelector({ currentMarket }: CountrySelectorProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChanging, setIsChanging] = useState(false);

  // Om ingen currentMarket, försök hämta från URL
  const activeMarket = currentMarket || markets.se;
  const currentMarketKey = (activeMarket.pathPrefix === '' ? 'se' : activeMarket.pathPrefix.slice(1)) as MarketKey;

  const handleMarketChange = async (marketKey: MarketKey) => {
    setIsChanging(true);
    
    // Skapa ny URL med rätt market prefix
    const newPath = localizeUrl(location.pathname, marketKey, activeMarket);
    
    // Sätt cookie för att komma ihåg valet
    document.cookie = `selected_market=${marketKey}; path=/; max-age=${60 * 60 * 24 * 365}`;
    
    // Navigera till ny URL
    navigate(newPath);
  };

  return (
    <ClientOnly>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center gap-x-2 rounded-md px-2 py-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">{marketFlags[currentMarketKey]}</span>
            <span className="text-sm font-medium">{activeMarket.currency}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style={{ backgroundColor: 'var(--dark-3)' }}>
            <div className="py-1">
              {Object.entries(markets).map(([key, market]) => {
                const marketKey = key as MarketKey;
                const isActive = (activeMarket.pathPrefix === '' && marketKey === 'se') || 
                               activeMarket.pathPrefix === market.pathPrefix;
                
                return (
                  <Menu.Item key={marketKey}>
                    {({ active }) => (
                      <button
                        onClick={() => handleMarketChange(marketKey)}
                        disabled={isChanging}
                        className={classNames(
                          active ? 'bg-gray-700 text-white' : 'text-gray-300',
                          isActive ? 'font-semibold text-green-9' : '',
                          'group flex items-center px-4 py-3 text-sm w-full text-left transition-colors',
                          isChanging ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                        style={isActive ? { color: 'var(--green-9)' } : {}}
                      >
                        <span className="text-lg mr-3">{marketFlags[marketKey]}</span>
                        <span className="flex-1 font-medium">{market.label}</span>
                        <span className="ml-3 text-sm font-medium" style={{ color: 'var(--gray-11)' }}>{market.currency}</span>
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </ClientOnly>
  );
}

// Enklare version för mobil/header - som i TailwindUI-referensen
export function CountrySelectorSimple({ currentMarket }: CountrySelectorProps) {
  const activeMarket = currentMarket || markets.se;
  const marketKey = (activeMarket.pathPrefix === '' ? 'se' : activeMarket.pathPrefix.slice(1)) as MarketKey;

  return (
    <div className="flex items-center">
      <span className="text-lg">{marketFlags[marketKey]}</span>
      <span className="ml-3 text-sm font-medium text-white">{activeMarket.currency}</span>
      <span className="sr-only">, ändra valuta</span>
    </div>
  );
}

// Market detection banner
interface MarketBannerProps {
  detectedMarket: MarketKey;
  currentMarket: Market;
  onAccept: () => void;
  onDismiss: () => void;
}

export function MarketDetectionBanner({
  detectedMarket,
  currentMarket,
  onAccept,
  onDismiss,
}: MarketBannerProps) {
  const detectedMarketData = markets[detectedMarket];
  const currentMarketKey = (currentMarket.pathPrefix === '' ? 'se' : currentMarket.pathPrefix.slice(1)) as MarketKey;
  
  // Visa inte banner om vi redan är på rätt marknad
  if (detectedMarket === currentMarketKey) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-indigo-600 p-2 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <span className="text-2xl">{marketFlags[detectedMarket]}</span>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">
                  Vill du byta till {detectedMarketData.label}?
                </span>
                <span className="hidden md:inline">
                  Vi upptäckte att du besöker oss från {detectedMarketData.label}. 
                  Vill du se priser i {detectedMarketData.currency} istället?
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                onClick={onAccept}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Byt till {detectedMarketData.label}
              </button>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                onClick={onDismiss}
                className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Stäng</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 