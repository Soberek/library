import { useFilterStore } from '../filterStore';

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it('should initialize with default state', () => {
    const state = useFilterStore.getState();
    expect(state.filters.status).toBe('all');
    expect(state.filters.genre).toBe('all');
    expect(state.filters.showOnlyFavorites).toBe(false);
    expect(state.activeFilters).toBe(0);
  });

  it('should update filters and calculate activeFilters count', () => {
    useFilterStore.getState().setFilter('status', 'Przeczytana');
    expect(useFilterStore.getState().filters.status).toBe('Przeczytana');
    expect(useFilterStore.getState().activeFilters).toBe(1);

    useFilterStore.getState().setFilter('genre', 'Sci-Fi');
    expect(useFilterStore.getState().activeFilters).toBe(2);

    useFilterStore.getState().setFilter('showOnlyFavorites', true);
    expect(useFilterStore.getState().activeFilters).toBe(3);
  });

  it('should toggle tabs and expansion', () => {
    expect(useFilterStore.getState().expanded).toBe(false);

    useFilterStore.getState().toggleExpanded();
    expect(useFilterStore.getState().expanded).toBe(true);

    useFilterStore.getState().setTab('sort');
    expect(useFilterStore.getState().activeTab).toBe('sort');
  });

  it('should reset filters properly', () => {
    useFilterStore.getState().setFilter('status', 'Przeczytana');
    useFilterStore.getState().setFilter('searchTerm', 'test');
    expect(useFilterStore.getState().activeFilters).toBe(2);

    useFilterStore.getState().resetFilters('title', 'asc');
    const state = useFilterStore.getState();
    expect(state.filters.status).toBe('all');
    expect(state.filters.searchTerm).toBe('');
    expect(state.filters.sortBy).toBe('title');
    expect(state.filters.sortOrder).toBe('asc');
    expect(state.activeFilters).toBe(0);
  });
});
