import React, { useEffect } from 'react';
import { useFilterStore, type FilterStore } from '../../stores';
import type { FilterState } from '../../stores';
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Chip,
  IconButton, Collapse, Slider, FormControlLabel, Switch, TextField,
  Fade, Tabs, Tab, Divider, Badge, Button,
  InputAdornment, Grid as MuiGrid,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from '../../constants/bookStatus';
import { GENRES } from '../../constants/genres';
import type { Book, BookStatus } from '../../types/Book';
import StatisticsGrid from '../statistics/StatisticsGrid';
import MetricsGrid from '../statistics/MetricsGrid';

interface BooksStats {
  total: number;
  read: number;
  inProgress: number;
  dropped: number;
}

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
  completionRate: number;
}


interface FilterStatisticsPanelProps {
  books: Book[];
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  booksStats: BooksStats;
  additionalStats: AdditionalStats;
}

const FilterStatisticsPanel: React.FC<FilterStatisticsPanelProps> = ({
  books, 
  onSortChange,
  isFilterOpen, 
  onFilterToggle, 
  booksStats, 
  additionalStats,
}) => {
  // Zustand Store
  const filters = useFilterStore((state: FilterStore) => state.filters);
  const activeTab = useFilterStore((state: FilterStore) => state.activeTab);
  const expanded = useFilterStore((state: FilterStore) => state.expanded);
  const showAdvancedFilters = useFilterStore((state) => state.showAdvancedFilters);
  const activeFilters = useFilterStore((state) => state.activeFilters);
  
  const setFilter = useFilterStore((state) => state.setFilter);
  const toggleTab = useFilterStore((state) => state.toggleTab);
  const setExpanded = useFilterStore((state) => state.setExpanded);
  const toggleAdvancedFiltersAction = useFilterStore((state) => state.toggleAdvancedFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const toggleExpandedAction = useFilterStore((state) => state.toggleExpanded);
  
  useEffect(() => {
    setExpanded(isFilterOpen);
  }, [isFilterOpen, setExpanded]);

  const handleTabChange = (_: React.SyntheticEvent, newTab: string) => {
    toggleTab(newTab as 'filters' | 'sort' | 'stats');
    
    if (activeTab === newTab) {
      onFilterToggle();
    } else if (!expanded) {
      onFilterToggle();
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: unknown) => {
    setFilter(field, value);
  };

  const clearFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetFilters();
  };

  const toggleAdvancedFilters = () => {
    toggleAdvancedFiltersAction();
  };
  
  // Rufe onSortChange nur bei Sort-Änderungen auf (optional)
  useEffect(() => {
    if (onSortChange) {
      onSortChange(filters.sortBy, filters.sortOrder);
    }
  }, [filters.sortBy, filters.sortOrder, onSortChange]);

  const genreOptions = Object.entries(GENRES).map(([value, label]) => ({
    value, label,
  }));

  const renderFilterBadges = () => {
    const badges = [];
    
    if (filters.status !== 'all') {
      badges.push(
        <Chip 
          key="status" 
          label={BOOK_STATUS_LABELS[filters.status as BookStatus]} 
          size="small" 
          color="primary" 
          variant="outlined"
          onDelete={() => handleFilterChange('status', 'all')}
          sx={{ height: 24 }}
        />,
      );
    }
    
    if (filters.genre !== 'all') {
      const genreLabel = genreOptions.find(g => g.value === filters.genre)?.label || filters.genre;
      badges.push(
        <Chip 
          key="genre" 
          label={genreLabel} 
          size="small" 
          color="primary" 
          variant="outlined"
          onDelete={() => handleFilterChange('genre', 'all')}
          sx={{ height: 24 }}
        />,
      );
    }
    
    if (filters.author.trim()) {
      badges.push(
        <Chip 
          key="author" 
          label={`Autor: ${filters.author}`} 
          size="small" 
          color="primary" 
          variant="outlined"
          onDelete={() => handleFilterChange('author', '')}
          sx={{ height: 24 }}
        />,
      );
    }
    
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) {
      badges.push(
        <Chip 
          key="rating" 
          label={`Ocena: ${filters.ratingRange[0]}-${filters.ratingRange[1]}`} 
          size="small" 
          color="primary" 
          variant="outlined"
          onDelete={() => handleFilterChange('ratingRange', [0, 10])}
          sx={{ height: 24 }}
        />,
      );
    }
    
    if (filters.showOnlyFavorites) {
      badges.push(
        <Chip 
          key="favorites" 
          label="Tylko ulubione" 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<StarIcon fontSize="small" />}
          onDelete={() => handleFilterChange('showOnlyFavorites', false)}
          sx={{ height: 24 }}
        />,
      );
    }
    
    return badges;
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper sx={{
        mb: 3, borderRadius: 2, overflow: 'hidden',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth" 
          sx={{ 
            minHeight: 40, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '& .MuiTab-root': { 
              minHeight: 40, 
              py: 0.5,
              fontWeight: 500,
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                fontWeight: 600,
                opacity: 1,
                color: 'white',
              },
              '&:hover': {
                opacity: 1,
              },
            },
          }}
          TabIndicatorProps={{
            style: {
              height: 3,
              backgroundColor: 'white',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab 
            value="filters" 
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                width: '100%', 
                height: '100%',
                justifyContent: 'center',
              }}>
                <FilterListIcon fontSize="small" />
                <span>Filtry</span>
                {activeFilters > 0 && (
                  <Badge 
                    badgeContent={activeFilters} 
                    color="error" 
                    sx={{ ml: 0.5 }}
                    overlap="circular"
                  />
                )}
              </Box>
            }
            sx={{ width: '100%' }}
            onClick={() => {
              if (activeTab === 'filters') {
                onFilterToggle();
                toggleExpandedAction();
              }
            }}
          />
          <Tab 
            value="sort" 
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                width: '100%', 
                height: '100%',
                justifyContent: 'center',
              }}>
                <SortIcon fontSize="small" />
                <span>Sortowanie</span>
              </Box>
            }
            sx={{ width: '100%' }}
            onClick={() => {
              if (activeTab === 'sort') {
                onFilterToggle();
                toggleExpandedAction();
              }
            }}
          />
          <Tab 
            value="stats" 
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                width: '100%', 
                height: '100%',
                justifyContent: 'center',
              }}>
                <AnalyticsIcon fontSize="small" />
                <span>Statystyki</span>
              </Box>
            }
            sx={{ width: '100%' }}
            onClick={() => {
              if (activeTab === 'stats') {
                onFilterToggle();
                toggleExpandedAction();
              }
            }}
          />
        </Tabs>

        {/* Content */}
        <Collapse in={expanded}>
          {activeTab === 'filters' && (
            <Box sx={{ p: 2 }}>
              {/* Active Filter Chips */}
              {activeFilters > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {renderFilterBadges()}
                  {activeFilters > 1 && (
                    <Button 
                      size="small" 
                      variant="text" 
                      color="primary" 
                      onClick={clearFilters}
                      sx={{ fontSize: '0.75rem', py: 0 }}
                    >
                      Wyczyść wszystkie
                    </Button>
                  )}
                </Box>
              )}
              
              {/* Quick Filters */}
              <Box sx={{ mb: 2 }}>
                <MuiGrid container spacing={2}>
                  {/* First row: Status, Genre, Author */}
                  <MuiGrid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value as BookStatus | 'all')}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem value="all">Wszystkie</MenuItem>
                        {BOOK_STATUSES.map((status: BookStatus) => (
                          <MenuItem key={status} value={status}>
                            {BOOK_STATUS_LABELS[status]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MuiGrid>
                  <MuiGrid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Gatunek</InputLabel>
                      <Select
                        value={filters.genre}
                        label="Gatunek"
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem value="all">Wszystkie</MenuItem>
                        {genreOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MuiGrid>
                  <MuiGrid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Autor"
                      value={filters.author || ''}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: filters.author ? (
                          <InputAdornment position="end">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFilterChange('author', '');
                              }}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  </MuiGrid>
                </MuiGrid>
              </Box>
              
              
              {/* Advanced Filters Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Button
                  size="small"
                  startIcon={<TuneIcon />}
                  onClick={toggleAdvancedFilters}
                  sx={{ textTransform: 'none' }}
                >
                  {showAdvancedFilters ? 'Ukryj filtry zaawansowane' : 'Pokaż filtry zaawansowane'}
                </Button>
                
                {(filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10 || filters.pagesRange[0] > 0 || filters.pagesRange[1] < 5000) && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      handleFilterChange('ratingRange', [0, 10]);
                      handleFilterChange('pagesRange', [0, 5000]);
                    }}
                  >
                    Resetuj zakresy
                  </Button>
                )}
              </Box>
              
              {/* Advanced Filters */}
              <Collapse in={showAdvancedFilters}>
                <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                  <MuiGrid container spacing={3}>
                    {/* Rating Range */}
                    <MuiGrid item xs={12} sm={6}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Zakres ocen: {filters.ratingRange[0]} - {filters.ratingRange[1]}
                      </Typography>
                      <Slider
                        size="small"
                        value={filters.ratingRange}
                        onChange={(_, newValue) => handleFilterChange('ratingRange', newValue as [number, number])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10}
                        step={0.5}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 5, label: '5' },
                          { value: 10, label: '10' },
                        ]}
                        sx={{
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: '0px 0px 0px 8px rgba(102, 126, 234, 0.16)',
                            },
                          },
                          '& .MuiSlider-rail': {
                            opacity: 0.3,
                          },
                        }}
                      />
                    </MuiGrid>
                    
                    {/* Pages Range */}
                    <MuiGrid item xs={12} sm={6}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Zakres stron: {filters.pagesRange[0]} - {filters.pagesRange[1]}
                      </Typography>
                      <Slider
                        size="small"
                        value={filters.pagesRange}
                        onChange={(_, newValue) => handleFilterChange('pagesRange', newValue as [number, number])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={5000}
                        step={50}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 2500, label: '2500' },
                          { value: 5000, label: '5000' },
                        ]}
                        sx={{
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: '0px 0px 0px 8px rgba(102, 126, 234, 0.16)',
                            },
                          },
                          '& .MuiSlider-rail': {
                            opacity: 0.3,
                          },
                        }}
                      />
                    </MuiGrid>
                  </MuiGrid>
                </Box>
              </Collapse>
              
              {/* Results Summary */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Wyświetlanie <strong>{books.length}</strong> książek
                </Typography>
                
                {activeFilters > 0 && (
                  <Chip
                    icon={<CheckCircleIcon fontSize="small" />}
                    label={`${activeFilters} ${activeFilters === 1 ? 'aktywny filtr' : 'aktywne filtry'}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
          
          {activeTab === 'sort' && (
            <Box sx={{ p: 2 }}>
              {/* Sort Controls */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SortIcon fontSize="small" />
                  Sortuj według
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 1 }}>
                  {[
                    { value: 'title', label: 'Tytuł', icon: '📚' },
                    { value: 'author', label: 'Autor', icon: '✍️' },
                    { value: 'rating', label: 'Ocena', icon: '⭐' },
                    { value: 'pages', label: 'Liczba stron', icon: '📄' },
                    { value: 'dateAdded', label: 'Data dodania', icon: '📅' },
                    { value: 'status', label: 'Status', icon: '📊' },
                  ].map((option) => (
                    <Paper 
                      key={option.value}
                      onClick={() => {
                        const sortByValue = option.value as 'title' | 'author' | 'rating' | 'pages' | 'dateAdded' | 'status';
                        if (filters.sortBy === sortByValue) {
                          handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          handleFilterChange('sortBy', sortByValue);
                        }
                      }}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: filters.sortBy === option.value ? 'primary.main' : 'divider',
                        bgcolor: filters.sortBy === option.value ? 'primary.50' : 'background.paper',
                        '&:hover': {
                          bgcolor: filters.sortBy === option.value ? 'primary.100' : 'action.hover',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 3px 5px rgba(0,0,0,0.08)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        fontSize: '1.2rem', 
                        width: 28, 
                        height: 28, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: filters.sortBy === option.value ? 'primary.100' : 'action.hover',
                      }}>
                        {option.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={filters.sortBy === option.value ? 600 : 400}>
                          {option.label}
                        </Typography>
                      </Box>
                      {filters.sortBy === option.value && (
                        <Box>
                          {filters.sortOrder === 'asc' ? 
                            <ArrowUpwardIcon fontSize="small" color="primary" /> : 
                            <ArrowDownwardIcon fontSize="small" color="primary" />}
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.secondary">
                    Dodatkowe opcje
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.showOnlyFavorites}
                        onChange={(e) => handleFilterChange('showOnlyFavorites', e.target.checked)}
                        color="warning"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon fontSize="small" color={filters.showOnlyFavorites ? 'warning' : 'action'} />
                        <Typography variant="body2">Tylko ulubione</Typography>
                      </Box>
                    }
                  />
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Kierunek sortowania
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {filters.sortOrder === 'asc' ? (
                      <Button 
                        size="small" 
                        onClick={() => handleFilterChange('sortOrder', 'desc')}
                        startIcon={<ArrowUpwardIcon fontSize="small" />}
                      >
                        Rosnąco
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        onClick={() => handleFilterChange('sortOrder', 'asc')}
                        startIcon={<ArrowDownwardIcon fontSize="small" />}
                      >
                        Malejąco
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
              
              {/* Results Summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Wyświetlanie <strong>{books.length}</strong> książek, sortowanie według <strong>{({
                    'title': 'tytułu',
                    'author': 'autora',
                    'rating': 'oceny',
                    'pages': 'liczby stron',
                    'dateAdded': 'daty dodania',
                    'status': 'statusu',
                  } as Record<string, string>)[filters.sortBy] || filters.sortBy}</strong> ({filters.sortOrder === 'asc' ? 'rosnąco' : 'malejąco'})
                </Typography>
              </Box>
            </Box>
          )}
          
          {activeTab === 'stats' && (
            <Box sx={{ p: 2 }}>
              <StatisticsGrid booksStats={booksStats} additionalStats={additionalStats} />
              <Divider sx={{ my: 2 }} />
              <MetricsGrid additionalStats={additionalStats} />
            </Box>
          )}
        </Collapse>
      </Paper>
    </Fade>
  );
};

export default FilterStatisticsPanel;