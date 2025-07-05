type Listener = () => void;

interface RealtimeAnalytics {
  currentUsers: number;
  activeSearches: number;
  recentSearches: string[];
  popularToday: string[];
}

class RealtimeAnalyticsService {
  private static instance: RealtimeAnalyticsService;
  private listeners: Set<Listener> = new Set();
  private data: RealtimeAnalytics = {
    currentUsers: 0,
    activeSearches: 0,
    recentSearches: [],
    popularToday: [],
  };
  private updateInterval: number | null = null;

  private constructor() {
    // Simulera realtidsuppdateringar
    this.startUpdates();
  }

  static getInstance(): RealtimeAnalyticsService {
    if (!RealtimeAnalyticsService.instance) {
      RealtimeAnalyticsService.instance = new RealtimeAnalyticsService();
    }
    return RealtimeAnalyticsService.instance;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  getData(): RealtimeAnalytics {
    return {...this.data};
  }

  addSearch(term: string): void {
    this.data.activeSearches++;
    this.data.recentSearches = [term, ...this.data.recentSearches].slice(0, 10);

    // Uppdatera populära sökningar (only in browser)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const today = new Date().toISOString().split('T')[0];
      const popularKey = `popular_searches_${today}`;
      try {
        const stored = localStorage.getItem(popularKey);
        const popularSearches = stored ? JSON.parse(stored) : {};
        popularSearches[term] = (popularSearches[term] || 0) + 1;
        localStorage.setItem(popularKey, JSON.stringify(popularSearches));

        // Sortera och uppdatera populära sökningar
        this.data.popularToday = Object.entries(popularSearches)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([term]) => term);
      } catch (error) {
        console.error('Failed to update popular searches:', error);
      }
    }

    this.notify();
  }

  completeSearch(): void {
    this.data.activeSearches = Math.max(0, this.data.activeSearches - 1);
    this.notify();
  }

  private startUpdates(): void {
    // Check if we're in browser environment before accessing window
    if (typeof window === 'undefined') return;

    // Simulera användaraktivitet
    this.updateInterval = window.setInterval(() => {
      this.data.currentUsers = Math.floor(Math.random() * 20) + 10;
      this.notify();
    }, 5000);
  }

  stopUpdates(): void {
    if (this.updateInterval !== null && typeof window !== 'undefined') {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const realtimeAnalytics = RealtimeAnalyticsService.getInstance();
