// Lokalisering och Markets utilities för Hydrogen
import type { AppLoadContext } from '@shopify/remix-oxygen';
import type { I18nLocale } from '@shopify/hydrogen';

// Definiera marknader och språk
export const markets = {
  se: {
    language: 'SV',
    country: 'SE',
    currency: 'SEK',
    label: 'Sverige',
    pathPrefix: '', // Ingen prefix för huvuddomänen
  },
  en: {
    language: 'EN',
    country: 'US',
    currency: 'USD',
    label: 'English (International)',
    pathPrefix: '/en',
  },
  'en-gb': {
    language: 'EN',
    country: 'GB',
    currency: 'GBP',
    label: 'United Kingdom',
    pathPrefix: '/en-gb',
  },
  de: {
    language: 'DE',
    country: 'DE',
    currency: 'EUR',
    label: 'Deutschland',
    pathPrefix: '/de',
  },
  no: {
    language: 'NO',
    country: 'NO',
    currency: 'NOK',
    label: 'Norge',
    pathPrefix: '/no',
  },
  dk: {
    language: 'DA',
    country: 'DK',
    currency: 'DKK',
    label: 'Danmark',
    pathPrefix: '/dk',
  },
} as const;

export type MarketKey = keyof typeof markets;
export type Market = typeof markets[MarketKey];

// Hämta marknad från URL
export function getMarketFromRequest(request: Request): Market {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();
  
  // Kontrollera om pathname börjar med någon market prefix
  for (const [key, market] of Object.entries(markets)) {
    if (market.pathPrefix && pathname.startsWith(market.pathPrefix)) {
      return market;
    }
  }
  
  // Default till svenska om ingen prefix hittas
  return markets.se;
}

// Skapa locale objekt för Hydrogen
export function getLocaleFromRequest(request: Request): I18nLocale {
  const market = getMarketFromRequest(request);
  
  return {
    language: market.language,
    country: market.country,
    currency: market.currency,
    pathPrefix: market.pathPrefix,
  };
}

// Detektera användarens föredragna språk från headers
export function detectUserPreferredMarket(request: Request): MarketKey {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return 'se';
  
  // Enkel parsing av accept-language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());
  
  // Matcha mot våra marknader
  for (const lang of languages) {
    if (lang.startsWith('sv')) return 'se';
    if (lang.startsWith('en-gb')) return 'en-gb';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('no')) return 'no';
    if (lang.startsWith('da')) return 'dk';
  }
  
  return 'se'; // Default
}

// Skapa URL med rätt market prefix
export function localizeUrl(
  pathname: string,
  market: Market | MarketKey,
  currentMarket?: Market
): string {
  const targetMarket = typeof market === 'string' ? markets[market] : market;
  
  // Ta bort nuvarande market prefix om den finns
  let cleanPath = pathname;
  if (currentMarket?.pathPrefix) {
    cleanPath = pathname.replace(new RegExp(`^${currentMarket.pathPrefix}`), '');
  }
  
  // Lägg till ny market prefix
  return targetMarket.pathPrefix + cleanPath;
}

