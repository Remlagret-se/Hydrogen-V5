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
  return [{title: 'Företagskonto | Remlagret'}];
};

// Loader för att hämta företagsinformation
export async function loader({context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  // Hämta företagsinformation och B2B-specifik data
  const {data} = await context.storefront.query(B2B_COMPANY_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  // Hämta företagets ordrar
  const orders = await context.storefront.query(B2B_ORDERS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  // Hämta företagets leveransadresser
  const addresses = await context.storefront.query(B2B_ADDRESSES_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  return json({
    company: data.company,
    orders: orders.company?.orders.edges || [],
    addresses: addresses.company?.locations.edges || [],
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

  return json({error: 'Ogiltig åtgärd'}, {status: 400});
}

export default function B2BAccountPage() {
  const {company, orders, addresses} = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidopanel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Företagskonto</h2>
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
                activeTab === 'locations'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('locations')}
            >
              Leveransadresser
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Användare
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
                Välkommen {company.name}!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Företagsinformation */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Företagsinformation</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Organisationsnummer:</span>{' '}
                      {company.registrationNumber}
                    </p>
                    <p>
                      <span className="font-medium">Momsregistreringsnummer:</span>{' '}
                      {company.taxRegistrationNumber}
                    </p>
                    <p>
                      <span className="font-medium">Kreditgräns:</span>{' '}
                      {company.creditLimit?.amount}{' '}
                      {company.creditLimit?.currencyCode}
                    </p>
                  </div>
                </div>

                {/* Senaste ordrar */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Senaste ordrar</h3>
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
                            to={`/account/b2b/orders/${order.node.id}`}
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
              </div>

              {/* Statistik */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-500">Total ordervolym</h4>
                  <p className="text-2xl font-bold mt-2">
                    {company.totalOrders?.amount} {company.totalOrders?.currencyCode}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-500">Aktiva användare</h4>
                  <p className="text-2xl font-bold mt-2">
                    {company.users?.totalCount || 0}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-500">Leveransadresser</h4>
                  <p className="text-2xl font-bold mt-2">
                    {company.locations?.totalCount || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ordrar */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Företagsordrar</h2>
                <Link
                  to="/account/b2b/orders/new"
                  className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Ny order
                </Link>
              </div>
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
                          <div className="mt-2 space-y-1">
                            <p>
                              Status:{' '}
                              <span className="font-medium">
                                {order.node.fulfillmentStatus}
                              </span>
                            </p>
                            <p>
                              Betalning:{' '}
                              <span className="font-medium">
                                {order.node.financialStatus}
                              </span>
                            </p>
                            <p>
                              Total:{' '}
                              <span className="font-medium">
                                {order.node.totalPrice.amount}{' '}
                                {order.node.totalPrice.currencyCode}
                              </span>
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/account/b2b/orders/${order.node.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          Visa detaljer
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Inga ordrar än</p>
              )}
            </div>
          )}

          {/* Leveransadresser */}
          {activeTab === 'locations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Leveransadresser</h2>
                <Link
                  to="/account/b2b/locations/new"
                  className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Lägg till adress
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((location: any) => (
                  <div
                    key={location.node.id}
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="mb-4">
                      <p className="font-medium">{location.node.name}</p>
                      <p>{location.node.address.company}</p>
                      <p>{location.node.address.address1}</p>
                      {location.node.address.address2 && (
                        <p>{location.node.address.address2}</p>
                      )}
                      <p>
                        {location.node.address.zip} {location.node.address.city}
                      </p>
                      <p>{location.node.address.country}</p>
                      {location.node.phone && <p>Tel: {location.node.phone}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/account/b2b/locations/${location.node.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Redigera
                      </Link>
                      <Form
                        method="delete"
                        action={`/account/b2b/locations/${location.node.id}`}
                      >
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

          {/* Användare */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Företagsanvändare</h2>
                <Link
                  to="/account/b2b/users/new"
                  className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Lägg till användare
                </Link>
              </div>
              {company.users?.edges.length > 0 ? (
                <div className="space-y-4">
                  {company.users.edges.map((user: any) => (
                    <div
                      key={user.node.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {user.node.firstName} {user.node.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.node.email}
                          </p>
                          <p className="mt-2">
                            Roll:{' '}
                            <span className="font-medium">
                              {user.node.role}
                            </span>
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/account/b2b/users/${user.node.id}`}
                            className="text-primary hover:text-primary/80"
                          >
                            Redigera
                          </Link>
                          {user.node.role !== 'OWNER' && (
                            <Form
                              method="delete"
                              action={`/account/b2b/users/${user.node.id}`}
                            >
                              <button
                                type="submit"
                                className="text-red-600 hover:text-red-800"
                              >
                                Ta bort
                              </button>
                            </Form>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Inga användare tillagda</p>
              )}
            </div>
          )}

          {/* Inställningar */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Företagsinställningar</h2>
              <Form method="post" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium" htmlFor="companyName">
                    Företagsnamn
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    defaultValue={company.name}
                    className={getInputStyleClasses()}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="registrationNumber"
                  >
                    Organisationsnummer
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    defaultValue={company.registrationNumber}
                    className={getInputStyleClasses()}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="taxRegistrationNumber"
                  >
                    Momsregistreringsnummer
                  </label>
                  <input
                    type="text"
                    id="taxRegistrationNumber"
                    name="taxRegistrationNumber"
                    defaultValue={company.taxRegistrationNumber}
                    className={getInputStyleClasses()}
                  />
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

// GraphQL-queries för företagsinformation
const B2B_COMPANY_QUERY = `#graphql
  query B2BCompany($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
      id
      name
      registrationNumber
      taxRegistrationNumber
      creditLimit {
        amount
        currencyCode
      }
      totalOrders {
        amount
        currencyCode
      }
      users {
        totalCount
        edges {
          node {
            id
            firstName
            lastName
            email
            role
          }
        }
      }
      locations {
        totalCount
      }
    }
  }
`;

const B2B_ORDERS_QUERY = `#graphql
  query B2BOrders($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const B2B_ADDRESSES_QUERY = `#graphql
  query B2BAddresses($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
      locations(first: 10) {
        edges {
          node {
            id
            name
            address {
              company
              address1
              address2
              city
              province
              zip
              country
            }
            phone
          }
        }
      }
    }
  }
`; 