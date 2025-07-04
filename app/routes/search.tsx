import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useSearchParams} from 'react-router';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get('q') || '';

  // Return early if storefront is not available
  if (!context?.storefront) {
    return {
      products: { nodes: [] },
      query,
    };
  }

  const {products} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query,
    },
  });

  return {
    products,
    query,
  };
}

export default function Search() {
  const {products, query} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="search">
      <h1>Search Results</h1>
      <form method="get" className="search-form">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>
      {products.nodes.length ? (
        <div className="search-results">
          {products.nodes.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.title}</h2>
              {/* Add product image and link here */}
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

const SEARCH_QUERY = `#graphql
  query Search($query: String!) {
    products(first: 20, query: $query) {
      nodes {
        id
        title
        handle
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const; 
