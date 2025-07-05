import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {sortSearchResults, groupSearchResults} from '~/lib/search/ranking';

const SEARCH_QUERY = `#graphql
  query search(
    $searchTerm: String!
    $first: Int!
  ) {
    products(
      first: $first,
      query: $searchTerm
    ) {
      nodes {
        id
        title
        vendor
        handle
        description
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function loader({request, context}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q') || '';
  const isPredictive = searchParams.get('predictive') === 'true';

  if (!searchTerm) {
    return json({
      searchTerm,
      products: [],
    });
  }

  const {products} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      first: isPredictive ? 5 : 50,
    },
  });

  // Använd den nya rankningsfunktionen
  const sortedProducts = sortSearchResults(products.nodes, searchTerm);
  
  // Gruppera efter tillverkare om det inte är prediktiv sökning
  const groupedProducts = isPredictive ? null : groupSearchResults(sortedProducts);

  return json({
    searchTerm,
    products: sortedProducts,
    groupedProducts,
  });
}

export default function Search() {
  const {searchTerm, products, groupedProducts} = useLoaderData<typeof loader>();

  return (
    <div className="search-results">
      <h1 className="text-2xl font-bold mb-8">
        {searchTerm ? (
          <>
            Sökresultat för "{searchTerm}"
            <span className="text-gray-500 text-lg ml-2">
              ({products.length} träffar)
            </span>
          </>
        ) : (
          'Sök produkter'
        )}
      </h1>

      {groupedProducts ? (
        // Visa grupperade resultat
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([vendor, items]) => (
            <div key={vendor} className="vendor-group">
              <h2 className="text-xl font-semibold mb-4">{vendor}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Visa vanlig lista
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {searchTerm && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Inga produkter matchade din sökning "{searchTerm}"
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Försök med andra sökord eller kontrollera stavningen
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({product}: {product: any}) {
  const {title, vendor, handle, variants} = product;
  const firstVariant = variants.nodes[0];
  const price = firstVariant?.price;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const image = firstVariant?.image;

  return (
    <Link
      to={`/products/${handle}`}
      className="group relative border rounded-lg overflow-hidden hover:border-primary transition-colors"
    >
      {image && (
        <div className="aspect-square overflow-hidden">
          <Image
            data={image}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">
          {title}
        </h3>
        {vendor && (
          <p className="mt-1 text-sm text-gray-500">{vendor}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {compareAtPrice && (
              <p className="text-sm text-gray-500 line-through">
                <Money data={compareAtPrice} />
              </p>
            )}
            <p className="text-sm font-medium text-gray-900">
              <Money data={price} />
            </p>
          </div>
          {!product.availableForSale && (
            <span className="text-xs text-red-600">Slut i lager</span>
          )}
        </div>
      </div>
    </Link>
  );
} 
