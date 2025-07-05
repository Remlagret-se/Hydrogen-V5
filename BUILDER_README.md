# Remlagret Hydrogen Storefront - Builder.io Integration Guide

## Project Overview

This is a Shopify Hydrogen storefront for Remlagret, a Swedish e-commerce site specializing in bearings, transmission components, and related industrial products. The project is built using:

- Shopify Hydrogen (v2025.5.0)
  - Custom hooks for cart management
  - Server-side rendering with Oxygen
  - Streaming SSR for improved performance
- React 19
  - Server Components
  - Suspense for data loading
  - Custom hooks for state management
- TypeScript
  - Strict mode enabled
  - Custom type definitions for Shopify API
  - Type-safe GraphQL queries
- Tailwind CSS
  - Custom configuration
  - Dark theme support
  - Responsive design utilities
- Headless UI
  - Accessible components
  - Custom styling
  - Animation support
- Remix for routing and server-side functionality
  - Nested routing
  - Data loading
  - Error boundaries

## Key Features

### Multi-language Support
- Swedish (Primary)
- English
- Language detection
- URL-based locale switching
- Market-specific content

### Advanced Mega Menu Navigation
- Dynamic category structure
- Featured product displays
- Mobile-responsive design
- Animated transitions
- Deep linking support

### Dynamic Product Filtering
- Real-time updates
- Multiple filter types
  - Price ranges
  - Categories
  - Attributes
  - Availability
- URL-based filter state
- Clear all / Reset functionality

### Cart Functionality
- Real-time updates
- Persistent storage
- Cross-device synchronization
- Quantity adjustments
- Price calculations
- Shipping estimates

### Search Features
- Predictive results
- Category suggestions
- Popular searches
- Recent searches
- Keyword highlighting
- Filter integration

### Account Management
- User registration
- Login/logout
- Order history
- Address management
- Wishlist
- Saved payment methods

### Market Selection
- Currency switching
- Location-based defaults
- Price conversion
- Tax calculation
- Shipping rules

## Project Structure

```
Hydrogen-V5/
├── app/
│   ├── components/         # React components
│   │   ├── collection/     # Collection-related components
│   │   │   ├── CollectionGrid.tsx
│   │   │   ├── CollectionFilters.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── MobileFilters.tsx
│   │   ├── checkout/      # Checkout components
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── PaymentMethods.tsx
│   │   ├── ui/            # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Select.tsx
│   │   └── examples/      # Example components
│   ├── routes/            # Remix routes
│   │   ├── ($locale)/     # Localized routes
│   │   ├── account/       # Account-related routes
│   │   └── collections/   # Collection routes
│   ├── lib/               # Utility functions and stores
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── stores/        # State management
│   ├── styles/            # CSS and Tailwind styles
│   │   ├── app.css
│   │   ├── tailwind.css
│   │   └── themes/
│   └── graphql/           # GraphQL queries and mutations
│       ├── fragments/
│       ├── queries/
│       └── mutations/
├── public/                # Static assets
└── guides/               # Documentation
```

## Key Components for Builder.io Integration

### Navigation Components

The main navigation is handled by `StoreNavigation.tsx`, which includes:

```typescript
// app/components/StoreNavigation.tsx
export interface NavigationProps {
  isLoggedIn?: Promise<boolean>;
  cart?: Promise<any>;
  currentMarket?: Market;
}

export interface Market {
  id: string;
  handle: string;
  currency: {
    code: string;
    symbol: string;
  };
  language: {
    code: string;
    name: string;
  };
}

export interface NavigationItem {
  id: string;
  title: string;
  handle: string;
  items?: NavigationItem[];
  featured?: FeaturedItem[];
  type: 'COLLECTION' | 'PAGE' | 'EXTERNAL';
}

export interface FeaturedItem {
  title: string;
  image: {
    url: string;
    altText: string;
  };
  handle: string;
  description?: string;
}
```

Key areas for Builder.io customization:

#### Mega Menu Structure
- Category hierarchy
- Featured products section
- Promotional banners
- Dynamic content zones

#### Featured Product Displays
- Image optimization
- Hover effects
- Quick view integration
- Price display options

