import React, { useEffect, useMemo } from "react";
import { useFilterStore, type FilterStore } from "../../stores";
import type { FilterState } from "../../stores";
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
  TextField,
  Fade,
  Button,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import TuneIcon from "@mui/icons-material/Tune";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TitleIcon from "@mui/icons-material/Title";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "../../constants/bookStatus";
import { GENRES } from "../../constants/genres";
import type { Book, BookStatus } from "../../types/Book";
import StatisticsGrid from "../statistics/StatisticsGrid";
import MetricsGrid from "../statistics/MetricsGrid";
import { formatBookCount } from "../../utils/textHelpers";

interface BooksStats {
  total: number;
  read: number;
  inProgress: number;
  dropped: number;
  wantToRead: number;
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
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  booksStats: BooksStats;
  additionalStats: AdditionalStats;
}

type SortField =
  | "title"
  | "author"
  | "rating"
  | "pages"
  | "dateAdded"
  | "status";

const SORT_OPTIONS: {
  value: SortField;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "title", label: "Tytuł", Icon: TitleIcon },
  { value: "author", label: "Autor", Icon: PersonOutlineIcon },
  { value: "rating", label: "Ocena", Icon: GradeOutlinedIcon },
  { value: "pages", label: "Strony", Icon: MenuBookOutlinedIcon },
  { value: "dateAdded", label: "Data", Icon: CalendarTodayOutlinedIcon },
  { value: "status", label: "Status", Icon: FlagOutlinedIcon },
];

const SORT_LABELS: Record<SortField, string> = {
  title: "tytułu",
  author: "autora",
  rating: "oceny",
  pages: "liczby stron",
  dateAdded: "daty dodania",
  status: "statusu",
};

const TABS = [
  { id: "filters" as const, label: "Filtry", Icon: FilterListIcon },
  { id: "sort" as const, label: "Sortowanie", Icon: SortIcon },
  { id: "stats" as const, label: "Statystyki", Icon: AnalyticsIcon },
];

const sectionLabelSx = {
  display: "block",
  mb: 1.25,
  fontWeight: 700,
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "text.secondary",
};

