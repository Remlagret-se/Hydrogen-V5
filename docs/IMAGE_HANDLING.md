# Image Handling in Shopify Hydrogen Store

This document outlines the comprehensive image handling system implemented in the Hydrogen storefront to ensure optimal performance, accessibility, and user experience when displaying Shopify product and collection images.

## Overview

The image handling system provides:

- ✅ Optimized Shopify CDN image loading
- ✅ Responsive images with proper srcSet
- ✅ Lazy loading with intersection observer
- ✅ Modern image format support (WebP)
- ✅ Proper fallbacks for missing images
- ✅ Consistent GraphQL image fragments
- ✅ Type-safe image components

## Components

### 1. `ShopifyImage` Component

**Location**: `app/components/ui/ShopifyImage.tsx`

A wrapper around Hydrogen's `Image` component with additional features:

- Uses Shopify's Image component for optimal CDN integration
- Handles missing/null images gracefully
- Supports custom aspect ratios and object-fit
- Provides consistent styling and loading states

```tsx
<ShopifyImage
  data={product.featuredImage}
  sizes="(min-width: 768px) 50vw, 100vw"
  loading="lazy"
  aspectRatio="1"
  fallbackText="No product image"
/>
```

### 2. `OptimizedImage` Component

**Location**: `app/components/ui/OptimizedImage.tsx`

Enhanced image component for non-Shopify images with:

- Intersection Observer for lazy loading
- Shopify CDN URL optimization
- Responsive srcSet generation
- Modern image format detection
- Error handling and fallbacks

```tsx
<OptimizedImage
  data={shopifyImageData}
  src={fallbackUrl}
  alt="Product image"
  className="w-full h-48"
  aspectRatio="1"
  sizes="(min-width: 768px) 33vw, 50vw"
/>
```

### 3. `ShopifyProductCard` Component

**Location**: `app/components/ui/ShopifyProductCard.tsx`

Product card specifically designed for Shopify product data:

- Uses ShopifyImage for optimal performance
- Supports vendor and product type display
- Hover animations with Framer Motion
- Proper linking to product pages

### 4. `FeaturedCollectionCard` Component

**Location**: `app/components/ui/FeaturedCollectionCard.tsx`

Collection card for homepage and featured sections:

- Uses ShopifyImage for collection images
- Overlay gradients for text readability
- Responsive sizing and hover effects

## GraphQL Fragments

### Image Fragments

**Location**: `app/lib/fragments.ts`

Reusable GraphQL fragments ensure consistent image data:

```graphql
fragment Image on Image {
  id
  url
  altText
  width
  height
}

fragment ProductImage on ProductImage {
  id
  url
  altText
  width
  height
}
```

### Product and Collection Fragments

Include image data in all product and collection queries:

```graphql
fragment ProductCard on Product {
  id
  title
  handle
  featuredImage {
    ...Image
  }
  # ... other fields
}
```

## Utility Functions

### Image Utilities

**Location**: `app/lib/utils/image.ts`

Helper functions for image optimization:

- `getOptimizedImageUrl()` - Generate optimized Shopify CDN URLs
- `generateSrcSet()` - Create responsive srcSet strings
- `getImageDimensions()` - Extract image dimensions with fallbacks
- `getOptimalImageFormat()` - Detect browser format support
- `generateSizesAttribute()` - Create responsive sizes attributes

## Implementation in Routes

### Collection Pages

**Location**: `app/routes/collections.$collectionHandle.tsx`

```tsx
// Uses ShopifyProductCard for consistent product display
{
  collection.products.edges.map(({node: product}, index) => (
    <ShopifyProductCard
      key={product.id}
      product={product}
      loading={index < 6 ? 'eager' : 'lazy'}
      showVendor={true}
      showProductType={true}
    />
  ));
}
```

### Product Pages

**Location**: `app/routes/products.$productHandle.tsx`

```tsx
// Uses Hydrogen's Image component directly
<Image
  data={product.featuredImage}
  className="h-full w-full object-cover object-center"
/>
```

## Performance Optimizations

### 1. Lazy Loading

- First 6 products use `loading="eager"`
- Subsequent products use `loading="lazy"`
- Intersection Observer for custom lazy loading

### 2. Responsive Images

- Multiple image sizes in srcSet
- Appropriate sizes attributes
- Optimized for different viewports

### 3. Modern Formats

- WebP format detection and usage
- Fallback to JPEG for older browsers
- Quality optimization for smaller file sizes

### 4. CDN Optimization

- Shopify CDN URL parameter optimization
- Width, height, and format parameters
- Automatic image resizing

## Best Practices

### 1. Always Use Shopify Components

For Shopify images, prefer Hydrogen's `Image` component or our `ShopifyImage` wrapper.

### 2. Provide Proper Alt Text

Always include meaningful alt text from Shopify data:

```tsx
alt={product.featuredImage?.altText || product.title}
```

### 3. Use Appropriate Sizes

Configure responsive sizes based on layout:

```tsx
sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';
```

### 4. Handle Missing Images

Always provide fallbacks for missing or failed images:

```tsx
fallbackText = 'No product image available';
```

### 5. Optimize Loading Strategy

Use eager loading for above-the-fold images, lazy loading for others:

```tsx
loading={index < 6 ? 'eager' : 'lazy'}
```

## Browser Support

The image system supports:

- ✅ Modern browsers with WebP support
- ✅ Older browsers with JPEG fallbacks
- ✅ Responsive images (srcSet/sizes)
- ✅ Intersection Observer API
- ✅ CSS aspect-ratio property

## Troubleshooting

### Common Issues

1. **Images not loading**: Check if Shopify CDN URLs are properly formatted
2. **Slow loading**: Verify lazy loading is working and images are optimized
3. **Layout shift**: Ensure proper aspect ratios and dimensions are set
4. **Missing images**: Check GraphQL queries include image fragments

### Debug Tools

Use browser dev tools to verify:

- Image formats being served (WebP vs JPEG)
- Lazy loading intersection triggers
- Network requests for optimized URLs
- Console errors for failed image loads