#### Category Organization
- Multi-level navigation
- Dynamic routing
- SEO optimization
- Breadcrumb integration

#### Mobile Menu Layout
- Touch-friendly interface
- Slide-out navigation
- Search integration
- Account shortcuts

### Product Components

Product display components that can be customized in Builder:

#### 1. ProductCard.tsx
```typescript
interface ProductCardProps {
  product: ShopifyProduct;
  loading?: 'eager' | 'lazy';
  showQuickView?: boolean;
  showPrice?: boolean;
  showVariants?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: (product: ShopifyProduct) => void;
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: {
    nodes: ProductImage[];
  };
  variants: {
    nodes: ProductVariant[];
  };
  collections: {
    nodes: Collection[];
  };
}
```

Features:
- Responsive image loading
- Price formatting
- Variant selection
- Quick view modal
- Add to cart functionality
- Wishlist integration
- Stock status display
- Sale badges
- Custom labels

#### 2. ProductGrid.tsx
```typescript
interface ProductGridProps {
  products: ShopifyProduct[];
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  loading?: 'eager' | 'lazy';
  withFilters?: boolean;
  withSorting?: boolean;
  withPagination?: boolean;
  onLoadMore?: () => void;
  onSort?: (sortKey: string) => void;
  onFilter?: (filters: FilterValues) => void;
}

interface FilterValues {
  price?: [number, number];
  collections?: string[];
  tags?: string[];
  attributes?: Record<string, string[]>;
}
```

Features:
- Responsive grid layout
- Infinite scrolling
- Load more functionality
- Sort options
- Filter integration
- Empty state handling
- Loading skeletons
- Error boundaries

### Collection Components

Collection components for category pages:

#### 1. CollectionGrid.tsx
```typescript
interface CollectionGridProps {
  collection: ShopifyCollection;
  filters: FilterState;
  sorting: SortOption;
  pagination: PaginationState;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onPageChange: (page: number) => void;
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText: string;
  };
  products: {
    nodes: ShopifyProduct[];
    pageInfo: PageInfo;
  };
  filters: CollectionFilter[];
}

interface FilterState {
  price?: [number, number];
  attributes: Record<string, string[]>;
  availability?: boolean;
  tags?: string[];
}

interface SortOption {
  key: string;
  direction: 'asc' | 'desc';
  label: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  productsPerPage: number;
}
```

Features:
- Dynamic grid layout
- Filter panel integration
- Sort options
- Pagination controls
- URL state management
- Loading states
- Error handling
- Empty states

#### 2. CollectionFilters.tsx
```typescript
interface CollectionFiltersProps {
  filters: CollectionFilter[];
  activeFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

interface CollectionFilter {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
  values?: {
    label: string;
    value: string;
    count: number;
  }[];
  range?: {
    min: number;
    max: number;
    step: number;
  };
}
```

Features:
- Multiple filter types
- Price range slider
- Checkbox groups
- Active filter tags
- Clear all button
- Mobile optimization
- Accessibility support
- Real-time updates

## Theme Configuration

### Colors

The project uses a sophisticated color system with CSS variables:

```css
:root {
  /* Base colors */
  --dark-1: #121212;
  --dark-2: #1E1E1E;
  --dark-3: #2A2A2A;
  --green-9: #00875A;

  /* Semantic colors */
  --color-primary: var(--green-9);
  --color-background: var(--dark-1);
  --color-surface: var(--dark-2);
  --color-text: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  
  /* Interactive states */
  --color-hover: rgba(255, 255, 255, 0.1);
  --color-active: rgba(255, 255, 255, 0.2);
  --color-focus: rgba(0, 135, 90, 0.5);
  
  /* Feedback colors */
  --color-success: #00C853;
  --color-error: #FF5252;
  --color-warning: #FFD740;
  --color-info: #40C4FF;
  
  /* Gradients */
  --gradient-primary: linear-gradient(45deg, var(--green-9), #00A878);
  --gradient-dark: linear-gradient(180deg, var(--dark-2), var(--dark-1));
}

/* Dark theme overrides */
[data-theme="dark"] {
  --color-background: var(--dark-1);
  --color-surface: var(--dark-2);
  --color-border: rgba(255, 255, 255, 0.12);
}
```

