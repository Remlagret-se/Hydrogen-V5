import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, useActionData, useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getInputStyleClasses} from '~/lib/utils';
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Duplicera order | Remlagret'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(ORDER_DETAILS_QUERY, {
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

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const form = await request.formData();
  const action = String(form.get('action'));

  if (action === 'duplicateOrder') {
    try {
      const lineItems = JSON.parse(String(form.get('lineItems')));
      const referenceNumber = String(form.get('referenceNumber') || '');
      const purchaseOrder = String(form.get('purchaseOrder') || '');
      const shippingAddress = JSON.parse(String(form.get('shippingAddress')));
      const specialInstructions = String(form.get('specialInstructions') || '');

      // Skapa en ny cart med de valda produkterna
      const cartCreateResponse = await context.storefront.mutate(CREATE_CART_MUTATION, {
        variables: {
          input: {
            lines: lineItems.map((item: any) => ({
              quantity: item.quantity,
              merchandiseId: item.merchandiseId,
            })),
            buyerIdentity: {
              customerAccessToken: session.accessToken,
              email: session.email,
            },
          },
        },
      });

      if (!cartCreateResponse.cartCreate?.cart) {
        return json({error: 'Kunde inte skapa order'}, {status: 400});
      }

      // Uppdatera cart med företagsinformation
      const cartId = cartCreateResponse.cartCreate.cart.id;
      await context.storefront.mutate(UPDATE_CART_MUTATION, {
        variables: {
          cartId,
          attributes: [
            {key: 'referenceNumber', value: referenceNumber},
            {key: 'purchaseOrder', value: purchaseOrder},
            {key: 'specialInstructions', value: specialInstructions},
          ],
          deliveryAddress: {
            ...shippingAddress,
          },
        },
      });

      return redirect(`/cart?cartId=${cartId}`);
    } catch (error: any) {
      if (error?.message) {
        return json({error: error.message}, {status: 500});
      }
      return json(
        {error: 'Något gick fel vid duplicering av ordern. Försök igen senare.'},
        {status: 500},
      );
    }
  }

  return json({error: 'Ogiltig åtgärd'}, {status: 400});
}

export default function DuplicateOrder() {
  const {order, company} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(order.lineItems.edges.map((edge: any) => edge.node.id)),
  );

  const [useOriginalAddress, setUseOriginalAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Lägg till valda produkter
    const lineItems = order.lineItems.edges
      .filter((edge: any) => selectedItems.has(edge.node.id))
      .map((edge: any) => ({
        quantity: edge.node.quantity,
        merchandiseId: edge.node.variant.id,
      }));
    formData.set('lineItems', JSON.stringify(lineItems));

    // Lägg till leveransadress
    formData.set(
      'shippingAddress',
      JSON.stringify(useOriginalAddress ? order.shippingAddress : shippingAddress),
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href={`/account/b2b/orders/${order.id}`}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Tillbaka till order
          </a>
          <h1 className="text-2xl font-bold">Duplicera order #{order.orderNumber}</h1>
        </div>
      </div>

      {actionData?.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{actionData.error}</p>
        </div>
      )}

      <Form method="post" className="space-y-8" onSubmit={handleSubmit}>
        <input type="hidden" name="action" value="duplicateOrder" />

        {/* Produkter */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Välj produkter att inkludera</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {order.lineItems.edges.map(({node: item}: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={selectedItems.has(item.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedItems);
                      if (e.target.checked) {
                        newSelected.add(item.id);
                      } else {
                        newSelected.delete(item.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={item.id} className="flex-1">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img
                          src={item.variant?.image?.url || 'placeholder-image-url.jpg'}
                          alt={item.variant?.image?.altText || item.title}
                          className="h-full w-full rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.variant?.title}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Antal: {item.quantity} st
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orderinformation */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Orderinformation</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="referenceNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Referensnummer
              </label>
              <input
                type="text"
                name="referenceNumber"
                id="referenceNumber"
                className={getInputStyleClasses()}
                placeholder="Valfritt referensnummer"
              />
            </div>

            <div>
              <label
                htmlFor="purchaseOrder"
                className="block text-sm font-medium text-gray-700"
              >
                Inköpsordernummer
              </label>
              <input
                type="text"
                name="purchaseOrder"
                id="purchaseOrder"
                className={getInputStyleClasses()}
                placeholder="Valfritt inköpsordernummer"
              />
            </div>

            <div>
              <label
                htmlFor="specialInstructions"
                className="block text-sm font-medium text-gray-700"
              >
                Särskilda instruktioner
              </label>
              <textarea
                name="specialInstructions"
                id="specialInstructions"
                rows={3}
                className={getInputStyleClasses()}
                placeholder="T.ex. leveransinstruktioner eller andra noteringar"
              />
            </div>
          </div>
        </div>

        {/* Leveransadress */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Leveransadress</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="useOriginalAddress"
                name="addressChoice"
                checked={useOriginalAddress}
                onChange={() => setUseOriginalAddress(true)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="useOriginalAddress" className="text-sm">
                Använd samma leveransadress som originalordern
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="useNewAddress"
                name="addressChoice"
                checked={!useOriginalAddress}
                onChange={() => setUseOriginalAddress(false)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="useNewAddress" className="text-sm">
                Ange ny leveransadress
              </label>
            </div>

            {!useOriginalAddress && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Företag
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.company}
                      onChange={(e) =>
                        setShippingAddress({...shippingAddress, company: e.target.value})
                      }
                      className={getInputStyleClasses()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Attention
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        setShippingAddress({...shippingAddress, firstName: e.target.value})
                      }
                      className={getInputStyleClasses()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adress
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address1}
                    onChange={(e) =>
                      setShippingAddress({...shippingAddress, address1: e.target.value})
                    }
                    className={getInputStyleClasses()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adressrad 2 (valfritt)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address2 || ''}
                    onChange={(e) =>
                      setShippingAddress({...shippingAddress, address2: e.target.value})
                    }
                    className={getInputStyleClasses()}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postnummer
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) =>
                        setShippingAddress({...shippingAddress, zip: e.target.value})
                      }
                      className={getInputStyleClasses()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ort
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({...shippingAddress, city: e.target.value})
                      }
                      className={getInputStyleClasses()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <a
            href={`/account/b2b/orders/${order.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Avbryt
          </a>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            <DocumentDuplicateIcon className="mr-2 h-5 w-5" />
            Skapa ny order
          </button>
        </div>
      </Form>
    </div>
  );
}

const ORDER_DETAILS_QUERY = `#graphql
  query OrderDetails($orderId: ID!) {
    order(id: $orderId) {
      id
      orderNumber
      lineItems(first: 50) {
        edges {
          node {
            id
            title
            quantity
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
    }
    company {
      id
      name
    }
  }
`;

const CREATE_CART_MUTATION = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `#graphql
  mutation CartUpdate(
    $cartId: ID!
    $attributes: [AttributeInput!]
    $deliveryAddress: CartDeliveryAddressInput
  ) {
    cartUpdate(
      cartId: $cartId
      attributes: $attributes
      deliveryAddress: $deliveryAddress
    ) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`; 