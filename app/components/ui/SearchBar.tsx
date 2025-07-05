import {useState, useEffect} from 'react';
import {useDebounce} from '@app/hooks/useDebounce';
import {motion, AnimatePresence} from 'framer-motion';
import {Search} from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Sök produkter...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useDebounce(
    () => {
      setDebouncedValue(query);
    },
    300,
    [query],
  );

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <motion.div
      initial={{opacity: 0, y: -20}}
      animate={{opacity: 1, y: 0}}
      className="w-full max-w-md mx-auto relative"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border p-2"
          >
            <p className="text-sm text-gray-500">Söker efter: {query}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
