import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{title: 'Företagsfaktura | Remlagret'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const {data} = await context.storefront.query(B2B_ORDER_INVOICE_QUERY, {
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

export async function action({request, context, params}: ActionFunctionArgs) {
  const {session} = await context.customerAccount.get();

  if (!session) {
    return redirect('/account/login');
  }

  const form = await request.formData();
  const action = String(form.get('action'));

  try {
    if (action === 'sendInvoice') {
      // Hämta företagets faktura-e-post från metafält
      const {data} = await context.storefront.query(COMPANY_INVOICE_EMAIL_QUERY, {
        variables: {
          customerAccessToken: session.accessToken,
        },
      });

      const invoiceEmail = data.company?.metafields?.find(
        (metafield: any) =>
          metafield.namespace === 'custom' && metafield.key === 'invoice_email',
      )?.value;

      if (!invoiceEmail) {
        return json(
          {
            error: 'Ingen e-postadress för fakturor är inställd. Vänligen ställ in en e-postadress i företagsinställningarna.',
          },
          {status: 400},
        );
      }

      // Här skulle vi implementera faktisk e-postfunktionalitet
      // Detta är en placeholder för demonstration
      console.log(`Sending invoice to ${invoiceEmail}`);

      return json({
        success: true,
        message: `Faktura skickad till ${invoiceEmail}`,
      });
    }

    return json({error: 'Ogiltig åtgärd'}, {status: 400});
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {error: 'Något gick fel. Försök igen senare.'},
      {status: 500},
    );
  }
}

export default function B2BOrderInvoice() {
  const {order, company} = useLoaderData<typeof loader>();

  // Beräkna förfallodatum baserat på betalningsvillkor
  const dueDate = new Date(order.processedAt);
  const paymentTermsDays = parseInt(order.paymentTerms?.split(' ')[0] || '30', 10);
  dueDate.setDate(dueDate.getDate() + paymentTermsDays);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center sm:space-x-4">
            <Link
              to={`/account/b2b/orders/${order.id}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Tillbaka till order
            </Link>
          </div>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
              Ladda ner PDF
            </button>
            <button
              type="button"
              onClick={() => {
                const form = new FormData();
                form.append('action', 'sendInvoice');
                submit(form, {method: 'post'});
              }}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
            >
              <EnvelopeIcon className="mr-2 h-5 w-5" />
              Skicka via e-post
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
                  Fakturadatum:{' '}
                  {new Date(order.processedAt).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Förfallodatum:{' '}
                  {dueDate.toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Referensnummer: {order.referenceNumber || '-'}
                </p>
                {order.purchaseOrder && (
                  <p className="mt-1 text-sm text-gray-500">
                    Inköpsordernummer: {order.purchaseOrder}
                  </p>
                )}
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

          {/* Företagsinformation */}
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-gray-900">Faktureras till</h2>
              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium">{company.name}</p>
                <p>Org.nr: {company.registrationNumber}</p>
                <p>VAT-nr: {company.taxRegistrationNumber}</p>
                <p>{order.billingAddress?.address1}</p>
                {order.billingAddress?.address2 && (
                  <p>{order.billingAddress.address2}</p>
                )}
                <p>{order.billingAddress?.zip} {order.billingAddress?.city}</p>
                <p>{order.billingAddress?.country}</p>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">Levereras till</h2>
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
          </div>

          {/* Produkter */}
          <div className="mt-16">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 text-sm text-gray-900">
                <tr>
                  <th scope="col" className="py-3 pr-8 font-medium">
                    Artikelnummer
                  </th>
                  <th scope="col" className="py-3 pr-8 font-medium">
                    Produkt
                  </th>
                  <th scope="col" className="hidden py-3 pr-8 font-medium sm:table-cell">
                    Antal
                  </th>
                  <th scope="col" className="hidden py-3 pr-8 font-medium sm:table-cell">
                    Pris (ex. moms)
                  </th>
                  <th scope="col" className="py-3 pr-8 font-medium text-right">
                    Totalt (ex. moms)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-500">
                {order.lineItems.edges.map(({node: item}: any) => (
                  <tr key={item.id}>
                    <td className="py-6 pr-8">
                      {item.variant?.sku || '-'}
                    </td>
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
                          {item.customAttributes?.map((attr: any) => (
                            <div key={attr.key} className="mt-1 text-xs">
                              {attr.key}: {attr.value}
                            </div>
                          ))}
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
                  <th scope="row" colSpan={4} className="hidden pt-6 text-right font-normal text-gray-500 sm:table-cell">
                    Delsumma (ex. moms)
                  </th>
                  <th scope="row" colSpan={2} className="pt-6 text-right font-normal text-gray-500 sm:hidden">
                    Delsumma (ex. moms)
                  </th>
                  <td className="pt-6 text-right font-medium text-gray-900">
                    {order.subtotalPrice?.amount} {order.subtotalPrice?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4} className="hidden pt-4 text-right font-normal text-gray-500 sm:table-cell">
                    Frakt
                  </th>
                  <th scope="row" colSpan={2} className="pt-4 text-right font-normal text-gray-500 sm:hidden">
                    Frakt
                  </th>
                  <td className="pt-4 text-right font-medium text-gray-900">
                    {order.totalShippingPrice?.amount} {order.totalShippingPrice?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4} className="hidden pt-4 text-right font-normal text-gray-500 sm:table-cell">
                    Moms (25%)
                  </th>
                  <th scope="row" colSpan={2} className="pt-4 text-right font-normal text-gray-500 sm:hidden">
                    Moms (25%)
                  </th>
                  <td className="pt-4 text-right font-medium text-gray-900">
                    {order.totalTax?.amount} {order.totalTax?.currencyCode}
                  </td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4} className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell">
                    Totalt (ink. moms)
                  </th>
                  <th scope="row" colSpan={2} className="pt-4 text-right font-semibold text-gray-900 sm:hidden">
                    Totalt (ink. moms)
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
                  <p className="mt-2">Betalningsvillkor: {order.paymentTerms || '30 dagar netto'}</p>
                  <p className="mt-1">
                    Bankgiro: 123-4567
                  </p>
                  <p className="mt-1">
                    OCR-nummer: {order.orderNumber}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  Leveransinformation
                </h2>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Leveranssätt: {order.shippingMethod}</p>
                  {order.specialInstructions && (
                    <p className="mt-2">Notering: {order.specialInstructions}</p>
                  )}
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

          {/* Företagsinformation */}
          <div className="mt-16 border-t border-gray-200 pt-8 text-sm text-gray-500">
            <p>Remlagret AB</p>
            <p>Org.nr: 556XXX-XXXX</p>
            <p>VAT-nr: SE556XXX-XXXX01</p>
            <p>Innehar F-skattsedel</p>
            <p className="mt-2">
              Vid försenad betalning debiteras dröjsmålsränta enligt räntelagen samt påminnelseavgift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const B2B_ORDER_INVOICE_QUERY = `#graphql
  query B2BOrderInvoice($orderId: ID!) {
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
      specialInstructions
      paymentTerms
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
              sku
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
        trackingInfo {
          number
          url
        }
      }
      paymentGatewayNames
    }
    company {
      id
      name
      registrationNumber
      taxRegistrationNumber
    }
  }
`;

const COMPANY_INVOICE_EMAIL_QUERY = `#graphql
  query CompanyInvoiceEmail($customerAccessToken: String!) {
    company(customerAccessToken: $customerAccessToken) {
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