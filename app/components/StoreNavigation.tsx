import {Fragment, Suspense, useState} from 'react';
import {NavLink, Await} from '@remix-run/react';
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
import {CartCount} from '~/components/Cart';
import {useAside} from '~/components/Aside';
import {CountrySelector} from './CountrySelector';
import type {HeaderQuery} from 'storefrontapi.generated';

interface StoreNavigationProps {
  isLoggedIn?: Promise<boolean>;
  cart?: Promise<any>;
  currentMarket?: any;
  header?: HeaderQuery;
}

export function StoreNavigation({
  isLoggedIn,
  cart,
  currentMarket,
  header,
}: StoreNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {open} = useAside();

  // Extract collections from header query
  const allCollections = header?.collections?.nodes || [];

  // Use market language to show correct handle
  const marketKey = currentMarket
    ? currentMarket.pathPrefix === ''
      ? 'se'
      : (currentMarket.pathPrefix.slice(1) as any)
    : 'se';

  // Helper function to get collection image by handle
  const getCollectionImage = (handle: string) => {
    const collection = allCollections.find((col) => col.handle === handle);
    return (
      collection?.image?.url ||
      'https://via.placeholder.com/400x400?text=No+Image'
    );
  };

  // Navigation structure with localized handles following Tailwind UI pattern
  const navigation = {
    categories: [
      {
        id: 'kullager',
        name: 'Kullager',
        featured: [
          {
            name: 'Spårkullager',
            href: `/collections/sparkullager`,
            imageSrc: getCollectionImage('sparkullager'),
            imageAlt: 'Spårkullager för industri',
          },
          {
            name: 'Sfäriska kullager',
            href: `/collections/sfariska-kullager`,
            imageSrc: getCollectionImage('sfariska-kullager'),
            imageAlt: 'Sfäriska kullager för tunga belastningar',
          },
        ],
        sections: [
          {
            id: 'standard',
            name: 'Standard Kullager',
            items: [
              {name: 'Spårkullager', href: `/collections/sparkullager`},
              {
                name: 'Vinkelkontaktlager',
                href: `/collections/vinkelkontaktlager`,
              },
              {
                name: 'Sfäriska kullager',
                href: `/collections/sfariska-kullager`,
              },
              {name: 'Axialkullager', href: `/collections/axialkullager`},
              {name: 'Fyrpunktslager', href: `/collections/fyrpunktslager`},
              {name: 'Se alla kullager', href: `/collections/kullager`},
            ],
          },
          {
            id: 'precision',
            name: 'Precisionslager',
            items: [
              {name: 'P4 Precision', href: `/collections/p4-precision`},
              {name: 'P5 Precision', href: `/collections/p5-precision`},
              {name: 'P6 Precision', href: `/collections/p6-precision`},
              {name: 'Spindellager', href: `/collections/spindellager`},
              {
                name: 'Maskintillverkning',
                href: `/collections/maskintillverkning`,
              },
            ],
          },
          {
            id: 'brands',
            name: 'Varumärken',
            items: [
              {name: 'SKF', href: `/collections/skf`},
              {name: 'FAG', href: `/collections/fag`},
              {name: 'INA', href: `/collections/ina`},
              {name: 'NTN', href: `/collections/ntn`},
              {name: 'NSK', href: `/collections/nsk`},
            ],
          },
        ],
      },
      {
        id: 'rullager',
        name: 'Rullager',
        featured: [
          {
            name: 'Cylindriska rullager',
            href: `/collections/cylindriska-rullager`,
            imageSrc: getCollectionImage('cylindriska-rullager'),
            imageAlt: 'Cylindriska rullager för hög kapacitet',
          },
          {
            name: 'Koniska rullager',
            href: `/collections/koniska-rullager`,
            imageSrc: getCollectionImage('koniska-rullager'),
            imageAlt: 'Koniska rullager för kombinerade belastningar',
          },
        ],
        sections: [
          {
            id: 'types',
            name: 'Rullagertyper',
            items: [
              {
                name: 'Cylindriska rullager',
                href: `/collections/cylindriska-rullager`,
              },
              {name: 'Koniska rullager', href: `/collections/koniska-rullager`},
              {
                name: 'Sfäriska rullager',
                href: `/collections/sfariska-rullager`,
              },
              {name: 'Nållager', href: `/collections/nallager`},
              {name: 'Axialrullager', href: `/collections/axialrullager`},
              {name: 'Se alla rullager', href: `/collections/rullager`},
            ],
          },
          {
            id: 'applications',
            name: 'Applikationer',
            items: [
              {name: 'Tunga maskiner', href: `/collections/tunga-maskiner`},
              {name: 'Automotive', href: `/collections/automotive`},
              {name: 'Industrimotorer', href: `/collections/industrimotorer`},
              {name: 'Pumpar & Fläktar', href: `/collections/pumpar-flaktar`},
              {name: 'Transmissioner', href: `/collections/transmissioner`},
            ],
          },
          {
            id: 'sizes',
            name: 'Storlekar',
            items: [
              {name: 'Små lager (0-30mm)', href: `/collections/sma-lager`},
              {
                name: 'Medium lager (30-100mm)',
                href: `/collections/medium-lager`,
              },
              {name: 'Stora lager (100mm+)', href: `/collections/stora-lager`},
              {name: 'Specialstorlekar', href: `/collections/specialstorlekar`},
            ],
          },
        ],
      },
    ],
    pages: [
      {name: 'Om oss', href: `/pages/om-oss`},
      {name: 'Teknisk support', href: `/pages/teknisk-support`},
    ],
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Stäng meny</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-[selected]:border-blue-600 data-[selected]:text-blue-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
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
                            className="mt-6 block font-medium text-gray-900"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </NavLink>
                          <p aria-hidden="true" className="mt-1">
                            Handla nu
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-gray-900"
                        >
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
                                className="-m-2 block p-2 text-gray-500"
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

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <NavLink
                    to={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {page.name}
                  </NavLink>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <NavLink
                  to="/account/login"
                  className="-m-2 block p-2 font-medium text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logga in
                </NavLink>
              </div>
              <div className="flow-root">
                <NavLink
                  to="/account/register"
                  className="-m-2 block p-2 font-medium text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Skapa konto
                </NavLink>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <CountrySelector currentMarket={currentMarket} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-blue-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Fri frakt på beställningar över 1000 SEK
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Öppna meny</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <NavLink to={currentMarket?.pathPrefix || '/'}>
                  <span className="sr-only">Remlagret</span>
                  <img
                    alt="Remlagret"
                    src="https://cdn.shopify.com/s/files/1/2427/6923/files/remlagret.se-logo_5f630daf-9666-487a-a905-17a12c64de50.png?v=1704469705"
                    className="h-8 w-auto"
                  />
                </NavLink>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:text-blue-600">
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-[open]:bg-blue-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-150 data-[leave]:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white shadow-sm"
                        />
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <NavLink
                                      to={item.href}
                                      className="mt-6 block font-medium text-gray-900"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </NavLink>
                                    <p aria-hidden="true" className="mt-1">
                                      Handla nu
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="font-medium text-gray-900"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <NavLink
                                            to={item.href}
                                            className="hover:text-gray-800"
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
                    </Popover>
                  ))}
                  {navigation.pages.map((page) => (
                    <NavLink
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </NavLink>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Suspense
                    fallback={
                      <span className="text-sm font-medium text-gray-700">
                        Konto
                      </span>
                    }
                  >
                    {isLoggedIn && (
                      <Await resolve={isLoggedIn}>
                        {(loggedIn) => (
                          <NavLink
                            to="/account"
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {loggedIn ? 'Mitt konto' : 'Logga in'}
                          </NavLink>
                        )}
                      </Await>
                    )}
                  </Suspense>
                  <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                  <NavLink
                    to="/account/register"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Skapa konto
                  </NavLink>
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <CountrySelector currentMarket={currentMarket} />
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <button
                    onClick={() => open('search')}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Sök</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </button>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    onClick={() => open('cart')}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <CartCount />
                    <span className="sr-only">
                      produkter i varukorgen, visa varukorg
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

