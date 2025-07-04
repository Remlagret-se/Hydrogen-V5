import type {AppLoadContext} from '@shopify/remix-oxygen';
import {createStorefrontClient} from '@shopify/hydrogen';
import {createCookieSessionStorage} from '@shopify/remix-oxygen';

export async function getLoadContext(
  request: Request,
): Promise<AppLoadContext> {
  console.log('=== getLoadContext called (Node.js development) ===');
  console.log('Request URL:', request.url);
  
  // Get environment variables from process.env in development
  const env = {
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
    PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN || '',
    PUBLIC_STOREFRONT_API_VERSION: process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-04',
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID || '',
    SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || '',
    PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN || '',
    SHOP_ID: process.env.SHOP_ID || '',
  } as Env;

  console.log('Environment variables loaded:', {
    storeDomain: !!env.PUBLIC_STORE_DOMAIN,
    publicToken: !!env.PUBLIC_STOREFRONT_API_TOKEN,
    privateToken: !!env.PRIVATE_STOREFRONT_API_TOKEN,
  });

  try {
    // Create storefront client for development
    console.log('Creating storefront client for development...');
    
    const {storefront} = createStorefrontClient({
      cache: await caches.open('hydrogen'),
      waitUntil: () => {},
      i18n: {language: 'EN', country: 'US'},
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
      storefrontId: env.PUBLIC_STOREFRONT_ID,
    });

    console.log('Storefront client created successfully:', !!storefront);

    // Create session storage
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: '__session',
        httpOnly: true,
        secure: false, // false for development
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        secrets: [env.SESSION_SECRET],
      },
    });

    const session = await sessionStorage.getSession(request.headers.get('Cookie'));

    console.log('Returning development context with real storefront');

    return {
      env,
      waitUntil: () => {},
      storefront,
      session,
      sessionStorage,
    };

  } catch (error) {
    console.error('Error creating development context:', error);
    
    // Return minimal context on error
    return {
      env,
      waitUntil: () => {},
      error: error?.message || 'Development context creation failed',
    } as any;
  }
} 