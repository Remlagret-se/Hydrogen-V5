import {Fragment, useState} from 'react';
import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react';
import {XMarkIcon as XMarkIconOutline} from '@heroicons/react/24/outline';
import {ChevronDownIcon} from '@heroicons/react/16/solid';
import {
  CheckIcon,
  ClockIcon,
  XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Money} from '@shopify/hydrogen';

export type CartLayout = 'page' | 'aside';

export interface CartMainProps {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
}

interface CartEmptyProps {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}

// Sample products for demo - replace with actual cart data
const sampleProducts = [
  {
    id: 1,
    name: 'SKF 6203-2RS1',
    href: '#',
    price: '245.00',
    currency: 'SEK',
    vendor: 'SKF',
    inStock: true,
    size: '17x40x12mm',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0000/0000/files/bearing-sample-1.jpg?v=1234567890',
    imageAlt: 'SKF 6203-2RS1 djupspårkullager',
    quantity: 2,
  },
  {
    id: 2,
    name: 'FAG 6004-C3',
    href: '#',
    price: '189.00',
    currency: 'SEK',
    vendor: 'FAG',
    inStock: false,
    leadTime: '2–3 veckor',
    size: '20x42x12mm',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0000/0000/files/bearing-sample-2.jpg?v=1234567890',
    imageAlt: 'FAG 6004-C3 djupspårkullager',
    quantity: 1,
  },
];

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // For demo purposes, use sample products if no cart items
  const products = cartHasItems ? cart.lines.nodes : sampleProducts;
  const isDemo = !cartHasItems;

  if (layout === 'aside') {
    return <CartAside cart={cart} />;
  }

  return (
    <div style={{backgroundColor: 'var(--color-background)'}}>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{color: 'var(--gray-12)'}}
        >
          Varukorg
        </h1>

        <CartEmpty hidden={linesCount || isDemo} layout={layout} />

        {(linesCount || isDemo) && (
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Produkter i din varukorg
              </h2>

              <ul
                role="list"
                className="divide-y border-t border-b"
                style={{
                  borderColor: 'var(--gray-6)',
                  '--tw-divide-opacity': '1',
                  borderTopColor: 'var(--gray-6)',
                  borderBottomColor: 'var(--gray-6)',
                }}
              >
                {products.map((product, productIdx) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="shrink-0">
                      <img
                        alt={product.imageAlt || product.name}
                        src={
                          product.imageSrc ||
                          'https://cdn.shopify.com/s/files/1/0000/0000/files/placeholder-bearing.jpg'
                        }
                        className="size-24 rounded-md object-cover sm:size-48"
                        style={{backgroundColor: 'var(--gray-4)'}}
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                to={product.href}
                                className="font-medium hover:opacity-80 transition-opacity"
                                style={{color: 'var(--gray-12)'}}
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p style={{color: 'var(--gray-9)'}}>
                              {product.vendor || 'Tillverkare'}
                            </p>
                            {product.size && (
                              <p
                                className="ml-4 border-l pl-4"
                                style={{
                                  borderColor: 'var(--gray-6)',
                                  color: 'var(--gray-9)',
                                }}
                              >
                                {product.size}
                              </p>
                            )}
                          </div>
                          <p
                            className="mt-1 text-sm font-medium"
                            style={{color: 'var(--gray-12)'}}
                          >
                            {isDemo ? (
                              `${product.price} ${product.currency}`
                            ) : (
                              <Money data={product.price} />
                            )}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="inline-grid w-full max-w-16 grid-cols-1">
                            <select
                              id={`quantity-${productIdx}`}
                              name={`quantity-${productIdx}`}
                              aria-label={`Antal, ${product.name}`}
                              defaultValue={product.quantity || 1}
                              className="col-start-1 row-start-1 appearance-none rounded-md py-1.5 pr-8 pl-3 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                              style={{
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--gray-12)',
                                outlineColor: 'var(--gray-6)',
                                '--tw-ring-color': 'var(--blue-9)',
                              }}
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
                              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end sm:size-4"
                              style={{color: 'var(--gray-9)'}}
                            />
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 hover:opacity-70 transition-opacity"
                              style={{color: 'var(--gray-9)'}}
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

                      <p
                        className="mt-4 flex space-x-2 text-sm"
                        style={{color: 'var(--gray-11)'}}
                      >
                        {product.inStock ? (
                          <CheckIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-green-500"
                          />
                        ) : (
                          <ClockIcon
                            aria-hidden="true"
                            className="size-5 shrink-0"
                            style={{color: 'var(--gray-6)'}}
                          />
                        )}

                        <span>
                          {product.inStock
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
              className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
              style={{backgroundColor: 'var(--gray-2)'}}
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium"
                style={{color: 'var(--gray-12)'}}
              >
                Ordersammanfattning
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm" style={{color: 'var(--gray-11)'}}>
                    Delsumma
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{color: 'var(--gray-12)'}}
                  >
                    679,00 kr
                  </dd>
                </div>
                <div
                  className="flex items-center justify-between border-t pt-4"
                  style={{borderColor: 'var(--gray-6)'}}
                >
                  <dt
                    className="flex items-center text-sm"
                    style={{color: 'var(--gray-11)'}}
                  >
                    <span>Frakt</span>
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{color: 'var(--gray-12)'}}
                  >
                    Gratis
                  </dd>
                </div>
                <div
                  className="flex items-center justify-between border-t pt-4"
                  style={{borderColor: 'var(--gray-6)'}}
                >
                  <dt
                    className="flex text-sm"
                    style={{color: 'var(--gray-11)'}}
                  >
                    <span>Moms (25%)</span>
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{color: 'var(--gray-12)'}}
                  >
                    135,80 kr
                  </dd>
                </div>
                <div
                  className="flex items-center justify-between border-t pt-4"
                  style={{borderColor: 'var(--gray-6)'}}
                >
                  <dt
                    className="text-base font-medium"
                    style={{color: 'var(--gray-12)'}}
                  >
                    Totalt
                  </dt>
                  <dd
                    className="text-base font-medium"
                    style={{color: 'var(--gray-12)'}}
                  >
                    814,80 kr
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-hidden transition-all"
                  style={{
                    backgroundColor: 'var(--blue-9)',
                    '--tw-ring-color': 'var(--blue-9)',
                    '--tw-ring-offset-color': 'var(--gray-2)',
                  }}
                >
                  Gå till kassan
                </button>
              </div>
            </section>
          </form>
        )}
      </main>
    </div>
  );
}

