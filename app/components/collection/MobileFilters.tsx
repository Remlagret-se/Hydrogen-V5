import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { CollectionFilters } from './CollectionFilters';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions?: Record<string, string[]>;
  activeFilters?: Record<string, string[]>;
  onFilterChange: (filterKey: string, value: string, checked: boolean) => void;
  onClearAll: () => void;
}

export function MobileFilters({ 
  isOpen, 
  onClose, 
  filterOptions = {}, 
  activeFilters = {}, 
  onFilterChange, 
  onClearAll 
}: MobileFiltersProps) {
  const activeFilterCount = Object.values(activeFilters || {}).reduce(
    (total, values) => total + (values?.length || 0), 
    0
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 border-b">
                      <div className="flex items-center space-x-2">
                        <Dialog.Title className="text-lg font-medium">
                          Filter
                        </Dialog.Title>
                        {activeFilterCount > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">Stäng</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex-1 px-4 py-6">
                      <CollectionFilters
                        filterOptions={filterOptions || {}}
                        activeFilters={activeFilters || {}}
                        onFilterChange={onFilterChange}
                        onClearAll={onClearAll}
                      />
                    </div>

                    <div className="border-t px-4 py-6 space-y-3">
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => {
                            onClearAll();
                            onClose();
                          }}
                        >
                          Rensa alla filter
                        </button>
                      )}
                      <button
                        type="button"
                        className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        {activeFilterCount > 0 ? `Visa resultat (${activeFilterCount} filter)` : 'Visa resultat'}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 
