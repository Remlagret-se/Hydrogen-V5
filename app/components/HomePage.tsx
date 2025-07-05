import {Fragment} from 'react';
import {
  type Market,
  translateCollectionHandle,
  translateHandle,
} from '~/lib/utils/localization';
import {Link} from 'react-router';
import {ProductGrid} from './examples/ProductCard';
// import Incentives from './ui/Incentives';
// import TrendingProducts from './ui/TrendingProducts';
// import {ArrowRightIcon} from '@heroicons/react/24/outline';

interface HomePageProps {
  menu: any;
  collections: any[];
  sparkullager: any;
  sfariskaKullager: any;
  products: any[];
  currentMarket: Market;
  cart?: any;
}

// Kategorier för lagerbranschen med verkliga bilder och korrekta collection-länkar
const categories = [
  {
    name: 'Spårkullager',
    href: '/collections/sparkullager',
    imageSrc: 'https://picsum.photos/800/800?random=17',
    description: 'Högkvalitativa spårkullager för alla industrier',
  },
  {
    name: 'Cylindriska rullager',
    href: '/collections/cylindriska-rullager',
    imageSrc: 'https://picsum.photos/800/800?random=18',
    description: 'Precision cylindriska rullager för tung industri',
  },
  {
    name: 'Glidbussningar',
    href: '/collections/glidbussningar',
    imageSrc: 'https://picsum.photos/800/800?random=19',
    description: 'Smörjfria glidbussningar för krävande applikationer',
  },
  {
    name: 'Speciallager',
    href: '/collections/speciallager',
    imageSrc: 'https://picsum.photos/800/800?random=20',
    description: 'Speciallösningar för unika behov',
  },
  {
    name: 'Magnetlager',
    href: '/collections/magnetlager',
    imageSrc: 'https://picsum.photos/800/800?random=21',
    description: 'Avancerade magnetlager för precisionsapplikationer',
  },
];

// Hero-bilder för lagerbranschen
const heroImages = [
  'https://picsum.photos/400/600?random=22',
  'https://picsum.photos/400/600?random=23',
  'https://picsum.photos/400/600?random=24',
  'https://picsum.photos/400/600?random=25',
  'https://picsum.photos/400/600?random=26',
];

// CTA-bilder för lagerbranschen
const ctaImages = [
  'https://picsum.photos/600/600?random=27',
  'https://picsum.photos/600/600?random=28',
  'https://picsum.photos/600/600?random=29',
  'https://picsum.photos/600/600?random=30',
  'https://picsum.photos/600/600?random=31',
  'https://picsum.photos/600/600?random=32',
];

// Lokaliserade texter
function getTexts(marketKey: string) {
  const texts = {
    hero: {
      title: {
        se: 'Välkommen till Remlagret',
        en: 'Welcome to Remlagret',
        de: 'Willkommen bei Remlagret',
        no: 'Velkommen til Remlagret',
        dk: 'Velkommen til Remlagret',
      },
      subtitle: {
        se: 'Ditt första val för högkvalitativa lager och industrikomponenter. Vi levererar till hela Norden med expertkunskap sedan 1985.',
        en: 'Your first choice for high-quality bearings and industrial components. We deliver throughout the Nordics with expert knowledge since 1985.',
        de: 'Ihre erste Wahl für hochwertige Lager und Industriekomponenten. Wir liefern in ganz Skandinavien mit Expertenwissen seit 1985.',
        no: 'Ditt første valg for høykvalitets lagre og industrikomponenter. Vi leverer til hele Norden med ekspertkunnskap siden 1985.',
        dk: 'Dit første valg for højkvalitets lejer og industrikomponenter. Vi leverer til hele Norden med ekspertviden siden 1985.',
      },
      cta: {
        se: 'Se alla produkter',
        en: 'View all products',
        de: 'Alle Produkte anzeigen',
        no: 'Se alle produkter',
        dk: 'Se alle produkter',
      },
    },
    sections: {
      shopByCategory: {
        se: 'Handla efter kategori',
        en: 'Shop by Category',
        de: 'Nach Kategorie einkaufen',
        no: 'Handle etter kategori',
        dk: 'Shop efter kategori',
      },
      browseAll: {
        se: 'Se alla kategorier',
        en: 'Browse all categories',
        de: 'Alle Kategorien durchsuchen',
        no: 'Se alle kategorier',
        dk: 'Se alle kategorier',
      },
      featuredProducts: {
        se: 'Utvalda produkter',
        en: 'Featured Products',
        de: 'Ausgewählte Produkte',
        no: 'Utvalgte produkter',
        dk: 'Udvalgte produkter',
      },
    },
  };

  return texts;
}

