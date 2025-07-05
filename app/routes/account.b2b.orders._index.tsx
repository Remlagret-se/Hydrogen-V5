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
  DocumentDuplicateIcon,
  DocumentArrowDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Företagsordrar | Remlagret'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  // Hämta företagets ordrar med detaljerad information
  const {data} = await context.storefront.query(B2B_ORDERS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  return json({
    orders: data?.company?.orders?.edges || [],
    company: data?.company,
  });
}

export default function B2BOrderHistory() {
  const {orders, company} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 sm:px-6 sm:py-24">
        <div className="px-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Företagsordrar
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Hantera företagets ordrar, fakturor och leveranser.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/account/b2b/orders/new"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Skapa ny order
              </Link>
              <Link
                to="/account/b2b/orders/recurring"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Återkommande ordrar
              </Link>
            </div>
          </div>

          {/* Statistik */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Ordrar denna månad
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {company.currentMonthOrders || 0}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Ordervolym (YTD)
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {company.ytdOrderVolume?.amount}{' '}
                {company.ytdOrderVolume?.currencyCode}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Aktiva leveranser
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {company.activeDeliveries || 0}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Kreditgräns använd
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {company.creditLimitUsedPercentage || 0}%
              </dd>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="space-y-16 sm:space-y-24">
            {orders.map((order: any) => (
              <div key={order.node.id}>
                <div className="bg-gray-50 px-4 py-6 sm:rounded-lg sm:p-6">
                  <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:space-x-8">
                    <div className="flex-1 md:grid md:grid-cols-4 md:gap-6">
                      <div className="sm:col-span-2">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Ordernummer
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              #{order.node.orderNumber}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Orderdatum
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <time dateTime={order.node.processedAt}>
                                {new Date(
                                  order.node.processedAt,
                                ).toLocaleDateString('sv-SE', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </time>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="mt-6 sm:col-span-2 sm:mt-0">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Referensnummer
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {order.node.referenceNumber || '-'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Totalt (ex. moms)
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-gray-900">
                              {order.node.subtotalPrice.amount}{' '}
                              {order.node.subtotalPrice.currencyCode}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4 md:mt-0">
                      <Link
                        to={`/account/b2b/orders/${order.node.id}`}
                        className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <DocumentDuplicateIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Visa order
                      </Link>
                      <Link
                        to={`/account/b2b/orders/${order.node.id}/invoice`}
                        className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <DocumentArrowDownIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Ladda ner faktura
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {order.node.fulfillmentStatus === 'FULFILLED' ? (
                          <>
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium text-green-700">
                              Levererad
                            </span>
                          </>
                        ) : order.node.fulfillmentStatus === 'IN_PROGRESS' ? (
                          <>
                            <TruckIcon className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              Under leverans
                            </span>
                          </>
                        ) : order.node.canceledAt ? (
                          <>
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium text-red-700">
                              Avbruten
                            </span>
                          </>
                        ) : (
                          <>
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              Behandlas
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Betalningsstatus:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            order.node.financialStatus === 'PAID'
                              ? 'text-green-700'
                              : order.node.financialStatus === 'PENDING'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}
                        >
                          {order.node.financialStatus === 'PAID'
                            ? 'Betald'
                            : order.node.financialStatus === 'PENDING'
                            ? 'Väntande'
                            : 'Obetald'}
                        </span>
                      </div>
                    </div>

                    {/* Leveransinformation */}
                    {order.node.fulfillments?.length > 0 && (
                      <div className="mt-4 rounded-md bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Leveransinformation
                            </h4>
                            <div className="mt-1">
                              {order.node.fulfillments.map(
                                (fulfillment: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="text-sm text-gray-500">
                                      Spårningsnummer:
                                    </span>
                                    <a
                                      href={
                                        fulfillment.trackingInfo?.[0]?.url || '#'
                                      }
                                      className="text-sm text-primary hover:text-primary/80"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {fulfillment.trackingInfo?.[0]?.number}
                                    </a>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                          {order.node.fulfillmentStatus === 'IN_PROGRESS' && (
                            <Link
                              to={`/account/b2b/orders/${order.node.id}/tracking`}
                              className="text-sm text-primary hover:text-primary/80"
                            >
                              Spåra leverans
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Produkter */}
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
                                <div className="mt-1 flex flex-col space-y-1 text-sm text-gray-500">
                                  {lineItem.node.variant?.selectedOptions?.map(
                                    (option: any) => (
                                      <div
                                        key={option.name}
                                        className="flex items-center space-x-1"
                                      >
                                        <span className="font-medium">
                                          {option.name}:
                                        </span>
                                        <span>{option.value}</span>
                                      </div>
                                    ),
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium">Antal:</span>
                                    <span>{lineItem.node.quantity}</span>
                                  </div>
                                  {lineItem.node.customAttributes?.map(
                                    (attr: any) => (
                                      <div
                                        key={attr.key}
                                        className="flex items-center space-x-1"
                                      >
                                        <span className="font-medium">
                                          {attr.key}:
                                        </span>
                                        <span>{attr.value}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                              <div className="mt-2 flex flex-col sm:mt-0 sm:ml-6">
                                <p className="font-medium text-gray-900">
                                  {lineItem.node.originalTotalPrice.amount}{' '}
                                  {lineItem.node.originalTotalPrice.currencyCode}
                                </p>
                                {lineItem.node.discountedTotalPrice && (
                                  <p className="mt-1 text-sm text-gray-500 line-through">
                                    {lineItem.node.originalTotalPrice.amount}{' '}
                                    {lineItem.node.originalTotalPrice.currencyCode}
                                  </p>
                                )}
                              </div>
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

const B2B_ORDERS_QUERY = `#graphql
  query B2BOrders($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
      id
      name
      currentMonthOrders
      ytdOrderVolume {
        amount
        currencyCode
      }
      activeDeliveries
      creditLimitUsedPercentage
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            referenceNumber
            processedAt
            financialStatus
            fulfillmentStatus
            subtotalPrice {
              amount
              currencyCode
            }
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
                  discountedTotalPrice {
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
                  customAttributes {
                    key
                    value
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