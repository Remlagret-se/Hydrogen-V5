import {
  json,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  ArrowLeftIcon,
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Leveransspårning | Remlagret'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(ORDER_TRACKING_QUERY, {
    variables: {
      orderId: params.orderId,
    },
  });

  if (!data?.order) {
    throw new Response('Order not found', {status: 404});
  }

  return json({
    order: data.order,
  });
}

function getTrackingStatus(fulfillment: any) {
  if (fulfillment.deliveredAt) {
    return {
      status: 'delivered',
      label: 'Levererad',
      date: new Date(fulfillment.deliveredAt),
    };
  }

  if (fulfillment.inTransitAt) {
    return {
      status: 'in_transit',
      label: 'Under transport',
      date: new Date(fulfillment.inTransitAt),
    };
  }

  if (fulfillment.estimatedDeliveryAt) {
    return {
      status: 'processing',
      label: 'Behandlas',
      date: new Date(fulfillment.estimatedDeliveryAt),
    };
  }

  return {
    status: 'pending',
    label: 'Väntar på leverans',
    date: null,
  };
}

export default function OrderTracking() {
  const {order} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/account/b2b/orders/${order.id}`}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Tillbaka till order
          </Link>
          <h1 className="text-2xl font-bold">
            Leveransspårning - Order #{order.orderNumber}
          </h1>
        </div>
      </div>

      {/* Leveransinformation */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Leveransinformation</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Leveransadress</h3>
              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium">{order.shippingAddress?.company}</p>
                <p>Att: {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                <p>{order.shippingAddress?.address1}</p>
                {order.shippingAddress?.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>{order.shippingAddress?.zip} {order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Leveransdetaljer</h3>
              <div className="mt-3 text-sm text-gray-500">
                <p>Leveranssätt: {order.shippingLine?.title || 'Standard'}</p>
                {order.estimatedDeliveryAt && (
                  <p className="mt-1">
                    Beräknad leverans:{' '}
                    {new Date(order.estimatedDeliveryAt).toLocaleDateString('sv-SE')}
                  </p>
                )}
                {order.fulfillments?.[0]?.trackingInfo?.[0] && (
                  <p className="mt-1">
                    Spårningsnummer:{' '}
                    <a
                      href={order.fulfillments[0].trackingInfo[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      {order.fulfillments[0].trackingInfo[0].number}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leveransstatus */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Leveransstatus</h2>
        </div>
        <div className="px-6 py-4">
          {order.fulfillments?.map((fulfillment: any, index: number) => {
            const status = getTrackingStatus(fulfillment);
            return (
              <div key={index} className="space-y-8">
                {/* Status timeline */}
                <div className="relative">
                  <div
                    className="absolute left-4 h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                  <div className="relative space-y-8">
                    {/* Levererad */}
                    <div className="flex items-center">
                      <div
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                          status.status === 'delivered'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <CheckCircleIcon
                          className={`h-5 w-5 ${
                            status.status === 'delivered'
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Levererad
                        </h3>
                        {status.status === 'delivered' && status.date && (
                          <p className="text-sm text-gray-500">
                            {status.date.toLocaleDateString('sv-SE')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Under transport */}
                    <div className="flex items-center">
                      <div
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                          status.status === 'in_transit'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <TruckIcon
                          className={`h-5 w-5 ${
                            status.status === 'in_transit'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Under transport
                        </h3>
                        {status.status === 'in_transit' && status.date && (
                          <p className="text-sm text-gray-500">
                            {status.date.toLocaleDateString('sv-SE')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Behandlas */}
                    <div className="flex items-center">
                      <div
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                          status.status === 'processing'
                            ? 'bg-yellow-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <ClockIcon
                          className={`h-5 w-5 ${
                            status.status === 'processing'
                              ? 'text-yellow-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Behandlas
                        </h3>
                        {status.status === 'processing' && status.date && (
                          <p className="text-sm text-gray-500">
                            {status.date.toLocaleDateString('sv-SE')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order mottagen */}
                    <div className="flex items-center">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Order mottagen
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.processedAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leveransuppdateringar */}
                {fulfillment.trackingInfo?.[0]?.events?.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="text-sm font-medium text-gray-900">
                      Leveransuppdateringar
                    </h3>
                    <div className="mt-4 space-y-4">
                      {fulfillment.trackingInfo[0].events.map((event: any, eventIndex: number) => (
                        <div key={eventIndex} className="flex space-x-4">
                          <div className="flex-none">
                            <div className="h-2 w-2 mt-2 rounded-full bg-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {event.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString('sv-SE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {event.location && (
                              <p className="mt-1 text-sm text-gray-500">
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ORDER_TRACKING_QUERY = `#graphql
  query OrderTracking($orderId: ID!) {
    order(id: $orderId) {
      id
      orderNumber
      processedAt
      estimatedDeliveryAt
      shippingLine {
        title
      }
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
      fulfillments {
        deliveredAt
        inTransitAt
        estimatedDeliveryAt
        trackingInfo {
          number
          url
          events {
            status
            timestamp
            location
          }
        }
      }
    }
  }
`; 