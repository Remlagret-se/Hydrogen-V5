import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';

export async function loader({context}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const cartId = await session.get('cartId');

  if (!cartId) {
    return {cart: null};
  }

  // Return early if storefront is not available
  if (!storefront) {
    return {cart: null};
  }

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
    },
  });

  return {cart};
}

export default function Cart() {
  const {cart} = useLoaderData<typeof loader>();

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {cart?.lines?.nodes?.length ? (
        <div className="cart-items">
          {cart.lines.nodes.map((line) => (
            <div key={line.id} className="cart-item">
              <h2>{line.merchandise.product.title}</h2>
              <p>Quantity: {line.quantity}</p>
              <p>Price: {line.cost.totalAmount.amount} {line.cost.totalAmount.currencyCode}</p>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total</h2>
            <p>{cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}</p>
          </div>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
}

const CART_QUERY = `#graphql
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              product {
                title
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
` as const; 
