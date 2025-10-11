import { useMemo } from 'react';
import { useFilterStore } from '../stores';
import { applyFiltersAndSort } from '../utils/bookFilters';
import type { Book } from '../types/Book';

/**
 * Custom hook for filtering and sorting books
 * 
 * @param books - Array of books to filter and sort
 * @returns Filtered and sorted array of books
 * 
 * @example
 * ```tsx
 * const filteredBooks = useBookFilters(books);
 * ```
 */
export const useBookFilters = (books: Book[]): Book[] => {
  const filters = useFilterStore((state) => state.filters);

  const filteredBooks = useMemo(() => {
    return applyFiltersAndSort(books, filters);
  }, [books, filters]);

  return filteredBooks;
};

