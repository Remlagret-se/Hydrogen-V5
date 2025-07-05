# Remlagret Design System

## Color System

Our color system is built on a sophisticated dark theme with vibrant accents, optimized for industrial e-commerce.

### Base Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'brand': {
          50: '#E6FFF7',
          100: '#B3FFE6',
          200: '#80FFD6',
          300: '#4DFFC5',
          400: '#1AFFB4',
          500: '#00E69D',
          600: '#00B37A',
          700: '#008056',
          800: '#004D33',
          900: '#001A11',
        },
        
        // Dark Theme Base
        'surface': {
          50: '#2A2A2A',
          100: '#242424',
          200: '#1E1E1E',
          300: '#181818',
          400: '#121212',
          500: '#0C0C0C',
          600: '#080808',
          700: '#040404',
          800: '#020202',
          900: '#000000',
        },
        
        // Accent Colors
        'accent-blue': {
          50: '#E6F8FF',
          100: '#B3ECFF',
          200: '#80DFFF',
          300: '#4DD3FF',
          400: '#1AC6FF',
          500: '#00B8FF',
          600: '#0093CC',
          700: '#006E99',
          800: '#004A66',
          900: '#001933',
        },
        
        'accent-amber': {
          50: '#FFF8E6',
          100: '#FFEDB3',
          200: '#FFE180',
          300: '#FFD64D',
          400: '#FFCA1A',
          500: '#FFB800',
          600: '#CC9300',
          700: '#996E00',
          800: '#664A00',
          900: '#332500',
        },
        
        // Success/Error States
        'success': {
          50: '#E6FFF0',
          100: '#B3FFD6',
          200: '#80FFBB',
          300: '#4DFF9F',
          400: '#1AFF83',
          500: '#00FF66',
          600: '#00CC52',
          700: '#00993D',
          800: '#006629',
          900: '#003314',
        },
        
        'error': {
          50: '#FFE6E6',
          100: '#FFB3B3',
          200: '#FF8080',
          300: '#FF4D4D',
          400: '#FF1A1A',
          500: '#FF0000',
          600: '#CC0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
      },
    },
  },
};
```

### Semantic Color Usage

```css
:root {
  /* Interactive Elements */
  --color-interactive-primary: var(--color-brand-500);
  --color-interactive-primary-hover: var(--color-brand-600);
  --color-interactive-primary-active: var(--color-brand-700);
  
  /* Text Colors */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-text-tertiary: rgba(255, 255, 255, 0.5);
  --color-text-disabled: rgba(255, 255, 255, 0.3);
  
  /* Border Colors */
  --color-border-primary: rgba(255, 255, 255, 0.1);
  --color-border-secondary: rgba(255, 255, 255, 0.05);
  --color-border-focus: var(--color-brand-500);
  
  /* Background Colors */
  --color-bg-primary: var(--color-surface-400);
  --color-bg-secondary: var(--color-surface-300);
  --color-bg-tertiary: var(--color-surface-200);
  --color-bg-overlay: rgba(0, 0, 0, 0.8);
}
```

## Typography System

### Font Stack

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
        display: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
```

### Type Scale

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
    },
  },
};
```

## Component Design Patterns

### Buttons

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading,
  disabled,
  children,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-surface-300 hover:bg-surface-200 text-white border border-surface-200',
    tertiary: 'bg-transparent hover:bg-surface-300 text-white',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'relative !text-transparent' : ''}
      `}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </span>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

### Cards

```tsx
interface CardProps {
  variant: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  children,
}) => {
  const baseStyles = 'rounded-xl overflow-hidden';
  
  const variants = {
    elevated: 'bg-surface-300 shadow-lg hover:shadow-xl',
    outlined: 'border border-surface-200',
    filled: 'bg-surface-200',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${interactive ? 'transition-all duration-200 hover:-translate-y-1' : ''}
      `}
    >
      {children}
    </div>
  );
};
```

## Animation System

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
      },
    },
  },
};
```

