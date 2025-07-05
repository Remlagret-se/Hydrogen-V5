import {useRef, useState, useEffect} from 'react';
import {Link, useFetcher} from '@remix-run/react';
import {useDebounce} from '~/lib/hooks/useDebounce';
import {SearchCache} from '~/lib/search/cache';
import {SearchHistory} from '~/lib/search/history';
import {Image, Money} from '@shopify/hydrogen';
import {useClickAway} from '~/lib/hooks/useClickAway';
import {SearchAnalytics} from '~/lib/search/analytics';

export function SearchBar() {
  const fetcher = useFetcher();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState(SearchHistory.getSearchAnalytics());

  // Ladda sökhistorik när komponenten monteras
  useEffect(() => {
    const history = SearchHistory.getHistory();
    setRecentSearches(history.map(item => item.term).slice(0, 5));
    setPopularSearches(SearchHistory.getPopularSearches());
  }, []);

  // Uppdatera relaterade sökningar när söktermen ändras
  useEffect(() => {
    if (searchTerm) {
      setRelatedSearches(SearchHistory.getRelatedSearches(searchTerm));
    } else {
      setRelatedSearches([]);
    }
  }, [searchTerm]);

  // Stäng sökresultat när man klickar utanför
  useClickAway(searchRef, () => setIsOpen(false));

  // Starta söksession när komponenten monteras
  useEffect(() => {
    SearchAnalytics.startSession();
    return () => SearchAnalytics.endSession();
  }, []);

  // Hantera sökningar med analytics
  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }

    // Spara sökningen i historiken och analytics
    SearchHistory.addSearch(debouncedSearchTerm);
    SearchAnalytics.addSearch(debouncedSearchTerm, products.length, {
      hasResults: products.length > 0,
      timestamp: Date.now(),
    });

    // Kolla cache först
    const cachedResults = SearchCache.get(debouncedSearchTerm);
    if (cachedResults) {
      return;
    }

    // Gör ny sökning
    fetcher.load(
      `/search?q=${encodeURIComponent(debouncedSearchTerm)}&predictive=true`,
    );
  }, [debouncedSearchTerm, fetcher, products.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < (products.length - 1) ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && products[selectedIndex]) {
            const product = products[selectedIndex];
            handleProductClick(product);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, products, selectedIndex, searchTerm]);

  // Hantera produktklick med analytics
  const handleProductClick = (product: any) => {
    SearchHistory.addProductClick(
      searchTerm,
      product.id,
      product.productType,
      product.vendor
    );
    SearchAnalytics.addClick(product.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const products = fetcher.data?.products || [];
  const isLoading = fetcher.state === 'loading';

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl mx-auto">
      <div className="relative group">
        <input
          ref={inputRef}
          type="search"
          placeholder="Sök produkter... (Ctrl + K)"
          className="w-full px-4 py-3 pl-12 pr-10 border rounded-lg bg-white/80 backdrop-blur-sm focus:bg-white
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200 shadow-sm hover:shadow-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
        </div>
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setSearchTerm('');
              inputRef.current?.focus();
            }}
          >
            <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Sökresultat dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200/80 backdrop-blur-sm
          max-h-[80vh] overflow-y-auto z-50 transition-all duration-200 animate-fadeIn">
          {!searchTerm ? (
            <div className="p-4 space-y-6">
              {/* Senaste sökningar */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Senaste sökningar
                    </h3>
                    <button
                      onClick={() => {
                        SearchHistory.clear();
                        setRecentSearches([]);
                        setPopularSearches([]);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Rensa historik
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md
                          transition-colors duration-150 group"
                        onClick={() => {
                          setSearchTerm(term);
                          setIsOpen(true);
                        }}
                      >
                        <ClockIcon className="h-4 w-4 text-gray-400 group-hover:text-primary mr-2 transition-colors duration-150" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Populära sökningar */}
              {popularSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Populära sökningar
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md
                          transition-colors duration-150 group"
                        onClick={() => {
                          setSearchTerm(term);
                          setIsOpen(true);
                        }}
                      >
                        <TrendingIcon className="h-4 w-4 text-gray-400 group-hover:text-primary mr-2 transition-colors duration-150" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sökstatistik */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                  <div>
                    <div className="font-medium text-gray-900">
                      {searchAnalytics.totalSearches}
                    </div>
                    <div>Totalt sökningar</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {Math.round(searchAnalytics.successfulSearches / searchAnalytics.totalSearches * 100 || 0)}%
                    </div>
                    <div>Framgångsrika</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {Object.keys(searchAnalytics.popularVendors).length}
                    </div>
                    <div>Unika märken</div>
                  </div>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Relaterade sökningar */}
              {relatedSearches.length > 0 && (
                <div className="p-2 bg-gray-50/80">
                  <div className="text-xs text-gray-500 mb-2 px-2">
                    Relaterade sökningar:
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {relatedSearches.map((term) => (
                      <button
                        key={term}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs
                          bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5
                          text-gray-700 hover:text-primary transition-colors duration-150"
                        onClick={() => {
                          setSearchTerm(term);
                          setIsOpen(true);
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Produktresultat */}
              {products.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {products.map((product: any, index: number) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className={`flex items-center p-4 hover:bg-gray-50 transition duration-150 ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      {product.variants?.nodes[0]?.image && (
                        <div className="relative flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden group-hover:border-primary/30">
                          <Image
                            data={product.variants.nodes[0].image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">
                          {product.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          {product.vendor && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {product.vendor}
                            </span>
                          )}
                          <div className="ml-auto">
                            <Money
                              data={product.variants?.nodes[0]?.price}
                              className="text-sm font-medium text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                      {!product.availableForSale && (
                        <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          Slut i lager
                        </span>
                      )}
                    </Link>
                  ))}
                  
                  {/* Visa alla resultat länk */}
                  <div className="p-4 bg-gray-50">
                    <Link
                      to={`/search?q=${encodeURIComponent(searchTerm)}`}
                      className="flex items-center justify-center text-sm text-primary hover:text-primary/80 font-medium
                        transition-colors duration-150"
                      onClick={() => setIsOpen(false)}
                    >
                      Visa alla {products.length} resultat
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <SearchIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">
                    Inga resultat för "{searchTerm}"
                  </p>
                  <p className="text-sm text-gray-400">
                    Försök med andra sökord eller kontrollera stavningen
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function XIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ClockIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function TrendingIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}

function ArrowRightIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
} 