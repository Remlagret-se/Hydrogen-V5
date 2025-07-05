import {Fragment, useState} from 'react';
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
  XMarkIcon as XMarkIconOutline,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon} from '@heroicons/react/16/solid';
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid';
import {useCartStore} from '~/lib/cartStore';

const navigation = {
  categories: [
    {
      id: 'kullager',
      name: 'Kullager',
      featured: [
        {
          name: 'Spårkullager',
          href: '/collections/sparkullager',
          imageSrc: 'https://picsum.photos/400/400?random=1',
          imageAlt: 'Spårkullager för allmän användning',
        },
        {
          name: 'Vinkelkontaktlager',
          href: '/collections/vinkelkontaktlager',
          imageSrc: 'https://picsum.photos/400/400?random=2',
          imageAlt: 'Vinkelkontaktlager för höga hastigheter',
        },
      ],
      sections: [
        {
          id: 'types',
          name: 'Typer',
          items: [
            {name: 'Spårkullager', href: '/collections/sparkullager'},
            {
              name: 'Vinkelkontaktlager',
              href: '/collections/vinkelkontaktlager',
            },
            {name: 'Sfäriska kullager', href: '/collections/sfariska-kullager'},
            {name: 'Axialkullager', href: '/collections/axialkullager'},
            {
              name: 'Fyrpunktskontaktlager',
              href: '/collections/fyrpunktskontaktlager',
            },
            {name: 'Insatslager', href: '/collections/insatslager'},
          ],
        },
        {
          id: 'brands',
          name: 'Varumärken',
          items: [
            {name: 'SKF', href: '/collections/skf'},
            {name: 'FAG', href: '/collections/fag'},
            {name: 'Timken', href: '/collections/timken'},
            {name: 'NSK', href: '/collections/nsk'},
            {name: 'NTN', href: '/collections/ntn'},
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
          href: '/collections/cylindriska-rullager',
          imageSrc: 'https://picsum.photos/400/400?random=3',
          imageAlt: 'Cylindriska rullager för tunga laster',
        },
        {
          name: 'Koniska rullager',
          href: '/collections/koniska-rullager',
          imageSrc: 'https://picsum.photos/400/400?random=4',
          imageAlt: 'Koniska rullager för kombinerade laster',
        },
      ],
      sections: [
        {
          id: 'types',
          name: 'Typer',
          items: [
            {
              name: 'Cylindriska rullager',
              href: '/collections/cylindriska-rullager',
            },
            {name: 'Koniska rullager', href: '/collections/koniska-rullager'},
            {name: 'Sfäriska rullager', href: '/collections/sfariska-rullager'},
            {name: 'Nållager', href: '/collections/nallager'},
            {name: 'Axialrullager', href: '/collections/axialrullager'},
            {name: 'Kryssrullager', href: '/collections/kryssrullager'},
          ],
        },
        {
          id: 'applications',
          name: 'Tillämpningar',
          items: [
            {name: 'Industri', href: '/collections/industri'},
            {name: 'Fordon', href: '/collections/fordon'},
            {name: 'Marin', href: '/collections/marin'},
            {name: 'Aerospace', href: '/collections/aerospace'},
          ],
        },
      ],
    },
  ],
  pages: [],
};

const sampleProducts = [
  {
    id: 1,
    name: 'Spårkullager 6008',
    href: '/products/sparkullager-6008',
    price: '298 SEK',
    color: 'Standard',
    inStock: true,
    size: '40x68x15',
    imageSrc: 'https://picsum.photos/400/400?random=5',
    imageAlt: 'Spårkullager 6008',
  },
  {
    id: 2,
    name: 'Vinkelkontaktlager 7210',
    href: '/products/vinkelkontaktlager-7210',
    price: '456 SEK',
    color: 'Premium',
    inStock: false,
    leadTime: '2-3 veckor',
    size: '50x90x20',
    imageSrc: 'https://picsum.photos/400/400?random=6',
    imageAlt: 'Vinkelkontaktlager 7210',
  },
  {
    id: 3,
    name: 'Cylindriskt rullager NU 2308',
    href: '/products/cylindriskt-rullager-nu-2308',
    price: '789 SEK',
    color: 'Standard',
    inStock: true,
    imageSrc: 'https://picsum.photos/400/400?random=7',
    imageAlt: 'Cylindriskt rullager NU 2308',
  },
];

const relatedProducts = [
  {
    id: 1,
    name: 'Koniskt rullager 32210',
    href: '/products/koniskt-rullager-32210',
    imageSrc: 'https://picsum.photos/400/400?random=8',
    imageAlt: 'Koniskt rullager 32210',
    price: '567 SEK',
    color: 'Premium',
  },
  {
    id: 2,
    name: 'Sfäriskt rullager 22308',
    href: '/products/sfariskt-rullager-22308',
    imageSrc: 'https://picsum.photos/400/400?random=9',
    imageAlt: 'Sfäriskt rullager 22308',
    price: '845 SEK',
    color: 'Standard',
  },
  {
    id: 3,
    name: 'Nållager NK 25/16',
    href: '/products/nallager-nk-25-16',
    imageSrc: 'https://picsum.photos/400/400?random=10',
    imageAlt: 'Nållager NK 25/16',
    price: '234 SEK',
    color: 'Compact',
  },
  {
    id: 4,
    name: 'Axialrullager 81210',
    href: '/products/axialrullager-81210',
    imageSrc: 'https://picsum.photos/400/400?random=11',
    imageAlt: 'Axialrullager 81210',
    price: '432 SEK',
    color: 'Heavy Duty',
  },
];

const footerNavigation = {
  products: [
    {name: 'Kullager', href: '/collections/kullager'},
    {name: 'Rullager', href: '/collections/rullager'},
    {name: 'Glidlager', href: '/collections/glidlager'},
    {name: 'Tätningar', href: '/collections/tatningar'},
    {name: 'Verktyg', href: '/collections/verktyg'},
  ],
  company: [
    {name: 'Om oss', href: '/pages/om-oss'},
    {name: 'Hållbarhet', href: '/pages/hallbarhet'},
    {name: 'Press', href: '/pages/press'},
    {name: 'Karriär', href: '/pages/karriar'},
    {name: 'Villkor', href: '/pages/villkor'},
    {name: 'Integritet', href: '/pages/integritet'},
  ],
  customerService: [
    {name: 'Kontakt', href: '/pages/kontakt'},
    {name: 'Frakt', href: '/pages/frakt'},
    {name: 'Returer', href: '/pages/returer'},
    {name: 'Garanti', href: '/pages/garanti'},
    {name: 'Säkra betalningar', href: '/pages/betalningar'},
    {name: 'FAQ', href: '/pages/faq'},
    {name: 'Hitta butik', href: '/pages/butiker'},
  ],
};

export default function CompleteCartPage() {
  const [open, setOpen] = useState(false);
  const {items, updateQuantity, removeItem} = useCartStore();

  // Use sample products if cart is empty for demo purposes
  const products = items.length > 0 ? items : sampleProducts;

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Stäng meny</span>
                <XMarkIconOutline aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
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
                          <a
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
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
                              <a
                                href={item.href}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://cdn.builder.io/api/v1/image/assets%2F2d23cb488ecf4aa3809d17ace84b1dc2%2Fbb83cc0c05c944b087c7c1f41ad3aa70"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  SEK
                </span>
                <span className="sr-only">, byt valuta</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
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
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Öppna meny</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <span className="sr-only">Lagerteknik</span>
                  <img
                    alt=""
                    src="https://cdn.builder.io/api/v1/image/assets%2F2d23cb488ecf4aa3809d17ace84b1dc2%2F69526efafa864bc0b45828041adfc440"
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
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
                                    <a
                                      href={item.href}
                                      className="mt-6 block font-medium text-gray-900"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </a>
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
                                          <a
                                            href={item.href}
                                            className="hover:text-gray-800"
                                          >
                                            {item.name}
                                          </a>
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
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      alt=""
                      src="https://cdn.builder.io/api/v1/image/assets%2F2d23cb488ecf4aa3809d17ace84b1dc2%2Fbb83cc0c05c944b087c7c1f41ad3aa70"
                      className="block h-auto w-5 shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">SEK</span>
                    <span className="sr-only">, byt valuta</span>
                  </a>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <a
                    href="/search"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Sök</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <a href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {products.length}
                    </span>
                    <span className="sr-only">produkter i varukorgen</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Varukorg
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Produkter i din varukorg
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {products.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc || product.image}
                      className="size-24 rounded-md object-cover sm:size-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={product.href || `#`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.name || product.title}
                            </a>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {product.price || `${product.price} SEK`}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="inline-grid w-full max-w-16 grid-cols-1">
                          <select
                            id={`quantity-${productIdx}`}
                            name={`quantity-${productIdx}`}
                            aria-label={`Kvantitet, ${product.name || product.title}`}
                            defaultValue={product.quantity || 1}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              updateQuantity(product.id, newQuantity);
                            }}
                            className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                          </select>
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          />
                        </div>

                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Ta bort</span>
                            <XMarkIconMini
                              aria-hidden="true"
                              className="size-5"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {product.inStock !== false ? (
                        <CheckIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-green-500"
                        />
                      ) : (
                        <ClockIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-300"
                        />
                      )}

                      <span>
                        {product.inStock !== false
                          ? 'I lager'
                          : `Leverans ${product.leadTime || '2-3 veckor'}`}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Ordersammanfattning
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Delsumma</dt>
                <dd className="text-sm font-medium text-gray-900">1 543 SEK</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Frakt</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Läs mer om fraktberäkning</span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">Gratis</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Moms (25%)</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Läs mer om momsberäkning</span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">386 SEK</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Totalt</dt>
                <dd className="text-base font-medium text-gray-900">
                  1 929 SEK
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none"
              >
                Till kassan
              </button>
            </div>
          </section>
        </form>

        {/* Related products */}
        <section aria-labelledby="related-heading" className="mt-24">
          <h2
            id="related-heading"
            className="text-lg font-medium text-gray-900"
          >
            Du kanske också gillar&hellip;
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <img
                  alt={relatedProduct.imageAlt}
                  src={relatedProduct.imageSrc}
                  className="aspect-square w-full rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={relatedProduct.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {relatedProduct.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {relatedProduct.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {relatedProduct.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 py-20">
            <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
              {/* Image section */}
              <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-1">
                <img
                  alt=""
                  src="https://cdn.builder.io/api/v1/image/assets%2F2d23cb488ecf4aa3809d17ace84b1dc2%2F69526efafa864bc0b45828041adfc440"
                  className="h-8 w-auto"
                />
              </div>

              {/* Sitemap sections */}
              <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-2">
                <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Produkter
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      {footerNavigation.products.map((item) => (
                        <li key={item.name} className="text-sm">
                          <a
                            href={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Företag
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      {footerNavigation.company.map((item) => (
                        <li key={item.name} className="text-sm">
                          <a
                            href={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Kundservice
                  </h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.customerService.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Newsletter section */}
              <div className="mt-12 md:col-span-8 md:col-start-3 md:row-start-2 md:mt-0 lg:col-span-4 lg:col-start-9 lg:row-start-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Prenumerera på vårt nyhetsbrev
                </h3>
                <p className="mt-6 text-sm text-gray-500">
                  De senaste erbjudandena och besparingarna, skickade till din
                  inkorg varje vecka.
                </p>
                <form className="mt-2 flex sm:max-w-md">
                  <input
                    id="email-address"
                    type="email"
                    required
                    autoComplete="email"
                    aria-label="E-postadress"
                    placeholder="Ange din e-postadress"
                    className="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                  <div className="ml-4 shrink-0">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                      Prenumerera
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 Lagerteknik AB. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
