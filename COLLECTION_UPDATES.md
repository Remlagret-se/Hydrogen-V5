# Collection System Updates - Hydrogen 2025.5+

## Översikt
Uppdateringar för att säkerställa att alla collection routes fungerar korrekt med lokaliseringssystemet enligt de senaste Hydrogen-rekommendationerna.

## Ändringar

### 1. Lokaliseringssystem (`app/lib/utils/localization.ts`)
- ✅ **Lagt till alla saknade collection handles** inklusive `vinkelkontaktlager`
- ✅ **Uppdaterat collectionTranslations** med alla 20+ collection handles
- ✅ **Lagt till nya hjälpfunktioner:**
  - `getCollectionHandlesForMarket()` - Hämtar alla giltiga handles för en marknad
  - `isValidCollectionHandle()` - Validerar om en handle är giltig för en marknad

### 2. Collection Routes
#### `app/routes/collections.$collectionHandle.tsx`
- ✅ **Lagt till validering** av collection handles innan API-anrop
- ✅ **Förbättrad felhantering** med specifika felmeddelanden
- ✅ **Bättre logging** för debugging

#### `app/routes/($locale).collections.$collectionHandle.tsx`
- ✅ **Komplett uppdatering** med lokaliserad hantering
- ✅ **Validering av handles** för varje marknad
- ✅ **Korrekt översättning** från lokaliserat handle till Shopify handle

### 3. Sitemap (`app/routes/sitemap.xml.tsx`)
- ✅ **Lokaliserade collection URLs** för alla marknader
- ✅ **Automatisk generering** av alla giltiga collection URLs
- ✅ **SEO-optimerad** för alla språk

### 4. Debug Route (`app/routes/debug-collections.tsx`)
- ✅ **Ny debug-sida** för att testa alla collection handles
- ✅ **Visuell feedback** på vilka handles som fungerar
- ✅ **Hjälpmedel** för att identifiera problem

## Collection Handles som nu stöds

### Svenska (se)
- `vinkelkontaktlager` ✅
- `kullager` ✅
- `rullager` ✅
- `magnetlager` ✅
- `sparkullager` ✅
- `glidlager` ✅
- `speciallager` ✅
- `axialkullager` ✅
- `cylindriska-rullager` ✅
- `koniska-rullager` ✅
- `nallager` ✅
- `sfariska-kullager` ✅
- `sfariska-rullager` ✅
- `linjarteknik` ✅
- `tatningar` ✅
- `insatslager` ✅
- `kryssrullager` ✅
- `fyrpunktskontaktlager` ✅
- `glidbussningar` ✅
- `glidplattor` ✅
- `ledlager` ✅
- `kulleder` ✅

### Engelska (en)
- `angular-contact-bearings` ✅
- `ball-bearings` ✅
- `roller-bearings` ✅
- `magnetic-bearings` ✅
- `spark-bearings` ✅
- `plain-bearings` ✅
- `special-bearings` ✅
- `thrust-bearings` ✅
- `cylindrical-bearings` ✅
- `tapered-bearings` ✅
- `needle-bearings` ✅
- `spherical-bearings` ✅
- `spherical-roller-bearings` ✅
- `linear-bearings` ✅
- `seals` ✅
- `insert-bearings` ✅
- `cross-roller-bearings` ✅
- `four-point-contact-bearings` ✅
- `bushings` ✅
- `sliding-plates` ✅
- `led-bearings` ✅
- `ball-joints` ✅

### Tyska (de)
- `schrägkugellager` ✅
- `kugellager` ✅
- `rollenlager` ✅
- `magnetlager` ✅
- `funkenlager` ✅
- `gleitlager` ✅
- `speziallager` ✅
- `drucklager` ✅
- `zylinderrollenlager` ✅
- `kegelrollenlager` ✅
- `nadellager` ✅
- `pendelkugellager` ✅
- `pendelrollenlager` ✅
- `linearlager` ✅
- `dichtungen` ✅
- `einbaulager` ✅
- `kreuzrollenlager` ✅
- `vierpunktkontaktlager` ✅
- `buchsen` ✅
- `gleitplatten` ✅
- `gelenklager` ✅
- `kugelgelenke` ✅

### Norska (no)
- `vinkelkontaktlagre` ✅
- `kulelagre` ✅
- `rullelagre` ✅
- `magnetlagre` ✅
- `gnistlagre` ✅
- `glidlagre` ✅
- `spesiallagre` ✅
- `trykklagre` ✅
- `sylindriske-rullelagre` ✅
- `kegle-rullelagre` ✅
- `nålelagre` ✅
- `sfæriske-kulelagre` ✅
- `sfæriske-rullelagre` ✅
- `linearlagre` ✅
- `tetninger` ✅
- `innstøpslagre` ✅
- `kryssrullelagre` ✅
- `firepunktskontaktlagre` ✅
- `bussinger` ✅
- `glideplater` ✅
- `leddlagre` ✅
- `kuleledd` ✅

### Danska (dk)
- `vinkelkontaktleje` ✅
- `kugleleje` ✅
- `rulleleje` ✅
- `magnetleje` ✅
- `gnistleje` ✅
- `glidleje` ✅
- `specialleje` ✅
- `trykleje` ✅
- `cylindriske-rulleleje` ✅
- `kegle-rulleleje` ✅
- `nåleleje` ✅
- `sfæriske-kugleleje` ✅
- `sfæriske-rulleleje` ✅
- `linearleje` ✅
- `tætninger` ✅
- `indstøbsleje` ✅
- `krydsrulleleje` ✅
- `firepunktskontaktleje` ✅
- `bussinger` ✅
- `glideplader` ✅
- `ledleje` ✅
- `kugleled` ✅

## Testning

### 1. Debug-sida
Besök `/debug-collections` för att se alla collection handles och deras status.

### 2. Testa specifika routes
- `/collections/vinkelkontaktlager` (svenska)
- `/en/collections/angular-contact-bearings` (engelska)
- `/de/collections/schrägkugellager` (tyska)
- `/no/collections/vinkelkontaktlagre` (norska)
- `/dk/collections/vinkelkontaktleje` (danska)

### 3. Sitemap
Besök `/sitemap.xml` för att se alla lokaliserade collection URLs.

## Felhantering

### 404-fel på collections
Om du får 404-fel på en collection:

1. **Kontrollera att collection finns i Shopify Admin**
2. **Verifiera att handle är korrekt** i debug-sidan
3. **Kontrollera att översättningen finns** i `localization.ts`

### Vanliga orsaker till 404:
- Collection handle finns inte i Shopify
- Översättning saknas i `collectionTranslations`
- Felaktig market prefix i URL

## Nästa steg

1. **Testa alla collection routes** med debug-sidan
2. **Verifiera att sitemap fungerar** korrekt
3. **Kontrollera SEO** för alla lokaliserade URLs
4. **Uppdatera navigation** om nödvändigt

## Tekniska detaljer

### Routing-struktur
```
/collections/[handle]                    # Svenska (ingen prefix)
/en/collections/[handle]                 # Engelska
/de/collections/[handle]                 # Tyska
/no/collections/[handle]                 # Norska
/dk/collections/[handle]                 # Danska
```

### Validering
- Alla collection handles valideras innan API-anrop
- Felaktiga handles ger 404 med specifikt felmeddelande
- Debug-information loggas i development-läge

### Prestanda
- Batch-loading av produkter (250 per batch)
- Client-side filtrering för bättre prestanda
- Caching av filter-options 