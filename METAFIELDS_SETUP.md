# Shopify Metafields Setup för Remlagret

För att få full funktionalitet av filtersystemet behöver du konfigurera produktmetafields i Shopify Admin.

## Steg 1: Gå till Shopify Admin

1. Logga in på din Shopify Admin
2. Gå till **Settings** → **Metafields**

## Steg 2: Skapa Product Metafields

Skapa följande metafields för **Products**:

### 1. Innerdiameter
- **Namespace:** `custom`
- **Key:** `innerdiameter`
- **Name:** `Innerdiameter`
- **Description:** `Lagrets innerdiameter i millimeter`
- **Type:** `Dimension` eller `Single line text`
- **Validation:** Endast nummer (om du väljer text)

### 2. Ytterdiameter
- **Namespace:** `custom`
- **Key:** `ytterdiameter`
- **Name:** `Ytterdiameter`
- **Description:** `Lagrets ytterdiameter i millimeter`
- **Type:** `Dimension` eller `Single line text`
- **Validation:** Endast nummer (om du väljer text)

### 3. Bredd
- **Namespace:** `custom`
- **Key:** `bredd`
- **Name:** `Bredd`
- **Description:** `Lagrets bredd i millimeter`
- **Type:** `Dimension` eller `Single line text`
- **Validation:** Endast nummer (om du väljer text)

## Steg 3: Lägg till Metafields till Produkter

1. Gå till **Products** i Shopify Admin
2. Öppna en produkt
3. Scrolla ner till **Metafields**-sektionen
4. Fyll i värdena för:
   - Innerdiameter (t.ex. "8", "12", "15")
   - Ytterdiameter (t.ex. "22", "32", "40")
   - Bredd (t.ex. "7", "10", "12")

### Viktigt för Dimension-metafields:
Om du använder `Dimension` som typ kommer Shopify att lagra värdet som JSON:
```json
{"value": 8.0, "unit": "MILLIMETERS"}
```

Systemet hanterar automatiskt båda formaten:
- Enkla värden: `"8"`
- JSON-format: `{"value": 8.0, "unit": "MILLIMETERS"}`

## Alternativ: Använd Tags

Om du inte vill använda metafields kan du använda produkttaggar istället:

- `inner:8` för innerdiameter 8mm
- `outer:22` för ytterdiameter 22mm
- `width:7` för bredd 7mm

## Steg 4: Bulk-redigering

För att lägga till metafields till många produkter samtidigt:

1. Gå till **Products** → **All products**
2. Välj flera produkter
3. Klicka **Bulk actions** → **Edit metafields**
4. Fyll i värdena för alla valda produkter

## Resultat

När metafields är konfigurerade kommer filtersystemet automatiskt att:

- Visa filter för Innerdiameter, Ytterdiameter och Bredd
- Sortera dimensioner numeriskt (8, 10, 12, 15...)
- Visa antal produkter för varje dimension
- Tillåta kombinerade filter
- Visa endast numeriska värden (inte JSON-objektet)
- Filtrera produkter i realtid

## Felsökning

### Om filter inte visas:
1. Kontrollera att metafields har rätt namespace (`custom`) och keys
2. Se till att produkterna har värden i metafields
3. Kontrollera att värdena är numeriska (utan "mm" eller andra enheter)
4. Prova att använda tags som alternativ

### Om filtreringen inte fungerar:
1. Kontrollera att metafield-värdena är konsistenta
2. Se till att samma enheter används för alla produkter
3. Kontrollera att JSON-formatet är korrekt (om du använder Dimension-typ)

### Om bilder inte visas:
1. Kontrollera att produkter har `featuredImage` uppsatt
2. Se till att bilderna är tillgängliga och inte blockerade
3. Kontrollera Content Security Policy för externa bilder

## Exempel på korrekt metafield-konfiguration

**Produkt:** SKF 608-2RS Kullager

**Med enkla värden:**
- **Innerdiameter:** `8`
- **Ytterdiameter:** `22` 
- **Bredd:** `7`

**Med Dimension-metafields (JSON):**
- **Innerdiameter:** `{"value": 8.0, "unit": "MILLIMETERS"}`
- **Ytterdiameter:** `{"value": 22.0, "unit": "MILLIMETERS"}`
- **Bredd:** `{"value": 7.0, "unit": "MILLIMETERS"}`

**Eller som tags:**
- `inner:8`
- `outer:22`
- `width:7`

Alla format fungerar och systemet extraherar automatiskt det numeriska värdet för visning och filtrering. 