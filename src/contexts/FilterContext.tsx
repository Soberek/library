import React, { createContext, useContext, useReducer} from 'react';
import type { ReactNode } from 'react';
import type { BookStatus } from '../types/Book';

// Tab-Typen
export type TabType = 'filters' | 'sort' | 'stats';

// Filter-State
export interface FilterState {
  status: BookStatus | 'all';
  genre: string | 'all';
  ratingRange: [number, number];
  pagesRange: [number, number];
  sortBy: 'title' | 'author' | 'rating' | 'pages' | 'dateAdded' | 'status';
  sortOrder: 'asc' | 'desc';
  showOnlyFavorites: boolean;
  author: string;
}

// App-State
export interface AppState {
  filters: FilterState;
  activeTab: TabType;
  lastOpenTab: TabType | null;
  expanded: boolean;
  showAdvancedFilters: boolean;
  activeFilters: number;
}

// Action-Typen
export type FilterAction =
  | { type: 'SET_FILTER'; field: keyof FilterState; value: unknown }
  | { type: 'SET_TAB'; tab: TabType }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EXPANDED'; value: boolean }
  | { type: 'TOGGLE_TAB'; tab: TabType }
  | { type: 'TOGGLE_ADVANCED_FILTERS' }
  | { type: 'RESET_FILTERS'; initialSortBy?: string; initialSortOrder?: 'asc' | 'desc' }
  | { type: 'SET_FILTER_VALUE'; payload: { filterType: keyof FilterState; value: unknown } };

// Hilfsfunktion zur Berechnung der aktiven Filter
export const getActiveFiltersCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.status !== 'all') count++;
  if (filters.genre !== 'all') count++;
  if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) count++;
  if (filters.pagesRange[0] > 0 || filters.pagesRange[1] < 5000) count++;
  if (filters.showOnlyFavorites) count++;
  if (filters.author.trim()) count++;
  return count;
};

// Reducer-Funktion
export const filterReducer = (state: AppState, action: FilterAction): AppState => {
  switch (action.type) {
    case 'SET_FILTER': {
      const newFilters = {
        ...state.filters,
        [action.field]: action.value,
      };
      return {
        ...state,
        filters: newFilters,
        activeFilters: getActiveFiltersCount(newFilters),
      };
    }
    
    case 'SET_TAB':
      return {
        ...state,
        activeTab: action.tab,
        lastOpenTab: action.tab,
      };
    
    case 'TOGGLE_EXPANDED':
      return {
        ...state,
        expanded: !state.expanded,
      };
    
    case 'SET_EXPANDED':
      return {
        ...state,
        expanded: action.value,
      };
      
    case 'TOGGLE_TAB':
      // Wenn der gleiche Tab angeklickt wird
      if (state.activeTab === action.tab) {
        // Panel umschalten (ein/ausklappen)
        return {
          ...state,
          expanded: !state.expanded,
        };
      } 
      // Wenn ein anderer Tab angeklickt wird
      else {
        return {
          ...state,
          activeTab: action.tab,
          lastOpenTab: action.tab,
          // Wenn das Panel geschlossen ist, öffnen
          expanded: state.expanded ? state.expanded : true,
        };
      }
    
    case 'TOGGLE_ADVANCED_FILTERS':
      return {
        ...state,
        showAdvancedFilters: !state.showAdvancedFilters,
      };
    
    case 'RESET_FILTERS': {
      return {
        ...state,
        filters: {
          status: 'all',
          genre: 'all',
          ratingRange: [0, 10],
          pagesRange: [0, 5000],
          sortBy: action.initialSortBy as 'title' | 'author' | 'rating' | 'pages' | 'dateAdded' | 'status',
          sortOrder: action.initialSortOrder || state.filters.sortOrder,
          showOnlyFavorites: false,
          author: '',
        },
        activeFilters: 0,
      };
    }
    
    case 'SET_FILTER_VALUE': {
      const { filterType, value } = action.payload;
      return { ...state, [filterType]: value };
    }
    
    default:
      return state;
  }
};

// Context-Typen
interface FilterContextType {
  state: AppState;
  dispatch: React.Dispatch<FilterAction>;
}

// Context erstellen
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider-Props
interface FilterProviderProps {
  children: ReactNode;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
  isFilterOpen?: boolean;
}

// Provider-Komponente
export const FilterProvider: React.FC<FilterProviderProps> = ({ 
  children, 
  initialSortBy = 'status',
  initialSortOrder = 'asc',
  isFilterOpen = false,
}) => {
  const initialState: AppState = {
    filters: {
      status: 'all',
      genre: 'all',
      ratingRange: [0, 10],
      pagesRange: [0, 5000],
      sortBy: initialSortBy as 'title' | 'author' | 'rating' | 'pages' | 'dateAdded' | 'status',
      sortOrder: initialSortOrder,
      showOnlyFavorites: false,
      author: '',
    },
    activeTab: 'filters',
    lastOpenTab: null,
    expanded: isFilterOpen,
    showAdvancedFilters: false,
    activeFilters: 0,
  };

  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom Hook zum Verwenden des Contexts
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

