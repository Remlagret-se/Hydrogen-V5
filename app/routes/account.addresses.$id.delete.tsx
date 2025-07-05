import {
  redirect,
  type ActionFunctionArgs,
  json,
} from '@shopify/remix-oxygen';

export async function action({params, context}: ActionFunctionArgs) {
  const {session} = await context.customerAccount.get();
  if (!session) {
    return redirect('/account/login');
  }

  const addressId = params.id;
  if (!addressId) {
    return json({error: 'Adress-ID saknas'}, {status: 400});
  }

  try {
    await context.storefront.mutate(DELETE_ADDRESS_MUTATION, {
      variables: {
        customerAccessToken: session.accessToken,
        id: decodeURIComponent(addressId),
      },
    });

    return redirect('/account?tab=addresses');
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {error: 'Ett fel uppstod när adressen skulle tas bort.'},
      {status: 500},
    );
  }
}

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
`; 