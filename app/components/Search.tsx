import { useId } from 'react';
import { Link } from '@remix-run/react';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import { useAside } from '~/components/Aside';

export function SearchAside() {
  const queriesDatalistId = useId();
  const { close } = useAside();
  
  return (
    <div className="predictive-search p-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <SearchFormPredictive className="mb-4">
        {({ fetchResults, goToSearch, inputRef, fetcher }) => (
          <div className="relative">
            <input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              placeholder="Sök produkter..."
              ref={inputRef}
              type="search"
              list={queriesDatalistId}
              className="w-full rounded-md border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--gray-6)',
                color: 'var(--gray-12)',
                '--tw-ring-color': 'var(--blue-9)',
                '--tw-ring-offset-color': 'var(--color-background)'
              }}
            />
            <button
              onClick={goToSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--blue-9)' }}
            >
              Sök
            </button>
            
            {/* Real search results using fetcher data */}
            <div className="mt-4">
              {(() => {
                const searchData = fetcher.data;
                const isLoading = fetcher.state === 'loading';
                const term = inputRef.current?.value || '';
                
                if (isLoading && term) {
                  return (
                    <div className="py-8 text-center">
                      <p className="text-sm" style={{ color: 'var(--gray-11)' }}>
                        Söker...
                      </p>
                    </div>
                  );
                }
                
                if (!searchData?.result?.items || !searchData.result.total) {
                  return (
                    <div className="py-8 text-center">
                      <p className="text-sm" style={{ color: 'var(--gray-11)' }}>
                        {term
                          ? `Inga resultat för "${term}"`
                          : 'Börja skriva för att söka produkter'}
                      </p>
                    </div>
                  );
                }

                const { items, total } = searchData.result;
                const { articles, collections, pages, products, queries } = items;

                return (
                  <div className="space-y-6">
                    {/* Queries datalist */}
                    {queries && queries.length > 0 && (
                      <datalist id={queriesDatalistId}>
                        {queries.map((suggestion: any) => (
                          <option key={suggestion.text} value={suggestion.text} />
                        ))}
                      </datalist>
                    )}
                    
                    {products && products.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--gray-12)' }}>
                          Produkter
                        </h3>
                        <ul className="space-y-2">
                          {products.map((product: any) => {
                            const price = product?.selectedOrFirstAvailableVariant?.price;
                            const image = product?.selectedOrFirstAvailableVariant?.image;
                            
                            return (
                              <li key={product.id}>
                                <Link 
                                  to={`/products/${product.handle}`}
                                  onClick={close}
                                  className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: 'var(--gray-2)' }}
                                >
                                  {image && (
                                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                                      <img
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
                                        {price.amount} {price.currencyCode}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {collections && collections.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--gray-12)' }}>
                          Kategorier
                        </h3>
                        <ul className="space-y-2">
                          {collections.map((collection: any) => (
                            <li key={collection.id}>
                              <Link 
                                to={`/collections/${collection.handle}`}
                                onClick={close}
                                className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: 'var(--gray-2)' }}
                              >
                                {collection.image && (
                                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                                    <img
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
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pages && pages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--gray-12)' }}>
                          Sidor
                        </h3>
                        <ul className="space-y-2">
                          {pages.map((page: any) => (
                            <li key={page.id}>
                              <Link 
                                to={`/pages/${page.handle}`}
                                onClick={close}
                                className="block p-2 rounded-md hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: 'var(--gray-2)' }}
                              >
                                <p className="text-sm font-medium" style={{ color: 'var(--gray-12)' }}>
                                  {page.title}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {articles && articles.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--gray-12)' }}>
                          Artiklar
                        </h3>
                        <ul className="space-y-2">
                          {articles.map((article: any) => (
                            <li key={article.id}>
                              <Link 
                                to={`/blogs/${article.blog?.handle}/${article.handle}`}
                                onClick={close}
                                className="flex items-center space-x-3 p-2 rounded-md hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: 'var(--gray-2)' }}
                              >
                                {article.image && (
                                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--gray-4)' }}>
                                    <img
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
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {term && total > 0 && (
                      <div className="pt-4 border-t" style={{ borderColor: 'var(--gray-6)' }}>
                        <Link
                          onClick={close}
                          to={`${SEARCH_ENDPOINT}?q=${term}`}
                          className="block w-full rounded-md border border-transparent px-4 py-3 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: 'var(--blue-9)' }}
                        >
                          Visa alla resultat för "{term}" ({total})
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </SearchFormPredictive>
    </div>
  );
} 
