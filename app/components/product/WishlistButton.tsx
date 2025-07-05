import {useState, useEffect} from 'react';
import {ProductService} from '~/lib/product/service';

interface WishlistButtonProps {
  productId: string;
  variantId: string;
  className?: string;
}

export function WishlistButton({
  productId,
  variantId,
  className = '',
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

  const productService = ProductService.getInstance();

  useEffect(() => {
    checkWishlistStatus();
  }, [productId, variantId]);

  const checkWishlistStatus = () => {
    setIsInWishlist(productService.isInWishlist(productId, variantId));
  };

  const handleToggleWishlist = async () => {
    if (isInWishlist) {
      await handleRemoveFromWishlist();
    } else {
      setShowNote(true);
    }
  };

  const handleAddToWishlist = async () => {
    setIsUpdating(true);
    try {
      await productService.addToWishlist(productId, variantId, note);
      setIsInWishlist(true);
      setShowNote(false);
      setNote('');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    setIsUpdating(true);
    try {
      await productService.removeFromWishlist(productId, variantId);
      setIsInWishlist(false);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleWishlist}
        disabled={isUpdating || showNote}
        className={`group relative inline-flex items-center ${className}`}
        aria-label={isInWishlist ? 'Ta bort från önskelista' : 'Lägg till i önskelista'}
      >
        <HeartIcon
          className={`h-6 w-6 transition-colors duration-150 ${
            isInWishlist
              ? 'text-red-500 fill-current'
              : 'text-gray-400 group-hover:text-red-500'
          }`}
        />
        <span className="sr-only">
          {isInWishlist ? 'Ta bort från önskelista' : 'Lägg till i önskelista'}
        </span>
      </button>

      {/* Anteckningsmodal */}
      {showNote && (
        <div className="absolute z-10 mt-2 w-64 -right-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700"
              >
                Anteckning (valfritt)
              </label>
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="T.ex. önskad storlek eller färg"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNote(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isUpdating ? 'Sparar...' : 'Lägg till'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeartIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
} 