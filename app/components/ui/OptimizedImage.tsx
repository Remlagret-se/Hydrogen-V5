import {Image} from '@shopify/hydrogen';
import {useInView} from 'react-intersection-observer';
import {useState, useEffect} from 'react';
import type {CSSProperties} from 'react';

interface ShopifyImageData {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface OptimizedImageProps {
  data?: ShopifyImageData;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  quality?: number;
  aspectRatio?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  style?: CSSProperties;
}

export function OptimizedImage({
  data,
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  quality = 80,
  aspectRatio,
  crop = 'center',
  placeholder = 'blur',
  onLoad,
  style,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px',
  });

  // Use Shopify image data if provided, otherwise fallback to props
  const imageUrl = data?.url || src;
  const imageAlt = data?.altText || alt || '';
  const imageWidth = data?.width || width;
  const imageHeight = data?.height || height;

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return widths
      .map((w) => {
        const imageUrl = new URL(imageUrl || '');
        imageUrl.searchParams.set('width', w.toString());
        imageUrl.searchParams.set(
          'height',
          Math.round(w / (aspectRatio || 1)).toString(),
        );
        imageUrl.searchParams.set('crop', crop);
        imageUrl.searchParams.set('quality', quality.toString());
        return `${imageUrl.toString()} ${w}w`;
      })
      .join(', ');
  };

  // Generate blur data URL for placeholder
  const generateBlurDataUrl = () => {
    const imageUrl = new URL(imageUrl || '');
    imageUrl.searchParams.set('width', '50');
    imageUrl.searchParams.set('quality', '1');
    return imageUrl.toString();
  };

  useEffect(() => {
    // Preload high-quality image if priority is true
    if (priority && imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
    }
  }, [priority, imageUrl]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        ...style,
      }}
    >
      {/* Low-quality placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <Image
          src={generateBlurDataUrl()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 transform"
          width={20}
          height={20 / (aspectRatio || 1)}
          loading="eager"
        />
      )}

      {/* Main image */}
      {(inView || priority) && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className={`
            relative w-full h-full object-cover
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={priority ? 'eager' : loading}
          sizes={sizes}
          srcSet={generateSrcSet()}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-100/10">
          <div className="animate-pulse rounded-full h-16 w-16 bg-surface-200/20" />
        </div>
      )}
    </div>
  );
}

// Gallery component using OptimizedImage
interface GalleryProps {
  images: Array<{
    src: string;
    alt: string;
    aspectRatio?: number;
  }>;
  columns?: number;
  gap?: number;
}

export function Gallery({images, columns = 3, gap = 4}: GalleryProps) {
  return (
    <div
      className={`grid gap-${gap}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={image.src}
          {...image}
          loading={index < 4 ? 'eager' : 'lazy'}
          priority={index < 2}
          className="w-full h-full"
        />
      ))}
    </div>
  );
}

// Product image component with zoom
interface ProductImageProps extends OptimizedImageProps {
  enableZoom?: boolean;
}

export function ProductImage({enableZoom = true, ...props}: ProductImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom) return;

    const {left, top, width, height} =
      event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    setMousePosition({x, y});
  };

  return (
    <div
      className={`relative overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
      onMouseMove={handleMouseMove}
      onClick={() => enableZoom && setIsZoomed(!isZoomed)}
    >
      <OptimizedImage {...props} />

      {isZoomed && (
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${props.src})`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            transform: 'scale(2)',
          }}
        />
      )}
    </div>
  );
}

// Usage example:
/*
import {OptimizedImage, Gallery, ProductImage} from '~/components/ui/OptimizedImage';

// Basic usage
<OptimizedImage
  src="product-image.jpg"
  alt="Product"
  width={800}
  height={600}
  priority
/>

// Gallery
<Gallery
  images={[
    {src: 'image1.jpg', alt: 'Image 1'},
    {src: 'image2.jpg', alt: 'Image 2'},
    {src: 'image3.jpg', alt: 'Image 3'},
  ]}
  columns={3}
  gap={4}
/>

// Product image with zoom
<ProductImage
  src="product-detail.jpg"
  alt="Product detail"
  width={1200}
  height={1200}
  enableZoom
/>
*/
