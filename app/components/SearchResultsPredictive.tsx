import React from 'react';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import type { PredictiveSearchReturn } from '~/lib/search';

interface SearchResultsPredictiveProps {
  children: ((args: {
    items: PredictiveSearchReturn['result']['items'];
    total: number;
    term: React.MutableRefObject<string>;
    state: 'loading' | 'idle';
    closeSearch: () => void;
  }) => React.ReactNode) | null;
  isLoading?: boolean;
}

interface SearchResultsPredictiveProductsProps {
  products: any[];
  closeSearch: () => void;
  term: React.MutableRefObject<string>;
}

interface SearchResultsPredictiveCollectionsProps {
  collections: any[];
  closeSearch: () => void;
  term: React.MutableRefObject<string>;
}

interface SearchResultsPredictivePagesProps {
  pages: any[];
  closeSearch: () => void;
  term: React.MutableRefObject<string>;
}

interface SearchResultsPredictiveArticlesProps {
  articles: any[];
  closeSearch: () => void;
  term: React.MutableRefObject<string>;
}

interface SearchResultsPredictiveQueriesProps {
  queries: any[];
  queriesDatalistId: string;
}

interface SearchResultsPredictiveEmptyProps {
  term: React.MutableRefObject<string>;
  children?: React.ReactNode;
}

function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  term,
}: {
  baseUrl: string;
  trackingParams?: string;
  term?: string;
}) {
  const params = new URLSearchParams();
  if (trackingParams) {
    params.set('tracking', trackingParams);
  }
  if (term) {
    params.set('q', term);
  }
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function NoResults({term}: {term: string}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <p className="text-gray-500 text-center">
        Inga resultat hittades för "{term}"
      </p>
      <p className="text-sm text-gray-400 mt-2 text-center">
        Försök med andra sökord eller kontrollera stavningen
      </p>
    </div>
  );
}

export function SearchResultsPredictive({
  children,
  isLoading = false,
}: SearchResultsPredictiveProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Detta är en placeholder-implementation som normalt skulle använda fetcher-data
  const mockData = {
    items: {
      articles: [],
      collections: [],
      pages: [],
      products: [],
      queries: [],
    },
    total: 0,
    term: {current: ''},
    state: 'idle' as const,
    closeSearch: () => {},
  };

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <div className="predictive-search-results">
      {children(mockData)}
    </div>
  );
}

// Compound components
SearchResultsPredictive.Products = function SearchResultsPredictiveProducts({
  products,
  closeSearch,
  term,
}: SearchResultsPredictiveProductsProps) {
  if (!products?.length) {
    return term?.current ? <NoResults term={term.current} /> : null;
  }

  return (
    <div className="predictive-search-result space-y-3">
      <div className="px-4 py-2 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-900">Produkter</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });
          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          
          return (
            <li key={product.id} className="group">
              <Link 
                to={productUrl} 
                onClick={closeSearch}
                className="flex items-center p-4 hover:bg-gray-50 transition duration-150"
              >
                {image && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-md border overflow-hidden">
                    <Image
                      alt={image.altText ?? product.title}
                      src={image.url}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="ml-4 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">
                      {product.title}
                    </h4>
                    {price && (
                      <p className="text-sm font-medium text-gray-900">
                        <Money data={price} />
                      </p>
                    )}
                  </div>
                  {product.vendor && (
                    <p className="mt-1 text-sm text-gray-500">{product.vendor}</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {products.length > 0 && (
        <div className="px-4 py-3 bg-gray-50">
          <Link
            to={`/search?q=${term.current}`}
            onClick={closeSearch}
            className="text-sm text-primary hover:text-primary/80"
          >
            Visa alla resultat ({products.length})
          </Link>
        </div>
      )}
    </div>
  );
};

SearchResultsPredictive.Collections = function SearchResultsPredictiveCollections({
  collections,
  closeSearch,
  term,
}: SearchResultsPredictiveCollectionsProps) {
  if (!collections?.length) return null;

  return (
    <div className="predictive-search-result space-y-3">
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });
          
          return (
            <li key={collection.id} className="predictive-search-result-item">
              <Link 
                to={collectionUrl} 
                onClick={closeSearch}
                className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--gray-2)' }}
              >
                {collection.image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                    <Image
                      alt={collection.image.altText ?? ''}
                      src={collection.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--gray-12)' }}>
                    {collection.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Pages = function SearchResultsPredictivePages({
  pages,
  closeSearch,
  term,
}: SearchResultsPredictivePagesProps) {
  if (!pages?.length) return null;

  return (
    <div className="predictive-search-result space-y-3">
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });
          
          return (
            <li key={page.id} className="predictive-search-result-item">
              <Link 
                to={pageUrl} 
                onClick={closeSearch}
                className="block p-2 rounded-md hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--gray-2)' }}
              >
                <p className="text-sm font-medium" style={{ color: 'var(--gray-12)' }}>
                  {page.title}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Articles = function SearchResultsPredictiveArticles({
  articles,
  closeSearch,
  term,
}: SearchResultsPredictiveArticlesProps) {
  if (!articles?.length) return null;

  return (
    <div className="predictive-search-result space-y-3">
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog?.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current,
          });
          
          return (
            <li key={article.id} className="predictive-search-result-item">
              <Link 
                to={articleUrl} 
                onClick={closeSearch}
                className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--gray-2)' }}
              >
                {article.image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                    <Image
                      alt={article.image.altText ?? ''}
                      src={article.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--gray-12)' }}>
                    {article.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Queries = function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: SearchResultsPredictiveQueriesProps) {
  if (!queries?.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => (
        <option key={suggestion.text} value={suggestion.text} />
      ))}
    </datalist>
  );
};

SearchResultsPredictive.Empty = function SearchResultsPredictiveEmpty({
  term,
  children,
}: SearchResultsPredictiveEmptyProps) {
  if (children) {
    return <>{children}</>;
  }
  
  return term.current ? (
    <NoResults term={term.current} />
  ) : (
    <div className="flex items-center justify-center py-12 px-4">
      <p className="text-gray-500 text-center">
        Börja skriva för att söka produkter
      </p>
    </div>
  );
}; 

