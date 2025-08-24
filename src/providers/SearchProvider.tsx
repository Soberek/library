import { useState } from "react";

import { SearchContext } from "../hooks/useSearch";

export const SearchProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};
