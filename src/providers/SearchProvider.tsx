import React from 'react';

/**
 * @deprecated Search state has migrated to Zustand useFilterStore.
 * SearchProvider is kept for backward-compatibility as a passthrough component.
 */
export const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default SearchProvider;
