// Virtual entry point for the app
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:react-router/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      console.log('=== SERVER REQUEST ===');
      console.log('URL:', request.url);
      console.log('Method:', request.method);
      console.log('Is collection route:', request.url.includes('/collections/'));
      
      console.log('About to create AppLoadContext...');
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      console.log('AppLoadContext created, storefront available:', !!appLoadContext.storefront);
      console.log('AppLoadContext keys:', Object.keys(appLoadContext));

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      console.log('Creating request handler...');
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => {
          console.log('getLoadContext called, returning:', Object.keys(appLoadContext));
          return appLoadContext;
        },
      });

      console.log('Handling request...');
      const response = await handleRequest(request);

      // Handle session commits if needed
      if (appLoadContext.session && appLoadContext.sessionStorage) {
        const headers = new Headers(response.headers);
        headers.append(
          'Set-Cookie',
          await appLoadContext.sessionStorage.commitSession(appLoadContext.session)
        );
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error('=== SERVER ERROR ===');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
