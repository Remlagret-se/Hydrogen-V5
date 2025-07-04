import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {orderId} = params;
  const {storefront} = context;

  if (!orderId) {
    throw new Error('Expected order ID to be defined');
  }

  // Return early if storefront is not available
  if (!storefront) {
    throw new Response('Storefront not available', {status: 500});
  }

  const {node: order} = await storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      id: orderId,
    },
  });

  if (!order?.id) {
    throw new Response('Not found', {status: 404});
  }

  return {
    order,
  };
}

export default function Order() {
  const {order} = useLoaderData<typeof loader>();

  return (
    <div className="order">
      <h1>Order {order.name}</h1>
      <div className="order-details">
        <h2>Order Details</h2>
        <p>Status: {order.fulfillmentStatus}</p>
        <p>Total: {order.totalPriceV2.amount} {order.totalPriceV2.currencyCode}</p>
        <div className="order-items">
          {order.lineItems.nodes.map((item) => (
            <div key={item.id} className="order-item">
              <h3>{item.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.originalTotalPrice.amount} {item.originalTotalPrice.currencyCode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
