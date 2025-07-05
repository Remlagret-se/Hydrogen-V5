import type {Image} from '@shopify/hydrogen/storefront-api-types';

interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Generate an optimized Shopify CDN image URL
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options: ImageTransformOptions = {},
): string {
  if (!imageUrl || !imageUrl.includes('cdn.shopify.com')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    // Add transformation parameters
    if (options.width) {
      url.searchParams.set('width', options.width.toString());
    }

    if (options.height) {
      url.searchParams.set('height', options.height.toString());
    }

    if (options.format) {
      url.searchParams.set('format', options.format);
    }

    if (options.quality && options.quality >= 1 && options.quality <= 100) {
      url.searchParams.set('quality', options.quality.toString());
    }

    if (options.crop) {
      url.searchParams.set('crop', options.crop);
    }

    return url.toString();
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return imageUrl;
  }
}

/**
 * Generate responsive srcSet for Shopify images
 */
export function generateSrcSet(
  imageUrl: string,
  sizes: number[] = [320, 640, 750, 828, 1080, 1200, 1920],
  format?: 'webp' | 'jpg',
): string {
  if (!imageUrl || !imageUrl.includes('cdn.shopify.com')) {
    return '';
  }

  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(imageUrl, {
        width: size,
        format,
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Get image dimensions with fallback
 */
export function getImageDimensions(image: Image | null | undefined): {
  width?: number;
  height?: number;
  aspectRatio?: number;
} {
  if (!image?.width || !image?.height) {
    return {};
  }

  return {
    width: image.width,
    height: image.height,
    aspectRatio: image.width / image.height,
  };
}

/**
 * Check if browser supports modern image formats
 */
export function getOptimalImageFormat(): 'webp' | 'jpg' {
  if (typeof window === 'undefined') return 'jpg';

  try {
    const canvas = document.createElement('canvas');
    const supportsWebP =
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return supportsWebP ? 'webp' : 'jpg';
  } catch {
    return 'jpg';
  }
}

/**
 * Generate responsive sizes attribute based on breakpoints
 */
export function generateSizesAttribute(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    fallback = '100vw',
  } = config;

  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
}
