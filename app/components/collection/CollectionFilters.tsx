import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';

interface CollectionFiltersProps {
  filterOptions?: Record<string, string[]>;
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterKey: string, value: string, checked: boolean) => void;
  onClearAll: () => void;
}

const filterLabels: Record<string, string> = {
  innerdiameter: 'Innerdiameter (mm)',
  ytterdiameter: 'Ytterdiameter (mm)', 
  bredd: 'Bredd (mm)',
  inner: 'Innerdiameter (mm)',
  outer: 'Ytterdiameter (mm)',
  width: 'Bredd (mm)',
  productType: 'Produkttyp',
  vendor: 'Tillverkare'
};

export function CollectionFilters({
  filterOptions = {},
  activeFilters = {},
  onFilterChange,
  onClearAll
}: CollectionFiltersProps) {
  const hasActiveFilters = Object.values(activeFilters || {}).some(values => values.length > 0);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  const handleSearchChange = (filterKey: string, searchTerm: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterKey]: searchTerm
    }));
  };

  const toggleFilter = (filterKey: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const getFilteredOptions = (filterKey: string, options: string[]) => {
    const searchTerm = searchTerms[filterKey]?.toLowerCase() || '';
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm)
    );
  };

  // Helper function to get all active filter items
  const getActiveFilterItems = () => {
    const items: Array<{filterKey: string, value: string, label: string}> = [];
    Object.entries(activeFilters || {}).forEach(([filterKey, values]) => {
      values.forEach(value => {
        const filterLabel = filterLabels[filterKey] || filterKey;
        items.push({
          filterKey,
          value,
          label: `${filterLabel}: ${value}`
        });
      });
    });
    return items;
  };

  const activeFilterItems = getActiveFilterItems();

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            Rensa alla
          </button>
        )}
      </div>

      {/* Active Filters Section */}
      {activeFilterItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Aktiva filter</h3>
          <div className="flex flex-wrap gap-2">
            {activeFilterItems.map((item, index) => (
              <div
                key={`${item.filterKey}-${item.value}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
              >
                <span>{item.label}</span>
                <button
                  onClick={() => onFilterChange(item.filterKey, item.value, false)}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  title={`Ta bort ${item.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(filterOptions || {}).map(([filterKey, options]) => {
          if (options.length === 0) return null;

          const activeValues = activeFilters[filterKey] || [];
          const label = filterLabels[filterKey] || filterKey;
          const isExpanded = expandedFilters[filterKey] !== false; // Default to expanded
          const filteredOptions = getFilteredOptions(filterKey, options);
          const showSearch = options.length > 10; // Show search for categories with many options

          return (
            <div key={filterKey} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900 text-sm">{label}</h3>
                {options.length > 5 && (
                  <button
                    onClick={() => toggleFilter(filterKey)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {isExpanded && (
                <>
                  {/* Search field for large option lists */}
                  {showSearch && (
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Sök ${label.toLowerCase()}...`}
                        value={searchTerms[filterKey] || ''}
                        onChange={(e) => handleSearchChange(filterKey, e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Show active filters count if there are many options */}
                  {activeValues.length > 0 && options.length > 10 && (
                    <div className="mb-2 text-xs text-blue-600">
                      {activeValues.length} valda filter
                    </div>
                  )}

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isChecked = activeValues.includes(option);
                        
                        return (
                          <label
                            key={option}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors group"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => onFilterChange(filterKey, option, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className={`
                                w-4 h-4 border-2 rounded transition-all duration-200 flex items-center justify-center
                                ${isChecked 
                                  ? 'bg-blue-600 border-blue-600' 
                                  : 'border-gray-300 bg-white group-hover:border-gray-400'
                                }
                              `}>
                                {isChecked && (
                                  <svg 
                                    className="w-2.5 h-2.5 text-white" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className={`text-sm transition-colors ${
                              isChecked ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm py-2">
                        Inga alternativ hittades för "{searchTerms[filterKey]}"
                      </p>
                    )}
                  </div>

                  {/* Show count info for large lists */}
                  {options.length > 20 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Visar {filteredOptions.length} av {options.length} alternativ
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {!hasActiveFilters && Object.keys(filterOptions || {}).length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">Inga filter tillgängliga</p>
      )}
    </div>
  );
} 
