import {createStorefrontClient} from '@shopify/hydrogen';
import {createCookieSessionStorage} from '@shopify/remix-oxygen';
import type {AppLoadContext} from '@shopify/remix-oxygen';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
): Promise<AppLoadContext> {
  console.log('=== FORCE WORKING CONTEXT ===');
  console.log('Request URL:', request.url);
  
  // Force return a working context with mock storefront for testing
  const mockStorefront = {
    query: async (query: string, options?: any) => {
      console.log('Mock storefront query called:', query.substring(0, 100));
      
      // Return mock collection data
      if (query.includes('collection(handle:')) {
        return {
          collection: {
            id: 'gid://shopify/Collection/12345',
            title: 'Sparkullager',
            handle: options?.variables?.handle || 'sparkullager',
            description: 'En fantastisk kollektion av sparkullager från vår butik.',
            products: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/Product/1',
                    title: 'Premium Sparkullager',
                    handle: 'premium-sparkullager',
                    vendor: 'SKF',
                    productType: 'Kullager',
                    featuredImage: {
                      url: 'https://picsum.photos/400/400?random=1',
                      altText: 'Premium Sparkullager',
                      width: 400,
                      height: 400
                    },
                    priceRange: {
                      minVariantPrice: {
                        amount: '299.00',
                        currencyCode: 'SEK'
                      },
                      maxVariantPrice: {
                        amount: '299.00',
                        currencyCode: 'SEK'
                      }
                    },
                    variants: {
                      nodes: [{
                        id: 'gid://shopify/ProductVariant/1',
                        availableForSale: true,
                        price: {
                          amount: '299.00',
                          currencyCode: 'SEK'
                        }
                      }]
                    }
                  }
                },
                {
                  node: {
                    id: 'gid://shopify/Product/2',
                    title: 'Standard Sparkullager',
                    handle: 'standard-sparkullager',
                    vendor: 'FAG',
                    productType: 'Kullager',
                    featuredImage: {
                      url: 'https://picsum.photos/400/400?random=2',
                      altText: 'Standard Sparkullager',
                      width: 400,
                      height: 400
                    },
                    priceRange: {
                      minVariantPrice: {
                        amount: '199.00',
                        currencyCode: 'SEK'
                      },
                      maxVariantPrice: {
                        amount: '199.00',
                        currencyCode: 'SEK'
                      }
                    },
                    variants: {
                      nodes: [{
                        id: 'gid://shopify/ProductVariant/2',
                        availableForSale: true,
                        price: {
                          amount: '199.00',
                          currencyCode: 'SEK'
                        }
                      }]
                    }
                  }
                }
              ]
            }
          }
        };
      }
      
      // Return empty result for other queries
      return {};
    }
  };

  console.log('Returning mock context with working storefront');

  return {
    env,
    waitUntil: executionContext.waitUntil.bind(executionContext),
    storefront: mockStorefront,
    session: null,
    sessionStorage: null,
  } as any;
} 
