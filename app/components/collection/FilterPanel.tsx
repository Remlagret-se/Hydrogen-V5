import { Fragment, useState, useMemo } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

interface FilterPanelProps {
  filters: Array<{
    id: string;
    name: string;
    options: Array<{
      value: string;
      label: string;
      checked: boolean;
    }>;
  }>;
  activeFilters: Record<string, string[]>;
  filteredProductsCount: number;
  allProductsCount: number;
  onFilterChange: (filterKey: string, value: string, checked: boolean) => void;
  onRemoveFilter: (filterKey: string, value: string) => void;
  onClearAllFilters: () => void;
  getFilterDisplayName: (filterKey: string) => string;
}

export function FilterPanel({
  filters,
  activeFilters,
  filteredProductsCount,
  allProductsCount,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  getFilterDisplayName,
}: FilterPanelProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0);

  // Filter options based on search
  const getFilteredOptions = (filterId: string, options: any[]) => {
    const searchTerm = searchTerms[filterId]?.toLowerCase() || '';
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm)
    );
  };

  // Virtualized list for long filter lists
  const VirtualizedOptions = ({ filterId, options }: { filterId: string, options: any[] }) => {
    const filteredOptions = getFilteredOptions(filterId, options);
    const [visibleCount, setVisibleCount] = useState(10);
    
    const visibleOptions = filteredOptions.slice(0, visibleCount);
    const hasMore = filteredOptions.length > visibleCount;

    return (
      <>
        {/* Search box for filters with many options */}
        {options.length > 10 && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Sök..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerms[filterId] || ''}
              onChange={(e) => {
                setSearchTerms(prev => ({ ...prev, [filterId]: e.target.value }));
                setVisibleCount(10); // Reset visible count on search
              }}
            />
          </div>
        )}
        
        <div className="space-y-3">
          {visibleOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`filter-${filterId}-${option.value}`}
                name={`${filterId}[]`}
                defaultValue={option.value}
                type="checkbox"
                checked={option.checked}
                onChange={(e) => onFilterChange(filterId, option.value, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`filter-${filterId}-${option.value}`}
                className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Visa fler ({filteredOptions.length - visibleCount} till)
          </button>
        )}
      </>
    );
  };

  const FilterContent = () => (
    <>
      {/* Active filters header */}
      {activeFilterCount > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Aktiva filter ({activeFilterCount})
            </h3>
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Rensa alla
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterKey, values]) =>
              values.map((value) => (
                <span
                  key={`${filterKey}-${value}`}
                  className="inline-flex items-center gap-x-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {getFilterDisplayName(filterKey)}: {value}
                  <button
                    type="button"
                    onClick={() => onRemoveFilter(filterKey, value)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Product count */}
      <div className="mb-6 text-sm text-gray-600">
        Visar {filteredProductsCount} av {allProductsCount} produkter
      </div>

      {/* Filter sections */}
      {filters.map((section) => (
        <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6" defaultOpen={section.options.some(opt => opt.checked)}>
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <VirtualizedOptions filterId={section.id} options={section.options} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filter</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Stäng meny</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 px-4">
                  <FilterContent />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile filter button */}
      <button
        type="button"
        className="inline-flex items-center lg:hidden text-gray-400 hover:text-gray-500"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <FunnelIcon className="h-5 w-5" aria-hidden="true" />
        <span className="ml-2 text-sm font-medium text-gray-700">Filter</span>
        {activeFilterCount > 0 && (
          <span className="ml-1.5 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
    </>
  );
} 