### Typography

The project uses a comprehensive typography system:

```css
:root {
  /* Font families */
  --font-primary: 'InterVariable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Breakpoints

Comprehensive breakpoint system:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
}
```

## Builder.io Integration Points

### 1. Content Models

Detailed Builder.io content models for different page sections:

#### Product Section
```typescript
interface ProductSection {
  title: string;
  subtitle?: string;
  products: Product[];
  layout: 'grid' | 'carousel' | 'featured';
  showPrices: boolean;
  showQuickView: boolean;
  backgroundColor?: string;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing: {
    padding: string;
    gap: string;
  };
  cta?: {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'text';
  };
}
```

#### Hero Section
```typescript
interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImage: {
    desktop: string;
    mobile: string;
    altText: string;
  };
  overlay?: {
    color: string;
    opacity: number;
  };
  content: {
    position: 'left' | 'center' | 'right';
    maxWidth: string;
    alignment: 'start' | 'center' | 'end';
  };
  ctaButtons: Array<{
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
    openInNewTab?: boolean;
  }>;
  height: {
    mobile: string;
    desktop: string;
  };
  animation?: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
  };
}
```

#### Category Feature
```typescript
interface CategoryFeature {
  category: {
    handle: string;
    title: string;
    description: string;
  };
  image: {
    src: string;
    altText: string;
    aspectRatio: number;
  };
  layout: {
    imagePosition: 'left' | 'right' | 'background';
    contentWidth: string;
    spacing: string;
  };
  featured: Array<{
    product: Product;
    highlight?: string;
  }>;
  statistics?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  backgroundColor?: string;
  textColor?: string;
}
```

#### Collection Highlight
```typescript
interface CollectionHighlight {
  collection: {
    handle: string;
    title: string;
  };
  displayType: 'carousel' | 'grid' | 'masonry';
  productsToShow: number;
  sortBy: 'BEST_SELLING' | 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH';
  filters?: {
    tags?: string[];
    priceRange?: [number, number];
    availability?: boolean;
  };
  showProductDetails: {
    price: boolean;
    title: boolean;
    vendor: boolean;
    rating: boolean;
  };
  autoplay?: {
    enabled: boolean;
    interval: number;
  };
}
```

### 2. Custom Components

Detailed Builder.io component configurations:

#### 1. Product Components

##### ProductCard
```typescript
@BuilderComponent({
  name: 'ProductCard',
  inputs: [
    {
      name: 'product',
      type: 'object',
      subFields: [
        { name: 'id', type: 'string' },
        { name: 'handle', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        {
          name: 'images',
          type: 'array',
          subFields: [
            { name: 'url', type: 'string' },
            { name: 'altText', type: 'string' }
          ]
        },
        {
          name: 'variants',
          type: 'array',
          subFields: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'compareAtPrice', type: 'number' },
            { name: 'availableForSale', type: 'boolean' }
          ]
        }
      ]
    },
    {
      name: 'showQuickView',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'size',
      type: 'string',
      enum: ['small', 'medium', 'large'],
      defaultValue: 'medium'
    },
    {
      name: 'aspectRatio',
      type: 'string',
      defaultValue: '1/1'
    },
    {
      name: 'showPrice',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'showVariants',
      type: 'boolean',
      defaultValue: false
    }
  ]
})
```

##### ProductGrid
```typescript
@BuilderComponent({
  name: 'ProductGrid',
  inputs: [
    {
      name: 'collection',
      type: 'object',
      required: true,
      subFields: [
        { name: 'handle', type: 'string' },
        { name: 'title', type: 'string' }
      ]
    },
    {
      name: 'productsPerRow',
      type: 'number',
      defaultValue: 4
    },
    {
      name: 'showFilters',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'filterPosition',
      type: 'string',
      enum: ['left', 'top', 'offcanvas'],
      defaultValue: 'left'
    },
    {
      name: 'sortOptions',
      type: 'array',
      defaultValue: [
        { label: 'Featured', value: 'MANUAL' },
        { label: 'Price: Low to High', value: 'PRICE_ASC' },
        { label: 'Price: High to Low', value: 'PRICE_DESC' },
        { label: 'Best Selling', value: 'BEST_SELLING' },
        { label: 'Newest', value: 'CREATED_DESC' }
      ]
    },
    {
      name: 'paginationType',
      type: 'string',
      enum: ['load-more', 'infinite-scroll', 'numbered'],
      defaultValue: 'load-more'
    }
  ]
})
```

