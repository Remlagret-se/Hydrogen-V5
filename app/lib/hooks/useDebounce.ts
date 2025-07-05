import {useState, useEffect} from 'react';

/**
 * Hook för att fördröja värdeuppdateringar, användbart för sökning
 * @param value Värdet som ska fördröjas
 * @param delay Fördröjning i millisekunder
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 