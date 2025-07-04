import React from 'react';
import { Link } from 'react-router';
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

export function SearchResultsPredictive({ children }: SearchResultsPredictiveProps) {
  // This is a placeholder implementation that would normally use fetcher data
  const mockData = {
    items: {
      articles: [],
      collections: [],
      pages: [],
      products: [],
      queries: [],
    },
    total: 0,
    term: { current: '' },
    state: 'idle' as const,
    closeSearch: () => {},
  };

  if (typeof children !== 'function') {
    return null;
  }

  return <div className="predictive-search-results">{children(mockData)}</div>;
}

// Compound components
SearchResultsPredictive.Products = function SearchResultsPredictiveProducts({
  products,
  closeSearch,
  term,
}: SearchResultsPredictiveProductsProps) {
  if (!products?.length) return null;

  return (
    <div className="predictive-search-result space-y-3">
      <ul className="space-y-2">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });
          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          
          return (
            <li key={product.id} className="predictive-search-result-item">
              <Link 
                to={productUrl} 
                onClick={closeSearch}
                className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--gray-2)' }}
              >
                {image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                    <Image
                      alt={image.altText ?? ''}
                      src={image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--gray-12)' }}>
                    {product.title}
                  </p>
                  {price && (
                    <p className="text-sm" style={{ color: 'var(--gray-11)' }}>
                      <Money data={price} />
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
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
  
  return (
    <div className="py-8 text-center">
      <p className="text-sm" style={{ color: 'var(--gray-11)' }}>
        {term.current
          ? `Inga resultat för "${term.current}"`
          : 'Börja skriva för att söka produkter'}
      </p>
    </div>
  );
}; 
