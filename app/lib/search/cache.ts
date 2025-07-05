import type {PredictiveSearchReturn} from '../search';

/**
 * Cache-service för sökresultat
 */
export class SearchCache {
  private static cache = new Map<string, {
    data: PredictiveSearchReturn;
    timestamp: number;
  }>();
  private static maxSize = 100; // Max antal cachade sökningar
  private static maxAge = 1000 * 60 * 5; // 5 minuter i millisekunder

  /**
   * Spara sökresultat i cachen
   */
  static set(key: string, value: PredictiveSearchReturn): void {
    // Rensa gammal cache om vi når maxgränsen
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    // Rensa gamla cacheposter
    this.cleanup();

    // Lägg till ny cachepost
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  /**
   * Hämta sökresultat från cachen
   */
  static get(key: string): PredictiveSearchReturn | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    // Kontrollera om cachen är för gammal
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }

  /**
   * Rensa utgången cache
   */
  private static cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Rensa hela cachen
   */
  static clear(): void {
    this.cache.clear();
  }
} 