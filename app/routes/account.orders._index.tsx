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
  return [{title: 'Orderhistorik | Remlagret'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  // Hämta kundens ordrar med detaljerad information
  const {data} = await context.storefront.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  return json({
    orders: data?.customer?.orders?.edges || [],
  });
}

export default function OrderHistory() {
  const {orders} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl py-16 sm:px-6 sm:py-24">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orderhistorik
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Se status på dina ordrar, hantera returer och ladda ner fakturor.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Senaste ordrar</h2>

          <div className="space-y-16 sm:space-y-24">
            {orders.map((order: any) => (
              <div key={order.node.id}>
                <h3 className="sr-only">
                  Order lagd{' '}
                  <time dateTime={order.node.processedAt}>
                    {new Date(order.node.processedAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </h3>

                <div className="bg-gray-50 px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                  <dl className="flex-auto divide-y divide-gray-200 text-sm text-gray-600 md:grid md:grid-cols-3 md:gap-x-6 md:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                    <div className="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0">
                      <dt className="font-medium text-gray-900">Ordernummer</dt>
                      <dd className="md:mt-1">#{order.node.orderNumber}</dd>
                    </div>
                    <div className="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0">
                      <dt className="font-medium text-gray-900">Orderdatum</dt>
                      <dd className="md:mt-1">
                        <time dateTime={order.node.processedAt}>
                          {new Date(order.node.processedAt).toLocaleDateString(
                            'sv-SE',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </time>
                      </dd>
                    </div>
                    <div className="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0">
                      <dt className="font-medium text-gray-900">Totalt</dt>
                      <dd className="font-medium text-gray-900 md:mt-1">
                        {order.node.currentTotalPrice.amount}{' '}
                        {order.node.currentTotalPrice.currencyCode}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-4 md:mt-0">
                    <Link
                      to={`/account/orders/${order.node.id}`}
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:w-auto"
                    >
                      Visa order
                      <span className="sr-only">#{order.node.orderNumber}</span>
                    </Link>
                    <Link
                      to={`/account/orders/${order.node.id}/invoice`}
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:w-auto"
                    >
                      Visa faktura
                      <span className="sr-only">
                        för order #{order.node.orderNumber}
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                  <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                    {order.node.lineItems.edges.map((lineItem: any) => (
                      <div key={lineItem.node.id} className="flex py-6 sm:py-10">
                        <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                          <div className="lg:flex-1">
                            <div className="sm:flex">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {lineItem.node.title}
                                </h4>
                                <p className="mt-2 hidden text-sm text-gray-500 sm:block">
                                  {lineItem.node.variant?.title}
                                </p>
                                {lineItem.node.variant?.selectedOptions?.map(
                                  (option: any) => (
                                    <p
                                      key={option.name}
                                      className="mt-1 text-sm text-gray-500"
                                    >
                                      {option.name}: {option.value}
                                    </p>
                                  ),
                                )}
                              </div>
                              <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                {lineItem.node.originalTotalPrice.amount}{' '}
                                {lineItem.node.originalTotalPrice.currencyCode}
                              </p>
                            </div>
                            <div className="mt-2 flex text-sm font-medium sm:mt-4">
                              <Link
                                to={`/products/${lineItem.node.variant?.product?.handle}`}
                                className="text-primary hover:text-primary/80"
                              >
                                Visa produkt
                              </Link>
                              <div className="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
                                <button
                                  type="button"
                                  className="text-primary hover:text-primary/80"
                                  onClick={() => {
                                    // Implementera "Köp igen" funktionalitet
                                  }}
                                >
                                  Köp igen
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 font-medium">
                            {order.node.fulfillmentStatus === 'FULFILLED' ? (
                              <div className="flex space-x-2">
                                <CheckIcon
                                  aria-hidden="true"
                                  className="h-6 w-6 flex-none text-green-500"
                                />
                                <p>
                                  Levererad
                                  <span className="hidden sm:inline">
                                    {' '}
                                    {order.node.fulfillments?.[0]?.deliveredAt && (
                                      <>
                                        den{' '}
                                        <time
                                          dateTime={
                                            order.node.fulfillments[0].deliveredAt
                                          }
                                        >
                                          {new Date(
                                            order.node.fulfillments[0].deliveredAt,
                                          ).toLocaleDateString('sv-SE')}
                                        </time>
                                      </>
                                    )}
                                  </span>
                                </p>
                              </div>
                            ) : order.node.fulfillmentStatus === 'IN_PROGRESS' ? (
                              <div className="flex space-x-2">
                                <TruckIcon
                                  aria-hidden="true"
                                  className="h-6 w-6 flex-none text-primary"
                                />
                                <p>Under leverans</p>
                              </div>
                            ) : order.node.canceledAt ? (
                              <div className="flex space-x-2">
                                <XMarkIcon
                                  aria-hidden="true"
                                  className="h-6 w-6 flex-none text-red-500"
                                />
                                <p className="text-gray-500">Avbruten</p>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <p>Behandlas</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 shrink-0 sm:order-first sm:m-0 sm:mr-6">
                          <img
                            src={
                              lineItem.node.variant?.image?.url ||
                              'placeholder-image-url.jpg'
                            }
                            alt={
                              lineItem.node.variant?.image?.altText ||
                              lineItem.node.title
                            }
                            className="col-start-2 col-end-3 h-20 w-20 rounded-lg object-cover sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
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
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
            fulfillments {
              deliveredAt
              trackingInfo {
                number
                url
              }
            }
            canceledAt
          }
        }
      }
    }
  }
`; 