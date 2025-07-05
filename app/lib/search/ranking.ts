/**
 * Hjälpfunktioner för att ranka sökresultat för lager och komponenter
 */

interface SearchItem {
  title: string;
  vendor?: string;
  [key: string]: any;
}

/**
 * Separerar produktnummer i delar för bättre jämförelse
 * Ex: "608-2RS" -> ["608", "2", "RS"]
 */
function parseProductNumber(str: string): string[] {
  return str
    .toUpperCase()
    .split(/[-/]/)
    .filter(Boolean)
    .map(part => part.trim());
}

/**
 * Jämför två produktnummer för sortering
 */
function compareProductNumbers(a: string, b: string): number {
  const partsA = parseProductNumber(a);
  const partsB = parseProductNumber(b);

  // Jämför varje del
  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    // Om båda delarna är nummer, jämför numeriskt
    const numA = parseInt(partA);
    const numB = parseInt(partB);
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB;
      continue;
    }

    // Specialhantering för C3, C4, etc.
    if (partA.startsWith('C') && partB.startsWith('C')) {
      const cNumA = parseInt(partA.substring(1));
      const cNumB = parseInt(partB.substring(1));
      if (!isNaN(cNumA) && !isNaN(cNumB)) {
        return cNumA - cNumB;
      }
    }

    // Jämför strängar
    const comparison = partA.localeCompare(partB);
    if (comparison !== 0) return comparison;
  }

  // Kortare nummer kommer först vid i övrigt lika
  return partsA.length - partsB.length;
}

/**
 * Beräknar relevanspoäng för en sökträff
 */
export function calculateSearchScore(item: SearchItem, searchTerm: string): number {
  const itemTitle = item.title.toUpperCase();
  const searchTermUpper = searchTerm.toUpperCase();
  const searchParts = parseProductNumber(searchTermUpper);
  
  let score = 0;

  // Exakt matchning ger högst poäng
  if (itemTitle === searchTermUpper) {
    score += 1000;
  }

  // Början av titel ger höga poäng
  if (itemTitle.startsWith(searchTermUpper)) {
    score += 500;
  }

  // Matchning av produktnummerdelar
  const titleParts = parseProductNumber(itemTitle);
  let matchedParts = 0;
  for (const searchPart of searchParts) {
    if (titleParts.some(part => part.includes(searchPart))) {
      matchedParts++;
      score += 100;
    }
  }

  // Bonus för matchning i rätt ordning
  if (matchedParts === searchParts.length) {
    score += 200;
  }

  // Tillverkare/märke påverkar rankning
  if (item.vendor) {
    const vendorUpper = item.vendor.toUpperCase();
    if (searchTermUpper.includes(vendorUpper)) {
      score += 150;
    }
  }

  // Straffa längre titlar vid i övrigt lika relevans
  score -= itemTitle.length * 0.1;

  return score;
}

/**
 * Sorterar sökresultat baserat på relevans och produktnummer
 */
export function sortSearchResults(items: SearchItem[], searchTerm: string): SearchItem[] {
  return [...items].sort((a, b) => {
    // Först jämför relevanspoäng
    const scoreA = calculateSearchScore(a, searchTerm);
    const scoreB = calculateSearchScore(b, searchTerm);
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Högre poäng först
    }

    // Vid lika poäng, sortera på produktnummer
    return compareProductNumbers(a.title, b.title);
  });
}

/**
 * Grupperar sökresultat efter tillverkare/märke
 */
export function groupSearchResults(items: SearchItem[]): Record<string, SearchItem[]> {
  const groups: Record<string, SearchItem[]> = {};
  
  for (const item of items) {
    const vendor = item.vendor || 'Övrigt';
    if (!groups[vendor]) {
      groups[vendor] = [];
    }
    groups[vendor].push(item);
  }

  return groups;
}

// Exempel på användning:
/*
const results = sortSearchResults([
  { title: '608-2RS ZEN', vendor: 'ZEN' },
  { title: '608-2RSH SKF', vendor: 'SKF' },
  { title: '608-2RSH/C3', vendor: 'SKF' }
], '608-2RS');
*/ 