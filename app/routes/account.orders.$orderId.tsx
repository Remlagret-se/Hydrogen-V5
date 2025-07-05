import {
  json,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  CheckIcon,
  TruckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Orderdetaljer | Remlagret'}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();
  if (!session) {
    return redirect('/account/login');
  }

  const orderId = decodeURIComponent(params.orderId);

  try {
    const {data} = await context.storefront.query(ORDER_QUERY, {
      variables: {
        customerAccessToken: session.accessToken,
        orderId,
      },
    });

    if (!data?.customer?.order) {
      return redirect('/account?tab=orders');
    }

    return json({order: data.customer.order});
  } catch (error) {
    return redirect('/account?tab=orders');
  }
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getOrderStep(status: string) {
  switch (status) {
    case 'UNFULFILLED':
      return 0;
    case 'IN_PROGRESS':
      return 1;
    case 'FULFILLED':
      return 2;
    case 'DELIVERED':
      return 3;
    default:
      return 0;
  }
}

export default function OrderDetails() {
  const {order} = useLoaderData<typeof loader>();

  const orderStep = getOrderStep(order.fulfillmentStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/account?tab=orders"
          className="text-primary hover:text-primary/80"
        >
          ← Tillbaka till ordrar
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-500">
              {new Date(order.processedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-gray-600">
              Status: <span className="font-medium">{order.fulfillmentStatus}</span>
            </p>
            <p className="text-gray-600">
              Betalningsstatus:{' '}
              <span className="font-medium">{order.financialStatus}</span>
            </p>
          </div>
        </div>

        {/* Leveransadress */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Leveransadress</h2>
          <div className="text-gray-600">
            <p>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p>{order.shippingAddress.address2}</p>
            )}
            <p>
              {order.shippingAddress.zip} {order.shippingAddress.city}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Produkter */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-4">Produkter</h2>
          <div className="space-y-4">
            {order.lineItems.edges.map(({node: item}) => (
              <div
                key={item.id}
                className="flex items-center border-b last:border-b-0 pb-4 last:pb-0"
              >
                <div className="w-20 h-20 flex-shrink-0">
                  {item.variant?.image && (
                    <img
                      src={item.variant.image.url}
                      alt={item.variant.image.altText || item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      {item.variant.title !== 'Default Title'
                        ? item.variant.title
                        : ''}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Antal: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.originalTotalPrice.amount}{' '}
                    {item.originalTotalPrice.currencyCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summering */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Delsumma</span>
              <span>
                {order.subtotalPrice.amount} {order.subtotalPrice.currencyCode}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frakt</span>
              <span>
                {order.totalShippingPrice.amount}{' '}
                {order.totalShippingPrice.currencyCode}
              </span>
            </div>
            {order.totalTax && (
              <div className="flex justify-between text-gray-600">
                <span>Moms</span>
                <span>
                  {order.totalTax.amount} {order.totalTax.currencyCode}
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Totalt</span>
              <span>
                {order.totalPrice.amount} {order.totalPrice.currencyCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ORDER_QUERY = `#graphql
  query Order($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      order(id: $orderId) {
        id
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        currentTotalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                id
                title
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`; 
