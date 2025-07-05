import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getInputStyleClasses} from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [{title: 'Mitt konto | Remlagret'}];
};

// Loader för att hämta kundinformation
export async function loader({context}: LoaderFunctionArgs) {
  const {session, customer} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  // Hämta kundens ordrar
  const orders = await context.storefront.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  // Hämta kundens adresser
  const addresses = await context.storefront.query(CUSTOMER_ADDRESSES_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  return json({
    customer,
    orders: orders.customer?.orders.edges || [],
    addresses: addresses.customer?.addresses.edges || [],
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = await context.customerAccount.get();
  if (!session) {
    return redirect('/account/login');
  }

  const form = await request.formData();
  const action = form.get('action');

  if (action === 'logout') {
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await session.destroy(),
      },
    });
  }

  if (action === 'updateProfile') {
    const formData = {
      firstName: String(form.get('firstName')),
      lastName: String(form.get('lastName')),
      email: String(form.get('email')),
      phone: String(form.get('phone')),
      acceptsMarketing: Boolean(form.get('acceptsMarketing')),
    };

    const validationErrors: Record<string, string> = {};

    if (!formData.firstName) validationErrors.firstName = 'Förnamn krävs';
    if (!formData.lastName) validationErrors.lastName = 'Efternamn krävs';
    if (!formData.email || !formData.email.includes('@')) {
      validationErrors.email = 'Vänligen ange en giltig e-postadress';
    }

    if (Object.keys(validationErrors).length > 0) {
      return json({errors: validationErrors}, {status: 400});
    }

    try {
      // Uppdatera kundprofilen
      await context.storefront.mutate(UPDATE_CUSTOMER_MUTATION, {
        variables: {
          customerAccessToken: session.accessToken,
          customer: formData,
        },
      });

      return json({success: true});
    } catch (error: any) {
      if (error?.message) {
        return json({error: error.message}, {status: 500});
      }
      return json(
        {error: 'Ett fel uppstod när profilen skulle uppdateras.'},
        {status: 500},
      );
    }
  }

  return json({error: 'Ogiltig åtgärd'}, {status: 400});
}

export default function AccountPage() {
  const {customer, orders, addresses} = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('overview');
  const actionData = useLoaderData<typeof action>();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidopanel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Mitt konto</h2>
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Översikt
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === 'orders'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Ordrar
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === 'addresses'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Adresser
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === 'settings'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Inställningar
            </button>
            <Form method="post">
              <input type="hidden" name="action" value="logout" />
              <button
                type="submit"
                className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50"
              >
                Logga ut
              </button>
            </Form>
          </nav>
        </div>

        {/* Huvudinnehåll */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
          {/* Översikt */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">
                Välkommen {customer.firstName}!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Senaste order</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-2">
                      {orders.slice(0, 3).map((order: any) => (
                        <div
                          key={order.node.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">#{order.node.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.node.processedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Link
                            to={`/account/orders/${order.node.id}`}
                            className="text-primary hover:text-primary/80"
                          >
                            Visa
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Inga ordrar än</p>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Standardadress</h3>
                  {addresses.length > 0 ? (
                    <div>
                      <p>{addresses[0].node.firstName} {addresses[0].node.lastName}</p>
                      <p>{addresses[0].node.address1}</p>
                      <p>{addresses[0].node.zip} {addresses[0].node.city}</p>
                      <p>{addresses[0].node.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Ingen adress tillagd</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ordrar */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mina ordrar</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order.node.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #{order.node.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.node.processedAt).toLocaleDateString()}
                          </p>
                          <p className="mt-2">
                            Status:{' '}
                            <span className="font-medium">
                              {order.node.fulfillmentStatus}
                            </span>
                          </p>
                        </div>
                        <Link
                          to={`/account/orders/${order.node.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          Visa detaljer
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Du har inga ordrar än</p>
              )}
            </div>
          )}

          {/* Adresser */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mina adresser</h2>
                <Link
                  to="/account/addresses/new"
                  className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Lägg till adress
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address: any) => (
                  <div
                    key={address.node.id}
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="mb-4">
                      <p>
                        {address.node.firstName} {address.node.lastName}
                      </p>
                      <p>{address.node.address1}</p>
                      {address.node.address2 && <p>{address.node.address2}</p>}
                      <p>
                        {address.node.zip} {address.node.city}
                      </p>
                      <p>{address.node.country}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/account/addresses/${address.node.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Redigera
                      </Link>
                      <Form method="delete" action={`/account/addresses/${address.node.id}`}>
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Ta bort
                        </button>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inställningar */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Kontoinställningar</h2>
              {actionData?.success && (
                <div className="mb-6 bg-green-100 rounded p-4">
                  <p className="text-sm text-green-700">
                    Dina uppgifter har uppdaterats.
                  </p>
                </div>
              )}
              {actionData?.error && (
                <div className="mb-6 bg-red-100 rounded p-4">
                  <p className="text-sm text-red-900">{actionData.error}</p>
                </div>
              )}
              <Form method="post" className="space-y-4">
                <input type="hidden" name="action" value="updateProfile" />
                <div>
                  <label className="block text-sm font-medium" htmlFor="firstName">
                    Förnamn
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={customer.firstName}
                    className={getInputStyleClasses(actionData?.errors?.firstName)}
                    required
                  />
                  {actionData?.errors?.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {actionData.errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="lastName">
                    Efternamn
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={customer.lastName}
                    className={getInputStyleClasses(actionData?.errors?.lastName)}
                    required
                  />
                  {actionData?.errors?.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {actionData.errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="email">
                    E-post
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={customer.email}
                    className={getInputStyleClasses(actionData?.errors?.email)}
                    required
                  />
                  {actionData?.errors?.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {actionData.errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="phone">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={customer.phone || ''}
                    className={getInputStyleClasses()}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptsMarketing"
                    name="acceptsMarketing"
                    defaultChecked={customer.acceptsMarketing}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="acceptsMarketing"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Ja, jag vill ta emot erbjudanden och nyheter via e-post
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded hover:opacity-90"
                  >
                    Spara ändringar
                  </button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// GraphQL-queries för kundinformation
const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 10) {
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
          }
        }
      }
    }
  }
`;

const CUSTOMER_ADDRESSES_QUERY = `#graphql
  query CustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
      }
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `#graphql
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`; 
