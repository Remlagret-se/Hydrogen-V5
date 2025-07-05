import type {LoaderFunctionArgs} from '@remix-run/react';
import CompleteCartPage from '~/components/cart/CompleteCartPage';

export async function loader({context}: LoaderFunctionArgs) {
  // In a real implementation, you would fetch cart data from Shopify
  // For now, we'll return empty cart data and let the component handle Zustand store
  return {
    cart: null,
  };
}

export default function Cart() {
  return <CompleteCartPage />;
}

