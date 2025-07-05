import {useState} from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {ChevronDownIcon, PlusIcon} from '@heroicons/react/20/solid';
import {NavLink, useSearchParams} from '@remix-run/react';

const filters = [
  {
    id: 'brand',
    name: 'Varumärke',
    options: [
      {value: 'skf', label: 'SKF'},
      {value: 'fag', label: 'FAG'},
      {value: 'nsk', label: 'NSK'},
      {value: 'ntn', label: 'NTN'},
      {value: 'timken', label: 'Timken'},
      {value: 'ina', label: 'INA'},
    ],
  },
  {
    id: 'type',
    name: 'Lagertyp',
    options: [
      {value: 'deep-groove', label: 'Spårkullager'},
      {value: 'angular-contact', label: 'Vinkelkontaktlager'},
      {value: 'spherical', label: 'Sfäriska kullager'},
      {value: 'cylindrical', label: 'Cylindriska rullager'},
      {value: 'tapered', label: 'Koniska rullager'},
      {value: 'needle', label: 'Nållager'},
    ],
  },
  {
    id: 'diameter',
    name: 'Innerdiameter',
    options: [
      {value: '0-10', label: '0-10 mm'},
      {value: '10-20', label: '10-20 mm'},
      {value: '20-50', label: '20-50 mm'},
      {value: '50-100', label: '50-100 mm'},
      {value: '100-200', label: '100-200 mm'},
      {value: '200+', label: 'Över 200 mm'},
    ],
  },
  {
    id: 'price',
    name: 'Pris',
    options: [
      {value: '0-500', label: '0-500 kr'},
      {value: '500-1000', label: '500-1000 kr'},
      {value: '1000-2500', label: '1000-2500 kr'},
      {value: '2500-5000', label: '2500-5000 kr'},
      {value: '5000+', label: 'Över 5000 kr'},
    ],
  },
];

const subCategories = [
  {name: 'Alla lager', href: '/collections/alla-lager'},
  {name: 'Kullager', href: '/collections/kullager'},
  {name: 'Rullager', href: '/collections/rullager'},
  {name: 'Glidlager', href: '/collections/glidlager'},
  {name: 'Speciallager', href: '/collections/speciallager'},
];

interface CollectionFiltersProps {
  totalProducts?: number;
  children: React.ReactNode;
  collectionTitle?: string;
  collectionDescription?: string;
}

export function CollectionFilters({
  totalProducts = 0,
  children,
  collectionTitle = 'Produkter',
  collectionDescription,
}: CollectionFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (
    filterId: string,
    optionValue: string,
    checked: boolean,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    if (checked) {
      // Add filter
      const existing = newParams.get(filterId);
      if (existing) {
        newParams.set(filterId, `${existing},${optionValue}`);
      } else {
        newParams.set(filterId, optionValue);
      }
    } else {
      // Remove filter
      const existing = newParams.get(filterId);
      if (existing) {
        const values = existing.split(',').filter((v) => v !== optionValue);
        if (values.length > 0) {
          newParams.set(filterId, values.join(','));
        } else {
          newParams.delete(filterId);
        }
      }
    }

    setSearchParams(newParams);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filter</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Stäng meny</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="px-4 py-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Kategorier
                </h3>
                <ul className="space-y-4">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <NavLink
                        to={category.href}
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        {category.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Filters */}
              <form className="mt-4">
                {filters.map((section) => (
                  <Disclosure
                    key={section.name}
                    as="div"
                    className="border-t border-gray-200 pt-4 pb-4"
                  >
                    <fieldset>
                      <legend className="w-full px-2">
                        <DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                          <span className="text-sm font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="size-5 rotate-0 transform group-data-[open]:-rotate-180"
                            />
                          </span>
                        </DisclosureButton>
                      </legend>
                      <DisclosurePanel className="px-4 pt-4 pb-2">
                        <div className="space-y-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    defaultValue={option.value}
                                    id={`${section.id}-${optionIdx}-mobile`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    onChange={(e) =>
                                      handleFilterChange(
                                        section.id,
                                        option.value,
                                        e.target.checked,
                                      )
                                    }
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:checked]:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label
                                htmlFor={`${section.id}-${optionIdx}-mobile`}
                                className="text-sm text-gray-500"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </fieldset>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {collectionTitle}
            </h1>
            {collectionDescription && (
              <p className="mt-4 text-base text-gray-500">
                {collectionDescription}
              </p>
            )}
            {totalProducts > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Visar {totalProducts} produkter
              </p>
            )}
          </div>

          <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filter</h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center lg:hidden"
              >
                <span className="text-sm font-medium text-gray-700">
                  Filter
                </span>
                <PlusIcon
                  aria-hidden="true"
                  className="ml-1 size-5 shrink-0 text-gray-400"
                />
              </button>

              <div className="hidden lg:block">
                {/* Desktop Categories */}
                <div className="pb-10">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Kategorier
                  </h3>
                  <ul className="space-y-4">
                    {subCategories.map((category) => (
                      <li key={category.name}>
                        <NavLink
                          to={category.href}
                          className="block text-sm text-gray-600 hover:text-gray-900"
                        >
                          {category.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desktop Filters */}
                <form className="divide-y divide-gray-200">
                  {filters.map((section) => (
                    <div
                      key={section.name}
                      className="py-10 first:pt-0 last:pb-0"
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.name}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    defaultValue={option.value}
                                    id={`${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    onChange={(e) =>
                                      handleFilterChange(
                                        section.id,
                                        option.value,
                                        e.target.checked,
                                      )
                                    }
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:checked]:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label
                                htmlFor={`${section.id}-${optionIdx}`}
                                className="text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

            {/* Product grid */}
            <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

