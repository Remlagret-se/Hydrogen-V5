import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, useActionData, useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getInputStyleClasses} from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [{title: 'Redigera adress | Remlagret'}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();
  if (!session) {
    return redirect('/account/login');
  }

  const addressId = params.id;

  if (addressId === 'new') {
    return json({
      address: null,
      isNew: true,
    });
  }

  // Hämta adressen från Shopify
  const {data} = await context.storefront.query(GET_ADDRESS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
      addressId: decodeURIComponent(addressId),
    },
  });

  if (!data?.customer?.address) {
    return redirect('/account?tab=addresses');
  }

  return json({
    address: data.customer.address,
    isNew: false,
  });
}

export async function action({request, params, context}: ActionFunctionArgs) {
  const {session, customer} = await context.customerAccount.get();
  if (!session) {
    return redirect('/account/login');
  }

  const form = await request.formData();
  const addressId = params.id;
  const formData = {
    firstName: String(form.get('firstName')),
    lastName: String(form.get('lastName')),
    company: String(form.get('company')),
    address1: String(form.get('address1')),
    address2: String(form.get('address2')),
    city: String(form.get('city')),
    province: String(form.get('province')),
    zip: String(form.get('zip')),
    country: String(form.get('country')),
    phone: String(form.get('phone')),
  };

  const validationErrors: Record<string, string> = {};

  if (!formData.firstName) validationErrors.firstName = 'Förnamn krävs';
  if (!formData.lastName) validationErrors.lastName = 'Efternamn krävs';
  if (!formData.address1) validationErrors.address1 = 'Adress krävs';
  if (!formData.city) validationErrors.city = 'Stad krävs';
  if (!formData.zip) validationErrors.zip = 'Postnummer krävs';
  if (!formData.country) validationErrors.country = 'Land krävs';

  if (Object.keys(validationErrors).length > 0) {
    return json({errors: validationErrors}, {status: 400});
  }

  try {
    if (addressId === 'new') {
      // Skapa ny adress
      await context.storefront.mutate(CREATE_ADDRESS_MUTATION, {
        variables: {
          customerAccessToken: session.accessToken,
          address: formData,
        },
      });
    } else {
      // Uppdatera befintlig adress
      await context.storefront.mutate(UPDATE_ADDRESS_MUTATION, {
        variables: {
          customerAccessToken: session.accessToken,
          id: decodeURIComponent(addressId),
          address: formData,
        },
      });
    }

    return redirect('/account?tab=addresses');
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {error: 'Ett fel uppstod när adressen skulle sparas.'},
      {status: 500},
    );
  }
}

export default function EditAddress() {
  const {address, isNew} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Lägg till adress' : 'Redigera adress'}
      </h1>

      {actionData?.error && (
        <div className="mb-6 bg-red-100 rounded p-4">
          <p className="text-sm text-red-900">{actionData.error}</p>
        </div>
      )}

      <Form method="post" noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="firstName">
              Förnamn
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={address?.firstName || ''}
              className={getInputStyleClasses(actionData?.errors?.firstName)}
              aria-label="Förnamn"
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
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={address?.lastName || ''}
              className={getInputStyleClasses(actionData?.errors?.lastName)}
              aria-label="Efternamn"
              required
            />
            {actionData?.errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {actionData.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="company">
            Företag (valfritt)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={address?.company || ''}
            className={getInputStyleClasses()}
            aria-label="Företag"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="address1">
            Adress
          </label>
          <input
            id="address1"
            name="address1"
            type="text"
            defaultValue={address?.address1 || ''}
            className={getInputStyleClasses(actionData?.errors?.address1)}
            aria-label="Adress"
            required
          />
          {actionData?.errors?.address1 && (
            <p className="text-red-500 text-xs mt-1">
              {actionData.errors.address1}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="address2">
            Lägenhet, svit, etc. (valfritt)
          </label>
          <input
            id="address2"
            name="address2"
            type="text"
            defaultValue={address?.address2 || ''}
            className={getInputStyleClasses()}
            aria-label="Lägenhet, svit, etc."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="city">
              Stad
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={address?.city || ''}
              className={getInputStyleClasses(actionData?.errors?.city)}
              aria-label="Stad"
              required
            />
            {actionData?.errors?.city && (
              <p className="text-red-500 text-xs mt-1">{actionData.errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="province">
              Län (valfritt)
            </label>
            <input
              id="province"
              name="province"
              type="text"
              defaultValue={address?.province || ''}
              className={getInputStyleClasses()}
              aria-label="Län"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="zip">
              Postnummer
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              defaultValue={address?.zip || ''}
              className={getInputStyleClasses(actionData?.errors?.zip)}
              aria-label="Postnummer"
              required
            />
            {actionData?.errors?.zip && (
              <p className="text-red-500 text-xs mt-1">{actionData.errors.zip}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="country">
              Land
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={address?.country || ''}
              className={getInputStyleClasses(actionData?.errors?.country)}
              aria-label="Land"
              required
            />
            {actionData?.errors?.country && (
              <p className="text-red-500 text-xs mt-1">
                {actionData.errors.country}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="phone">
            Telefon (valfritt)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={address?.phone || ''}
            className={getInputStyleClasses()}
            aria-label="Telefon"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded hover:opacity-90"
          >
            {isNew ? 'Lägg till' : 'Spara ändringar'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
          >
            Avbryt
          </button>
        </div>
      </Form>
    </div>
  );
}

const GET_ADDRESS_QUERY = `#graphql
  query GetAddress($customerAccessToken: String!, $addressId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      address(id: $addressId) {
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
`;

const CREATE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`; 