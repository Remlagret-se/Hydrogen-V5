import {useState, useEffect} from 'react';
import {ProductService} from '~/lib/product/service';

interface StockStatusProps {
  productId: string;
  variantId: string;
  userEmail?: string;
}

export function StockStatus({productId, variantId, userEmail}: StockStatusProps) {
  const [stockInfo, setStockInfo] = useState<{
    inStock: boolean;
    quantity?: number;
    expectedDate?: string;
  } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productService = ProductService.getInstance();

  useEffect(() => {
    loadStockInfo();
    checkSubscription();
  }, [productId, variantId]);

  const loadStockInfo = async () => {
    try {
      const info = await productService.checkStock(productId, variantId);
      setStockInfo(info);
    } catch (error) {
      console.error('Failed to load stock info:', error);
      setError('Kunde inte hämta lagerstatus');
    }
  };

  const checkSubscription = () => {
    if (!userEmail) return;
    
    const notifications = productService.getStockNotifications();
    setIsSubscribed(
      notifications.some(
        n =>
          n.productId === productId &&
          n.variantId === variantId &&
          n.email === userEmail
      )
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.subscribeToStock(productId, variantId, email);
      setIsSubscribed(true);
      setShowSubscribeForm(false);
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setError('Kunde inte prenumerera på lagernotifieringar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.unsubscribeFromStock(productId, variantId, email);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setError('Kunde inte avsluta prenumerationen');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stockInfo) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lagerstatus */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <span className="text-sm font-medium">
          {stockInfo.inStock
            ? stockInfo.quantity
              ? `${stockInfo.quantity} i lager`
              : 'I lager'
            : 'Ej i lager'}
        </span>
      </div>

      {/* Förväntad leverans */}
      {!stockInfo.inStock && stockInfo.expectedDate && (
        <p className="text-sm text-gray-600">
          Förväntad åter i lager:{' '}
          {new Date(stockInfo.expectedDate).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'long',
          })}
        </p>
      )}

      {/* Lagernotifieringar */}
      {!stockInfo.inStock && (
        <div className="mt-4">
          {isSubscribed ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Du kommer att meddelas när produkten är tillbaka i lager.
              </p>
              <button
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Avsluta prenumeration
              </button>
            </div>
          ) : showSubscribeForm ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="din@epost.se"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sparar...' : 'Meddela mig'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubscribeForm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Avbryt
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowSubscribeForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Meddela mig när produkten är i lager
            </button>
          )}
        </div>
      )}

      {/* Felmeddelande */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 