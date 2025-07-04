# Tailwind UI → Hydrogen Checklista

## 1. ❌ Ta bort 'use client'
```tsx
// Tailwind UI (Next.js)
'use client'

// Hydrogen - BEHÖVS INTE!
```

## 2. ✅ Använd ClientOnly för interaktiva komponenter
```tsx
// Wrap Headless UI komponenter
<ClientOnly>
  <Dialog open={open} onClose={setOpen}>
    {/* ... */}
  </Dialog>
</ClientOnly>
```

## 3. 🔄 Ersätt länkar
```tsx
// Tailwind UI
<a href="#">Link</a>

// Hydrogen
import { NavLink } from 'react-router';
<NavLink to="/path">Link</NavLink>
```

## 4. 🛍️ Anslut till Shopify-data
```tsx
// Tailwind UI
const navigation = {
  categories: [
    { name: 'Women', href: '#' }
  ]
}

// Hydrogen - använd GraphQL data
const navigation = {
  categories: collections.nodes.map(collection => ({
    name: collection.title,
    href: `/collections/${collection.handle}`
  }))
}
```

## 5. 🔧 Anpassa för e-handel
```tsx
// Lägg till e-handelsfunktioner
- Varukorgsräknare från Shopify cart
- Inloggningsstatus från customer API
- Sökfunktion med predictive search
- Produktbilder från Shopify CDN
```

## 6. 🎨 Behåll Tailwind-styling
```tsx
// All Tailwind CSS fungerar direkt!
className="flex h-10 items-center justify-center bg-indigo-600"
```

## 7. 📱 Testa SSR
```bash
# Bygg och kör preview för att testa SSR
npm run build
npm run preview
```

## Exempel på komponenter att använda:

### Navigation
- ✅ Headers med mega menu
- ✅ Mobile navigation
- ✅ Breadcrumbs

### E-handel
- ✅ Product grids
- ✅ Shopping carts
- ✅ Product quickviews
- ✅ Filters

### Forms
- ✅ Newsletter signup
- ✅ Contact forms
- ✅ Checkout steps

### Marketing
- ✅ Heroes
- ✅ Features
- ✅ Testimonials
- ✅ CTAs 