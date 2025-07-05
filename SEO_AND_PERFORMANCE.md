# SEO and Performance Optimization

## SEO Guidelines

### 1. Meta Tags and Structured Data

```tsx
// app/components/SEOHead.tsx
const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  product,
  collection,
}) => {
  const siteTitle = 'Remlagret - Industrial Bearings & Transmission';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Product Structured Data */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images[0]?.url,
            sku: product.variants[0]?.sku,
            brand: {
              '@type': 'Brand',
              name: product.vendor,
            },
            offers: {
              '@type': 'Offer',
              price: product.price.amount,
              priceCurrency: product.price.currencyCode,
              availability: product.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          })}
        </script>
      )}
      
      {/* Collection Structured Data */}
      {collection && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: collection.title,
            description: collection.description,
            url: url,
          })}
        </script>
      )}
    </>
  );
};
```

### 2. URL Structure and Sitemap

```tsx
// app/routes/sitemap.xml.tsx
export const loader: LoaderFunction = async ({ request, context }) => {
  const { storefront } = context;
  
  // Fetch all products and collections
  const [products, collections, pages] = await Promise.all([
    getAllProducts(storefront),
    getAllCollections(storefront),
    getAllPages(storefront),
  ]);
  
  const baseUrl = 'https://www.remlagret.se';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Products -->
      ${products.map(product => `
        <url>
          <loc>${baseUrl}/products/${product.handle}</loc>
          <lastmod>${product.updatedAt}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      
      <!-- Collections -->
      ${collections.map(collection => `
        <url>
          <loc>${baseUrl}/collections/${collection.handle}</loc>
          <lastmod>${collection.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
      
      <!-- Pages -->
      ${pages.map(page => `
        <url>
          <loc>${baseUrl}/pages/${page.handle}</loc>
          <lastmod>${page.updatedAt}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
    </urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
```

### 3. Canonical URLs and Alternates

```tsx
// app/components/CanonicalLinks.tsx
const CanonicalLinks: React.FC<{
  path: string;
  alternates?: { locale: string; url: string }[];
}> = ({ path, alternates }) => {
  const baseUrl = 'https://www.remlagret.se';
  const canonicalUrl = `${baseUrl}${path}`;
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {alternates?.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}${url}`}
        />
      ))}
    </>
  );
};
```

## Performance Optimizations

### 1. Image Loading Strategy

```tsx
// app/components/OptimizedImage.tsx
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}> = ({ src, alt, sizes, priority = false }) => {
  // Generate srcSet for responsive images
  const generateSrcSet = (url: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => `${url}?width=${width} ${width}w`)
      .join(', ');
  };
  
  return (
    <div className="relative">
      {/* Low-quality placeholder */}
      <img
        src={`${src}?width=20&quality=30`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 transform"
      />
      
      {/* Main image */}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="relative w-full h-full object-cover"
      />
    </div>
  );
};
```

### 2. Code Splitting and Dynamic Imports

```tsx
// app/routes/products.$handle.tsx
import {lazy, Suspense} from 'react';

const ProductReviews = lazy(() => import('~/components/ProductReviews'));
const RelatedProducts = lazy(() => import('~/components/RelatedProducts'));
const ProductRecommendations = lazy(() => import('~/components/ProductRecommendations'));

export default function ProductPage() {
  return (
    <div>
      {/* Critical content */}
      <ProductDetails />
      
      {/* Non-critical content */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews />
      </Suspense>
      
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts />
      </Suspense>
      
      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations />
      </Suspense>
    </div>
  );
}
```

### 3. Caching Strategy

```tsx
// app/lib/cache.ts
import {createCache} from '@shopify/hydrogen';

export const cache = createCache({
  // Product cache
  product: {
    maxAge: 60 * 60, // 1 hour
    staleWhileRevalidate: 60 * 60 * 24, // 24 hours
    group: 'products',
  },
  
  // Collection cache
  collection: {
    maxAge: 60 * 60 * 2, // 2 hours
    staleWhileRevalidate: 60 * 60 * 24, // 24 hours
    group: 'collections',
  },
  
  // Search results cache
  search: {
    maxAge: 60 * 15, // 15 minutes
    staleWhileRevalidate: 60 * 60, // 1 hour
    group: 'search',
  },
  
  // Cart cache (shorter duration)
  cart: {
    maxAge: 60 * 5, // 5 minutes
    staleWhileRevalidate: 60 * 15, // 15 minutes
    group: 'cart',
  },
});
```

### 4. Resource Hints

```tsx
// app/root.tsx
export default function App() {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical domains */}
        <link
          rel="preconnect"
          href="https://cdn.shopify.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/Inter-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Preload critical images */}
        <link
          rel="preload"
          href="/images/logo.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

### 5. Bundle Optimization

```javascript
// vite.config.ts
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  build: {
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            '@headlessui/react',
            '@heroicons/react',
          ],
          utils: [
            './app/lib/utils',
            './app/lib/hooks',
          ],
        },
      },
    },
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Enable source maps for production
  sourcemap: true,
});
```

### 6. Service Worker

```typescript
// app/entry.worker.ts
/// <reference lib="WebWorker" />

import {CacheFirst, NetworkFirst} from 'workbox-strategies';
import {registerRoute} from 'workbox-routing';
import {ExpirationPlugin} from 'workbox-expiration';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

// Cache static assets
registerRoute(
  ({request}) => request.destination === 'style' ||
                 request.destination === 'script' ||
                 request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache images
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Network-first for API requests
registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);
```

Would you like me to:
1. Add more performance optimization techniques?
2. Create additional SEO components?
3. Add analytics integration guidelines?
4. Provide server-side optimization tips? 