function CartAside({cart}: {cart: CartApiQueryFragment | null}) {
  const {close} = useAside();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    close();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div
                className="flex h-full flex-col overflow-y-scroll shadow-xl"
                style={{backgroundColor: 'var(--color-background)'}}
              >
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium"
                      style={{color: 'var(--gray-12)'}}
                    >
                      Varukorg
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative -m-2 p-2 hover:opacity-70 transition-opacity"
                        style={{color: 'var(--gray-9)'}}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Stäng panel</span>
                        <XMarkIconOutline
                          aria-hidden="true"
                          className="size-6"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y"
                        style={{
                          '--tw-divide-opacity': '1',
                          borderColor: 'var(--gray-6)',
                        }}
                      >
                        {sampleProducts.map((product) => (
                          <li key={product.id} className="flex py-6">
                            <div
                              className="size-24 shrink-0 overflow-hidden rounded-md"
                              style={{backgroundColor: 'var(--gray-4)'}}
                            >
                              <img
                                alt={product.imageAlt}
                                src={product.imageSrc}
                                className="size-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium">
                                  <h3 style={{color: 'var(--gray-12)'}}>
                                    <Link to={product.href}>
                                      {product.name}
                                    </Link>
                                  </h3>
                                  <p
                                    className="ml-4"
                                    style={{color: 'var(--gray-12)'}}
                                  >
                                    {product.price} {product.currency}
                                  </p>
                                </div>
                                <p
                                  className="mt-1 text-sm"
                                  style={{color: 'var(--gray-9)'}}
                                >
                                  {product.vendor}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p style={{color: 'var(--gray-9)'}}>
                                  Antal {product.quantity}
                                </p>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium hover:opacity-80 transition-opacity"
                                    style={{color: 'var(--blue-9)'}}
                                  >
                                    Ta bort
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className="border-t px-4 py-6 sm:px-6"
                  style={{borderColor: 'var(--gray-6)'}}
                >
                  <div className="flex justify-between text-base font-medium">
                    <p style={{color: 'var(--gray-12)'}}>Delsumma</p>
                    <p style={{color: 'var(--gray-12)'}}>679,00 kr</p>
                  </div>
                  <p
                    className="mt-0.5 text-sm"
                    style={{color: 'var(--gray-9)'}}
                  >
                    Frakt och moms beräknas vid kassan.
                  </p>
                  <div className="mt-6">
                    <button
                      className="flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
                      style={{backgroundColor: 'var(--blue-9)'}}
                    >
                      Gå till kassan
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm">
                    <p style={{color: 'var(--gray-9)'}}>
                      eller{' '}
                      <button
                        type="button"
                        onClick={handleClose}
                        className="font-medium hover:opacity-80 transition-opacity"
                        style={{color: 'var(--blue-9)'}}
                      >
                        Fortsätt handla
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function CartEmpty({hidden = false, layout}: CartEmptyProps) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="text-center py-16">
      <p className="text-lg mb-4" style={{color: 'var(--gray-11)'}}>
        Din varukorg är tom
      </p>
      <p className="text-sm mb-8" style={{color: 'var(--gray-9)'}}>
        Lägg till produkter för att komma igång med din beställning
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="inline-block px-6 py-3 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
        style={{backgroundColor: 'var(--blue-9)'}}
      >
        Fortsätt handla →
      </Link>
    </div>
  );
}

