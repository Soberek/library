import React, { useEffect, useMemo } from "react";
import { useFilterStore, type FilterStore } from "../../stores";
import type { FilterState } from "../../stores";
import {
  Filter,
  SlidersHorizontal,
  BarChart2,
  X,
  ArrowUp,
  ArrowDown,
  Star,
  BookOpen,
  Calendar,
  Layers,
  User,
  Bookmark,
  CheckCircle2,
  BookmarkPlus,
  XCircle,
} from "lucide-react";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "../../constants/bookStatus";
import { GENRES } from "../../constants/genres";
import type { Book, BookStatus } from "../../types/Book";
import {
  StatisticsGrid,
  MetricsGrid,
  ReadingHighlights,
  GenreBreakdown,
  RatingDistribution,
} from "../statistics";
import { formatBookCount } from "../../utils/textHelpers";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Slider } from "../ui/slider";
import { cn } from "../../lib/utils";

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
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  ascLabel: string;
  descLabel: string;
}[] = [
  { value: "title", label: "Tytuł", Icon: Bookmark, ascLabel: "A → Z", descLabel: "Z → A" },
  { value: "author", label: "Autor", Icon: User, ascLabel: "A → Z", descLabel: "Z → A" },
  { value: "rating", label: "Ocena", Icon: Star, ascLabel: "od najniższej", descLabel: "od najwyższej" },
  { value: "pages", label: "Liczba stron", Icon: Layers, ascLabel: "od najkrótszej", descLabel: "od najdłuższej" },
  { value: "dateAdded", label: "Data dodania", Icon: Calendar, ascLabel: "od najstarszych", descLabel: "od najnowszych" },
  { value: "status", label: "Status", Icon: BookOpen, ascLabel: "A → Z", descLabel: "Z → A" },
];

const TABS = [
  { id: "filters" as const, label: "Filtry", Icon: Filter },
  { id: "sort" as const, label: "Sortowanie", Icon: SlidersHorizontal },
  { id: "stats" as const, label: "Statystyki", Icon: BarChart2 },
];

