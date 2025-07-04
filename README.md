# Hydrogen Store - Professional B2B E-commerce

Ett professionellt B2B e-handelslager byggt med Shopify Hydrogen 2025.5+ och React Router 7.6+. Optimerat för stora produktkataloger med 12,000+ produkter och avancerad filtrering.

## 🚀 Tech Stack & Versions

### Core Framework
- **Hydrogen**: 2025.5.0 (Shopify's headless commerce stack)
- **React Router**: 7.6.2 (Full stack web framework)
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Node.js**: >=22.0.0

### Key Dependencies
- **@shopify/remix-oxygen**: 3.0.0
- **@react-router/node**: 7.6.2
- **@react-router/fs-routes**: 7.6.0
- **@shopify/cli**: ~3.81.2
- **@shopify/mini-oxygen**: 3.2.1

### UI & Styling
- **Tailwind CSS**: 3.4.17
- **@tailwindcss/forms**: 0.5.10
- **@tailwindcss/aspect-ratio**: 0.4.2
- **Lucide React**: 0.515.0 (Icons)
- **Framer Motion**: 12.18.1 (Animations)

### Development Tools
- **Vite**: 6.3.5 (Build tool)
- **ESLint**: 9.18.0
- **Prettier**: 3.4.2
- **Vitest**: Testing framework

## 🏗️ Architecture

### Hydrogen 2025.5+ Best Practices
- **Dynamic Collection Loading**: Collections laddas dynamiskt från Shopify utan hårdkodade handles
- **Shopify Handles in URLs**: Använder Shopify's faktiska collection handles i URLs
- **Market-Based Localization**: Språk/marknad kontrollerar innehåll men inte URLs
- **Batch Product Loading**: Laddar produkter i 250-produkt batches för optimal prestanda
- **Client-Side Filtering**: Avancerad filtrering med metafields, tags och produktattribut

### Key Features
- **12,000+ Products**: Optimerat för stora produktkataloger
- **Advanced Filtering**: innerdiameter, ytterdiameter, bredd, vendor, productType, pfs
- **Multi-Market Support**: SE, EN, DE, NO, DK med automatisk marknadsdetektering
- **Responsive Design**: 6 produkter per rad på stora skärmar
- **SEO Optimized**: Dynamisk sitemap generation

## 🚀 Getting Started

### Prerequisites
- Node.js version 22.0.0 or higher
- Shopify Partner account
- Shopify store with products and collections

### Installation

```bash
# Clone repository
git clone <repository-url>
cd hydrogen-sanity-store

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Shopify store credentials
```

### Environment Variables
```env
# Shopify Store
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-access-token
PUBLIC_STOREFRONT_ID=your-storefront-id

# Checkout
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com

# Customer Account API (optional)
CUSTOMER_ACCOUNT_API_CLIENT_ID=your-client-id
CUSTOMER_ACCOUNT_API_CLIENT_SECRET=your-client-secret
```

## 🛠️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## 📁 Project Structure

```
hydrogen-sanity-store/
├── app/
│   ├── components/
│   │   ├── collection/          # Collection filtering components
│   │   ├── ui/                  # Reusable UI components
│   │   └── examples/            # Example components
│   ├── routes/
│   │   ├── collections.$collectionHandle.tsx  # Main collection route
│   │   ├── ($locale).collections.$collectionHandle.tsx  # Localized routes
│   │   └── sitemap.xml.tsx      # Dynamic sitemap
│   ├── lib/
│   │   ├── fragments.ts         # GraphQL queries
│   │   └── utils/
│   │       └── localization.ts  # Market/locale utilities
│   └── styles/                  # Global styles
├── public/                      # Static assets
└── guides/                      # Documentation
```

## 🌍 Localization & Markets

### Supported Markets
- **SE** (Sverige): `/` - Svenska, SEK
- **EN** (International): `/en` - Engelska, USD
- **DE** (Deutschland): `/de` - Tyska, EUR
- **NO** (Norge): `/no` - Norska, NOK
- **DK** (Danmark): `/dk` - Danska, DKK

### Market Detection
- Automatisk detektering baserat på användarens IP/geolocation
- Cookie-baserad marknadsval för användare
- Fallback till svenska marknaden

## 🔧 Configuration

### Collection Filtering
Filtrering stöds för följande attribut:
- **Metafields**: innerdiameter, ytterdiameter, bredd
- **Product Attributes**: vendor, productType
- **Tags**: pfs och andra anpassade taggar

### Performance Optimizations
- **Batch Loading**: 250 produkter per batch för filter options
- **Pagination**: 48 produkter per sida (6 per rad)
- **Caching**: CacheLong för collections och produkter
- **Deferred Loading**: Footer och icke-kritiska data laddas asynkront

## 🚀 Deployment

### Shopify Oxygen
```bash
# Deploy to Shopify Oxygen
npm run build
shopify hydrogen deploy
```

### Other Platforms
Projektet är kompatibelt med alla Remix-hosting plattformar:
- Vercel
- Netlify
- Cloudflare Pages
- AWS
- Azure

## 📚 Documentation

- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router Documentation](https://reactrouter.com/)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Remix Documentation](https://remix.run/docs)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

För support och frågor:
- Skapa en issue i GitHub
- Kontakta utvecklingsteamet
- Läs [Hydrogen dokumentationen](https://shopify.dev/custom-storefronts/hydrogen)

---

**Version**: 2025.5.1  
**Last Updated**: December 2024  
**Compatibility**: Hydrogen 2025.5+, React Router 7.6+, Node.js >=22.0.0
