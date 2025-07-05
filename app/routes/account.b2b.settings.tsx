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
  return [{title: 'Företagsinställningar | Remlagret'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(COMPANY_SETTINGS_QUERY, {
    variables: {
      customerAccessToken: session.accessToken,
    },
  });

  return json({
    company: data.company,
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const form = await request.formData();
  const invoiceEmail = String(form.get('invoiceEmail'));
  const action = String(form.get('action'));

  try {
    if (action === 'updateInvoiceEmail') {
      // Uppdatera metafält för faktura-e-post
      await context.storefront.mutate(UPDATE_COMPANY_METAFIELD_MUTATION, {
        variables: {
          companyId: session.companyId,
          input: {
            namespace: 'custom',
            key: 'invoice_email',
            value: invoiceEmail,
            type: 'single_line_text_field',
          },
        },
      });

      return json({
        success: true,
        message: 'E-postadress för fakturor har uppdaterats',
      });
    }

    return json({error: 'Ogiltig åtgärd'}, {status: 400});
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {error: 'Något gick fel vid uppdateringen. Försök igen senare.'},
      {status: 500},
    );
  }
}

export default function CompanySettings() {
  const {company} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Hämta faktura-e-post från metafält
  const invoiceEmail = company.metafields?.find(
    (metafield: any) =>
      metafield.namespace === 'custom' && metafield.key === 'invoice_email',
  )?.value;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Företagsinställningar</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold mb-4">Fakturainställningar</h2>

          {/* Success message */}
          {actionData?.success && (
            <div className="mb-6 p-4 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">{actionData.message}</p>
            </div>
          )}

          {/* Error message */}
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{actionData.error}</p>
            </div>
          )}

          <Form method="post" className="space-y-4">
            <input type="hidden" name="action" value="updateInvoiceEmail" />
            
            <div>
              <label 
                htmlFor="invoiceEmail" 
                className="block text-sm font-medium text-gray-700"
              >
                E-postadress för fakturor
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Fakturor kommer att skickas automatiskt till denna e-postadress.
              </p>
              <div className="mt-2">
                <input
                  type="email"
                  name="invoiceEmail"
                  id="invoiceEmail"
                  defaultValue={invoiceEmail || ''}
                  className={getInputStyleClasses(actionData?.error)}
                  placeholder="faktura@företag.se"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Spara ändringar
              </button>
            </div>
          </Form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">
              Företagsinformation
            </h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Företagsnamn</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Organisationsnummer</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.registrationNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Momsregistreringsnummer</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.taxRegistrationNumber}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMPANY_SETTINGS_QUERY = `#graphql
  query CompanySettings($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
      id
      name
      registrationNumber
      taxRegistrationNumber
      metafields(
        identifiers: [{namespace: "custom", key: "invoice_email"}]
      ) {
        namespace
        key
        value
      }
    }
  }
`;

const UPDATE_COMPANY_METAFIELD_MUTATION = `#graphql
  mutation updateCompanyMetafield($companyId: ID!, $input: MetafieldInput!) {
    metafieldsSet(ownerId: $companyId, metafields: [$input]) {
      metafields {
        key
        namespace
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`; 