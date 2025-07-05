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
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Företagsorder | Remlagret'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(B2B_ORDER_DETAILS_QUERY, {
    variables: {
      orderId: params.orderId,
    },
  });

  if (!data?.order) {
    throw new Response('Order not found', {status: 404});
  }

  return json({
    order: data.order,
    company: data.company,
  });
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

export default function B2BOrderDetails() {
  const {order, company} = useLoaderData<typeof loader>();

  const orderStep = getOrderStep(order.fulfillmentStatus);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl pt-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order #{order.orderNumber}
            </h1>
            <div className="hidden sm:flex sm:space-x-4">
              <Link
                to={`/account/b2b/orders/${order.id}/invoice`}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                <DocumentArrowDownIcon className="mr-2 inline-block h-5 w-5" />
                Ladda ner faktura
              </Link>
              <Link
                to={`/account/b2b/orders/${order.id}/duplicate`}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                <DocumentDuplicateIcon className="mr-2 inline-block h-5 w-5" />
                Duplicera order
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Order lagd{' '}
            <time dateTime={order.processedAt} className="font-medium text-gray-900">
              {new Date(order.processedAt).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </p>
        </div>

        {/* Företagsinformation */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {company.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Org.nr: {company.registrationNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Referensnummer: {order.referenceNumber || '-'}
              </p>
              <p className="text-sm text-gray-500">
                Inköpsorder: {order.purchaseOrder || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Produkter */}
        <div className="mt-8">
          <h2 className="sr-only">Köpta produkter</h2>

          <div className="space-y-8">
            {order.lineItems.edges.map(({node: lineItem}: any) => (
              <div
                key={lineItem.id}
                className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
              >
                <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                  <div className="sm:flex lg:col-span-7">
                    <div className="aspect-square w-full shrink-0 rounded-lg sm:size-40">
                      <img
                        src={lineItem.variant?.image?.url || 'placeholder-image-url.jpg'}
                        alt={lineItem.variant?.image?.altText || lineItem.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>

                    <div className="mt-6 sm:mt-0 sm:ml-6">
                      <h3 className="text-base font-medium text-gray-900">
                        <Link
                          to={`/products/${lineItem.variant?.product?.handle}`}
                          className="hover:text-primary/80"
                        >
                          {lineItem.title}
                        </Link>
                      </h3>
                      <div className="mt-2 flex items-center space-x-4">
                        <p className="text-sm font-medium text-gray-900">
                          {lineItem.variant?.price?.amount}{' '}
                          {lineItem.variant?.price?.currencyCode} / st
                        </p>
                        <p className="text-sm text-gray-500">
                          Antal: {lineItem.quantity} st
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        {lineItem.variant?.title}
                      </p>
                      {lineItem.variant?.selectedOptions?.map((option: any) => (
                        <p key={option.name} className="mt-1 text-sm text-gray-500">
                          {option.name}: {option.value}
                        </p>
                      ))}
                      {/* B2B-specifika fält */}
                      {lineItem.customAttributes?.map((attr: any) => (
                        <p key={attr.key} className="mt-1 text-sm text-gray-500">
                          {attr.key}: {attr.value}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 lg:col-span-5 lg:mt-0">
                    <dl className="grid grid-cols-2 gap-x-6 text-sm">
                      <div>
                        <dt className="font-medium text-gray-900">Leveransadress</dt>
                        <dd className="mt-3 text-gray-500">
                          <p className="font-medium">{order.shippingAddress?.company}</p>
                          <p>Att: {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                          <p>{order.shippingAddress?.address1}</p>
                          {order.shippingAddress?.address2 && (
                            <p>{order.shippingAddress.address2}</p>
                          )}
                          <p>
                            {order.shippingAddress?.zip} {order.shippingAddress?.city}
                          </p>
                          <p>{order.shippingAddress?.country}</p>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">Leveransvillkor</dt>
                        <dd className="mt-3 space-y-3 text-gray-500">
                          <p>Leveranssätt: {order.shippingMethod}</p>
                          <p>Leveranstid: {order.estimatedDeliveryDate}</p>
                          {order.specialInstructions && (
                            <p>Notering: {order.specialInstructions}</p>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
                  <h4 className="sr-only">Status</h4>
                  <p className="text-sm font-medium text-gray-900">
                    {order.fulfillmentStatus === 'FULFILLED'
                      ? 'Levererad'
                      : order.fulfillmentStatus === 'IN_PROGRESS'
                      ? 'Under leverans'
                      : order.fulfillmentStatus === 'UNFULFILLED'
                      ? 'Behandlas'
                      : 'Avbruten'}{' '}
                    {order.fulfillments?.[0]?.deliveredAt && (
                      <time dateTime={order.fulfillments[0].deliveredAt}>
                        {new Date(order.fulfillments[0].deliveredAt).toLocaleDateString(
                          'sv-SE',
                        )}
                      </time>
                    )}
                  </p>
                  <div aria-hidden="true" className="mt-6">
                    <div className="overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${
                          order.canceledAt ? 'bg-red-600' : 'bg-primary'
                        }`}
                        style={{
                          width: `calc((${orderStep} * 2 + 1) / 8 * 100%)`,
                        }}
                      />
                    </div>
                    <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                      <div className="text-primary">Order mottagen</div>
                      <div
                        className={classNames(
                          orderStep > 0 ? 'text-primary' : '',
                          'text-center',
                        )}
                      >
                        Behandlas
                      </div>
                      <div
                        className={classNames(
                          orderStep > 1 ? 'text-primary' : '',
                          'text-center',
                        )}
                      >
                        Skickad
                      </div>
                      <div
                        className={classNames(
                          orderStep > 2 ? 'text-primary' : '',
                          'text-right',
                        )}
                      >
                        Levererad
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fakturering */}
        <div className="mt-16">
          <h2 className="sr-only">Faktureringsinformation</h2>

          <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
              <div>
                <dt className="font-medium text-gray-900">Faktureringsadress</dt>
                <dd className="mt-3 text-gray-500">
                  <p className="font-medium">{order.billingAddress?.company}</p>
                  <p>Att: {order.billingAddress?.firstName} {order.billingAddress?.lastName}</p>
                  <p>{order.billingAddress?.address1}</p>
                  {order.billingAddress?.address2 && (
                    <p>{order.billingAddress.address2}</p>
                  )}
                  <p>
                    {order.billingAddress?.zip} {order.billingAddress?.city}
                  </p>
                  <p>{order.billingAddress?.country}</p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Betalningsinformation</dt>
                <dd className="mt-3 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <p>
                      {order.financialStatus === 'PAID'
                        ? 'Betald'
                        : order.financialStatus === 'PENDING'
                        ? 'Väntande'
                        : 'Ej betald'}
                    </p>
                  </div>
                  <p className="mt-2">Betalningsvillkor: {order.paymentTerms || '30 dagar'}</p>
                  <p className="mt-1">Förfallodatum: {order.dueDate}</p>
                  {order.paymentGatewayNames?.map((gateway: string) => (
                    <p key={gateway} className="mt-1">
                      {gateway}
                    </p>
                  ))}
                </dd>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-gray-600">Delsumma</dt>
                <dd className="font-medium text-gray-900">
                  {order.subtotalPrice?.amount} {order.subtotalPrice?.currencyCode}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Frakt</dt>
                <dd className="font-medium text-gray-900">
                  {order.totalShippingPrice?.amount}{' '}
                  {order.totalShippingPrice?.currencyCode}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Moms (25%)</dt>
                <dd className="font-medium text-gray-900">
                  {order.totalTax?.amount} {order.totalTax?.currencyCode}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-gray-900">Totalt</dt>
                <dd className="font-medium text-primary">
                  {order.totalPrice?.amount} {order.totalPrice?.currencyCode}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Mobila knappar */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white p-4 sm:hidden">
          <Link
            to={`/account/b2b/orders/${order.id}/invoice`}
            className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
            Ladda ner faktura
          </Link>
          <Link
            to={`/account/b2b/orders/${order.id}/duplicate`}
            className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            <DocumentDuplicateIcon className="mr-2 h-5 w-5" />
            Duplicera order
          </Link>
        </div>
      </div>
    </div>
  );
}

const B2B_ORDER_DETAILS_QUERY = `#graphql
  query B2BOrderDetails($orderId: ID!) {
    order(id: $orderId) {
      id
      name
      orderNumber
      referenceNumber
      purchaseOrder
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
      phone
      shippingAddress {
        company
        firstName
        lastName
        address1
        address2
        city
        zip
        country
      }
      billingAddress {
        company
        firstName
        lastName
        address1
        address2
        city
        zip
        country
      }
      shippingMethod
      estimatedDeliveryDate
      specialInstructions
      paymentTerms
      dueDate
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
      paymentGatewayNames
      canceledAt
    }
    company {
      id
      name
      registrationNumber
    }
  }
`; 