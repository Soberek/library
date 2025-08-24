import { createContext, useContext } from "react";

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export const useSearch = () => {
  return useContext(SearchContext);
};
