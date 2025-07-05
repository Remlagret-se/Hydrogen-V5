import {
  useFetcher,
  useNavigate,
  type FormProps,
  type Fetcher,
} from '@remix-run/react';
import React, {useRef, useEffect, useState} from 'react';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';
import {useDebounce} from '~/lib/hooks/useDebounce';
import {SearchCache} from '~/lib/search/cache';

interface SearchFormPredictiveChildrenProps {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fetcher: Fetcher<PredictiveSearchReturn>;
  isLoading: boolean;
}

interface SearchFormPredictiveProps extends Omit<FormProps, 'children'> {
  children: ((args: SearchFormPredictiveChildrenProps) => React.ReactNode) | null;
  className?: string;
}

export const SEARCH_ENDPOINT = '/search';

/**
 * Förbättrad sökformulärkomponent med debouncing och caching
 */
export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFormPredictiveProps) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const aside = useAside();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Använd debounce för söktermen
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effekt för att hantera debounced sökningar
  useEffect(() => {
    if (!debouncedSearchTerm) return;

    // Kolla först i cachen
    const cachedResults = SearchCache.get(debouncedSearchTerm);
    if (cachedResults) {
      fetcher.load(`${SEARCH_ENDPOINT}?q=${debouncedSearchTerm}&limit=5&predictive=true`);
      return;
    }

    // Om inget finns i cache, gör en ny sökning
    setIsLoading(true);
    fetcher.submit(
      {q: debouncedSearchTerm, limit: 5, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }, [debouncedSearchTerm, fetcher]);

  // Spara resultat i cache när vi får svar
  useEffect(() => {
    if (fetcher.data && searchTerm) {
      SearchCache.set(searchTerm, fetcher.data);
      setIsLoading(false);
    }
  }, [fetcher.data, searchTerm]);

  /** Återställ input och blur */
  function resetInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) {
      inputRef.current.blur();
      setSearchTerm('');
    }
  }

  /** Navigera till söksidan */
  function goToSearch() {
    const term = inputRef?.current?.value;
    navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
    aside.close();
  }

  /** Hämta sökresultat baserat på input */
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    setSearchTerm(term);
  }

  // Säkerställ att input har type="search"
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <fetcher.Form {...props} className={className} onSubmit={resetInput}>
      {children({inputRef, fetcher, fetchResults, goToSearch, isLoading})}
    </fetcher.Form>
  );
}
