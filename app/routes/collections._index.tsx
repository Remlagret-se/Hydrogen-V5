import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  // Return early if storefront is not available
  if (!context?.storefront) {
    return {
      collections: { nodes: [] },
    };
  }

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY);
  return {collections};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <h1>Collections</h1>
      <div className="collections-grid">
        {collections.nodes.map((collection) => (
          <div key={collection.id} className="collection-card">
            <h2>{collection.title}</h2>
            {/* Add collection image and link here */}
          </div>
        ))}
      </div>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query CollectionsIndex {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
      }
    }
  }
` as const; 

