import {createStorefrontClient, StorefrontClient} from '@shopify/hydrogen';
import type {AppLoadContext} from '@shopify/remix-oxygen';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
): Promise<AppLoadContext> {
  const {storefront} = createStorefrontClient({
    cache: await caches.open('hydrogen'),
    waitUntil: executionContext.waitUntil.bind(executionContext),
    i18n: {language: 'SV', country: 'SE'},
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
    storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
    storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
    storefrontId: env.PUBLIC_STOREFRONT_ID,
    storefrontHeaders: {
      requestGroupId: request.headers.get('request-id'),
      buyerIp: request.headers.get('oxygen-buyer-ip'),
      cookie: request.headers.get('cookie'),
    },
  });

  return {
    env,
    storefront,
    waitUntil: executionContext.waitUntil.bind(executionContext),
  };
} 
