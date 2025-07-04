import { Fragment, Suspense, useState, useEffect, useRef } from 'react';
import { Await, NavLink, useAsyncValue } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { ClientOnly } from './ClientOnly';
import { CountrySelector } from './CountrySelector';
import type { Market } from '~/lib/utils/localization';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  currentMarket?: Market;
}

export default function HeaderClient({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  currentMarket,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {open} = useAside();

  // Extrahera kollektioner från header query
  const allCollections = header?.collections?.nodes || [];
  
  // Använd marknadens språk för att visa rätt handle
  const marketKey = currentMarket ? (currentMarket.pathPrefix === '' ? 'se' : currentMarket.pathPrefix.slice(1) as any) : 'se';
  
  // Navigationsstruktur med lokaliserade handles
  const navigation = {
    categories: [
      {
        id: 'lager',
        name: 'Lager',
        featured: [
          {
            name: 'Magnetlager',
            href: `/collections/${marketKey === 'se' ? 'magnetlager' : 'magnetic-bearings'}`,
            imageSrc: 'https://picsum.photos/400/400?random=4',
            imageAlt: 'Magnetlager',
            description: 'Avancerade magnetlager',
          },
          {
            name: 'Kullager',
            href: `/collections/${marketKey === 'se' ? 'kullager' : 'ball-bearings'}`,
            imageSrc: 'https://picsum.photos/400/400?random=1',
            imageAlt: 'Kullager',
            description: 'Högkvalitativa kullager för alla behov',
          },
          {
            name: 'Rullager',
            href: `/collections/${marketKey === 'se' ? 'rullager' : 'roller-bearings'}`,
            imageSrc: 'https://picsum.photos/400/400?random=2',
            imageAlt: 'Rullager',
            description: 'Pålitliga rullager för tunga belastningar',
          },
          {
            name: 'Glidlager',
            href: `/collections/${marketKey === 'se' ? 'glidlager' : 'plain-bearings'}`,
            imageSrc: 'https://picsum.photos/400/400?random=3',
            imageAlt: 'Glidlager',
            description: 'Underhållsfria glidlager',
          },
        ],
        sections: [
          {
            id: 'kullager',
            name: 'Kullager',
            items: [
              { name: 'Spårkullager', href: `/collections/sparkullager` },
              { name: 'Vinkelkontaktlager', href: `/collections/vinkelkontaktlager` },
              { name: 'Sfäriska kullager', href: `/collections/sfariska-kullager` },
              { name: 'Axialkullager', href: `/collections/axialkullager` },
              { name: 'Fyrpunktskontaktlager', href: `/collections/fyrpunktskontaktlager` },
              { name: 'Insatslager', href: `/collections/insatslager` },
            ],
          },
          {
            id: 'rullager',
            name: 'Rullager',
            items: [
              { name: 'Cylindriska rullager', href: `/collections/cylindriska-rullager` },
              { name: 'Koniska rullager', href: `/collections/koniska-rullager` },
              { name: 'Sfäriska rullager', href: `/collections/sfariska-rullager` },
              { name: 'Nållager', href: `/collections/nallager` },
              { name: 'Axialrullager', href: `/collections/axialrullager` },
              { name: 'Kryssrullager', href: `/collections/kryssrullager` },
            ],
          },
          {
            id: 'glidlager',
            name: 'Glidlager & Speciallager',
            items: [
              { name: 'Glidbussningar', href: `/collections/glidbussningar` },
              { name: 'Glidplattor', href: `/collections/glidplattor` },
              { name: 'Kulleder', href: `/collections/kulleder` },
              { name: 'Ledlager', href: `/collections/ledlager` },
              { name: 'Magnetlager', href: `/collections/magnetlager` },
              { name: 'Speciallager', href: `/collections/speciallager` },
            ],
          },
        ],
      },
      {
        id: 'transmission',
        name: 'Transmission',
        featured: [
          {
            name: 'Kilremmar',
            href: `/collections/kilremmar`,
            imageSrc: 'https://picsum.photos/400/400?random=8',
            imageAlt: 'Kilremmar',
            description: 'Högkvalitativa kilremmar',
          },
          {
            name: 'Kuggremmar',
            href: `/collections/kuggremmar`,
            imageSrc: 'https://picsum.photos/400/400?random=9',
            imageAlt: 'Kuggremmar',
            description: 'Precision kuggremmar',
          },
        ],
        sections: [
          {
            id: 'remmar',
            name: 'Remmar',
            items: [
              { name: 'Kilremmar', href: `/collections/kilremmar` },
              { name: 'Kuggremmar', href: `/collections/kuggremmar` },
              { name: 'Multiremmar', href: `/collections/multiremmar` },
              { name: 'Rundremmar', href: `/collections/rundremmar` },
              { name: 'Variatorremmar', href: `/collections/variatorremmar` },
            ],
          },
          {
            id: 'tillbehor',
            name: 'Tillbehör',
            items: [
              { name: 'Kilremskivor', href: `/collections/kilremskivor` },
              { name: 'Klämbussningar', href: `/collections/klambussningar` },
              { name: 'Spännrullar', href: `/collections/spannrullar` },
            ],
          },
        ],
      },
    ],
    pages: [
      { name: 'Tätningar', href: '/collections/tatningar' },
      { name: 'Linjärteknik', href: '/collections/linjarteknik' },
      { name: 'Om oss', href: '/pages/om-oss' },
      { name: 'Kontakt', href: '/pages/kontakt' },
    ],
  };

  return (
    <div className="bg-white" style={{ backgroundColor: 'var(--dark-1)' }}>
      {/* Wrap Headless UI komponenter i ClientOnly */}
      <ClientOnly>
        {/* Mobile menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
              style={{ backgroundColor: 'var(--dark-3)' }}
            >
              <div className="flex px-4 pt-5 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Stäng meny</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile menu innehåll */}
              <TabGroup className="mt-2">
                <div className="border-b border-gray-600">
                  <TabList className="-mb-px flex space-x-8 px-4">
                    {navigation.categories.map((category) => (
                      <Tab
                        key={category.name}
                        className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-300 data-[selected]:border-green-9 data-[selected]:text-green-9"
                      >
                        {category.name}
                      </Tab>
                    ))}
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                  {navigation.categories.map((category) => (
                    <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                      <div className="grid grid-cols-2 gap-x-4">
                        {category.featured.map((item) => (
                          <div key={item.name} className="group relative text-sm">
                            <img
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                            />
                            <NavLink 
                              to={item.href} 
                              className="mt-6 block font-medium text-white"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span aria-hidden="true" className="absolute inset-0 z-10" />
                              {item.name}
                            </NavLink>
                            <p aria-hidden="true" className="mt-1 text-gray-400">
                              Se produkter
                            </p>
                          </div>
                        ))}
                      </div>
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-white">
                            {section.name}
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                            className="mt-6 flex flex-col space-y-6"
                          >
                            {section.items.map((item) => (
                              <li key={item.name} className="flow-root">
                                <NavLink 
                                  to={item.href} 
                                  className="-m-2 block p-2 text-gray-300 hover:text-white"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {item.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </TabPanel>
                  ))}
                </TabPanels>
              </TabGroup>

              <div className="space-y-6 border-t border-gray-600 px-4 py-6">
                {navigation.pages.map((page) => (
                  <div key={page.name} className="flow-root">
                    <NavLink 
                      to={page.href} 
                      className="-m-2 block p-2 font-medium text-white hover:text-green-9"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {page.name}
                    </NavLink>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-600 px-4 py-6">
                <div className="flow-root">
                  <Suspense fallback={<div className="-m-2 block p-2 font-medium text-white">Konto</div>}>
                    <Await resolve={isLoggedIn}>
                      {(loggedIn) => (
                        <NavLink 
                          to="/account" 
                          className="-m-2 block p-2 font-medium text-white hover:text-green-9"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {loggedIn ? 'Mitt konto' : 'Logga in'}
                        </NavLink>
                      )}
                    </Await>
                  </Suspense>
                </div>
                <div className="flow-root">
                  <NavLink 
                    to="/account" 
                    className="-m-2 block p-2 font-medium text-white hover:text-green-9"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Skapa konto
                  </NavLink>
                </div>
                <div className="flow-root">
                  <a 
                    href="/pages/kontakt" 
                    className="-m-2 block p-2 font-medium text-white hover:text-green-9"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </a>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </ClientOnly>

      <header className="relative" style={{ backgroundColor: 'var(--dark-3)' }}>
        {/* Promotional bar med grön accent */}
        <p className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8" 
           style={{ backgroundColor: 'var(--green-9)' }}>
          Fri frakt på beställningar över 1000 kr
        </p>

        <nav aria-label="Top" className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="border-b border-gray-600">
            <div className="flex h-16 lg:h-20 items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative rounded-md p-2 text-gray-400 hover:text-white lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Öppna meny</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo - Original färger */}
              <div className="ml-4 flex lg:ml-0">
                <NavLink to="/">
                  <span className="sr-only">Remlagret</span>
                  <img
                    alt="Remlagret"
                    src="https://cdn.shopify.com/s/files/1/2427/6923/files/remlagret.se-logo_5f630daf-9666-487a-a905-17a12c64de50.png?v=1704469705"
                    className="h-8 w-auto lg:h-12 xl:h-14"
                  />
                </NavLink>
              </div>

              {/* Desktop Flyout menus */}
              <ClientOnly>
                <PopoverGroup className="hidden lg:ml-8 xl:ml-12 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-6 xl:space-x-8 2xl:space-x-10">
                    {navigation.categories.map((category) => (
                      <Popover key={category.name} className="flex">
                        {({ close }) => (
                          <>
                            <div className="relative flex">
                              <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm lg:text-base xl:text-lg font-medium text-white transition-colors duration-200 ease-out hover:text-gray-300 data-[open]:border-green-9 data-[open]:text-green-9">
                                {category.name}
                              </PopoverButton>
                            </div>

                            <PopoverPanel
                              transition
                              className="absolute inset-x-0 top-full text-sm transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-150 data-[leave]:ease-in z-50"
                            >
                          {/* Shadow */}
                          <div aria-hidden="true" className="absolute inset-0 top-1/2 shadow-lg" style={{ backgroundColor: 'var(--dark-2)' }} />

                          <div className="relative" style={{ backgroundColor: 'var(--dark-2)' }}>
                            <div className="mx-auto max-w-7xl xl:max-w-full px-8 xl:px-12 2xl:px-16">
                              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 xl:gap-x-12 gap-y-10 py-16 xl:py-20">
                                <div className={`${category.featured.length > 2 ? 'col-span-2 lg:col-span-2 xl:col-span-2' : 'col-start-2 lg:col-start-3 xl:col-start-3'} grid grid-cols-2 gap-x-8`}>
                                  {category.featured.map((item) => (
                                    <div key={item.name} className="group relative text-base sm:text-sm">
                                      <img
                                        alt={item.imageAlt}
                                        src={item.imageSrc}
                                        className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75 transition-opacity"
                                      />
                                      <NavLink 
                                        to={item.href} 
                                        className="mt-6 block font-medium text-white group-hover:text-green-9"
                                        onClick={() => close()}
                                      >
                                        <span aria-hidden="true" className="absolute inset-0 z-10" />
                                        {item.name}
                                      </NavLink>
                                      <p aria-hidden="true" className="mt-1 text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="row-start-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 xl:gap-x-12 gap-y-10 text-sm">
                                  {category.sections.map((section) => (
                                    <div key={section.name}>
                                      <p id={`${section.name}-heading`} className="font-medium text-white text-base lg:text-lg">
                                        {section.name}
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`${section.name}-heading`}
                                        className="mt-6 space-y-4 sm:mt-4 sm:space-y-4"
                                      >
                                        {section.items.map((item) => (
                                          <li key={item.name} className="flex">
                                            <NavLink 
                                              to={item.href} 
                                              className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                                              onClick={() => close()}
                                            >
                                              {item.name}
                                            </NavLink>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                            </PopoverPanel>
                          </>
                        )}
                      </Popover>
                    ))}

                    {navigation.pages.map((page) => (
                      <NavLink
                        key={page.name}
                        to={page.href}
                        className="flex items-center text-sm lg:text-base xl:text-lg font-medium text-white hover:text-gray-300 transition-colors"
                      >
                        {page.name}
                      </NavLink>
                    ))}
                  </div>
                </PopoverGroup>
              </ClientOnly>

              {/* Desktop fallback menu för SSR */}
              <div className="hidden lg:ml-8 xl:ml-12 lg:block lg:self-stretch data-[client]:hidden">
                <div className="flex h-full space-x-6 xl:space-x-8 2xl:space-x-10">
                  <NavLink
                    to="/collections"
                    className="flex items-center text-sm lg:text-base xl:text-lg font-medium text-white hover:text-gray-300 transition-colors"
                  >
                    Lager
                  </NavLink>
                  {navigation.pages.map((page) => (
                    <NavLink
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-sm lg:text-base xl:text-lg font-medium text-white hover:text-gray-300 transition-colors"
                    >
                      {page.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center space-x-4 lg:space-x-6">
                {/* Language Selector - Compact flaggor och valuta */}
                <CountrySelector currentMarket={currentMarket} />

                <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6">
                  <Suspense fallback={<span className="text-sm lg:text-base font-medium text-white">Konto</span>}>
                    <Await resolve={isLoggedIn}>
                      {(loggedIn) => (
                        <NavLink to="/account" className="text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors">
                          {loggedIn ? 'Mitt konto' : 'Logga in'}
                        </NavLink>
                      )}
                    </Await>
                  </Suspense>
                  <span aria-hidden="true" className="h-6 w-px bg-gray-600" />
                  <NavLink to="/account" className="text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors">
                    Skapa konto
                  </NavLink>
                </div>

                {/* Search */}
                <div className="flex">
                  <button
                    onClick={() => open('search')}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Sök</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6 lg:h-7 lg:w-7" />
                  </button>
                </div>

                {/* Cart */}
                <div className="flow-root">
                  <CartToggle cart={cart} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

function CartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  const {open} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart: analyticsCart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="group -m-2 flex items-center p-2"
    >
      <ShoppingBagIcon
        aria-hidden="true"
        className="h-6 w-6 lg:h-7 lg:w-7 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
      />
      <Suspense fallback={<span className="ml-2 text-sm lg:text-base font-medium text-white">0</span>}>
        <Await resolve={cart}>
          <CartBadgeCount />
        </Await>
      </Suspense>
      <span className="sr-only">produkter i varukorgen</span>
    </button>
  );
}

function CartBadgeCount() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;

  return (
    <span className="ml-2 text-sm lg:text-base font-medium text-white group-hover:text-gray-300 transition-colors">
      {count}
    </span>
  );
}

export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}: any) {
  // This is kept for compatibility but not used in the new design
  return null;
} 