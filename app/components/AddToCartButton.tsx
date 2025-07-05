import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

interface AddToCartButtonProps {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  variant = 'primary',
  className = '',
}: AddToCartButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'text-white hover:opacity-90 focus:ring-blue-500',
    secondary: 'text-gray-12 border hover:opacity-80 focus:ring-gray-500',
  };

  const primaryBg = { backgroundColor: 'var(--blue-9)' };
  const secondaryBg = { 
    backgroundColor: 'var(--color-background)', 
    borderColor: 'var(--gray-6)',
    color: 'var(--gray-12)'
  };

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={variant === 'primary' ? primaryBg : secondaryBg}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