const FilterStatisticsPanel: React.FC<FilterStatisticsPanelProps> = ({
  books,
  onSortChange,
  booksStats,
  additionalStats,
}) => {
  const filters = useFilterStore((state: FilterStore) => state.filters);
  const activeTab = useFilterStore((state: FilterStore) => state.activeTab);
  const expanded = useFilterStore((state: FilterStore) => state.expanded);
  const showAdvancedFilters = useFilterStore(
    (state) => state.showAdvancedFilters,
  );
  const activeFilters = useFilterStore((state) => state.activeFilters);

  const setFilter = useFilterStore((state) => state.setFilter);
  const toggleTab = useFilterStore((state) => state.toggleTab);
  const toggleAdvancedFiltersAction = useFilterStore(
    (state) => state.toggleAdvancedFilters,
  );
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const toggleExpandedAction = useFilterStore((state) => state.toggleExpanded);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    books.forEach((book) => {
      if (book.createdAt) {
        years.add(new Date(book.createdAt).getFullYear());
      }
    });
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [books]);

  useEffect(() => {
    if (onSortChange) {
      onSortChange(filters.sortBy, filters.sortOrder);
    }
  }, [filters.sortBy, filters.sortOrder, onSortChange]);

  const handleFilterChange = (field: keyof FilterState, value: unknown) => {
    setFilter(field, value);
  };

  const clearFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetFilters();
  };

  const handleTabClick = (tabId: "filters" | "sort" | "stats") => {
    if (activeTab === tabId && expanded) {
      toggleExpandedAction();
      return;
    }
    toggleTab(tabId);
  };

  const handleSortFieldSelect = (value: SortField) => {
    if (filters.sortBy === value) {
      handleFilterChange(
        "sortOrder",
        filters.sortOrder === "asc" ? "desc" : "asc",
      );
    } else {
      handleFilterChange("sortBy", value);
    }
  };

  const genreOptions = Object.entries(GENRES).map(([value, label]) => ({
    value,
    label,
  }));

  const renderFilterBadges = () => {
    const badges = [];

    if (filters.searchTerm.trim()) {
      badges.push(
        <Chip
          key="search"
          label={`Szukaj: ${filters.searchTerm}`}
          size="small"
          onDelete={() => handleFilterChange("searchTerm", "")}
          sx={chipSx}
        />,
      );
    }

    if (filters.status !== "all") {
      badges.push(
        <Chip
          key="status"
          label={BOOK_STATUS_LABELS[filters.status as BookStatus]}
          size="small"
          onDelete={() => handleFilterChange("status", "all")}
          sx={chipSx}
        />,
      );
    }

    if (filters.genre !== "all") {
      const genreLabel =
        genreOptions.find((g) => g.value === filters.genre)?.label ||
        filters.genre;
      badges.push(
        <Chip
          key="genre"
          label={genreLabel}
          size="small"
          onDelete={() => handleFilterChange("genre", "all")}
          sx={chipSx}
        />,
      );
    }

    if (filters.author.trim()) {
      badges.push(
        <Chip
          key="author"
          label={`Autor: ${filters.author}`}
          size="small"
          onDelete={() => handleFilterChange("author", "")}
          sx={chipSx}
        />,
      );
    }

    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) {
      badges.push(
        <Chip
          key="rating"
          label={`Ocena: ${filters.ratingRange[0]}–${filters.ratingRange[1]}`}
          size="small"
          onDelete={() => handleFilterChange("ratingRange", [0, 10])}
          sx={chipSx}
        />,
      );
    }

    if (filters.pagesRange[0] > 0 || filters.pagesRange[1] < 5000) {
      badges.push(
        <Chip
          key="pages"
          label={`Strony: ${filters.pagesRange[0]}–${filters.pagesRange[1]}`}
          size="small"
          onDelete={() => handleFilterChange("pagesRange", [0, 5000])}
          sx={chipSx}
        />,
      );
    }

    if (filters.showOnlyFavorites) {
      badges.push(
        <Chip
          key="favorites"
          label="Tylko ulubione"
          size="small"
          icon={<StarIcon sx={{ fontSize: "14px !important" }} />}
          onDelete={() => handleFilterChange("showOnlyFavorites", false)}
          sx={chipSx}
        />,
      );
    }

    return badges;
  };

  return (
    <Fade in timeout={400}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
          boxShadow: "0 1px 2px rgba(26, 32, 44, 0.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: { xs: 1.5, sm: 2 },
            py: 1.25,
            borderBottom: expanded ? "1px solid" : "none",
            borderColor: "grey.100",
            bgcolor: "grey.50",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              p: 0.375,
              gap: 0.25,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            {TABS.map(({ id, label, Icon }) => {
              const selected = activeTab === id && expanded;
              return (
                <Button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  startIcon={<Icon sx={{ fontSize: "18px !important" }} />}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: selected ? 700 : 550,
                    fontSize: "0.8125rem",
                    px: { xs: 1.25, sm: 1.75 },
                    py: 0.75,
                    minHeight: 34,
                    borderRadius: 1.5,
                    color: selected ? "primary.main" : "text.secondary",
                    bgcolor: selected ? "rgba(102, 126, 234, 0.1)" : "transparent",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: selected
                        ? "rgba(102, 126, 234, 0.14)"
                        : "rgba(102, 126, 234, 0.06)",
                      boxShadow: "none",
                    },
                  }}
                >
                  {label}
                  {id === "filters" && activeFilters > 0 && (
                    <Box
                      component="span"
                      sx={{
                        ml: 0.75,
                        minWidth: 18,
                        height: 18,
                        px: 0.5,
                        borderRadius: 999,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      {activeFilters}
                    </Box>
                  )}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ flex: 1 }} />

          {activeFilters > 0 && (
            <Button
              size="small"
              onClick={clearFilters}
              startIcon={<ClearIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                color: "text.secondary",
                "&:hover": { color: "error.main", bgcolor: "error.50" },
              }}
            >
              Wyczyść
            </Button>
          )}
        </Box>

        <Collapse in={expanded}>
          {activeTab === "filters" && (
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              {activeFilters > 0 && (
                <Box
                  sx={{
                    mb: 2.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75,
                    alignItems: "center",
                  }}
                >
                  {renderFilterBadges()}
                </Box>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                  mb: 2,
                }}
              >
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) =>
                      handleFilterChange(
                        "status",
                        e.target.value as BookStatus | "all",
                      )
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

                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Gatunek</InputLabel>
                  <Select
                    value={filters.genre}
                    label="Gatunek"
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                  >
                    <MenuItem value="all">Wszystkie</MenuItem>
                    {genreOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label="Autor"
                  value={filters.author || ""}
                  onChange={(e) =>
                    handleFilterChange("author", e.target.value)
                  }
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
                            handleFilterChange("author", "");
                          }}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button
                  onClick={() =>
                    handleFilterChange(
                      "showOnlyFavorites",
                      !filters.showOnlyFavorites,
                    )
                  }
                  startIcon={
                    filters.showOnlyFavorites ? (
                      <StarIcon sx={{ color: "warning.main" }} />
                    ) : (
                      <StarBorderIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    color: filters.showOnlyFavorites
                      ? "warning.dark"
                      : "text.secondary",
                    bgcolor: filters.showOnlyFavorites
                      ? "rgba(245, 158, 11, 0.1)"
                      : "grey.50",
                    border: "1px solid",
                    borderColor: filters.showOnlyFavorites
                      ? "rgba(245, 158, 11, 0.35)"
                      : "grey.200",
                    "&:hover": {
                      bgcolor: filters.showOnlyFavorites
                        ? "rgba(245, 158, 11, 0.16)"
                        : "grey.100",
                      borderColor: filters.showOnlyFavorites
                        ? "warning.main"
                        : "grey.300",
                    },
                  }}
                >
                  Tylko ulubione
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: showAdvancedFilters ? 1.5 : 0,
                }}
              >
                <Button
                  size="small"
                  startIcon={<TuneIcon />}
                  onClick={() => toggleAdvancedFiltersAction()}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  {showAdvancedFilters
                    ? "Ukryj zaawansowane"
                    : "Filtry zaawansowane"}
                </Button>

                {(filters.ratingRange[0] > 0 ||
                  filters.ratingRange[1] < 10 ||
                  filters.pagesRange[0] > 0 ||
                  filters.pagesRange[1] < 5000) && (
                  <Button
                    size="small"
                    onClick={() => {
                      handleFilterChange("ratingRange", [0, 10]);
                      handleFilterChange("pagesRange", [0, 5000]);
                    }}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Resetuj zakresy
                  </Button>
                )}
              </Box>

              <Collapse in={showAdvancedFilters}>
                <Box
                  sx={{
                    mt: 0.5,
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Ocena: {filters.ratingRange[0]}–{filters.ratingRange[1]}
                    </Typography>
                    <Slider
                      size="small"
                      value={filters.ratingRange}
                      onChange={(_, newValue) =>
                        handleFilterChange(
                          "ratingRange",
                          newValue as [number, number],
                        )
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={10}
                      step={0.5}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                      ]}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Strony: {filters.pagesRange[0]}–{filters.pagesRange[1]}
                    </Typography>
                    <Slider
                      size="small"
                      value={filters.pagesRange}
                      onChange={(_, newValue) =>
                        handleFilterChange(
                          "pagesRange",
                          newValue as [number, number],
                        )
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={5000}
                      step={50}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 2500, label: "2500" },
                        { value: 5000, label: "5000" },
                      ]}
                    />
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}

          {activeTab === "sort" && (
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography component="span" sx={sectionLabelSx}>
                Sortuj według
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  mb: 2.5,
                }}
              >
                {SORT_OPTIONS.map(({ value, label, Icon }) => {
                  const selected = filters.sortBy === value;
                  return (
                    <Chip
                      key={value}
                      clickable
                      onClick={() => handleSortFieldSelect(value)}
                      icon={
                        <Icon
                          sx={{
                            fontSize: "16px !important",
                            color: selected
                              ? "primary.main !important"
                              : "text.secondary !important",
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {label}
                          {selected &&
                            (filters.sortOrder === "asc" ? (
                              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                            ))}
                        </Box>
                      }
                      sx={{
                        height: 36,
                        px: 0.5,
                        borderRadius: 2,
                        fontWeight: selected ? 700 : 500,
                        fontSize: "0.8125rem",
                        bgcolor: selected
                          ? "rgba(102, 126, 234, 0.1)"
                          : "grey.50",
                        color: selected ? "primary.main" : "text.primary",
                        border: "1px solid",
                        borderColor: selected ? "primary.light" : "grey.200",
                        "& .MuiChip-icon": { ml: 0.75 },
                        "&:hover": {
                          bgcolor: selected
                            ? "rgba(102, 126, 234, 0.14)"
                            : "grey.100",
                          borderColor: selected ? "primary.main" : "grey.300",
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography component="span" sx={{ ...sectionLabelSx, mb: 0.75 }}>
                      Kierunek
                    </Typography>
                    <ToggleButtonGroup
                      value={filters.sortOrder}
                      exclusive
                      size="small"
                      onChange={(_, value: "asc" | "desc" | null) => {
                        if (value) handleFilterChange("sortOrder", value);
                      }}
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "grey.200",
                        "& .MuiToggleButtonGroup-grouped": {
                          border: "none",
                          borderRadius: "6px !important",
                          mx: 0.25,
                          my: 0.25,
                        },
                        "& .MuiToggleButton-root": {
                          textTransform: "none",
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          "&.Mui-selected": {
                            bgcolor: "rgba(102, 126, 234, 0.1)",
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "rgba(102, 126, 234, 0.14)",
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="asc" aria-label="Rosnąco">
                        <ArrowUpwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Rosnąco
                      </ToggleButton>
                      <ToggleButton value="desc" aria-label="Malejąco">
                        <ArrowDownwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Malejąco
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    textAlign: { xs: "left", sm: "right" },
                  }}
                >
                  {formatBookCount(books.length)}
                  <Box
                    component="span"
                    sx={{ color: "grey.400", mx: 0.75 }}
                  >
                    ·
                  </Box>
                  według {SORT_LABELS[filters.sortBy]}{" "}
                  ({filters.sortOrder === "asc" ? "↑" : "↓"})
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === "stats" && (
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    letterSpacing: "-0.01em",
                    color: "text.primary",
                  }}
                >
                  Statystyki czytelnicze
                </Typography>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="stats-year-label">Rok</InputLabel>
                  <Select
                    labelId="stats-year-label"
                    value={filters.statsYear}
                    label="Rok"
                    onChange={(e) =>
                      handleFilterChange("statsYear", e.target.value)
                    }
                    sx={{
                      "& .MuiSelect-select": {
                        py: 0.75,
                        fontSize: "0.8125rem",
                      },
                    }}
                  >
                    <MenuItem value="all">Wszystkie lata</MenuItem>
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <StatisticsGrid
                booksStats={booksStats}
                additionalStats={additionalStats}
              />

              <Box sx={{ mt: 1.25 }}>
                <MetricsGrid additionalStats={additionalStats} />
              </Box>
            </Box>
          )}
        </Collapse>
      </Paper>
    </Fade>
  );
};

const chipSx = {
  height: 28,
  fontWeight: 600,
  fontSize: "0.75rem",
  bgcolor: "rgba(102, 126, 234, 0.08)",
  color: "primary.main",
  border: "1px solid",
  borderColor: "rgba(102, 126, 234, 0.2)",
  "& .MuiChip-deleteIcon": {
    color: "primary.light",
    "&:hover": { color: "primary.main" },
  },
} as const;

export default FilterStatisticsPanel;
