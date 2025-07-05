// Exempel: Tailwind UI Header anpassad för Hydrogen
// INGEN 'use client' behövs i Hydrogen/Remix!

import { Fragment, useState } from 'react';
import { NavLink } from '@remix-run/react';
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
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { ClientOnly } from '~/components/ClientOnly';

// Anpassa navigation för din Shopify-data
const navigation = {
  categories: [
    {
      id: 'lager',
      name: 'Lager',
      featured: [
        {
          name: 'Kullager',
          href: '/collections/kullager', // Riktig URL istället för #
          imageSrc: '/images/kullager-featured.jpg',
          imageAlt: 'Olika typer av kullager',
        },
        {
          name: 'Tätningar',
          href: '/collections/tatningar',
          imageSrc: '/images/tatningar-featured.jpg',
          imageAlt: 'Industriella tätningar',
        },
      ],
      sections: [
        {
          id: 'typer',
          name: 'Produkttyper',
          items: [
            { name: 'Spårkullager', href: '/collections/sparkullager' },
            { name: 'Vinkelkontaktlager', href: '/collections/vinkelkontaktlager' },
            { name: 'Sfäriska kullager', href: '/collections/sfariska-kullager' },
            // etc...
          ],
        },
        {
          id: 'varumarken',
          name: 'Varumärken',
          items: [
            { name: 'SKF', href: '/collections/skf' },
            { name: 'FAG', href: '/collections/fag' },
            { name: 'NSK', href: '/collections/nsk' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Om oss', href: '/pages/om-oss' },
    { name: 'Kontakt', href: '/pages/kontakt' },
  ],
};

interface TailwindUIHeaderProps {
  cart?: any; // Din Shopify cart data
  isLoggedIn?: boolean;
}

export function TailwindUIHeader({ cart, isLoggedIn }: TailwindUIHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Wrap Dialog i ClientOnly för SSR */}
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
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              {/* Mobile menu innehåll... */}
              <div className="flex px-4 pt-5 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Stäng meny</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              {/* Resten av mobile menu... */}
            </DialogPanel>
          </div>
        </Dialog>
      </ClientOnly>

      <header className="relative bg-white">
        {/* Top banner */}
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Fri frakt på beställningar över 1000 kr
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Öppna meny</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo - använd NavLink istället för <a> */}
              <div className="ml-4 flex lg:ml-0">
                <NavLink to="/">
                  <span className="sr-only">Remlagret</span>
                  <img
                    alt="Remlagret"
                    src="/logo.svg"
                    className="h-8 w-auto"
                  />
                </NavLink>
              </div>

              {/* Desktop navigation - wrap i ClientOnly */}
              <ClientOnly>
                <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {navigation.categories.map((category) => (
                      <Popover key={category.name} className="flex">
                        {/* Popover innehåll... */}
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
              </ClientOnly>

              <div className="ml-auto flex items-center">
                {/* Konto länkar */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <NavLink 
                    to="/account" 
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {isLoggedIn ? 'Mitt konto' : 'Logga in'}
                  </NavLink>
                  {!isLoggedIn && (
                    <>
                      <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                      <NavLink 
                        to="/account/register" 
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Skapa konto
                      </NavLink>
                    </>
                  )}
                </div>

                {/* Cart - anslut till Shopify cart data */}
                <div className="ml-4 flow-root lg:ml-6">
                  <NavLink to="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cart?.totalQuantity || 0}
                    </span>
                    <span className="sr-only">produkter i varukorgen</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
} 
