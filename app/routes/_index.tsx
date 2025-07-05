import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {HomePage} from '~/components/HomePage';
import {COLLECTION_QUERY, MENU_QUERY} from '~/lib/fragments';
import {useLoaderData} from '@remix-run/react';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Get market from URL instead of session
  const url = new URL(request.url);
  const pathPrefix = url.pathname.split('/')[1] || '';
  const currentMarket = {
    pathPrefix: pathPrefix ? `/${pathPrefix}` : '',
    language: pathPrefix.toUpperCase() || 'SV'
  };

  try {
    const [menuData, collectionsData] = await Promise.all([
      storefront.query(MENU_QUERY),
      storefront.query(COLLECTION_QUERY),
    ]);

    // Fetch specific collections
    const sparkullager = collectionsData.collections?.nodes?.find(
      (collection) => collection?.handle === 'sparkullager',
    );
    const sfariskaKullager = collectionsData.collections?.nodes?.find(
      (collection) => collection?.handle === 'sfariska-kullager',
    );

    return defer({
      menu: menuData.menu,
      collections: collectionsData.collections?.nodes || [],
      sparkullager,
      sfariskaKullager,
      currentMarket,
    });
  } catch (error) {
    console.error('Error loading data:', error);
    throw new Response('Error loading shop data', {
      status: 500,
      statusText: error.message,
    });
  }
}

export default function Index() {
  const {
    menu,
    collections,
    sparkullager,
    sfariskaKullager,
    currentMarket,
  } = useLoaderData<typeof loader>();

  return (
    <HomePage
      menu={menu}
      collections={collections}
      sparkullager={sparkullager}
      sfariskaKullager={sfariskaKullager}
      products={[]}
      currentMarket={currentMarket}
    />
  );
}
