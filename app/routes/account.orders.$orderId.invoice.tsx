import {
  json,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Faktura | Remlagret'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(ORDER_INVOICE_QUERY, {
    variables: {
      orderId: params.orderId,
    },
  });

  if (!data?.order) {
    throw new Response('Order not found', {status: 404});
  }

  return json({order: data.order});
}

export default function OrderInvoice() {
  const {order} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center sm:space-x-4">
            <Link
              to={`/account/orders/${order.id}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Tillbaka till order
            </Link>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Skriv ut faktura
            </button>
          </div>
        </div>

        {/* Faktura */}
        <div className="mt-16">
          <div className="border-b border-gray-200 pb-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-base font-medium text-gray-900">
                  Faktura #{order.orderNumber}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Orderdatum:{' '}
                  {new Date(order.processedAt).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <img
                  src="/path-to-your-logo.png"
                  alt="Remlagret"
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Adresser */}
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                Fakturaadress
              </h2>
              <div className="mt-3 text-sm text-gray-500">
                <p>{order.billingAddress?.firstName} {order.billingAddress?.lastName}</p>
                <p>{order.billingAddress?.address1}</p>
                {order.billingAddress?.address2 && (
                  <p>{order.billingAddress.address2}</p>
                )}
                <p>{order.billingAddress?.zip} {order.billingAddress?.city}</p>
                <p>{order.billingAddress?.country}</p>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                Leveransadress
              </h2>
              <div className="mt-3 text-sm text-gray-500">
                <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                <p>{order.shippingAddress?.address1}</p>
                {order.shippingAddress?.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>{order.shippingAddress?.zip} {order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>
          </div>

          {/* Produkter */}
          <div className="mt-16">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 text-sm text-gray-900">
                <tr>
                  <th scope="col" className="py-3 pr-8 font-medium">
                    Produkt
                  </th>
                  <th scope="col" className="hidden py-3 pr-8 font-medium sm:table-cell">
                    Antal
                  </th>
                  <th scope="col" className="hidden py-3 pr-8 font-medium sm:table-cell">
                    Pris
                  </th>
                  <th scope="col" className="py-3 pr-8 font-medium text-right">
                    Totalt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-500">
                {order.lineItems.edges.map(({node: item}: any) => (
                  <tr key={item.id}>
                    <td className="py-6 pr-8">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={item.variant?.image?.url || 'placeholder-image-url.jpg'}
                            alt={item.variant?.image?.altText || item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="mt-1">{item.variant?.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">{item.quantity}</td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      {item.variant?.price?.amount} {item.variant?.price?.currencyCode}
                    </td>
                    <td className="py-6 pr-8 text-right font-medium text-gray-900">
                      {item.originalTotalPrice.amount} {item.originalTotalPrice.currencyCode}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200">
                <tr>
                  <th scope="row" className="hidden pt-6 text-right font-normal text-gray-500 sm:table-cell" colSpan={3}>
                    Delsumma
                  </th>
                  <th scope="row" className="pt-6 text-right font-normal text-gray-500 sm:hidden" colSpan={3}>
                    Delsumma
                  </th>
                  <td className="pt-6 text-right font-medium text-gray-900">
                    {order.subtotalPrice?.amount} {order.subtotalPrice?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="hidden pt-4 text-right font-normal text-gray-500 sm:table-cell" colSpan={3}>
                    Frakt
                  </th>
                  <th scope="row" className="pt-4 text-right font-normal text-gray-500 sm:hidden" colSpan={3}>
                    Frakt
                  </th>
                  <td className="pt-4 text-right font-medium text-gray-900">
                    {order.totalShippingPrice?.amount} {order.totalShippingPrice?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="hidden pt-4 text-right font-normal text-gray-500 sm:table-cell" colSpan={3}>
                    Moms
                  </th>
                  <th scope="row" className="pt-4 text-right font-normal text-gray-500 sm:hidden" colSpan={3}>
                    Moms
                  </th>
                  <td className="pt-4 text-right font-medium text-gray-900">
                    {order.totalTax?.amount} {order.totalTax?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell" colSpan={3}>
                    Totalt
                  </th>
                  <th scope="row" className="pt-4 text-right font-semibold text-gray-900 sm:hidden" colSpan={3}>
                    Totalt
                  </th>
                  <td className="pt-4 text-right font-semibold text-gray-900">
                    {order.totalPrice?.amount} {order.totalPrice?.currencyCode}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Betalningsinformation */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  Betalningsinformation
                </h2>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Status: {
                    order.financialStatus === 'PAID'
                      ? 'Betald'
                      : order.financialStatus === 'PENDING'
                      ? 'Väntande'
                      : 'Ej betald'
                  }</p>
                  {order.paymentGatewayNames?.map((gateway: string) => (
                    <p key={gateway}>{gateway}</p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  Leveransinformation
                </h2>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Status: {
                    order.fulfillmentStatus === 'FULFILLED'
                      ? 'Levererad'
                      : order.fulfillmentStatus === 'IN_PROGRESS'
                      ? 'Under leverans'
                      : 'Behandlas'
                  }</p>
                  {order.fulfillments?.map((fulfillment: any, index: number) => (
                    <div key={index} className="mt-2">
                      {fulfillment.trackingInfo?.map((tracking: any, idx: number) => (
                        <p key={idx}>
                          Spårningsnummer:{' '}
                          <a
                            href={tracking.url}
                            className="text-primary hover:text-primary/80"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {tracking.number}
                          </a>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ORDER_INVOICE_QUERY = `#graphql
  query OrderInvoice($orderId: ID!) {
    order(id: $orderId) {
      id
      name
      orderNumber
      processedAt
      fulfillmentStatus
      financialStatus
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
      email
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        zip
        country
      }
      billingAddress {
        firstName
        lastName
        address1
        address2
        city
        zip
        country
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
        trackingInfo {
          number
          url
        }
      }
      paymentGatewayNames
    }
  }
`; 