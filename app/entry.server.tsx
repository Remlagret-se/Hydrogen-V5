import './polyfills.server';
import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server.browser';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  // For development, use a simpler CSP or disable it entirely
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let nonce = '';
  let header = '';
  let NonceProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  if (!isDevelopment) {
    // Only use full CSP in production
    const csp = createContentSecurityPolicy({
      shop: {
        checkoutDomain: context?.env?.PUBLIC_CHECKOUT_DOMAIN,
        storeDomain: context?.env?.PUBLIC_STORE_DOMAIN,
      },
      // Production CSP settings
      imgSrc: [
        "'self'",
        'https://cdn.shopify.com',
        'https://shopify.com',
        'data:',
      ],
      fontSrc: [
        "'self'",
        'https://rsms.me',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.shopify.com',
        'https://rsms.me',
      ],
    });
    nonce = csp.nonce;
    header = csp.header;
    NonceProvider = csp.NonceProvider;
  } else {
    // Development: use a permissive CSP
    header = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:* ws://localhost:* https://cdn.shopify.com https://shopify.com https://picsum.photos https://fastly.picsum.photos https://cdn.picsum.photos https://rsms.me;";
  }

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
