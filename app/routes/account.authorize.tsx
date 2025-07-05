import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const token = searchParams.get('token');

  if (!token) {
    throw new Response('Token is required', {status: 400});
  }

  const {customerAccessTokenCreate} = await context.storefront.mutate(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    {
      variables: {
        input: {
          activationToken: token,
        },
      },
    },
  );

  if (customerAccessTokenCreate.customerUserErrors.length > 0) {
    throw new Response('Invalid token', {status: 400});
  }

  return {
    customerAccessToken: customerAccessTokenCreate.customerAccessToken,
  };
}

export default function Authorize() {
  const {customerAccessToken} = useLoaderData<typeof loader>();

  return (
    <div className="authorize">
      <h1>Account Activated</h1>
      <p>Your account has been successfully activated.</p>
      <a href="/account">Go to your account</a>
    </div>
  );
}

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const; 