#### 2. Collection Components

##### CollectionBanner
```typescript
@BuilderComponent({
  name: 'CollectionBanner',
  inputs: [
    {
      name: 'collection',
      type: 'object',
      required: true,
      subFields: [
        { name: 'handle', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        {
          name: 'image',
          type: 'object',
          subFields: [
            { name: 'url', type: 'string' },
            { name: 'altText', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'height',
      type: 'string',
      defaultValue: '400px'
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      defaultValue: 0.4
    },
    {
      name: 'textAlignment',
      type: 'string',
      enum: ['left', 'center', 'right'],
      defaultValue: 'center'
    },
    {
      name: 'showDescription',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'ctaText',
      type: 'string',
      defaultValue: 'Shop Now'
    }
  ]
})
```

##### FilterPanel
```typescript
@BuilderComponent({
  name: 'FilterPanel',
  inputs: [
    {
      name: 'filters',
      type: 'array',
      required: true,
      subFields: [
        { name: 'type', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'field', type: 'string' },
        {
          name: 'values',
          type: 'array',
          subFields: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'layout',
      type: 'string',
      enum: ['sidebar', 'horizontal', 'dropdown'],
      defaultValue: 'sidebar'
    },
    {
      name: 'showActiveFilters',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'collapsible',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'mobilePosition',
      type: 'string',
      enum: ['bottom-sheet', 'side-drawer'],
      defaultValue: 'bottom-sheet'
    }
  ]
})
```

### 3. Data Integration

Detailed data integration points with Shopify:

#### Product Data
```typescript
interface ShopifyProductData {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: {
    nodes: Array<{
      url: string;
      altText: string;
      width: number;
      height: number;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku: string;
      price: Money;
      compareAtPrice: Money;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      image: {
        url: string;
        altText: string;
      };
      availableForSale: boolean;
      currentlyNotInStock: boolean;
      quantityAvailable: number;
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  collections: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
    }>;
  };
  tags: string[];
  vendor: string;
  metafields: Array<{
    key: string;
    value: string;
    namespace: string;
  }>;
}
```

#### Collection Data
```typescript
interface ShopifyCollectionData {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  products: {
    nodes: ShopifyProductData[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
  metafields: Array<{
    key: string;
    value: string;
    namespace: string;
  }>;
  seo: {
    title: string;
    description: string;
  };
}
```

#### Customer Data
```typescript
interface CustomerData {
  isLoggedIn: boolean;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    defaultAddress?: Address;
    addresses: Address[];
    orders: Order[];
    metafields: Metafield[];
  };
  cart: {
    id: string;
    lines: CartLine[];
    cost: {
      subtotalAmount: Money;
      totalAmount: Money;
      totalTaxAmount: Money;
    };
    discountCodes: DiscountCode[];
  };
  wishlist: {
    items: WishlistItem[];
  };
}
```

#### Market/Locale Data
```typescript
interface MarketData {
  current: {
    id: string;
    handle: string;
    currency: {
      code: string;
      symbol: string;
      name: string;
    };
    language: {
      code: string;
      name: string;
      direction: 'ltr' | 'rtl';
    };
    country: {
      code: string;
      name: string;
    };
  };
  available: Array<{
    id: string;
    handle: string;
    name: string;
    currency: {
      code: string;
      symbol: string;
    };
    language: {
      code: string;
      name: string;
    };
    country: {
      code: string;
      name: string;
    };
  }>;
}
```

## Styling Guidelines

### CSS Methodology

The project uses a sophisticated styling approach combining:

