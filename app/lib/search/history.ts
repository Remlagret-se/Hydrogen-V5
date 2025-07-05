const SEARCH_HISTORY_KEY = 'search_history';
const SEARCH_ANALYTICS_KEY = 'search_analytics';
const MAX_HISTORY_ITEMS = 10;

interface SearchHistoryItem {
  term: string;
  timestamp: number;
  productClicked?: string; // product ID if user clicked a result
  category?: string;
  vendor?: string;
}

interface SearchAnalytics {
  totalSearches: number;
  successfulSearches: number; // searches that led to clicks
  lastUpdated: number;
  popularCategories: Record<string, number>;
  popularVendors: Record<string, number>;
  averageSearchLength: number;
  searchesWithResults: number;
  noResultSearches: number;
}

export class SearchHistory {
  private static analytics: SearchAnalytics = {
    totalSearches: 0,
    successfulSearches: 0,
    lastUpdated: Date.now(),
    popularCategories: {},
    popularVendors: {},
    averageSearchLength: 0,
    searchesWithResults: 0,
    noResultSearches: 0,
  };

  static getHistory(): SearchHistoryItem[] {
    try {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  static addSearch(term: string, resultsCount: number = 0): void {
    const history = this.getHistory();
    const newItem: SearchHistoryItem = {
      term,
      timestamp: Date.now(),
    };

    // Uppdatera historik
    const updatedHistory = [
      newItem,
      ...history.filter((item) => item.term !== term),
    ].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));

    // Uppdatera analytics
    this.updateAnalytics({
      totalSearches: 1,
      searchesWithResults: resultsCount > 0 ? 1 : 0,
      noResultSearches: resultsCount === 0 ? 1 : 0,
      averageSearchLength: term.length,
    });
  }

  static addProductClick(term: string, productId: string, category?: string, vendor?: string): void {
    const history = this.getHistory();
    const searchItem = history.find((item) => item.term === term);
    
    if (searchItem) {
      searchItem.productClicked = productId;
      searchItem.category = category;
      searchItem.vendor = vendor;
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));

      // Uppdatera analytics
      this.updateAnalytics({
        successfulSearches: 1,
        popularCategories: {[category || 'unknown']: 1},
        popularVendors: {[vendor || 'unknown']: 1},
      });
    }
  }

  private static updateAnalytics(updates: Partial<SearchAnalytics>): void {
    try {
      // Hämta befintlig analytics
      const stored = localStorage.getItem(SEARCH_ANALYTICS_KEY);
      const current: SearchAnalytics = stored ? JSON.parse(stored) : this.analytics;

      // Uppdatera värden
      const updated = {
        ...current,
        totalSearches: current.totalSearches + (updates.totalSearches || 0),
        successfulSearches: current.successfulSearches + (updates.successfulSearches || 0),
        searchesWithResults: current.searchesWithResults + (updates.searchesWithResults || 0),
        noResultSearches: current.noResultSearches + (updates.noResultSearches || 0),
        lastUpdated: Date.now(),
      };

      // Uppdatera genomsnittlig söklängd
      if (updates.averageSearchLength) {
        updated.averageSearchLength = 
          (current.averageSearchLength * current.totalSearches + updates.averageSearchLength) / 
          (current.totalSearches + 1);
      }

      // Uppdatera populära kategorier
      if (updates.popularCategories) {
        Object.entries(updates.popularCategories).forEach(([category, count]) => {
          updated.popularCategories[category] = (updated.popularCategories[category] || 0) + count;
        });
      }

      // Uppdatera populära tillverkare
      if (updates.popularVendors) {
        Object.entries(updates.popularVendors).forEach(([vendor, count]) => {
          updated.popularVendors[vendor] = (updated.popularVendors[vendor] || 0) + count;
        });
      }

      localStorage.setItem(SEARCH_ANALYTICS_KEY, JSON.stringify(updated));
      this.analytics = updated;
    } catch (error) {
      console.error('Failed to update search analytics:', error);
    }
  }

  static getPopularSearches(): string[] {
    const history = this.getHistory();
    const termCounts = new Map<string, number>();
    const termSuccess = new Map<string, number>();

    history.forEach((item) => {
      const count = termCounts.get(item.term) || 0;
      termCounts.set(item.term, count + 1);
      
      if (item.productClicked) {
        const success = termSuccess.get(item.term) || 0;
        termSuccess.set(item.term, success + 1);
      }
    });

    // Vikta sökningar baserat på antal och framgång
    return Array.from(termCounts.entries())
      .sort(([termA, countA], [termB, countB]) => {
        const successA = termSuccess.get(termA) || 0;
        const successB = termSuccess.get(termB) || 0;
        // Vikta framgångsrika sökningar högre
        const scoreA = countA + (successA * 2);
        const scoreB = countB + (successB * 2);
        return scoreB - scoreA;
      })
      .map(([term]) => term)
      .slice(0, 5);
  }

  static getRelatedSearches(term: string): string[] {
    const history = this.getHistory();
    const termWords = term.toLowerCase().split(/\s+/);
    
    // Hitta sökningar med liknande ord
    const relatedSearches = history
      .filter(item => {
        const itemWords = item.term.toLowerCase().split(/\s+/);
        return termWords.some(word => 
          itemWords.some(itemWord => 
            itemWord.includes(word) || word.includes(itemWord)
          )
        );
      })
      .map(item => item.term);

    // Ta bort dubbletter och den aktuella söktermen
    return [...new Set(relatedSearches)]
      .filter(s => s !== term)
      .slice(0, 3);
  }

  static getSearchAnalytics(): SearchAnalytics {
    try {
      const stored = localStorage.getItem(SEARCH_ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : this.analytics;
    } catch {
      return this.analytics;
    }
  }

  static clear(): void {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    localStorage.removeItem(SEARCH_ANALYTICS_KEY);
    this.analytics = {
      totalSearches: 0,
      successfulSearches: 0,
      lastUpdated: Date.now(),
      popularCategories: {},
      popularVendors: {},
      averageSearchLength: 0,
      searchesWithResults: 0,
      noResultSearches: 0,
    };
  }
} 