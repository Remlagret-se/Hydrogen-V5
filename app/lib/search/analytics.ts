interface SearchSession {
  id: string;
  startTime: number;
  endTime?: number;
  searchTerms: string[];
  results: number[];
  clicks: string[]; // product IDs
  filters: Record<string, any>[];
}

interface SearchInsights {
  averageSessionDuration: number;
  averageSearchesPerSession: number;
  mostCommonSearchPatterns: string[];
  popularSearchCombinations: string[];
  searchAbandonmentRate: number;
  searchRefinementRate: number;
}

export class SearchAnalytics {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minuter
  private static currentSession: SearchSession | null = null;
  private static readonly STORAGE_KEY = 'search_analytics_sessions';

  static startSession(): void {
    this.currentSession = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      searchTerms: [],
      results: [],
      clicks: [],
      filters: [],
    };
  }

  static addSearch(term: string, resultCount: number, filters: Record<string, any> = {}): void {
    if (!this.currentSession || Date.now() - this.currentSession.startTime > this.SESSION_TIMEOUT) {
      this.startSession();
    }

    if (this.currentSession) {
      this.currentSession.searchTerms.push(term);
      this.currentSession.results.push(resultCount);
      this.currentSession.filters.push(filters);
      this.saveSession();
    }
  }

  static addClick(productId: string): void {
    if (this.currentSession) {
      this.currentSession.clicks.push(productId);
      this.saveSession();
    }
  }

  static endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.saveSession();
      this.currentSession = null;
    }
  }

  private static saveSession(): void {
    try {
      const sessions = this.getSessions();
      if (this.currentSession) {
        const existingIndex = sessions.findIndex(s => s.id === this.currentSession?.id);
        if (existingIndex >= 0) {
          sessions[existingIndex] = this.currentSession;
        } else {
          sessions.push(this.currentSession);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Failed to save search session:', error);
    }
  }

  private static getSessions(): SearchSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getInsights(): SearchInsights {
    const sessions = this.getSessions();
    const completedSessions = sessions.filter(s => s.endTime);

    // Beräkna genomsnittlig sessionslängd
    const avgDuration = completedSessions.reduce((acc, session) => {
      return acc + ((session.endTime || 0) - session.startTime);
    }, 0) / completedSessions.length;

    // Beräkna genomsnittligt antal sökningar per session
    const avgSearches = sessions.reduce((acc, session) => {
      return acc + session.searchTerms.length;
    }, 0) / sessions.length;

    // Hitta vanliga sökmönster
    const patterns = this.findSearchPatterns(sessions);

    // Beräkna sökövergivningsfrekvens (searches without clicks)
    const abandonmentRate = sessions.reduce((acc, session) => {
      return acc + (session.clicks.length === 0 ? 1 : 0);
    }, 0) / sessions.length;

    // Beräkna sökförfiningsfrekvens (multiple searches in session)
    const refinementRate = sessions.reduce((acc, session) => {
      return acc + (session.searchTerms.length > 1 ? 1 : 0);
    }, 0) / sessions.length;

    return {
      averageSessionDuration: avgDuration,
      averageSearchesPerSession: avgSearches,
      mostCommonSearchPatterns: patterns.patterns,
      popularSearchCombinations: patterns.combinations,
      searchAbandonmentRate: abandonmentRate,
      searchRefinementRate: refinementRate,
    };
  }

  private static findSearchPatterns(sessions: SearchSession[]): {
    patterns: string[];
    combinations: string[];
  } {
    const patterns: Map<string, number> = new Map();
    const combinations: Map<string, number> = new Map();

    sessions.forEach(session => {
      // Registrera mönster av på varandra följande sökningar
      for (let i = 0; i < session.searchTerms.length - 1; i++) {
        const pattern = `${session.searchTerms[i]} → ${session.searchTerms[i + 1]}`;
        patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
      }

      // Registrera kombinationer av söktermer i samma session
      if (session.searchTerms.length > 1) {
        const sortedTerms = [...new Set(session.searchTerms)].sort();
        for (let i = 0; i < sortedTerms.length; i++) {
          for (let j = i + 1; j < sortedTerms.length; j++) {
            const combo = `${sortedTerms[i]} + ${sortedTerms[j]}`;
            combinations.set(combo, (combinations.get(combo) || 0) + 1);
          }
        }
      }
    });

    return {
      patterns: Array.from(patterns.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([pattern]) => pattern)
        .slice(0, 5),
      combinations: Array.from(combinations.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([combo]) => combo)
        .slice(0, 5),
    };
  }

  static getSearchEfficiency(): number {
    const sessions = this.getSessions();
    const totalClicks = sessions.reduce((acc, session) => acc + session.clicks.length, 0);
    const totalSearches = sessions.reduce((acc, session) => acc + session.searchTerms.length, 0);
    return totalSearches > 0 ? totalClicks / totalSearches : 0;
  }

  static getPopularFilters(): Record<string, number> {
    const sessions = this.getSessions();
    const filterCounts: Record<string, number> = {};

    sessions.forEach(session => {
      session.filters.forEach(filters => {
        Object.entries(filters).forEach(([key, value]) => {
          const filterKey = `${key}:${value}`;
          filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1;
        });
      });
    });

    return filterCounts;
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentSession = null;
  }
} 