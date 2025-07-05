import {useQuery} from '@tanstack/react-query';
import {useStorefront} from '@shopify/hydrogen';
import type {StorefrontApiResponse} from '@shopify/hydrogen';
import {useMemo} from 'react';

interface QueryOptions<T> {
  query: string;
  variables?: Record<string, any>;
  cache?: boolean;
  cacheTime?: number;
  staleTime?: number;
  suspense?: boolean;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useShopifyQuery<T>({
  query,
  variables,
  cache = true,
  cacheTime = 1000 * 60 * 60, // 1 hour
  staleTime = 1000 * 60 * 5, // 5 minutes
  suspense = false,
  enabled = true,
  onSuccess,
  onError,
}: QueryOptions<T>) {
  const {storefront} = useStorefront();
  
  // Memoize the query key to prevent unnecessary re-renders
  const queryKey = useMemo(
    () => ['shopify', query, variables],
    [query, variables]
  );

  return useQuery<StorefrontApiResponse<T>, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await storefront.query<T>(query, {
          variables,
          cache: cache ? 'force-cache' : 'no-store',
        });

        return response;
      } catch (error) {
        console.error('Shopify query error:', error);
        throw error;
      }
    },
    cacheTime,
    staleTime,
    suspense,
    enabled,
    onSuccess,
    onError,
  });
}

// Product queries
export const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      
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
      
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      
      variants(first: 250) {
        nodes {
          id
          title
          sku
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
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      
      options {
        name
        values
      }
      
      seo {
        title
        description
      }
      
      vendor
      tags
      
      metafields(
        identifiers: [
          {namespace: "custom", key: "specifications"},
          {namespace: "custom", key: "features"},
          {namespace: "custom", key: "warranty"}
        ]
      ) {
        namespace
        key
        value
      }
    }
    
    productRecommendations(productId: $productId) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        nodes {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

// Collection queries
export const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      
      image {
        id
        url
        altText
        width
        height
      }
      
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            nodes {
              url
              altText
              width
              height
            }
          }
          variants(first: 1) {
            nodes {
              availableForSale
            }
          }
        }
      }
      
      seo {
        title
        description
      }
    }
  }
`;

// Search queries
export const SEARCH_QUERY = `#graphql
  query Search($query: String!, $first: Int!, $after: String) {
    products(query: $query, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
            width
            height
          }
        }
        variants(first: 1) {
          nodes {
            availableForSale
          }
        }
      }
    }
  }
`;

// Usage example:
/*
import {useShopifyQuery, PRODUCT_QUERY} from '~/lib/hooks/useShopifyQuery';

function ProductPage({handle}: {handle: string}) {
  const {data, isLoading, error} = useShopifyQuery({
    query: PRODUCT_QUERY,
    variables: {handle},
    suspense: true,
    onSuccess: (data) => {
      // Handle success
      console.log('Product data:', data);
    },
    onError: (error) => {
      // Handle error
      console.error('Failed to fetch product:', error);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{data.product.title}</h1>
      {/* Render product details *//*}
    </div>
  );
}
*/ 