const heroSections = [
  {
    title: 'Kullager',
    subtitle: 'Högkvalitativa kullager för alla behov',
    description:
      'Vi erbjuder ett brett sortiment av kullager från världens ledande tillverkare.',
    imageSrc: 'https://picsum.photos/800/800?random=1',
    link: '/collections/kullager',
  },
  {
    title: 'Rullager',
    subtitle: 'Pålitliga rullager f��r tunga belastningar',
    description:
      'Specialiserade rullager för krävande applikationer och tunga belastningar.',
    imageSrc: 'https://picsum.photos/800/800?random=2',
    link: '/collections/rullager',
  },
  {
    title: 'Glidbussningar',
    subtitle: 'Slitstarka glidbussningar',
    description: 'Hållbara glidbussningar för precision och lång livslängd.',
    imageSrc: 'https://picsum.photos/800/800?random=3',
    link: '/collections/glidbussningar',
  },
  {
    title: 'Magnetlager',
    subtitle: 'Avancerade magnetlager',
    description: 'Innovativa magnetlager för friktionsfria applikationer.',
    imageSrc: 'https://picsum.photos/800/800?random=4',
    link: '/collections/magnetlager',
  },
  {
    title: 'Speciallager',
    subtitle: 'Skräddarsydda lösningar',
    description: 'Speciallager för unika applikationer och krävande miljöer.',
    imageSrc: 'https://picsum.photos/800/800?random=5',
    link: '/collections/speciallager',
  },
];

const featuredCategories = [
  {
    name: 'Kullager',
    image: 'https://picsum.photos/400/600?random=6',
    link: '/collections/kullager',
  },
  {
    name: 'Rullager',
    image: 'https://picsum.photos/400/600?random=7',
    link: '/collections/rullager',
  },
  {
    name: 'Glidbussningar',
    image: 'https://picsum.photos/400/600?random=8',
    link: '/collections/glidbussningar',
  },
  {
    name: 'Magnetlager',
    image: 'https://picsum.photos/400/600?random=9',
    link: '/collections/magnetlager',
  },
  {
    name: 'Speciallager',
    image: 'https://picsum.photos/400/600?random=10',
    link: '/collections/speciallager',
  },
];

const productImages = [
  'https://picsum.photos/600/600?random=11',
  'https://picsum.photos/600/600?random=12',
  'https://picsum.photos/600/600?random=13',
  'https://picsum.photos/600/600?random=14',
  'https://picsum.photos/600/600?random=15',
  'https://picsum.photos/600/600?random=16',
];