## Spacing System

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '2xs': '0.125rem',
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
        '5xl': '6rem',
        '6xl': '8rem',
      },
    },
  },
};
```

## Grid System

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
    },
  },
};
```

## Suggested Improvements

### 1. Enhanced Product Cards

```tsx
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card variant="elevated" interactive>
      <div className="relative group">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image.url}
            alt={product.image.altText}
            className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <IconButton
              icon={<HeartIcon />}
              onClick={() => addToWishlist(product.id)}
              variant="ghost"
            />
            <IconButton
              icon={<EyeIcon />}
              onClick={() => openQuickView(product.id)}
              variant="ghost"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-white truncate">
              {product.title}
            </h3>
            <ProductBadges product={product} />
          </div>
          
          <div className="flex items-center gap-2">
            <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} />
            <ProductStock stock={product.quantityAvailable} />
          </div>
          
          <AddToCartButton product={product} />
        </div>
      </div>
    </Card>
  );
};
```

### 2. Advanced Collection Filtering

```tsx
const CollectionFilters: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Price Range Slider */}
      <FilterSection title="Price Range">
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onChange={setPriceRange}
          formatter={(value) => `$${value}`}
        />
      </FilterSection>

      {/* Category Tree */}
      <FilterSection title="Categories">
        <CategoryTree
          categories={categories}
          selectedCategories={selectedCategories}
          onSelect={handleCategorySelect}
        />
      </FilterSection>

      {/* Dynamic Attributes */}
      {attributes.map(attribute => (
        <FilterSection key={attribute.id} title={attribute.name}>
          <AttributeFilter
            attribute={attribute}
            selected={selectedAttributes[attribute.id]}
            onChange={handleAttributeChange}
          />
        </FilterSection>
      ))}

      {/* Active Filters */}
      <ActiveFilters
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />
    </div>
  );
};
```

### 3. Improved Search Experience

```tsx
const SearchBar: React.FC = () => {
  return (
    <div className="relative">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative">
          <Combobox.Input
            className="w-full bg-surface-300 border border-surface-200 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            placeholder="Search products..."
            onChange={handleSearch}
          />
          
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Combobox.Options className="absolute z-50 mt-2 w-full bg-surface-300 rounded-lg shadow-xl">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-surface-200">
                  <h4 className="text-sm text-gray-400 px-2 mb-1">Recent Searches</h4>
                  {recentSearches.map(search => (
                    <Combobox.Option key={search} value={search}>
                      {({ active }) => (
                        <div className={`${active ? 'bg-surface-200' : ''} px-2 py-1 rounded`}>
                          {search}
                        </div>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              )}

              {/* Search Results */}
              <div className="p-2">
                {results.map(result => (
                  <Combobox.Option key={result.id} value={result}>
                    {({ active }) => (
                      <SearchResult result={result} active={active} />
                    )}
                  </Combobox.Option>
                ))}
              </div>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
```

### 4. Cart Improvements

```tsx
const Cart: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Cart Items */}
        {items.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        ))}

        {/* Empty State */}
        {items.length === 0 && (
          <EmptyCart onShopNow={closeCart} />
        )}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-surface-200 pt-4">
        {/* Subtotal */}
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">{formatMoney(subtotal)}</span>
        </div>

        {/* Shipping Estimate */}
        <ShippingEstimate
          subtotal={subtotal}
          weight={totalWeight}
          country={selectedCountry}
        />

        {/* Taxes */}
        <TaxEstimate
          subtotal={subtotal}
          country={selectedCountry}
          province={selectedProvince}
        />

        {/* Total */}
        <div className="flex justify-between text-lg font-medium mt-4">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-4"
          onClick={startCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};
```

Would you like me to:
1. Add more component examples?
2. Provide additional color scheme variations?
3. Create more advanced animation patterns?
4. Add accessibility guidelines? 