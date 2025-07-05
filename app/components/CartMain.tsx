import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export interface CartMainProps {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
}

interface CartEmptyProps {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className} style={{ backgroundColor: 'var(--color-background)' }}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({hidden = false, layout}: CartEmptyProps) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="text-center py-8">
      <p className="text-lg mb-4" style={{ color: 'var(--gray-11)' }}>
        Din varukorg är tom
      </p>
      <p className="text-sm mb-6" style={{ color: 'var(--gray-9)' }}>
        Lägg till produkter för att komma igång med din beställning
      </p>
      <Link 
        to="/collections" 
        onClick={close} 
        prefetch="viewport"
        className="inline-block px-6 py-3 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
        style={{ backgroundColor: 'var(--blue-9)' }}
      >
        Fortsätt handla →
      </Link>
    </div>
  );
}

