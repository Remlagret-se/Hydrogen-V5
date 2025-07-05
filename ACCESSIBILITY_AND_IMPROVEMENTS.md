# Accessibility and Advanced Features

## Accessibility Guidelines

### 1. Color Contrast and Visual Hierarchy

```css
/* High contrast color combinations */
:root {
  /* Text on dark backgrounds */
  --color-text-on-dark: #FFFFFF;      /* 15.6:1 contrast ratio on surface-400 */
  --color-text-secondary-on-dark: rgba(255, 255, 255, 0.87); /* 12.8:1 */
  --color-text-disabled-on-dark: rgba(255, 255, 255, 0.38); /* 5.5:1 */
  
  /* Text on light backgrounds */
  --color-text-on-light: #121212;     /* 16.4:1 contrast ratio on white */
  --color-text-secondary-on-light: rgba(0, 0, 0, 0.87); /* 14.2:1 */
  --color-text-disabled-on-light: rgba(0, 0, 0, 0.38); /* 6.2:1 */
  
  /* Interactive elements */
  --color-focus-ring: #2196F3;        /* Visible focus indicator */
  --color-error: #FF5252;             /* Error states */
  --color-success: #4CAF50;           /* Success states */
}
```

### 2. Keyboard Navigation

```tsx
const FocusTrap: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const focusableElements = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);
  
  return <div ref={ref}>{children}</div>;
};
```

### 3. ARIA Labels and Roles

```tsx
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article
      role="article"
      aria-labelledby={`product-title-${product.id}`}
      className="product-card"
    >
      <div className="relative">
        <img
          src={product.image.url}
          alt={product.image.altText}
          loading="lazy"
          aria-hidden="true"
        />
        
        <div className="actions" role="group" aria-label="Product actions">
          <button
            aria-label={`Add ${product.title} to wishlist`}
            onClick={() => addToWishlist(product.id)}
          >
            <HeartIcon />
          </button>
          
          <button
            aria-label={`Quick view ${product.title}`}
            onClick={() => openQuickView(product.id)}
          >
            <EyeIcon />
          </button>
        </div>
      </div>
      
      <div className="details">
        <h3 id={`product-title-${product.id}`} className="title">
          {product.title}
        </h3>
        
        <div className="price" aria-label="Product price">
          {product.compareAtPrice && (
            <span className="compare-at-price" aria-label="Original price">
              {formatMoney(product.compareAtPrice)}
            </span>
          )}
          <span className="current-price">
            {formatMoney(product.price)}
          </span>
        </div>
        
        <button
          className="add-to-cart"
          aria-label={`Add ${product.title} to cart`}
          disabled={!product.availableForSale}
        >
          {product.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
};
```

### 4. Screen Reader Support

```tsx
const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const ProductFilters: React.FC = () => {
  return (
    <div role="region" aria-label="Product filters">
      <button
        onClick={toggleFilters}
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <FilterIcon />
        <ScreenReaderOnly>
          {isOpen ? 'Close filters' : 'Open filters'}
        </ScreenReaderOnly>
      </button>
      
      <div
        id="filter-panel"
        role="group"
        aria-label="Filter options"
        hidden={!isOpen}
      >
        {/* Filter content */}
      </div>
    </div>
  );
};
```

## Advanced Features

### 1. Advanced Animation Patterns

```tsx
const PageTransition: React.FC = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

const ImageZoom: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  return (
    <motion.div
      layoutId={`image-${src}`}
      onClick={() => setIsZoomed(!isZoomed)}
      animate={{
        scale: isZoomed ? 1.5 : 1,
        zIndex: isZoomed ? 50 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 30,
      }}
      style={{
        cursor: 'zoom-in',
        originX: 0.5,
        originY: 0.5,
      }}
    >
      <img src={src} alt={alt} />
    </motion.div>
  );
};
```

### 2. Performance Optimizations

```tsx
// Image loading optimization
const ImageWithBlur: React.FC<ImageProps> = ({ src, alt, sizes }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      {/* Low-quality placeholder */}
      <img
        src={`${src}?width=20`}
        alt=""
        aria-hidden="true"
        className={`
          absolute inset-0 w-full h-full
          blur-xl scale-110
          transition duration-300
          ${isLoaded ? 'opacity-0' : 'opacity-100'}
        `}
      />
      
      {/* High-quality image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        className={`
          relative w-full h-full
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
};

// Virtualized product grid
const VirtualizedProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <VirtualGrid
      items={products}
      itemHeight={400}
      itemsPerRow={4}
      gap={24}
      overscan={2}
    >
      {(product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="h-full"
        />
      )}
    </VirtualGrid>
  );
};
```

### 3. Advanced Search Features

```tsx
const SearchWithFilters: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const searchResults = useSearchResults(debouncedQuery, {
    filters: {
      price: priceRange,
      categories: selectedCategories,
      inStock: true,
    },
    sort: {
      field: 'relevance',
      direction: 'desc',
    },
  });
  
  return (
    <div>
      <Combobox
        as="div"
        value={query}
        onChange={setQuery}
        className="relative"
      >
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Combobox.Input
            className="w-full pl-10 pr-4 py-2"
            placeholder="Search products..."
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setQuery('')}
            >
              <XIcon />
            </button>
          )}
        </div>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Combobox.Options className="absolute z-50 mt-2 w-full">
            <div className="rounded-lg shadow-lg">
              <div className="rounded-lg bg-surface-300 shadow-xs">
                {searchResults.loading ? (
                  <SearchSkeleton />
                ) : searchResults.items.length > 0 ? (
                  <div className="py-2">
                    {searchResults.items.map((item) => (
                      <Combobox.Option key={item.id} value={item}>
                        {({ active }) => (
                          <SearchResultItem
                            item={item}
                            active={active}
                          />
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                ) : (
                  <NoResults query={query} />
                )}
              </div>
            </div>
          </Combobox.Options>
        </Transition>
      </Combobox>
      
      <SearchFilters
        onChange={setFilters}
        onSortChange={setSort}
      />
    </div>
  );
};
```

### 4. Advanced Cart Features

```tsx
const CartWithUpsells: React.FC = () => {
  const cart = useCart();
  const recommendations = useRecommendations(cart.items);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CartItems items={cart.items} />
        
        {cart.items.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Frequently Bought Together
            </h3>
            <FrequentlyBoughtTogether
              items={recommendations.bundleItems}
              onAddToCart={addBundleToCart}
            />
          </div>
        )}
      </div>
      
      <div>
        <CartSummary
          subtotal={cart.subtotal}
          tax={cart.tax}
          shipping={cart.shipping}
          total={cart.total}
          savings={cart.savings}
        />
        
        {recommendations.upsellItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              You Might Also Like
            </h3>
            <UpsellProducts
              products={recommendations.upsellItems}
              onAddToCart={addToCart}
            />
          </div>
        )}
      </div>
    </div>
  );
};
```

Would you like me to:
1. Add more advanced component examples?
2. Create additional animation patterns?
3. Add more accessibility features?
4. Provide SEO optimization guidelines? 