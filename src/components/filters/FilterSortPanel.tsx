import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Slider,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from '../../constants/bookStatus';
import { GENRES } from '../../constants/genres';
import type { Book, BookStatus } from '../../types/Book';

interface FilterSortPanelProps {
  books: Book[];
  onFilterChange: (filteredBooks: Book[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface FilterState {
  status: BookStatus | 'all';
  genre: string | 'all';
  ratingRange: [number, number];
  pagesRange: [number, number];
  sortBy: 'title' | 'author' | 'rating' | 'pages' | 'dateAdded' | 'status';
  sortOrder: 'asc' | 'desc';
  showOnlyFavorites: boolean;
  author: string;
}

const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  books,
  onFilterChange,
  isOpen,
  onToggle,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    genre: "all",
    ratingRange: [0, 10],
    pagesRange: [0, 5000],
    sortBy: "dateAdded",
    sortOrder: "desc",
    showOnlyFavorites: false,
    author: "",
  });

  const applyFilters = React.useCallback(() => {
    let filtered = [...books];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((book) => book.read === filters.status);
    }

    // Genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter((book) => book.genre === filters.genre);
    }

    // Rating filter
    filtered = filtered.filter(
      (book) =>
        book.rating >= filters.ratingRange[0] &&
        book.rating <= filters.ratingRange[1],
    );

    // Pages filter
    filtered = filtered.filter(
      (book) =>
        book.overallPages >= filters.pagesRange[0] &&
        book.overallPages <= filters.pagesRange[1],
    );

    // Favorites filter
    if (filters.showOnlyFavorites) {
      filtered = filtered.filter((book) => book.isFavorite === true);
    }

    if (filters.author.trim()) {
      const searchAuthor = filters.author.toLowerCase();
      filtered = filtered.filter((book) => book.author.toLowerCase().includes(searchAuthor));
    }

    // Sorting: primary by status (BOOK_STATUSES order so "W trakcie" is first),
    // secondary by selected sort field and order.
    filtered.sort((a, b) => {
      // Primary: status priority only for default sortBy
      if (filters.sortBy === 'status') {
        const aStatusIndex = BOOK_STATUSES.indexOf(a.read as BookStatus);
        const bStatusIndex = BOOK_STATUSES.indexOf(b.read as BookStatus);

        if (aStatusIndex !== bStatusIndex) return aStatusIndex - bStatusIndex;
      }

      // Secondary (or primary if not default): selected sort field

      switch (filters.sortBy) {
        case 'title': {
          const aValue = a.title.toLowerCase();
          const bValue = b.title.toLowerCase();
          return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
        case 'author': {
          const aValue = a.author.toLowerCase();
          const bValue = b.author.toLowerCase();
          return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
        case 'rating': {
          const aValue = a.rating;
          const bValue = b.rating;
          return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
        case 'pages': {
          const aValue = a.overallPages;
          const bValue = b.overallPages;
          return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
        case 'dateAdded': {
          // Status primary for dateAdded
          const aStatusIndexDate = BOOK_STATUSES.indexOf(a.read as BookStatus);
          const bStatusIndexDate = BOOK_STATUSES.indexOf(b.read as BookStatus);
          if (aStatusIndexDate !== bStatusIndexDate) return aStatusIndexDate - bStatusIndexDate;

          const aValue = new Date(a.createdAt || 0).getTime();
          const bValue = new Date(b.createdAt || 0).getTime();
          return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
        case 'status': {
          const aStatusIndex = BOOK_STATUSES.indexOf(a.read as BookStatus);
          const bStatusIndex = BOOK_STATUSES.indexOf(b.read as BookStatus);
          return filters.sortOrder === 'asc' ? aStatusIndex - bStatusIndex : bStatusIndex - aStatusIndex;
        }
        default:
          return 0;
      }
    });

    onFilterChange(filtered);
  }, [books, filters, onFilterChange]);

  const clearFilters = () => {
    setFilters({
      status: 'all',
      genre: 'all',
      ratingRange: [0, 10],
      pagesRange: [0, 5000],
      sortBy: 'dateAdded',
      sortOrder: 'desc',
      showOnlyFavorites: false,
      author: '',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.genre !== 'all') count++;
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) count++;
    if (filters.pagesRange[0] > 0 || filters.pagesRange[1] < 5000) count++;
    if (filters.showOnlyFavorites) count++;
    if (filters.author.trim()) count++;
    return count;
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, books, applyFilters]);

  const genreOptions = Object.entries(GENRES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Paper
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <FilterListIcon />
          <Typography variant="h6" fontWeight="600">
            Filtry i sortowanie
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={getActiveFiltersCount()}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {getActiveFiltersCount() > 0 && (
            <IconButton
              size="small"
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              sx={{ color: 'white' }}
            >
              <ClearIcon />
            </IconButton>
          )}
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={isOpen}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value as BookStatus | 'all',
                    }))
                  }
                >
                  <MenuItem value="all">Wszystkie</MenuItem>
                  {BOOK_STATUSES.map((status: BookStatus) => (
                    <MenuItem key={status} value={status}>
                      {BOOK_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Genre Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gatunek</InputLabel>
                <Select
                  value={filters.genre}
                  label="Gatunek"
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, genre: e.target.value }))
                  }
                >
                  <MenuItem value="all">Wszystkie</MenuItem>
                  {genreOptions.map(
                    (option: { value: string; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Author Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Autor"
                value={filters.author}
                onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
              />
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sortuj według</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sortuj według"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as
                        | 'title'
                        | 'author'
                        | 'rating'
                        | 'pages'
                        | 'dateAdded'
                        | 'status',
                    }))
                  }
                >
                  <MenuItem value="dateAdded">Data dodania</MenuItem>
                  <MenuItem value="title">Tytuł</MenuItem>
                  <MenuItem value="author">Autor</MenuItem>
                  <MenuItem value="rating">Ocena</MenuItem>
                  <MenuItem value="pages">Liczba stron</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Kolejność</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="Kolejność"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortOrder: e.target.value as 'asc' | 'desc',
                    }))
                  }
                >
                  <MenuItem value="desc">Malejąco</MenuItem>
                  <MenuItem value="asc">Rosnąco</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Rating Range */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Zakres ocen: {filters.ratingRange[0]} - {filters.ratingRange[1]}
              </Typography>
              <Slider
                value={filters.ratingRange}
                onChange={(_, newValue) =>
                  setFilters((prev) => ({
                    ...prev,
                    ratingRange: newValue as [number, number],
                  }))
                }
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
              />
            </Grid>

            {/* Pages Range */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Zakres stron: {filters.pagesRange[0]} - {filters.pagesRange[1]}
              </Typography>
              <Slider
                value={filters.pagesRange}
                onChange={(_, newValue) =>
                  setFilters((prev) => ({
                    ...prev,
                    pagesRange: newValue as [number, number],
                  }))
                }
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={50}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2500, label: '2500' },
                  { value: 5000, label: '5000' },
                ]}
              />
            </Grid>

            {/* Favorites Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.showOnlyFavorites}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        showOnlyFavorites: e.target.checked,
                      }))
                    }
                  />
                }
                label="Pokaż tylko ulubione książki"
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterSortPanel;
