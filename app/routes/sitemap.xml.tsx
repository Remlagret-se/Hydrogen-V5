import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {markets} from '~/lib/utils/localization';

export async function loader({context}: LoaderFunctionArgs) {
  // Return early if storefront is not available
  if (!context?.storefront) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  const {collections, products} = await context.storefront.query(SITEMAP_QUERY);

  // Generera collection URLs för alla marknader med Shopify handles
  const localizedCollectionUrls = collections.nodes.flatMap((collection: any) => {
    const urls = [];
    
    // För varje marknad, använd Shopify handle direkt
    Object.entries(markets).forEach(([marketKey, market]) => {
      // Använd Shopify handle direkt (ingen översättning)
      const url = `${context.storefront.shop.url}${market.pathPrefix}/collections/${collection.handle}`;
      urls.push(url);
    });
    
    return urls;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${context.storefront.shop.url}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${localizedCollectionUrls
        .map(
          (url) => `
        <url>
          <loc>${url}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `,
        )
        .join('')}
      ${products.nodes
        .map(
          (product) => `
        <url>
          <loc>${context.storefront.shop.url}/products/${product.handle}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `,
        )
        .join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

const SITEMAP_QUERY = `#graphql
  query Sitemap {
    collections(first: 100) {
      nodes {
        handle
      }
    }
    products(first: 100) {
      nodes {
        handle
      }
    }
  }
` as const; 
