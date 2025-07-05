import {useState, useEffect} from 'react';
import {ProductComparisonService} from '~/lib/product/comparison';

interface CompareButtonProps {
  productId: string;
  product: {
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
  };
  className?: string;
}

export function CompareButton({
  productId,
  product,
  className = '',
}: CompareButtonProps) {
  const [isInComparison, setIsInComparison] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comparisonService = ProductComparisonService.getInstance();

  useEffect(() => {
    checkComparisonStatus();
  }, [productId]);

  const checkComparisonStatus = () => {
    setIsInComparison(comparisonService.isInComparison(productId));
  };

  const handleToggleComparison = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      if (isInComparison) {
        await comparisonService.removeFromComparison(productId);
      } else {
        if (!comparisonService.canAddMore()) {
          throw new Error(
            `Kan inte jämföra fler än ${comparisonService.getMaxProducts()} produkter`
          );
        }
        await comparisonService.addToComparison(product);
      }
      setIsInComparison(!isInComparison);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleComparison}
        disabled={isUpdating}
        className={`group relative inline-flex items-center space-x-2 ${
          isInComparison
            ? 'text-primary hover:text-primary/90'
            : 'text-gray-500 hover:text-gray-700'
        } ${className}`}
        aria-label={
          isInComparison ? 'Ta bort från jämförelse' : 'Lägg till i jämförelse'
        }
      >
        <CompareIcon
          className={`h-6 w-6 transition-colors duration-150 ${
            isInComparison ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
          }`}
        />
        <span className="text-sm font-medium">
          {isInComparison ? 'Ta bort från jämförelse' : 'Jämför'}
        </span>
      </button>

      {error && (
        <p
          className="absolute top-full left-0 mt-1 text-sm text-red-600 whitespace-nowrap"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function CompareIcon({className}: {className?: string}) {
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
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5" />
    </svg>
  );
} 