// Översätt collection handles - UPPDATERAD med alla collection handles
const collectionTranslations: Record<string, Record<MarketKey, string>> = {
  'magnetic-bearings': {
    se: 'magnetlager',
    en: 'magnetic-bearings',
    'en-gb': 'magnetic-bearings',
    de: 'magnetlager',
    no: 'magnetlagre',
    dk: 'magnetlejer',
  },
  'ball-bearings': {
    se: 'kullager',
    en: 'ball-bearings',
    'en-gb': 'ball-bearings',
    de: 'kugellager',
    no: 'kulelagre',
    dk: 'kugleleje',
  },
  'roller-bearings': {
    se: 'rullager',
    en: 'roller-bearings',
    'en-gb': 'roller-bearings',
    de: 'rollenlager',
    no: 'rullelagre',
    dk: 'rulleleje',
  },
  'plain-bearings': {
    se: 'glidlager',
    en: 'plain-bearings',
    'en-gb': 'plain-bearings',
    de: 'gleitlager',
    no: 'glidlagre',
    dk: 'glidleje',
  },
  'special-bearings': {
    se: 'speciallager',
    en: 'special-bearings',
    'en-gb': 'special-bearings',
    de: 'speziallager',
    no: 'spesiallagre',
    dk: 'specialleje',
  },
  'angular-contact-bearings': {
    se: 'vinkelkontaktlager',
    en: 'angular-contact-bearings',
    'en-gb': 'angular-contact-bearings',
    de: 'schrägkugellager',
    no: 'vinkelkontaktlagre',
    dk: 'vinkelkontaktleje',
  },
  'thrust-bearings': {
    se: 'axialkullager',
    en: 'thrust-bearings',
    'en-gb': 'thrust-bearings',
    de: 'drucklager',
    no: 'trykklagre',
    dk: 'trykleje',
  },
  'cylindrical-bearings': {
    se: 'cylindriska-rullager',
    en: 'cylindrical-bearings',
    'en-gb': 'cylindrical-bearings',
    de: 'zylinderrollenlager',
    no: 'sylindriske-rullelagre',
    dk: 'cylindriske-rulleleje',
  },
  'tapered-bearings': {
    se: 'koniska-rullager',
    en: 'tapered-bearings',
    'en-gb': 'tapered-bearings',
    de: 'kegelrollenlager',
    no: 'kegle-rullelagre',
    dk: 'kegle-rulleleje',
  },
  'needle-bearings': {
    se: 'nallager',
    en: 'needle-bearings',
    'en-gb': 'needle-bearings',
    de: 'nadellager',
    no: 'nålelagre',
    dk: 'nåleleje',
  },
  'spherical-bearings': {
    se: 'sfariska-kullager',
    en: 'spherical-bearings',
    'en-gb': 'spherical-bearings',
    de: 'pendelkugellager',
    no: 'sfæriske-kulelagre',
    dk: 'sfæriske-kugleleje',
  },
  'spherical-roller-bearings': {
    se: 'sfariska-rullager',
    en: 'spherical-roller-bearings',
    'en-gb': 'spherical-roller-bearings',
    de: 'pendelrollenlager',
    no: 'sfæriske-rullelagre',
    dk: 'sfæriske-rulleleje',
  },
  'linear-bearings': {
    se: 'linjarteknik',
    en: 'linear-bearings',
    'en-gb': 'linear-bearings',
    de: 'linearlager',
    no: 'linearlagre',
    dk: 'linearleje',
  },
  'seals': {
    se: 'tatningar',
    en: 'seals',
    'en-gb': 'seals',
    de: 'dichtungen',
    no: 'tetninger',
    dk: 'tætninger',
  },
  'insert-bearings': {
    se: 'insatslager',
    en: 'insert-bearings',
    'en-gb': 'insert-bearings',
    de: 'einbaulager',
    no: 'innstøpslagre',
    dk: 'indstøbsleje',
  },
  'cross-roller-bearings': {
    se: 'kryssrullager',
    en: 'cross-roller-bearings',
    'en-gb': 'cross-roller-bearings',
    de: 'kreuzrollenlager',
    no: 'kryssrullelagre',
    dk: 'krydsrulleleje',
  },
  'four-point-contact-bearings': {
    se: 'fyrpunktskontaktlager',
    en: 'four-point-contact-bearings',
    'en-gb': 'four-point-contact-bearings',
    de: 'vierpunktkontaktlager',
    no: 'firepunktskontaktlagre',
    dk: 'firepunktskontaktleje',
  },
  'bushings': {
    se: 'glidbussningar',
    en: 'bushings',
    'en-gb': 'bushings',
    de: 'buchsen',
    no: 'bussinger',
    dk: 'bussinger',
  },
  'sliding-plates': {
    se: 'glidplattor',
    en: 'sliding-plates',
    'en-gb': 'sliding-plates',
    de: 'gleitplatten',
    no: 'glideplater',
    dk: 'glideplader',
  },
  'led-bearings': {
    se: 'ledlager',
    en: 'led-bearings',
    'en-gb': 'led-bearings',
    de: 'gelenklager',
    no: 'leddlagre',
    dk: 'ledleje',
  },
  'kulleder': {
    se: 'kulleder',
    en: 'ball-joints',
    'en-gb': 'ball-joints',
    de: 'kugelgelenke',
    no: 'kuleledd',
    dk: 'kugleled',
  },
  'sparkullager': {
    se: 'sparkullager',
    en: 'spark-bearings',
    'en-gb': 'spark-bearings',
    de: 'funkenlager',
    no: 'gnistlagre',
    dk: 'gnistleje',
  },
};

// Översätt handle baserat på marknad
export function translateHandle(
  handle: string,
  fromMarket: MarketKey,
  toMarket: MarketKey
): string {
  // Hitta översättningen
  for (const [originalHandle, translations] of Object.entries(collectionTranslations)) {
    if (translations[fromMarket] === handle) {
      return translations[toMarket] || handle;
    }
  }
  
  // Om ingen översättning finns, returnera original handle
  return handle;
}

// Hämta Shopify storefront locale
export function getStorefrontLocale(market: Market): string {
  // Shopify format: language-COUNTRY
  return `${market.language}-${market.country}`;
}

// Cookie utilities för att spara användarens val
export const MARKET_COOKIE_NAME = 'selected_market';

export function setMarketCookie(market: MarketKey): string {
  return `${MARKET_COOKIE_NAME}=${market}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function getMarketFromCookie(request: Request): MarketKey | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const match = cookieHeader.match(new RegExp(`${MARKET_COOKIE_NAME}=([^;]+)`));
  return match ? (match[1] as MarketKey) : null;
}

// Wrapper för att översätta collection handles
export function translateCollectionHandle(handle: string, marketKey: MarketKey): string {
  return translateHandle(handle, 'en', marketKey);
}

// Ny funktion för att hämta alla collection handles för en marknad
export function getCollectionHandlesForMarket(marketKey: MarketKey): string[] {
  return Object.values(collectionTranslations).map(translations => translations[marketKey]).filter(Boolean);
}

// Ny funktion för att validera om en handle finns för en marknad
export function isValidCollectionHandle(handle: string, marketKey: MarketKey): boolean {
  return getCollectionHandlesForMarket(marketKey).includes(handle);
} 