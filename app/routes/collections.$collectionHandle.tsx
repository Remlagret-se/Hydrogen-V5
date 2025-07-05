import type {LoaderFunctionArgs} from '@remix-run/react';
import {useLoaderData, useSearchParams} from '@remix-run/react';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import {ChevronDownIcon, Squares2X2Icon} from '@heroicons/react/20/solid';
import {ShopifyProductCard} from '~/components/ui/ShopifyProductCard';
import {FilterPanel} from '~/components/collection/FilterPanel';
import {
  getHardcodedFilterOptions,
  mergeFilterOptions,
  extractFacetedFilterOptions,
  filterProductsByActiveFiltersWithCache,
  getFilterDisplayName,
  convertFiltersToUIFormat,
} from '~/lib/filters';
import {
  loadProductBatch,
  getCachedCollectionData,
  getCollectionTitle,
  loadAllProductsForFilters,
} from '~/lib/shopify';

export async function loader({params, context, request}: LoaderFunctionArgs) {
  console.log('=== COLLECTION LOADER START ===');
  const startTime = Date.now();

  const {collectionHandle} = params;

  if (!collectionHandle) {
    throw new Response('Collection handle required', {status: 400});
  }

  // If no storefront in context, create a working one directly here
  let storefront = context?.storefront;

  if (!storefront) {
    console.log('Creating storefront client directly in loader...');

    try {
      // Import createStorefrontClient here
      const {createStorefrontClient} = await import('@shopify/hydrogen');

      const storefrontClient = createStorefrontClient({
        // No cache in Node.js development mode
        waitUntil: () => {},
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
        privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN || '',
        storeDomain: process.env.PUBLIC_STORE_DOMAIN || '',
        storefrontApiVersion:
          process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-04',
        storefrontId: process.env.PUBLIC_STOREFRONT_ID || '',
      });

      storefront = storefrontClient.storefront;
    } catch (error) {
      console.error('Failed to create storefront in loader:', error);
      throw new Response('Failed to create storefront client', {status: 500});
    }
  }

  try {
    // Get search params for filters and pagination
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const currentPage = parseInt(searchParams.get('page') || '1');
    const productsPerPage = 48;

    // Build filter params from URL
    const activeFilters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'cursor') {
        activeFilters[key] = value.split(',').filter((v) => v.trim() !== '');
      }
    });

    console.log('Active filters:', activeFilters);

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    // ULTRA-OPTIMIZED PARALLEL LOADING
    const promises: Promise<any>[] = [];

    // 1. Always start with hardcoded filters for instant display
    let filterOptions = getHardcodedFilterOptions(collectionHandle);

    // 2. Load filter data from cache or fresh (lightweight query)
    const filterDataPromise = getCachedCollectionData(
      storefront,
      collectionHandle,
    ).then(({collectionTitle, products}) => {
      // Extract real filter options and merge with hardcoded
      const realFilterOptions = extractFacetedFilterOptions(
        products,
        activeFilters,
      );
      filterOptions = mergeFilterOptions(filterOptions, realFilterOptions);
      return {collectionTitle, filterProducts: products};
    });
    promises.push(filterDataPromise);

    // 3. Load current page products in parallel
    const startIndex = (currentPage - 1) * productsPerPage;
    let pageProductsPromise;

    if (!hasActiveFilters) {
      // No filters - just load the current page
      pageProductsPromise = loadProductBatch(
        storefront,
        collectionHandle,
        null,
        startIndex + productsPerPage,
      ).then((batch) => ({
        products: batch.products.slice(
          startIndex,
          startIndex + productsPerPage,
        ),
        hasMore:
          batch.hasNextPage ||
          batch.products.length > startIndex + productsPerPage,
      }));
    } else {
      // Filters active - we'll decide after loading filter data
      pageProductsPromise = Promise.resolve({products: [], hasMore: false});
    }
    promises.push(pageProductsPromise);

    // Wait for all parallel operations
    const [filterData, pageData] = await Promise.all(promises);

    let paginatedProducts: any[] = [];
    let filteredProducts: any[] = [];
    let allProductsForFiltering: any[] = [];
    let hasNextPage = false;
    let hasPreviousPage = currentPage > 1;
    let collectionTitle = filterData.collectionTitle || collectionHandle;

    if (!hasActiveFilters) {
      // No filters - use the loaded page products
      paginatedProducts = pageData.products;
      filteredProducts = paginatedProducts;
      hasNextPage = pageData.hasMore;
      allProductsForFiltering = filterData.filterProducts;
    } else {
      // Filters active - check if we need to load all products
      if (filterData.filterProducts.length < 1000) {
        // Small collection, filter data is sufficient
        allProductsForFiltering = filterData.filterProducts;
      } else {
        // Large collection, need all products for accurate filtering
        console.log('Loading all products for large collection filtering...');
        allProductsForFiltering = await loadAllProductsForFilters(
          storefront,
          collectionHandle,
        );
        // Update filter options with all products
        const fullFilterOptions = extractFacetedFilterOptions(
          allProductsForFiltering,
          activeFilters,
        );
        filterOptions = mergeFilterOptions(filterOptions, fullFilterOptions);
      }

      filteredProducts = filterProductsByActiveFiltersWithCache(
        allProductsForFiltering,
        activeFilters,
      );
      paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage,
      );
      hasNextPage = startIndex + productsPerPage < filteredProducts.length;
    }

    // Create collection object
    const collection = {
      id: `gid://shopify/Collection/${collectionHandle}`,
      title: collectionTitle,
      handle: collectionHandle,
      description: `Collection containing products`,
      products: {
        edges: paginatedProducts.map((product) => ({node: product})),
      },
    };

    const loadTime = Date.now() - startTime;
    console.log(
      `⚡ Collection loaded in ${loadTime}ms: ${collection.title} showing ${paginatedProducts.length} products`,
    );

    // Return comprehensive collection data with filters
    return {
      collection,
      filterOptions,
      currentMarket: {language: 'SV', country: 'SE', currency: 'SEK'},
      totalProducts: paginatedProducts.length,
      currentPage,
      productsPerPage,
      hasNextPage,
      hasPreviousPage,
      allProductsCount: hasActiveFilters
        ? allProductsForFiltering.length
        : 12421,
      filteredProductsCount: filteredProducts.length,
    };
  } catch (error) {
    console.error('Collection loader error:', error);

    if (error instanceof Response) {
      throw error;
    }

    throw new Response(
      `Error loading collection: ${error?.message || 'Unknown error'}`,
      {status: 500},
    );
  }
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Collection() {
  const {
    collection,
    filterOptions,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    allProductsCount,
    filteredProductsCount,
  } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  // Handle filter changes
  const handleFilterChange = (
    filterKey: string,
    value: string,
    checked: boolean,
  ) => {
    const current =
      searchParams
        .get(filterKey)
        ?.split(',')
        .filter((v) => v) || [];
    let updated: string[];

    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter((v) => v !== value);
    }

    if (updated.length > 0) {
      searchParams.set(filterKey, updated.join(','));
    } else {
      searchParams.delete(filterKey);
    }

    // Reset to page 1 when filters change
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  // Handle removing a specific filter
  const handleRemoveFilter = (filterKey: string, value: string) => {
    const current =
      searchParams
        .get(filterKey)
        ?.split(',')
        .filter((v) => v) || [];
    const updated = current.filter((v) => v !== value);

    if (updated.length > 0) {
      searchParams.set(filterKey, updated.join(','));
    } else {
      searchParams.delete(filterKey);
    }

    // Reset to page 1 when filters change
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'cursor') {
        active[key] = value.split(',').filter((v) => v.trim() !== '');
      }
    });
    return active;
  };

  const activeFilters = getActiveFilters();

  // Convert filterOptions to UI format using the utility function
  const filters = convertFiltersToUIFormat(filterOptions, activeFilters);

  const sortOptions = [
    {name: 'Senaste', href: '#', current: true},
    {name: 'Pris: Lågt till högt', href: '#', current: false},
    {name: 'Pris: Högt till lågt', href: '#', current: false},
    {name: 'Namn A-Ö', href: '#', current: false},
  ];

  return (
    <div className="bg-white">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {collection.title}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sortera
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current
                              ? 'font-medium text-gray-900'
                              : 'text-gray-500',
                            'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">Visa rutnät</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Produkter
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <FilterPanel
                filters={filters}
                activeFilters={activeFilters}
                filteredProductsCount={filteredProductsCount}
                allProductsCount={allProductsCount}
                onFilterChange={handleFilterChange}
                onRemoveFilter={handleRemoveFilter}
                onClearAllFilters={handleClearAllFilters}
                getFilterDisplayName={getFilterDisplayName}
              />

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                  {collection.products.edges.map(({node: product}, index) => (
                    <ShopifyProductCard
                      key={product.id}
                      product={product}
                      loading={index < 6 ? 'eager' : 'lazy'}
                      showVendor={true}
                      showProductType={true}
                    />
                  ))}
                </div>

                {collection.products.edges.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Inga produkter hittades med dessa filter.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {(hasNextPage || hasPreviousPage) && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    {hasPreviousPage && (
                      <button
                        onClick={() => {
                          searchParams.set(
                            'page',
                            (currentPage - 1).toString(),
                          );
                          setSearchParams(searchParams);
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        ← Föregående
                      </button>
                    )}
                    <span className="px-4 py-2 text-gray-700 font-medium">
                      Sida {currentPage}
                    </span>
                    {hasNextPage && (
                      <button
                        onClick={() => {
                          searchParams.set(
                            'page',
                            (currentPage + 1).toString(),
                          );
                          setSearchParams(searchParams);
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Nästa →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

