import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useRouteLoaderData} from 'react-router';
import {HomePage} from '~/components/HomePage';
import type {RootLoader} from '~/root';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Return early if storefront is not available
  if (!storefront) {
    return {
      products: [],
    };
  }

  const {products} = await storefront.query(FEATURED_PRODUCTS_QUERY);

  return {
    products: products.nodes,
  };
}

export default function Index() {
  const {products} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<RootLoader>('root');
  
  if (!rootData) {
    return null;
  }
  
  const {header, currentMarket} = rootData;
  
  // Extract collections data from header query with null-safety
  const collections = header?.collections?.nodes || [];
  const sparkullager = header?.sparkullager;
  const sfariskaKullager = header?.sfariskaKullager;
  const menu = header?.menu;

  return (
    <HomePage
      menu={menu}
      collections={collections}
      sparkullager={sparkullager}
      sfariskaKullager={sfariskaKullager}
      products={products}
      currentMarket={currentMarket}
      cart={rootData.cart}
    />
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts {
    products(first: 8) {
      nodes {
        id
        title
        handle
        vendor
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
` as const; 
