interface ComparedProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  imageSrc: string;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    available: boolean;
  }>;
  description: string;
  features: Record<string, string | number | boolean>;
}

export class ProductComparisonService {
  private static readonly COMPARISON_KEY = 'product_comparison';
  private static readonly MAX_PRODUCTS = 4;
  private static instance: ProductComparisonService;

  private constructor() {
    this.initStorage();
  }

  static getInstance(): ProductComparisonService {
    if (!ProductComparisonService.instance) {
      ProductComparisonService.instance = new ProductComparisonService();
    }
    return ProductComparisonService.instance;
  }

  private initStorage(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(ProductComparisonService.COMPARISON_KEY)) {
      localStorage.setItem(ProductComparisonService.COMPARISON_KEY, '[]');
    }
  }

  getComparedProducts(): ComparedProduct[] {
    try {
      return JSON.parse(
        localStorage.getItem(ProductComparisonService.COMPARISON_KEY) || '[]'
      );
    } catch {
      return [];
    }
  }

  async addToComparison(product: ComparedProduct): Promise<void> {
    const products = this.getComparedProducts();
    
    // Check if product is already in comparison
    if (products.some(p => p.id === product.id)) {
      return;
    }

    // Check if we've reached the maximum number of products
    if (products.length >= ProductComparisonService.MAX_PRODUCTS) {
      throw new Error(
        `Kan inte jämföra fler än ${ProductComparisonService.MAX_PRODUCTS} produkter`
      );
    }

    products.push(product);
    localStorage.setItem(
      ProductComparisonService.COMPARISON_KEY,
      JSON.stringify(products)
    );
  }

  async removeFromComparison(productId: string): Promise<void> {
    const products = this.getComparedProducts().filter(p => p.id !== productId);
    localStorage.setItem(
      ProductComparisonService.COMPARISON_KEY,
      JSON.stringify(products)
    );
  }

  clearComparison(): void {
    localStorage.setItem(ProductComparisonService.COMPARISON_KEY, '[]');
  }

  isInComparison(productId: string): boolean {
    return this.getComparedProducts().some(p => p.id === productId);
  }

  getCommonFeatures(products: ComparedProduct[]): string[] {
    if (products.length === 0) return [];

    // Get all unique feature keys
    const allFeatures = new Set<string>();
    products.forEach(product => {
      Object.keys(product.features).forEach(key => allFeatures.add(key));
    });

    // Filter to features that exist in all products
    return Array.from(allFeatures).filter(feature =>
      products.every(product => feature in product.features)
    );
  }

  canAddMore(): boolean {
    return (
      this.getComparedProducts().length < ProductComparisonService.MAX_PRODUCTS
    );
  }

  getMaxProducts(): number {
    return ProductComparisonService.MAX_PRODUCTS;
  }
} 