import {Analytics, getShopAnalytics, CacheLong} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {
  FOOTER_QUERY,
  HEADER_QUERY,
  ROOT_COLLECTIONS_QUERY,
} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';

import {
  getMarketFromRequest,
  getLocaleFromRequest,
  detectUserPreferredMarket,
  getMarketFromCookie,
  getStorefrontLocale,
  type Market,
} from '~/lib/utils/localization';
import {useNonce, CartProvider} from '@shopify/hydrogen';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css'},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
      crossOrigin: 'anonymous',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  const {request} = args;

  // Hämta marknad från request
  const currentMarket = getMarketFromRequest(request);
  const locale = getLocaleFromRequest(request);

  // Detektera användarens föredragna marknad
  const cookieMarket = getMarketFromCookie(request);
  const detectedMarket = cookieMarket || detectUserPreferredMarket(request);

  // Uppdatera storefront context med rätt locale (med null-safety)
  if (args.context?.storefront) {
    args.context.storefront.i18n = locale;
  }

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context || {};

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env?.PUBLIC_STORE_DOMAIN,
    currentMarket,
    detectedMarket,
    shop: storefront
      ? getShopAnalytics({
          storefront,
          publicStorefrontId: env?.PUBLIC_STOREFRONT_ID,
        })
      : null,
    consent: {
      checkoutDomain: env?.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env?.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: currentMarket.country,
      language: currentMarket.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Return early if storefront is not available
  if (!storefront) {
    return {
      header: null,
      collections: null,
    };
  }

  const [header, collections] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
        language: storefront.i18n?.language || 'EN',
      },
    }),
    // Hämta alla collections dynamiskt från Shopify
    storefront.query(ROOT_COLLECTIONS_QUERY, {
      cache: CacheLong(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header, collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer =
    storefront
      ?.query(FOOTER_QUERY, {
        cache: CacheLong(),
        variables: {
          footerMenuHandle: 'footer', // Adjust to your footer menu handle
          language: storefront.i18n?.language || 'EN',
        },
      })
      .catch((error) => {
        // Log query errors, but don't throw them so the page can still render
        console.error(error);
        return null;
      }) || Promise.resolve(null);
  return {
    cart: cart?.get() || null,
    isLoggedIn: customerAccount?.isLoggedIn() || false,
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const nonce = useNonce();

  return (
    <html
      lang={data?.currentMarket?.language.toLowerCase() || 'sv'}
      className="h-full"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <Meta />
        <Links />
      </head>
      <body
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--gray-12)',
        }}
        className="h-full"
      >
        <Analytics.Provider
          cart={data?.cart}
          shop={data?.shop}
          consent={data?.consent}
        >
          <div>
            <header style={{backgroundColor: 'var(--gray-2)', padding: '1rem'}}>
              <h1>Remlagret</h1>
              <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.8}}>
                Powered by Hydrogen 2025.5.0{' '}
                {data?.shop?.name ? `• ${data.shop.name}` : ''}
              </p>
            </header>
            <main>{children}</main>
            <footer
              style={{
                backgroundColor: 'var(--gray-2)',
                padding: '1rem',
                marginTop: '2rem',
              }}
            >
              <p>© 2024 Remlagret. All rights reserved.</p>
            </footer>
          </div>
        </Analytics.Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const is404 = errorStatus === 404;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{backgroundColor: 'var(--color-background)'}}
    >
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1
            className="text-6xl font-bold mb-4"
            style={{color: 'var(--gray-12)'}}
          >
            {errorStatus}
          </h1>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{color: 'var(--gray-11)'}}
          >
            {is404 ? 'Sidan hittades inte' : 'Ett fel inträffade'}
          </h2>
          <p className="text-base mb-8" style={{color: 'var(--gray-9)'}}>
            {is404
              ? 'Sidan du söker efter finns inte eller har flyttats.'
              : 'Vi ber om ursäkt för besväret. Försök igen om en stund.'}
          </p>
        </div>

        {errorMessage && !is404 && (
          <div
            className="p-4 rounded-lg mb-8 text-left"
            style={{
              backgroundColor: 'var(--gray-3)',
              borderColor: 'var(--gray-6)',
            }}
          >
            <h3 className="font-medium mb-2" style={{color: 'var(--gray-12)'}}>
              Teknisk information:
            </h3>
            <pre
              className="text-sm overflow-x-auto"
              style={{color: 'var(--gray-11)'}}
            >
              {errorMessage}
            </pre>
          </div>
        )}

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block w-full px-6 py-3 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
            style={{backgroundColor: 'var(--blue-9)'}}
          >
            Tillbaka till startsidan
          </a>

          {is404 && (
            <a
              href="/collections"
              className="inline-block w-full px-6 py-3 font-medium rounded-md border hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--gray-6)',
                color: 'var(--gray-12)',
              }}
            >
              Bläddra bland produkter
            </a>
          )}
        </div>

        <div
          className="mt-8 pt-8 border-t"
          style={{borderColor: 'var(--gray-6)'}}
        >
          <p className="text-sm" style={{color: 'var(--gray-9)'}}>
            Behöver du hjälp? Kontakta vår{' '}
            <a
              href="/pages/kontakt"
              className="underline hover:opacity-80 transition-opacity"
              style={{color: 'var(--blue-9)'}}
            >
              kundservice
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
