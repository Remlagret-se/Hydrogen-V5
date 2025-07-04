import type {Session} from '@shopify/remix-oxygen';
import type {Storefront} from '@shopify/hydrogen';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {I18nBase} from '@shopify/hydrogen';

export interface Env {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_CHECKOUT_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_API_VERSION: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
  PUBLIC_STOREFRONT_ID: string;
  SESSION_SECRET: string;
}

export interface ExecutionContext {
  waitUntil: (promise: Promise<any>) => void;
}

export interface CartApiQueryFragment {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          priceV2: {
            amount: string;
            currencyCode: string;
          };
          product: {
            id: string;
            title: string;
            handle: string;
            images: {
              edges: Array<{
                node: {
                  url: string;
                  altText: string;
                };
              }>;
            };
          };
        };
      };
    }>;
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  metafields: Array<{
    key: string;
    value: string;
    namespace: string;
  }>;
}

export interface Consent {
  checkoutDomain: string;
  storefrontAccessToken: string;
  withPrivacyBanner: boolean;
  country: string;
  language: string;
}

export interface FooterQuery {
  shop: {
    name: string;
    description: string;
  };
}

export interface CollectionFragment {
  id: string;
  title: string;
  handle: string;
}

export interface ProductItemFragment {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

export interface ArticleItemFragment {
  id: string;
  title: string;
  handle: string;
  publishedAt: string;
  contentHtml: string;
}

export interface OrderLineItemFullFragment {
  id: string;
  title: string;
  quantity: number;
  variantTitle: string;
}

export interface CartReturn {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: Array<{
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      priceV2: {
        amount: string;
        currencyCode: string;
      };
      product: {
        id: string;
        title: string;
        handle: string;
        images: {
          edges: Array<{
            node: {
              url: string;
              altText: string;
            };
          }>;
        };
      };
    };
  }>;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface SearchResult {
  type: 'regular' | 'predictive';
  term: string;
  error?: string;
  result: {
    total: number;
    items: any;
  };
}

export interface HeaderProps {
  header: any;
  cart: any;
  isLoggedIn: boolean;
  publicStoreDomain: string;
}

export interface FooterProps {
  footer: any;
  header: any;
  publicStoreDomain: string;
} 
