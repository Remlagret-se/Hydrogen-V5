import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronDown} from 'lucide-react';

interface Filter {
  id: string;
  name: string;
  options: string[];
}

interface ProductFiltersProps {
  filters: Filter[];
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export function ProductFilters({filters, onFilterChange}: ProductFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const updated = {...prev, [filterId]: newValue};
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {filters.map((filter) => (
        <motion.div
          key={filter.id}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="border rounded-lg overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedFilter(expandedFilter === filter.id ? null : filter.id)
            }
            className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-semibold">{filter.name}</h3>
            <ChevronDown
              className={`h-5 w-5 transform transition-transform ${
                expandedFilter === filter.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {expandedFilter === filter.id && (
              <motion.div
                initial={{height: 0, opacity: 0}}
                animate={{height: 'auto', opacity: 1}}
                exit={{height: 0, opacity: 0}}
                className="p-4 space-y-2"
              >
                {filter.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.id]?.includes(option)}
                      onChange={() => handleFilterChange(filter.id, option)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
