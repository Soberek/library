import { useFilterStore } from '../stores';

export const useSearch = () => {
  const searchTerm = useFilterStore((state) => state.filters.searchTerm);
  const setFilter = useFilterStore((state) => state.setFilter);

  return {
    searchTerm,
    setSearchTerm: (term: string) => setFilter('searchTerm', term),
  };
};

export default useSearch;
