// Komplett Produktsida - Anpassad från Tailwind UI Plus för Hydrogen
import { useState } from 'react';
import { Disclosure, RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ClientOnly } from '~/components/ClientOnly';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Money, Image } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants.nodes[0]);
  const [selectedSize, setSelectedSize] = useState(product.variants.nodes[0]);

  // Simulera produktdata - i verkligheten kommer detta från GraphQL
  const productData = {
    rating: 4,
    reviewCount: 117,
    colors: [
      { name: 'Space Gray', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
      { name: 'Silver', bgColor: 'bg-gray-200', selectedColor: 'ring-gray-400' },
      { name: 'Gold', bgColor: 'bg-yellow-500', selectedColor: 'ring-yellow-500' },
    ],
    sizes: [
      { name: 'XXS', inStock: false },
      { name: 'XS', inStock: true },
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true },
      { name: 'XXL', inStock: true },
      { name: 'XXXL', inStock: false },
    ],
    details: [
      'Endast det bästa materialet',
      'Etiskt och hållbart tillverkat',
      'Förtvättat och förskrumpet',
      'Maskintvätt upp till 30°C',
    ],
    faqs: [
      {
        question: 'Vad är din returpolicy?',
        answer: 'Vi erbjuder 30 dagars öppet köp på alla produkter. Produkten måste vara oanvänd och i originalförpackning.',
      },
      {
        question: 'Hur lång tid tar leveransen?',
        answer: 'Vi levererar inom 2-3 arbetsdagar med fri frakt på beställningar över 1000 kr.',
      },
      {
        question: 'Kan jag byta storlek?',
        answer: 'Ja, du kan byta storlek kostnadsfritt inom 30 dagar från köpdatum.',
      },
    ],
  };

  const breadcrumbs = [
    { id: 1, name: 'Hem', href: '/' },
    { id: 2, name: 'Produkter', href: '/collections/all' },
    { id: 3, name: product.vendor || 'Varumärke', href: `/collections/${product.vendor?.toLowerCase()}` },
  ];

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a href={product.handle} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.title}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            {product.images.nodes[0] && (
              <Image
                data={product.images.nodes[0]}
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              {product.images.nodes[1] && (
                <Image
                  data={product.images.nodes[1]}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              {product.images.nodes[2] && (
                <Image
                  data={product.images.nodes[2]}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            {product.featuredImage && (
              <Image
                data={product.featuredImage}
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.title}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Produktinformation</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              <Money data={product.priceRange.minVariantPrice} />
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Recensioner</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        productData.rating > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{productData.rating} av 5 stjärnor</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {productData.reviewCount} recensioner
                </a>
              </div>
            </div>

            <form className="mt-10">
              <ClientOnly>
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Färg</h3>

                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                    <RadioGroup.Label className="sr-only">Välj en färg</RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {productData.colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              color.selectedColor,
                              active && checked ? 'ring ring-offset-1' : '',
                              !active && checked ? 'ring-2' : '',
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color.name}
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.bgColor,
                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Storlek</h3>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Storleksguide
                    </a>
                  </div>

                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                    <RadioGroup.Label className="sr-only">Välj en storlek</RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {productData.sizes.map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={({ active }) =>
                            classNames(
                              size.inStock
                                ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                : 'cursor-not-allowed bg-gray-50 text-gray-200',
                              active ? 'ring-2 ring-indigo-500' : '',
                              'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                              {size.inStock ? (
                                <span
                                  className={classNames(
                                    active ? 'border' : 'border-2',
                                    checked ? 'border-indigo-500' : 'border-transparent',
                                    'pointer-events-none absolute -inset-px rounded-md'
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </ClientOnly>

              <AddToCartButton
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                lines={[
                  {
                    merchandiseId: selectedSize.id || product.variants.nodes[0].id,
                    quantity: 1,
                  },
                ]}
              >
                Lägg i varukorg
              </AddToCartButton>

              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <HeartIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Lägg till i önskelista
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Beskrivning</h3>

              <div className="space-y-6">
                <div className="text-base text-gray-900" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Höjdpunkter</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {productData.details.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Detaljer</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>

            <ClientOnly>
              <section aria-labelledby="faq-heading" className="mt-10">
                <h2 id="faq-heading" className="text-sm font-medium text-gray-900">
                  Vanliga frågor
                </h2>

                <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                  {productData.faqs.map((faq) => (
                    <Disclosure as="div" key={faq.question} className="pt-6">
                      {({ open }) => (
                        <>
                          <dt>
                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                              <span className="text-sm font-medium">{faq.question}</span>
                              <span className="ml-6 flex h-7 items-center">
                                {open ? (
                                  <MinusIcon className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-6 w-6" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </dt>
                          <Disclosure.Panel as="dd" className="mt-2 pr-12">
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </dl>
              </section>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
} 