#### 1. Tailwind Utility Classes
```tsx
// Example component with Tailwind classes
const Card = () => (
  <div className="
    bg-dark-2 
    rounded-lg 
    shadow-lg 
    p-4 
    hover:bg-dark-3 
    transition-colors 
    duration-200
    border
    border-gray-800
    hover:border-gray-700
  ">
    <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
    <p className="text-gray-400">Content</p>
  </div>
);
```

#### 2. CSS Modules for Component-Specific Styles
```css
/* styles/components/ProductCard.module.css */
.root {
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.root:hover {
  transform: translateY(-2px);
}

.image {
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.5rem;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.root:hover .overlay {
  opacity: 1;
}
```

#### 3. CSS Variables for Theme Values
```css
/* styles/theme.css */
:root {
  /* Color System */
  --color-primary-50: #E6F6F0;
  --color-primary-100: #CCEDE1;
  --color-primary-200: #99DBC3;
  --color-primary-300: #66C9A5;
  --color-primary-400: #33B787;
  --color-primary-500: #00A569;
  --color-primary-600: #008454;
  --color-primary-700: #00633F;
  --color-primary-800: #00422A;
  --color-primary-900: #002115;

  /* Spacing System */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Z-Index Layers */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}
```

### Component Patterns

#### 1. Responsive Design
```tsx
// Example of responsive component
const ProductGrid = () => (
  <div className="
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
    gap-4 
    md:gap-6 
    lg:gap-8
  ">
    {products.map(product => (
      <ProductCard 
        key={product.id} 
        product={product}
        className="w-full aspect-square"
      />
    ))}
  </div>
);
```

#### 2. Dark Theme Support
```tsx
// Example of theme-aware component
const Card = ({ children }) => (
  <div 
    className="rounded-lg p-4"
    style={{ 
      backgroundColor: 'var(--dark-2)',
      borderColor: 'var(--dark-3)',
      color: 'var(--color-text)'
    }}
  >
    {children}
  </div>
);
```

#### 3. Interactive Elements
```tsx
// Example of interactive component
const Button = ({ children, variant = 'primary' }) => (
  <button
    className={`
      px-4 
      py-2 
      rounded-md 
      font-medium 
      transition-all 
      duration-200
      ${variant === 'primary' ? `
        bg-green-9
        hover:bg-green-8
        text-white
        shadow-lg
        hover:shadow-xl
      ` : `
        bg-transparent
        border
        border-gray-600
        hover:border-gray-500
        text-gray-300
        hover:text-white
      `}
    `}
  >
    {children}
  </button>
);
```

## Performance Considerations

### 1. Image Optimization

#### OptimizedImage Component
```tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  className
}) => {
  const imageUrl = new URL(src);
  
  // Add Shopify image optimization parameters
  imageUrl.searchParams.set('width', width?.toString() || 'auto');
  imageUrl.searchParams.set('height', height?.toString() || 'auto');
  imageUrl.searchParams.set('crop', 'center');
  imageUrl.searchParams.set('format', 'webp');
  
  return (
    <img
      src={imageUrl.toString()}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={loading}
      className={className}
      decoding="async"
    />
  );
};
```

#### Responsive Images
```tsx
const ProductImage = ({ product }) => (
  <picture>
    <source
      media="(min-width: 1024px)"
      srcSet={`
        ${product.image.url}?width=600 1x,
        ${product.image.url}?width=1200 2x
      `}
    />
    <source
      media="(min-width: 768px)"
      srcSet={`
        ${product.image.url}?width=400 1x,
        ${product.image.url}?width=800 2x
      `}
    />
    <img
      src={`${product.image.url}?width=300`}
      alt={product.image.altText}
      loading="lazy"
      className="w-full h-full object-cover"
    />
  </picture>
);
```

### 2. Data Loading

#### GraphQL Query Optimization
```typescript
// Optimized product query with specific fields
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
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
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
        }
      }
    }
  }
`;
```

#### Data Preloading
```typescript
// Route loader with data preloading
export async function loader({ params, context }: LoaderArgs) {
  const { handle } = params;
  
  // Parallel data fetching
  const [product, recommendations] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: { handle },
    }),
    context.storefront.query(RECOMMENDATIONS_QUERY, {
      variables: { handle },
    }),
  ]);

  return defer({
    product: product.data.product,
    recommendations: recommendations.data.recommendations,
  });
}
```

### 3. Component Loading

#### Lazy Loading Components
```typescript
// Lazy load heavy components
const ProductReviews = lazy(() => import('./ProductReviews'));
const SizeGuide = lazy(() => import('./SizeGuide'));
const RelatedProducts = lazy(() => import('./RelatedProducts'));

