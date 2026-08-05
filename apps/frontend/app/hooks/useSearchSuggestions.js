'use client';

import { useEffect, useRef, useState } from 'react';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 220;
const SUGGESTION_LIMIT = 6;

/**
 * Debounced product suggestions for the nav search bar.
 * Aborts in-flight requests when the query changes or the component unmounts.
 */
export function useSearchSuggestions(query) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const q = String(query || '').trim();

    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    if (q.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: q,
          limit: String(SUGGESTION_LIMIT),
          page: '1',
          sortBy: 'name',
          sortOrder: 'asc'
        });
        const res = await fetch(`/api/products?${params}`, {
          signal: controller.signal,
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Suggestion fetch failed');
        const data = await res.json();
        if (!controller.signal.aborted) {
          setSuggestions(Array.isArray(data.products) ? data.products : []);
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { suggestions, isLoading, minQueryLength: MIN_QUERY_LENGTH };
}
