import {lazy, Suspense} from 'react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import type {Market} from '~/lib/utils/localization';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  currentMarket?: Market;
}

// Fix lazy import by using direct import instead
import HeaderClient from './HeaderClient';

export function HeaderWithHeadlessUI(props: HeaderProps) {
  return <HeaderClient {...props} />;
}

// Enkel fallback header som visas medan den riktiga laddar
function HeaderFallback({header}: HeaderProps) {
  return (
    <div className="bg-white" style={{backgroundColor: 'var(--dark-1)'}}>
      <header className="relative" style={{backgroundColor: 'var(--dark-3)'}}>
        {/* Promotional bar med grön accent */}
        <p
          className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{backgroundColor: 'var(--green-9)'}}
        >
          Fri frakt på beställningar över 1000 kr
        </p>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 border-b border-gray-600">
            <a href="/" className="flex items-center">
              <img
                src="https://cdn.shopify.com/s/files/1/2427/6923/files/remlagret.se-logo_5f630daf-9666-487a-a905-17a12c64de50.png?v=1704469705"
                alt="Remlagret"
                className="h-8 w-auto lg:h-10"
              />
            </a>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">🇸🇪 SEK</span>
              <a
                href="/account"
                className="text-sm text-white hover:text-gray-300"
              >
                Konto
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// Export HeaderMenu från HeaderClient
export {HeaderMenu} from './HeaderClient';
