import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {policyHandle} = params;
  const {storefront} = context;

  if (!policyHandle) {
    throw new Error('Expected policy handle to be defined');
  }

  // Return early if storefront is not available
  if (!storefront) {
    throw new Response('Storefront not available', {status: 500});
  }

  const {shop} = await storefront.query(POLICY_QUERY, {
    variables: {
      privacyPolicy: policyHandle === 'privacy-policy',
      shippingPolicy: policyHandle === 'shipping-policy',
      termsOfService: policyHandle === 'terms-of-service',
      refundPolicy: policyHandle === 'refund-policy',
    },
  });

  const policy = shop[policyHandle.replace(/-([a-z])/g, (_, m1) => m1.toUpperCase())];

  if (!policy) {
    throw new Response('Not found', {status: 404});
  }

  return {
    policy,
  };
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="policy">
      <h1>{policy.title}</h1>
      <div dangerouslySetInnerHTML={{__html: policy.body}} />
    </div>
  );
}

const POLICY_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const; 

