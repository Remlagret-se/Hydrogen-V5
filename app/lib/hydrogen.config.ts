import {defineConfig, CachingStrategy} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    defaultCountryCode: 'SE',
    defaultLanguageCode: 'SV',
    storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
    storefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
    storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION!,
  },
  
  // Caching Strategies
  cache: {
    // Product pages cache
    pages: {
      mode: CachingStrategy.StaleWhileRevalidate,
      maxAge: 60 * 60, // 1 hour
      staleWhileRevalidate: 60 * 60 * 24, // 24 hours
    },
    
    // Collection pages cache
    collections: {
      mode: CachingStrategy.StaleWhileRevalidate,
      maxAge: 60 * 60 * 2, // 2 hours
      staleWhileRevalidate: 60 * 60 * 24, // 24 hours
    },
    
    // Static pages cache
    static: {
      mode: CachingStrategy.CacheFirst,
      maxAge: 60 * 60 * 24, // 24 hours
    },
    
    // API responses cache
    api: {
      mode: CachingStrategy.NetworkFirst,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  // Performance optimizations
  performance: {
    // Image optimization
    imageOptimization: {
      defaultWidth: 1000,
      defaultHeight: 1000,
      formats: ['webp', 'jpeg'],
      contentTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minimumQuality: 80,
    },
    
    // Streaming SSR
    streaming: {
      enabled: true,
      partialHydration: true,
      suspenseDelay: 0,
    },
  },
  
  // SEO configuration
  seo: {
    titleTemplate: '%s | Remlagret',
    defaultTitle: 'Remlagret - Industrial Bearings & Transmission',
    robotsTxt: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/account', '/cart', '/checkout', '/search'],
      sitemap: 'https://www.remlagret.se/sitemap.xml',
    },
  },
  
  // Session configuration
  session: {
    name: 'remlagret_session',
    secret: process.env.SESSION_SECRET!,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true,
  },
}); 