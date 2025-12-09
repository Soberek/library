import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { BookStatus } from "../types/Book";

// Tab-Typen
export type TabType = "filters" | "sort" | "stats";

// Filter-State
export interface FilterState {
  status: BookStatus | "all";
  genre: string | "all";
  ratingRange: [number, number];
  pagesRange: [number, number];
  sortBy: "title" | "author" | "rating" | "pages" | "dateAdded" | "status";
  sortOrder: "asc" | "desc";
  showOnlyFavorites: boolean;
  author: string;
  searchTerm: string;
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

// Store mit Actions
export interface FilterStore extends AppState {
  // Actions
  setFilter: (field: keyof FilterState, value: unknown) => void;
  setTab: (tab: TabType) => void;
  toggleExpanded: () => void;
  setExpanded: (value: boolean) => void;
  toggleTab: (tab: TabType) => void;
  toggleAdvancedFilters: () => void;
  resetFilters: (
    initialSortBy?: string,
    initialSortOrder?: "asc" | "desc",
  ) => void;
  getActiveFiltersCount: () => number;
}

// Hilfsfunktion zur Berechnung der aktiven Filter
const calculateActiveFilters = (filters: FilterState): number => {
  let count = 0;
  if (filters.status !== "all") count++;
  if (filters.genre !== "all") count++;
  if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) count++;
  if (filters.pagesRange[0] > 0 || filters.pagesRange[1] < 5000) count++;
  if (filters.showOnlyFavorites) count++;
  if (filters.author.trim()) count++;
  if (filters.searchTerm.trim()) count++;
  return count;
};

// Initial State
const initialFilters: FilterState = {
  status: "all",
  genre: "all",
  ratingRange: [0, 10],
  pagesRange: [0, 5000],
  sortBy: "status",
  sortOrder: "asc",
  showOnlyFavorites: false,
  author: "",
  searchTerm: "",
};

const initialState: AppState = {
  filters: initialFilters,
  activeTab: "filters",
  lastOpenTab: null,
  expanded: false,
  showAdvancedFilters: false,
  activeFilters: 0,
};

// Zustand Store
export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setFilter: (field, value) =>
        set(
          (state) => {
            const newFilters = {
              ...state.filters,
              [field]: value,
            };
            return {
              filters: newFilters,
              activeFilters: calculateActiveFilters(newFilters),
            };
          },
          false,
          "setFilter",
        ),

      setTab: (tab) =>
        set(
          {
            activeTab: tab,
            lastOpenTab: tab,
          },
          false,
          "setTab",
        ),

      toggleExpanded: () =>
        set(
          (state) => ({ expanded: !state.expanded }),
          false,
          "toggleExpanded",
        ),

      setExpanded: (value) => set({ expanded: value }, false, "setExpanded"),

      toggleTab: (tab) =>
        set(
          (state) => {
            // Wenn der gleiche Tab angeklickt wird
            if (state.activeTab === tab) {
              return {
                expanded: !state.expanded,
              };
            }
            // Wenn ein anderer Tab angeklickt wird
            return {
              activeTab: tab,
              lastOpenTab: tab,
              expanded: state.expanded || true,
            };
          },
          false,
          "toggleTab",
        ),

      toggleAdvancedFilters: () =>
        set(
          (state) => ({ showAdvancedFilters: !state.showAdvancedFilters }),
          false,
          "toggleAdvancedFilters",
        ),

      resetFilters: (initialSortBy = "status", initialSortOrder = "asc") =>
        set(
          {
            filters: {
              status: "all",
              genre: "all",
              ratingRange: [0, 10],
              pagesRange: [0, 5000],
              sortBy: initialSortBy as FilterState["sortBy"],
              sortOrder: initialSortOrder,
              showOnlyFavorites: false,
              author: "",
              searchTerm: "",
            },
            activeFilters: 0,
          },
          false,
          "resetFilters",
        ),

      getActiveFiltersCount: () => {
        const state = get();
        return calculateActiveFilters(state.filters);
      },
    }),
    { name: "FilterStore" },
  ),
);
