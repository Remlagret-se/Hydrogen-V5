import { useEffect, useRef } from 'react';

export function useDebounce(
  fn: () => void,
  delay: number,
  deps: React.DependencyList
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up the new timeout
    timeoutRef.current = setTimeout(() => {
      fn();
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...deps, delay]); // Include delay in deps to handle delay changes
} 