const ProductPage = () => (
  <div>
    <ProductDetails />
    <Suspense fallback={<ReviewsSkeleton />}>
      <ProductReviews />
    </Suspense>
    <Suspense fallback={<SizeGuideSkeleton />}>
      <SizeGuide />
    </Suspense>
    <Suspense fallback={<RelatedProductsSkeleton />}>
      <RelatedProducts />
    </Suspense>
  </div>
);
```

#### Loading States
```typescript
const LoadingState = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
    <div className="h-4 bg-gray-700 rounded w-5/6" />
  </div>
);
```

## Testing Integration

### 1. Component Testing
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    price: { amount: '99.99', currencyCode: 'USD' },
    image: { url: 'test.jpg', altText: 'Test' },
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('handles quick view interaction', () => {
    const onQuickView = jest.fn();
    render(<ProductCard product={mockProduct} onQuickView={onQuickView} />);
    
    fireEvent.click(screen.getByText('Quick View'));
    expect(onQuickView).toHaveBeenCalledWith(mockProduct);
  });
});
```

### 2. Visual Testing
```typescript
// Example visual regression test
import { test, expect } from '@playwright/test';

test('product card visual regression', async ({ page }) => {
  await page.goto('/products/test-product');
  
  // Take screenshot of product card
  const productCard = await page.locator('.product-card').first();
  await expect(productCard).toHaveScreenshot('product-card.png', {
    maxDiffPixelRatio: 0.01,
  });
  
  // Test hover state
  await productCard.hover();
  await expect(productCard).toHaveScreenshot('product-card-hover.png');
});
```

### 3. E2E Testing
```typescript
// Example E2E test
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Start at product page
  await page.goto('/products/test-product');
  
  // Add to cart
  await page.click('button[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  
  // Go to cart
  await page.click('[data-testid="cart-icon"]');
  await expect(page).toHaveURL('/cart');
  
  // Start checkout
  await page.click('button[data-testid="checkout-button"]');
  await expect(page).toHaveURL(/\/checkout/);
  
  // Fill shipping info
  await page.fill('[data-testid="shipping-name"]', 'Test User');
  await page.fill('[data-testid="shipping-email"]', 'test@example.com');
  // ... more form filling
  
  // Complete order
  await page.click('button[data-testid="complete-order"]');
  await expect(page).toHaveURL(/\/order-confirmation/);
});
```

## Deployment

The project is deployed using Oxygen, Shopify's hosting platform. Builder.io integrations should:

1. Support preview environments
2. Handle CDN caching
3. Respect Oxygen's deployment patterns

## Getting Started with Builder.io

1. Install Builder.io SDK:
   ```bash
   npm install @builder.io/react
   ```

2. Initialize Builder:
   ```typescript
   // app/lib/builder.ts
   import { builder } from '@builder.io/react';
   builder.init('YOUR_API_KEY');
   ```

3. Create content models in Builder.io dashboard

4. Implement preview mode:
   ```typescript
   // app/routes/preview.tsx
   export default function Preview() {
     return <BuilderComponent model="page" />;
   }
   ```

## Support and Resources

- Project Documentation: `/guides`
- Component Examples: `/app/components/examples`
- Shopify Hydrogen Docs: [Hydrogen Documentation](https://hydrogen.shopify.dev/)
- Builder.io Docs: [Builder.io Documentation](https://www.builder.io/c/docs/introduction)

## Contributing

1. Follow TypeScript strict mode
2. Use provided ESLint configuration
3. Follow component patterns
4. Test all Builder.io integrations
5. Document any new Builder.io components

## Contact

For questions about the integration, contact:
- Technical Lead: [Contact Information]
- Project Manager: [Contact Information] 