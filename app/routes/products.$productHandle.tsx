import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {ProductPage} from '~/components/examples/ProductPage';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  // Return early if storefront is not available
  if (!storefront) {
    throw new Response('Storefront not available', {status: 500});
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
    },
  });

  if (!product?.id) {
    throw new Response('Not found', {status: 404});
  }

  return {
    product,
  };
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  return <ProductPage product={product} />;
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      featuredImage {
        id
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      options {
        name
        values
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
      variants(first: 100) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
` as const; 

