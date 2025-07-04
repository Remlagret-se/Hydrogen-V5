# Tailwind UI Plus komponenter för Hydrogen

## 🎯 Översikt

Här är alla Tailwind UI Plus komponenter anpassade för ditt Hydrogen-projekt. Alla komponenter är:
- ✅ SSR-kompatibla
- ✅ TypeScript-typsäkra  
- ✅ Anslutna till Shopify-data
- ✅ Optimerade för prestanda

## 📦 Tillgängliga komponenter

### 1. ProductPage - Komplett produktsida
```tsx
import { ProductPage } from '~/components/examples/ProductPage';

// I din produktroute (routes/products.$handle.tsx)
export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  return <ProductPage product={product} />;
}
```

**Features:**
- Bildgalleri med flera vyer
- Storlek & färgval med RadioGroup
- Breadcrumbs
- FAQ-sektion med Disclosure
- Recensioner & betyg
- Lägg till i varukorg

### 2. CollectionFilters - Filtreringssidebar
```tsx
import { CollectionFilters } from '~/components/examples/CollectionFilters';

// I din kollektionsroute (routes/collections.$handle.tsx)
export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  return (
    <CollectionFilters totalProducts={products.nodes.length}>
      <ProductGrid products={products.nodes} />
    </CollectionFilters>
  );
}
```

**Features:**
- Desktop sidebar + mobil modal
- URL-baserad filtrering
- Sorteringsmeny
- Responsiv design
- Anpassningsbara filter

### 3. ProductCard & ProductGrid - Produktkort
```tsx
import { ProductCard, ProductGrid } from '~/components/examples/ProductCard';

// Enskilt produktkort
<ProductCard 
  product={product} 
  variant="detailed" // 'default' | 'simple' | 'detailed'
/>

// Produktrutnät
<ProductGrid 
  products={products} 
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
/>
```

**Features:**
- Tre varianter (default, simple, detailed)
- REA-badge
- Önskelista-knapp
- Färgalternativ
- Betyg & recensioner
- Skeleton loaders

### 4. ProductQuickview - Snabbvy modal
```tsx
import { ProductQuickview } from '~/components/examples/ProductQuickview';

function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickviewOpen, setQuickviewOpen] = useState(false);

  return (
    <>
      {/* Produktlista med quickview-knapp */}
      <button onClick={() => {
        setSelectedProduct(product);
        setQuickviewOpen(true);
      }}>
        Snabbvy
      </button>

      {/* Quickview modal */}
      {selectedProduct && (
        <ProductQuickview
          product={selectedProduct}
          open={quickviewOpen}
          onClose={() => setQuickviewOpen(false)}
        />
      )}
    </>
  );
}
```

### 5. TailwindUIHeader - Mega menu header
```tsx
import { TailwindUIHeader } from '~/components/examples/TailwindUIHeader';

// I din root.tsx
export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <TailwindUIHeader cart={cart} isLoggedIn={isLoggedIn} />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

## 🛠️ Integration med Shopify GraphQL

### Lägg till metafields för extra data
```graphql
# I din PRODUCT_FRAGMENT
fragment ProductCard on Product {
  id
  title
  handle
  vendor
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  # Lägg till metafields för betyg, färger etc
  rating: metafield(namespace: "reviews", key: "rating") {
    value
  }
  reviewCount: metafield(namespace: "reviews", key: "count") {
    value
  }
}
```

### Anpassa filter för dina produkter
```tsx
// CollectionFilters - anpassa för dina produktattribut
const filters = [
  {
    id: 'type',
    name: 'Produkttyp',
    options: product.options.find(o => o.name === 'Type')?.values.map(
      value => ({ value, label: value, checked: false })
    ),
  },
  // Lägg till fler filter baserat på dina produkter
];
```

## 🎨 Stilanpassning

### Ändra färgschema
```tsx
// Ersätt Tailwind UI's indigo med ditt varumärke
// Sök och ersätt:
'bg-indigo-600' → 'bg-primary-600'
'text-indigo-600' → 'text-primary-600'
'border-indigo-600' → 'border-primary-600'
```

### Lägg till i tailwind.config.js
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... dina färger
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
```

## 🚀 Best practices

### 1. Lazy loading
```tsx
// Ladda bilder lazy för bättre prestanda
<ProductCard 
  product={product} 
  loading={index < 4 ? 'eager' : 'lazy'} 
/>
```

### 2. Optimistisk UI
```tsx
// Använd optimistic cart updates
import { useOptimisticCart } from '@shopify/hydrogen';

function CartButton() {
  const optimisticCart = useOptimisticCart(cart);
  return <span>{optimisticCart?.totalQuantity || 0}</span>;
}
```

### 3. Error boundaries
```tsx
// Wrap komponenter i error boundaries
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ProductCardSkeleton />}>
  <ProductCard product={product} />
</ErrorBoundary>
```

## 📱 Responsiv design

Alla komponenter följer Tailwind UI's responsiva mönster:
- **Mobile first** - Börjar med mobilvy
- **Breakpoints** - sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-optimerad** - Större klickbara ytor på mobil

## 🔍 SEO-optimering

```tsx
// Lägg till strukturerad data i ProductPage
export const meta: MetaFunction = ({data}) => {
  return [
    {title: data.product.title},
    {property: 'og:title', content: data.product.title},
    {property: 'og:image', content: data.product.featuredImage?.url},
  ];
};
```

## 🧪 Testing

```tsx
// Exempel test för ProductCard
import { render, screen } from '@testing-library/react';
import { ProductCard } from '~/components/examples/ProductCard';

test('renders product title', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
});
```

## 📚 Resurser

- [Tailwind UI Documentation](https://tailwindui.com/documentation)
- [Headless UI React](https://headlessui.com/react)
- [Heroicons](https://heroicons.com)
- [Hydrogen Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)

---

**Tips:** Använd dessa komponenter som utgångspunkt och anpassa dem efter ditt varumärke och behov! 🎨 