interface SearchSettings {
  algorithm: 'standard' | 'fuzzy' | 'exact';
  relevance: 'balanced' | 'exact' | 'popularity';
  cacheSize: number;
  languages: string[];
  advancedMode: boolean;
  indexingInterval: number;
  minScore: number;
  fuzzyThreshold: number;
  maxResults: number;
  timeout: number;
}

interface IndexingStats {
  lastRun: number;
  totalDocuments: number;
  indexSize: number;
  averageProcessingTime: number;
}

export class SearchSettingsService {
  private static readonly SETTINGS_KEY = 'search_settings';
  private static readonly STATS_KEY = 'search_indexing_stats';
  private static instance: SearchSettingsService;

  private defaultSettings: SearchSettings = {
    algorithm: 'standard',
    relevance: 'balanced',
    cacheSize: 5000,
    languages: ['sv'],
    advancedMode: false,
    indexingInterval: 24 * 60 * 60 * 1000, // 24 timmar
    minScore: 0.3,
    fuzzyThreshold: 0.7,
    maxResults: 100,
    timeout: 10000,
  };

  private constructor() {
    // Ladda sparade inställningar vid start
    this.loadSettings();
  }

  static getInstance(): SearchSettingsService {
    if (!SearchSettingsService.instance) {
      SearchSettingsService.instance = new SearchSettingsService();
    }
    return SearchSettingsService.instance;
  }

  private settings: SearchSettings;

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(SearchSettingsService.SETTINGS_KEY);
      this.settings = stored ? {...this.defaultSettings, ...JSON.parse(stored)} : this.defaultSettings;
    } catch (error) {
      console.error('Failed to load search settings:', error);
      this.settings = this.defaultSettings;
    }
  }

  saveSettings(newSettings: Partial<SearchSettings>): void {
    try {
      this.settings = {...this.settings, ...newSettings};
      localStorage.setItem(
        SearchSettingsService.SETTINGS_KEY,
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error('Failed to save search settings:', error);
    }
  }

  getSettings(): SearchSettings {
    return {...this.settings};
  }

  async updateIndex(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Simulera indexeringsprocess
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Uppdatera statistik
      const stats: IndexingStats = {
        lastRun: Date.now(),
        totalDocuments: Math.floor(Math.random() * 10000) + 5000,
        indexSize: Math.floor(Math.random() * 100) + 50,
        averageProcessingTime: Date.now() - startTime,
      };

      localStorage.setItem(
        SearchSettingsService.STATS_KEY,
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error('Failed to update search index:', error);
      throw error;
    }
  }

  getIndexingStats(): IndexingStats | null {
    try {
      const stored = localStorage.getItem(SearchSettingsService.STATS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  optimizePerformance(): Promise<void> {
    return new Promise((resolve) => {
      // Simulera optimeringsprocess
      setTimeout(() => {
        // Uppdatera cache-storlek baserat på användning
        const currentSettings = this.getSettings();
        if (currentSettings.cacheSize < 10000) {
          this.saveSettings({
            cacheSize: currentSettings.cacheSize * 1.5,
          });
        }
        resolve();
      }, 1500);
    });
  }

  backupSettings(): string {
    const backup = {
      settings: this.settings,
      stats: this.getIndexingStats(),
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  }

  restoreSettings(backupData: string): void {
    try {
      const backup = JSON.parse(backupData);
      if (backup.settings) {
        this.saveSettings(backup.settings);
      }
    } catch (error) {
      console.error('Failed to restore settings from backup:', error);
      throw new Error('Invalid backup data');
    }
  }

  resetToDefaults(): void {
    this.settings = {...this.defaultSettings};
    localStorage.setItem(
      SearchSettingsService.SETTINGS_KEY,
      JSON.stringify(this.settings)
    );
    localStorage.removeItem(SearchSettingsService.STATS_KEY);
  }

  validateSettings(settings: Partial<SearchSettings>): string[] {
    const errors: string[] = [];

    if (settings.minScore !== undefined && (settings.minScore < 0 || settings.minScore > 1)) {
      errors.push('Minimum score must be between 0 and 1');
    }

    if (settings.fuzzyThreshold !== undefined && (settings.fuzzyThreshold < 0 || settings.fuzzyThreshold > 1)) {
      errors.push('Fuzzy threshold must be between 0 and 1');
    }

    if (settings.maxResults !== undefined && settings.maxResults < 1) {
      errors.push('Max results must be greater than 0');
    }

    if (settings.timeout !== undefined && settings.timeout < 1000) {
      errors.push('Timeout must be at least 1000ms');
    }

    return errors;
  }

  getPerformanceMetrics(): {
    cacheHitRate: number;
    averageResponseTime: number;
    errorRate: number;
  } {
    // Simulera prestandamätningar
    return {
      cacheHitRate: Math.random() * 0.3 + 0.6, // 60-90%
      averageResponseTime: Math.random() * 100 + 50, // 50-150ms
      errorRate: Math.random() * 0.02, // 0-2%
    };
  }
} 