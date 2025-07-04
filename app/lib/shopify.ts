// Shopify-related operations and GraphQL queries

// Helper function to load a single batch of products
export async function loadProductBatch(storefront: any, collectionHandle: string, cursor: string | null, first: number) {
  try {
    // Ensure we never exceed GraphQL limit
    const safeFirst = Math.min(first, 250);
    
    const query = `
      query CollectionProducts($handle: String!, $cursor: String, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                handle
                vendor
                productType
                tags
                metafields(identifiers: [
                  {namespace: "custom", key: "innerdiameter"},
                  {namespace: "custom", key: "ytterdiameter"},
                  {namespace: "custom", key: "bredd"},
                  {namespace: "dimension", key: "innerdiameter"},
                  {namespace: "dimension", key: "ytterdiameter"},
                  {namespace: "dimension", key: "bredd"}
                ]) {
                  namespace
                  key
                  value
                  type
                }
                featuredImage {
                  url
                  altText
                  width
                  height
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 1) {
                  nodes {
                    id
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const {collection} = await storefront.query(query, {
      variables: {
        handle: collectionHandle,
        cursor: cursor,
        first: safeFirst,
      },
    });

    if (!collection?.products?.edges?.length) {
      return { products: [], hasNextPage: false, endCursor: null };
    }

    return {
      products: collection.products.edges.map((edge: any) => edge.node),
      hasNextPage: collection.products.pageInfo.hasNextPage,
      endCursor: collection.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error loading product batch:', error);
    return { products: [], hasNextPage: false, endCursor: null };
  }
}

// Helper function to load all products for filter options
export async function loadAllProductsForFilters(storefront: any, collectionHandle: string) {
  try {
    console.log('Loading products for filters, collection:', collectionHandle);
    
    let allProducts: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    let batchCount = 0;
    const maxBatches = 100; // Safety limit to prevent infinite loops
    
    while (hasNextPage && batchCount < maxBatches) {
      batchCount++;
      console.log(`Loading batch ${batchCount}...`);
      
      const query = `
        query CollectionProducts($handle: String!, $cursor: String) {
          collection(handle: $handle) {
            products(first: 250, after: $cursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  title
                  handle
                  vendor
                  productType
                  tags
                  metafields(identifiers: [
                    {namespace: "custom", key: "innerdiameter"},
                    {namespace: "custom", key: "ytterdiameter"},
                    {namespace: "custom", key: "bredd"},
                    {namespace: "dimension", key: "innerdiameter"},
                    {namespace: "dimension", key: "ytterdiameter"},
                    {namespace: "dimension", key: "bredd"}
                  ]) {
                    namespace
                    key
                    value
                    type
                  }
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  variants(first: 1) {
                    nodes {
                      id
                      availableForSale
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const {collection} = await storefront.query(query, {
        variables: {
          handle: collectionHandle,
          cursor: cursor,
        },
      });

      if (!collection?.products?.edges?.length) {
        break;
      }

      // Add products from this batch
      const batchProducts = collection.products.edges.map((edge: any) => edge.node);
      allProducts = [...allProducts, ...batchProducts];
      
      // Update pagination info
      hasNextPage = collection.products.pageInfo.hasNextPage;
      cursor = collection.products.pageInfo.endCursor;
      
      console.log(`Batch ${batchCount}: Loaded ${batchProducts.length} products, total: ${allProducts.length}`);
      
      // Small delay to avoid rate limiting
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Finished loading all products. Total: ${allProducts.length} products in ${batchCount} batches`);
    return allProducts;
    
  } catch (error) {
    console.error('Error loading products for filters:', error);
    return [];
  }
}

// Helper function to get collection title from first product
export function getCollectionTitle(product: any): string {
  // Try to derive collection name from product data
  if (product.productType) {
    return product.productType;
  }
  if (product.vendor) {
    return `${product.vendor} Products`;
  }
  return 'Products';
}

// Optimized function to load only metafields and basic data for filters
export async function loadProductMetafieldsForFilters(storefront: any, collectionHandle: string, limit: number = 250) {
  try {
    console.log('Loading product metafields for filters...');
    
    // Respektera GraphQL-gränsen på 250
    const safeLimit = Math.min(limit, 250);
    
    const query = `
      query CollectionFilterData($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          title
          products(first: $first) {
            edges {
              node {
                id
                vendor
                productType
                tags
                metafields(identifiers: [
                  {namespace: "custom", key: "innerdiameter"},
                  {namespace: "custom", key: "ytterdiameter"},
                  {namespace: "custom", key: "bredd"},
                  {namespace: "dimension", key: "innerdiameter"},
                  {namespace: "dimension", key: "ytterdiameter"},
                  {namespace: "dimension", key: "bredd"}
                ]) {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }
    `;

    const {collection} = await storefront.query(query, {
      variables: {
        handle: collectionHandle,
        first: safeLimit,
      },
    });

    if (!collection?.products?.edges?.length) {
      return { collectionTitle: '', products: [] };
    }

    const products = collection.products.edges.map((edge: any) => edge.node);
    console.log(`Loaded ${products.length} product metafields for filters`);
    
    return {
      collectionTitle: collection.title || '',
      products
    };
  } catch (error) {
    console.error('Error loading product metafields:', error);
    return { collectionTitle: '', products: [] };
  }
}

// Cache for collection data
const collectionCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedCollectionData(storefront: any, collectionHandle: string) {
  const cacheKey = collectionHandle;
  const cached = collectionCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached collection data');
    return cached.data;
  }
  
  try {
    // För bättre filter-täckning, ladda flera batches parallellt
    const batchPromises = [];
    
    // Första batchen inkluderar collection title
    batchPromises.push(loadProductMetafieldsForFilters(storefront, collectionHandle, 250));
    
    // Ladda ytterligare 3 batches parallellt för totalt ~1000 produkter
    let cursor = null;
    for (let i = 1; i < 4; i++) {
      batchPromises.push(
        loadProductBatch(storefront, collectionHandle, cursor, 250)
          .then(batch => {
            cursor = batch.endCursor; // Update cursor for next batch
            return {
              collectionTitle: '',
              products: batch.products
            };
          })
      );
    }
    
    console.log('Loading filter data from multiple batches in parallel...');
    const results = await Promise.all(batchPromises);
    
    // Kombinera alla produkter
    const allProducts = results.flatMap(r => r.products || []);
    const collectionTitle = results[0].collectionTitle;
    
    console.log(`Loaded ${allProducts.length} products for comprehensive filter extraction`);
    
    const data = {
      collectionTitle,
      products: allProducts
    };
    
    collectionCache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
    
  } catch (error) {
    console.error('Error in parallel collection data loading:', error);
    // Fallback till enkel laddning
    const data = await loadProductMetafieldsForFilters(storefront, collectionHandle, 250);
    collectionCache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
  }
}

// Lightweight function to just get collection title and info
export async function getCollectionInfo(storefront: any, collectionHandle: string) {
  try {
    const query = `
      query CollectionInfo($handle: String!) {
        collection(handle: $handle) {
          title
          description
          products(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `;

    const {collection} = await storefront.query(query, {
      variables: { handle: collectionHandle },
    });

    return {
      title: collection?.title || collectionHandle,
      description: collection?.description || ''
    };
  } catch (error) {
    console.error('Error getting collection info:', error);
    return { title: collectionHandle, description: '' };
  }
} 