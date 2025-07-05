interface StockNotification {
  productId: string;
  variantId: string;
  email: string;
  createdAt: number;
}

interface WishlistItem {
  productId: string;
  variantId: string;
  addedAt: number;
  note?: string;
}

interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  createdAt: number;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export class ProductService {
  private static readonly NOTIFICATIONS_KEY = 'stock_notifications';
  private static readonly WISHLIST_KEY = 'wishlist';
  private static readonly REVIEWS_KEY = 'product_reviews';
  private static instance: ProductService;

  private constructor() {
    // Initiera lagring vid start
    this.initStorage();
  }

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private initStorage(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(ProductService.NOTIFICATIONS_KEY)) {
      localStorage.setItem(ProductService.NOTIFICATIONS_KEY, '[]');
    }
    if (!localStorage.getItem(ProductService.WISHLIST_KEY)) {
      localStorage.setItem(ProductService.WISHLIST_KEY, '[]');
    }
    if (!localStorage.getItem(ProductService.REVIEWS_KEY)) {
      localStorage.setItem(ProductService.REVIEWS_KEY, '[]');
    }
  }

  // Lagernotifieringar
  async subscribeToStock(productId: string, variantId: string, email: string): Promise<void> {
    const notifications = this.getStockNotifications();
    
    // Kontrollera om prenumeration redan finns
    const exists = notifications.some(
      n => n.productId === productId && n.variantId === variantId && n.email === email
    );

    if (!exists) {
      notifications.push({
        productId,
        variantId,
        email,
        createdAt: Date.now(),
      });
      localStorage.setItem(ProductService.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }

  async unsubscribeFromStock(productId: string, variantId: string, email: string): Promise<void> {
    const notifications = this.getStockNotifications().filter(
      n => !(n.productId === productId && n.variantId === variantId && n.email === email)
    );
    localStorage.setItem(ProductService.NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }

  getStockNotifications(): StockNotification[] {
    try {
      return JSON.parse(localStorage.getItem(ProductService.NOTIFICATIONS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Önskelista
  async addToWishlist(productId: string, variantId: string, note?: string): Promise<void> {
    const wishlist = this.getWishlist();
    
    // Kontrollera om produkten redan finns
    const exists = wishlist.some(
      item => item.productId === productId && item.variantId === variantId
    );

    if (!exists) {
      wishlist.push({
        productId,
        variantId,
        addedAt: Date.now(),
        note,
      });
      localStorage.setItem(ProductService.WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }

  async removeFromWishlist(productId: string, variantId: string): Promise<void> {
    const wishlist = this.getWishlist().filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );
    localStorage.setItem(ProductService.WISHLIST_KEY, JSON.stringify(wishlist));
  }

  getWishlist(): WishlistItem[] {
    try {
      return JSON.parse(localStorage.getItem(ProductService.WISHLIST_KEY) || '[]');
    } catch {
      return [];
    }
  }

  isInWishlist(productId: string, variantId: string): boolean {
    return this.getWishlist().some(
      item => item.productId === productId && item.variantId === variantId
    );
  }

  // Produktrecensioner
  async addReview(review: Omit<ProductReview, 'id' | 'createdAt' | 'helpful'>): Promise<void> {
    const reviews = this.getReviews(review.productId);
    const newReview: ProductReview = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      helpful: 0,
    };
    reviews.push(newReview);
    this.saveReviews(reviews);
  }

  async updateReview(reviewId: string, updates: Partial<ProductReview>): Promise<void> {
    const allReviews = this.getAllReviews();
    const updated = allReviews.map(review =>
      review.id === reviewId ? {...review, ...updates} : review
    );
    localStorage.setItem(ProductService.REVIEWS_KEY, JSON.stringify(updated));
  }

  async deleteReview(reviewId: string): Promise<void> {
    const allReviews = this.getAllReviews().filter(review => review.id !== reviewId);
    localStorage.setItem(ProductService.REVIEWS_KEY, JSON.stringify(allReviews));
  }

  getReviews(productId: string): ProductReview[] {
    return this.getAllReviews().filter(review => review.productId === productId);
  }

  private getAllReviews(): ProductReview[] {
    try {
      return JSON.parse(localStorage.getItem(ProductService.REVIEWS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private saveReviews(reviews: ProductReview[]): void {
    localStorage.setItem(ProductService.REVIEWS_KEY, JSON.stringify(reviews));
  }

  // Statistik och aggregering
  getProductStats(productId: string): {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    verifiedReviews: number;
  } {
    const reviews = this.getReviews(productId);
    const ratingDistribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const verifiedReviews = reviews.filter(review => review.verified).length;

    return {
      averageRating: reviews.length ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
      ratingDistribution,
      verifiedReviews,
    };
  }

  // Lagerhantering
  async checkStock(productId: string, variantId: string): Promise<{
    inStock: boolean;
    quantity?: number;
    expectedDate?: string;
  }> {
    // Här skulle vi normalt göra ett API-anrop till Shopify
    // För demo, returnera simulerad data
    return {
      inStock: Math.random() > 0.3,
      quantity: Math.floor(Math.random() * 20),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async notifyBackInStock(notifications: StockNotification[]): Promise<void> {
    // Här skulle vi normalt skicka e-post via en e-posttjänst
    console.log('Sending stock notifications:', notifications);
  }
} 