export function HomePage({
  menu,
  collections,
  sparkullager,
  sfariskaKullager,
  products,
  currentMarket,
  cart,
}: HomePageProps) {
  const marketKey =
    currentMarket.pathPrefix === '' ? 'se' : currentMarket.pathPrefix.slice(1);
  const texts = getTexts(marketKey);

  return (
    <div style={{backgroundColor: 'var(--color-background)'}}>
      {/* Enhanced Hero section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50" />

        <div className="relative pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1
                className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                style={{color: 'var(--gray-12)'}}
              >
                {texts.hero.title[marketKey] || texts.hero.title['se']}
              </h1>
              <p
                className="mt-4 text-xl lg:text-2xl leading-relaxed"
                style={{color: 'var(--gray-11)'}}
              >
                {texts.hero.subtitle[marketKey] || texts.hero.subtitle['se']}
              </p>

              {/* Enhanced stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    12,000+
                  </div>
                  <div className="text-sm text-gray-600">Produkter</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">35+</div>
                  <div className="text-sm text-gray-600">År erfarbereght</div>
                </div>
              </div>
            </div>

            <div>
              <div className="mt-10">
                {/* Enhanced decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg sm:opacity-0 lg:opacity-100">
                          <img
                            alt="Precision bearings"
                            src={heroImages[0]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="Industrial components"
                            src={heroImages[1]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="Ball bearings"
                            src={heroImages[2]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="Roller bearings"
                            src={heroImages[3]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="Specialized bearings"
                            src={heroImages[4]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="High precision components"
                            src={heroImages[0]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-xl shadow-lg">
                          <img
                            alt="Industrial seals"
                            src={heroImages[1]}
                            className="size-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to={`${currentMarket.pathPrefix}/collections/all`}
                  className="inline-flex items-center gap-2 rounded-xl border border-transparent px-8 py-4 text-center font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{backgroundColor: 'var(--blue-9)'}}
                >
                  {texts.hero.cta[marketKey] || texts.hero.cta['se']}
                  {/* <ArrowRightIcon className="w-5 h-5" /> */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Products section */}
      {/* <TrendingProducts products={products} currentMarket={currentMarket} /> */}

      {/* Incentives section */}
      {/* <Incentives /> */}

      {/* Enhanced CTA section */}
      <section aria-labelledby="sale-heading" className="relative">
        <div className="overflow-hidden pt-32 sm:pt-14">
          <div style={{backgroundColor: 'var(--gray-12)'}} className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                className="absolute inset-0 h-full w-full"
                fill="currentColor"
              >
                <defs>
                  <pattern
                    id="heropattern"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#heropattern)" />
              </svg>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative pt-48 pb-16 sm:pb-24">
                <div className="max-w-2xl">
                  <h2
                    id="sale-heading"
                    className="text-4xl font-bold tracking-tight text-white md:text-6xl leading-tight"
                  >
                    {marketKey === 'se'
                      ? 'Upptäck vårt sortiment.'
                      : 'Discover our range.'}
                    <br />
                    <span className="text-blue-400">
                      {marketKey === 'se'
                        ? 'Över 12,000 artiklar.'
                        : 'Over 12,000 items.'}
                    </span>
                  </h2>
                  <p className="mt-6 text-lg text-gray-300 leading-relaxed">
                    Från standardlager till speciallösningar - vi har det du
                    behöver för din industri. Expertrådgivning och snabb
                    leverans till hela Norden.
                  </p>
                  <div className="mt-8">
                    <Link
                      to={`${currentMarket.pathPrefix}/collections/all`}
                      className="inline-flex items-center gap-2 font-semibold text-white hover:text-blue-300 transition-colors duration-200 text-lg group"
                    >
                      {texts.hero.cta[marketKey] || texts.hero.cta['se']}
                      {/* <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" /> */}
                    </Link>
                  </div>
                </div>

                <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                  <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                    <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                      <div className="shrink-0 group">
                        <img
                          alt="Precision engineering"
                          src={ctaImages[0]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-6 shrink-0 sm:mt-0 group">
                        <img
                          alt="Industrial components"
                          src={ctaImages[1]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                      <div className="shrink-0 group">
                        <img
                          alt="Ball bearings"
                          src={ctaImages[2]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-6 shrink-0 sm:mt-0 group">
                        <img
                          alt="Roller bearings"
                          src={ctaImages[3]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                      <div className="shrink-0 group">
                        <img
                          alt="Specialized bearings"
                          src={ctaImages[4]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-6 shrink-0 sm:mt-0 group">
                        <img
                          alt="Magnetic bearings"
                          src={ctaImages[5]}
                          className="size-64 rounded-2xl object-cover md:size-72 shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
