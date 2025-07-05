# Analytics and Server-Side Optimization

## Analytics Integration

### 1. Google Analytics 4 Integration

```tsx
// app/lib/analytics/ga4.ts
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const pageview = (url: string, title: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title,
  });
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// app/root.tsx
export default function App() {
  const location = useLocation();
  
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      pageview(location.pathname + location.search, document.title);
    }
  }, [location]);
  
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

### 2. E-commerce Event Tracking

```tsx
// app/lib/analytics/ecommerce.ts
export const ecommerceEvents = {
  viewItem: (product: Product) => {
    window.gtag('event', 'view_item', {
      currency: product.price.currencyCode,
      value: parseFloat(product.price.amount),
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_brand: product.vendor,
        price: product.price.amount,
        currency: product.price.currencyCode,
        item_category: product.productType,
      }],
    });
  },
  
  addToCart: (product: Product, quantity: number) => {
    window.gtag('event', 'add_to_cart', {
      currency: product.price.currencyCode,
      value: parseFloat(product.price.amount) * quantity,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_brand: product.vendor,
        price: product.price.amount,
        currency: product.price.currencyCode,
        quantity: quantity,
      }],
    });
  },
  
  beginCheckout: (cart: Cart) => {
    window.gtag('event', 'begin_checkout', {
      currency: cart.cost.totalAmount.currencyCode,
      value: parseFloat(cart.cost.totalAmount.amount),
      items: cart.lines.map(line => ({
        item_id: line.merchandise.id,
        item_name: line.merchandise.product.title,
        item_brand: line.merchandise.product.vendor,
        price: line.cost.amountPerQuantity.amount,
        currency: line.cost.amountPerQuantity.currencyCode,
        quantity: line.quantity,
      })),
    });
  },
  
  purchase: (order: Order) => {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: parseFloat(order.totalPrice.amount),
      currency: order.totalPrice.currencyCode,
      tax: parseFloat(order.totalTax.amount),
      shipping: parseFloat(order.totalShipping.amount),
      items: order.lineItems.map(item => ({
        item_id: item.variant.id,
        item_name: item.title,
        item_brand: item.vendor,
        price: item.variant.price.amount,
        currency: item.variant.price.currencyCode,
        quantity: item.quantity,
      })),
    });
  },
};
```

### 3. Custom Event Tracking

```tsx
// app/lib/analytics/custom.ts
export const customEvents = {
  searchQuery: (query: string, resultsCount: number) => {
    window.gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount,
    });
  },
  
  filterProducts: (filters: Record<string, any>) => {
    window.gtag('event', 'filter_products', {
      filters: JSON.stringify(filters),
    });
  },
  
  newsletterSignup: (source: string) => {
    window.gtag('event', 'newsletter_signup', {
      signup_source: source,
    });
  },
  
  productQuickView: (productId: string) => {
    window.gtag('event', 'product_quick_view', {
      product_id: productId,
    });
  },
};
```

## Server-Side Optimization

### 1. GraphQL Query Optimization

```typescript
// app/lib/queries/optimized-product.ts
export const OPTIMIZED_PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      
      # Only fetch required variant fields
      variants(first: 250) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      
      # Only fetch required image fields
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      
      # Fetch metafields in a single query
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
  }
`;
```

### 2. Data Prefetching

```typescript
// app/lib/prefetch.ts
export const prefetchQueries = {
  product: async (storefront: Storefront, handle: string) => {
    const data = await Promise.all([
      // Main product data
      storefront.query(OPTIMIZED_PRODUCT_QUERY, {
        variables: { handle },
      }),
      
      // Related products
      storefront.query(RELATED_PRODUCTS_QUERY, {
        variables: { handle },
      }),
      
      // Product recommendations
      storefront.query(RECOMMENDATIONS_QUERY, {
        variables: { handle },
      }),
    ]);
    
    return {
      product: data[0].product,
      relatedProducts: data[1].products,
      recommendations: data[2].recommendations,
    };
  },
  
  collection: async (storefront: Storefront, handle: string) => {
    const data = await Promise.all([
      // Collection data with products
      storefront.query(COLLECTION_QUERY, {
        variables: { handle },
      }),
      
      // Collection filters
      storefront.query(COLLECTION_FILTERS_QUERY, {
        variables: { handle },
      }),
    ]);
    
    return {
      collection: data[0].collection,
      filters: data[1].collection.filters,
    };
  },
};
```

### 3. Response Optimization

```typescript
// app/lib/response.ts
export const optimizeResponse = {
  headers: {
    // Cache control
    cacheControl: (maxAge: number) => ({
      'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=31536000`,
    }),
    
    // Security headers
    security: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    
    // Compression
    compression: {
      'Content-Encoding': 'br',
      'Accept-Encoding': 'br, gzip',
    },
  },
  
  // Response transformers
  transform: {
    // Minify HTML
    minifyHtml: (html: string) => {
      return html
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    },
    
    // Optimize JSON
    optimizeJson: (json: any) => {
      return JSON.stringify(json, null, 0);
    },
  },
};
```

### 4. Server-Side Caching

```typescript
// app/lib/cache/server.ts
import type {CacheEntry} from '@shopify/hydrogen';

export const serverCache = {
  // Memory cache for frequently accessed data
  memory: new Map<string, CacheEntry>(),
  
  // Redis cache for distributed caching
  redis: {
    client: new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    }),
    
    async get(key: string) {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    },
    
    async set(key: string, value: any, ttl?: number) {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    },
  },
  
  // Cache strategies
  strategies: {
    // Stale-while-revalidate strategy
    async staleWhileRevalidate(key: string, fetchFn: () => Promise<any>) {
      const cached = await serverCache.redis.get(key);
      
      if (cached) {
        // Return cached data immediately
        const revalidate = async () => {
          const fresh = await fetchFn();
          await serverCache.redis.set(key, fresh);
        };
        revalidate();
        return cached;
      }
      
      // No cache, fetch fresh data
      const fresh = await fetchFn();
      await serverCache.redis.set(key, fresh);
      return fresh;
    },
    
    // Cache-first strategy
    async cacheFirst(key: string, fetchFn: () => Promise<any>, ttl?: number) {
      const cached = await serverCache.redis.get(key);
      if (cached) return cached;
      
      const fresh = await fetchFn();
      await serverCache.redis.set(key, fresh, ttl);
      return fresh;
    },
  },
};
```

### 5. Request Queue Management

```typescript
// app/lib/queue.ts
import PQueue from 'p-queue';

export const requestQueue = {
  // Queue for API requests
  api: new PQueue({
    concurrency: 10,
    interval: 1000,
    intervalCap: 50,
  }),
  
  // Queue for background jobs
  jobs: new PQueue({
    concurrency: 5,
    interval: 1000,
    intervalCap: 20,
  }),
  
  // Add request to queue
  async enqueue(
    queue: 'api' | 'jobs',
    task: () => Promise<any>,
    priority = 0
  ) {
    return this[queue].add(task, {priority});
  },
  
  // Monitor queue health
  metrics: {
    getQueueMetrics(queue: 'api' | 'jobs') {
      const q = requestQueue[queue];
      return {
        size: q.size,
        pending: q.pending,
        isPaused: q.isPaused,
      };
    },
    
    async getQueueStats(queue: 'api' | 'jobs') {
      const q = requestQueue[queue];
      return {
        completed: await q.completed,
        errors: q.errors,
        averageTime: q.averageTime,
      };
    },
  },
};
```

Would you like me to:
1. Add more analytics tracking examples?
2. Create additional server optimization techniques?
3. Add performance monitoring guidelines?
4. Provide deployment optimization tips? 