export const FilterStatisticsPanel: React.FC<FilterStatisticsPanelProps> = ({
  books,
  onSortChange,
  booksStats,
  additionalStats,
}) => {
  const filters = useFilterStore((state: FilterStore) => state.filters);
  const activeTab = useFilterStore((state: FilterStore) => state.activeTab);
  const expanded = useFilterStore((state: FilterStore) => state.expanded);
  const showAdvancedFilters = useFilterStore((state) => state.showAdvancedFilters);
  const activeFilters = useFilterStore((state) => state.activeFilters);

  const setFilter = useFilterStore((state) => state.setFilter);
  const toggleTab = useFilterStore((state) => state.toggleTab);
  const toggleAdvancedFiltersAction = useFilterStore((state) => state.toggleAdvancedFilters);
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
      handleFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      handleFilterChange("sortBy", value);
    }
  };

  const genreOptions = Object.entries(GENRES).map(([value, label]) => ({
    value,
    label,
  }));

  const currentSortOpt = SORT_OPTIONS.find((s) => s.value === filters.sortBy) || SORT_OPTIONS[0];

  const filteredBooksForStats = useMemo(() => {
    if (filters.statsYear === "all") return books;
    const targetYear =
      typeof filters.statsYear === "number"
        ? filters.statsYear
        : parseInt(String(filters.statsYear), 10);
    return books.filter((book) => {
      if (!book.createdAt) return false;
      return new Date(book.createdAt).getFullYear() === targetYear;
    });
  }, [books, filters.statsYear]);

  return (
    <Card className="overflow-hidden shadow-sm border-slate-200/90 bg-white rounded-2xl">
      {/* Top toolbar tabs */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50/80 border-b border-slate-200/80 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          {TABS.map(({ id, label, Icon }) => {
            const selected = activeTab === id && expanded;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabClick(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                  selected
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
                {id === "filters" && activeFilters > 0 && (
                  <span className="ml-1 min-w-[18px] h-4.5 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
                    {activeFilters}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Wyczyść filtry ({activeFilters})</span>
          </Button>
        )}
      </div>

      {/* Expanded Tab Content */}
      {expanded && (
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 animate-in fade-in-0 duration-150">
          {/* TAB 1: FILTERS */}
          {activeTab === "filters" && (
            <div className="space-y-4">
              {/* Quick Status Chips */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Szybki wybór statusu
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFilterChange("status", "all")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      filters.status === "all"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    Wszystkie ({books.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFilterChange("status", "W trakcie")}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      filters.status === "W trakcie"
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100"
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>W trakcie ({booksStats.inProgress})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFilterChange("status", "Przeczytana")}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      filters.status === "Przeczytana"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100"
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Przeczytana ({booksStats.read})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFilterChange("status", "Chcę przeczytać")}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      filters.status === "Chcę przeczytać"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-blue-50 text-blue-800 border-blue-200/80 hover:bg-blue-100"
                    )}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Chcę przeczytać ({booksStats.wantToRead})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFilterChange("status", "Porzucona")}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      filters.status === "Porzucona"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100"
                    )}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Porzucona ({booksStats.dropped})</span>
                  </button>
                </div>
              </div>

              {/* Genre, Author, Favorites inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {/* Genre select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gatunek
                  </label>
                  <Select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange("genre", e.target.value)}
                  >
                    <option value="all">Wszystkie gatunki</option>
                    {genreOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Author input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Autor
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Wpisz autora..."
                      value={filters.author || ""}
                      onChange={(e) => handleFilterChange("author", e.target.value)}
                    />
                    {filters.author && (
                      <button
                        type="button"
                        onClick={() => handleFilterChange("author", "")}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Favorites toggle */}
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleFilterChange("showOnlyFavorites", !filters.showOnlyFavorites)
                    }
                    className={cn(
                      "flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                      filters.showOnlyFavorites
                        ? "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <Star className={cn("w-4 h-4", filters.showOnlyFavorites ? "fill-amber-500 text-amber-500" : "text-slate-400")} />
                    <span>Tylko ulubione</span>
                  </button>
                </div>
              </div>

              {/* Advanced range toggle */}
              <div className="pt-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAdvancedFiltersAction()}
                  className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 h-8 gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showAdvancedFilters ? "Ukryj suwaki zakresu" : "Dostosuj zakres stron i ocen"}</span>
                </Button>
              </div>

              {/* Advanced range sliders */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Zakres ocen (0–10)</span>
                      <span className="text-indigo-600 font-extrabold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {filters.ratingRange[0]} – {filters.ratingRange[1]} ★
                      </span>
                    </div>
                    <Slider
                      value={filters.ratingRange}
                      min={0}
                      max={10}
                      step={0.5}
                      onChange={(val) => handleFilterChange("ratingRange", val)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Liczba stron</span>
                      <span className="text-indigo-600 font-extrabold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {filters.pagesRange[0]} – {filters.pagesRange[1]} str.
                      </span>
                    </div>
                    <Slider
                      value={filters.pagesRange}
                      min={0}
                      max={5000}
                      step={50}
                      onChange={(val) => handleFilterChange("pagesRange", val)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SORTING */}
          {activeTab === "sort" && (
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Wybierz kryterium sortowania
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {SORT_OPTIONS.map(({ value, label, Icon, ascLabel, descLabel }) => {
                  const selected = filters.sortBy === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSortFieldSelect(value)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center",
                        selected
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs ring-2 ring-indigo-200/50"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <Icon size={18} className={cn(selected ? "text-indigo-600" : "text-slate-500")} />
                      <span>{label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {selected ? (filters.sortOrder === "asc" ? ascLabel : descLabel) : "Kliknij"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Kierunek sortowania:</span>
                  <div className="flex items-center p-0.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleFilterChange("sortOrder", "asc")}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer",
                        filters.sortOrder === "asc"
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Rosnąco</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("sortOrder", "desc")}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer",
                        filters.sortOrder === "desc"
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Malejąco</span>
                    </button>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-2xs">
                  Sortowanie: <strong>{currentSortOpt.label}</strong> ({filters.sortOrder === "asc" ? currentSortOpt.ascLabel : currentSortOpt.descLabel})
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: STATISTICS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Year filter and title */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Statystyki i analityka czytelnicza
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Szczegółowe podsumowanie Twojej biblioteki
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filtruj rok:</span>
                  <div className="w-40">
                    <Select
                      value={String(filters.statsYear)}
                      onChange={(e) =>
                        handleFilterChange(
                          "statsYear",
                          e.target.value === "all" ? "all" : parseInt(e.target.value, 10)
                        )
                      }
                    >
                      <option value="all">Wszystkie lata</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* 1. Overview and Status Breakdown */}
              <StatisticsGrid
                booksStats={booksStats}
                additionalStats={additionalStats}
              />

              {/* 2. Core Metrics */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Kluczowe wskaźniki
                </span>
                <MetricsGrid additionalStats={additionalStats} />
              </div>

              {/* 3. Highlights and Records */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Wyróżnienia i rekordy
                </span>
                <ReadingHighlights books={filteredBooksForStats} />
              </div>

              {/* 4. Genres and Rating Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GenreBreakdown books={filteredBooksForStats} />
                <RatingDistribution books={filteredBooksForStats} />
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default FilterStatisticsPanel;
