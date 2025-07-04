import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, redirect} from 'react-router';

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = context;
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  // Return early if storefront is not available
  if (!context?.storefront) {
    return redirect('/account/login');
  }

  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
    },
  });

  if (!customer) {
    return redirect('/account/login');
  }

  return {customer};
}

export default function Account() {
  const {customer} = useLoaderData<typeof loader>();

  return (
    <div className="account">
      <h1>My Account</h1>
      <div className="account-details">
        <h2>Account Information</h2>
        <p>Name: {customer.firstName} {customer.lastName}</p>
        <p>Email: {customer.email}</p>
      </div>
      <div className="account-addresses">
        <h2>Addresses</h2>
        {customer.addresses.nodes.map((address) => (
          <div key={address.id} className="address-card">
            <p>{address.formatted}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const CUSTOMER_QUERY = `#graphql
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      addresses(first: 10) {
        nodes {
          id
          formatted
        }
      }
    }
  }
` as const; 
