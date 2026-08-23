import React, { useCallback, useEffect, useState } from 'react';
import {
  Shuffle,
  BookOpen,
  Star,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  BookmarkPlus,
  Check,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Library,
  BookMarked,
  Search,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { addBook, getUserBooksData } from '../services/booksService';
import type { Book } from '../types/Book';
import type { BookLotteryFilters, BookMoodPreset, LotteryBook } from '../types/LotteryBook';
import {
  BOOK_EDITION_OPTIONS,
  BOOK_LOTTERY_LANGUAGES,
  BOOK_LOTTERY_SUBJECTS,
  BOOK_MOOD_PRESETS,
  BOOK_PAGES_OPTIONS,
  BOOK_POPULARITY_OPTIONS,
  BOOK_RATING_COUNT_OPTIONS,
  countAdvancedBookFilters,
  countLotteryBooks,
  ebookLabel,
  formatReadingTime,
  languageLabel,
  needsClientRatingFilter,
  pickRandomLotteryBook,
} from '../services/openLibraryService';
import BookDrawAnimation from '../components/book/BookDrawAnimation';
import BookMoodPresets from '../components/book/BookMoodPresets';
import BookFilterDrawer from '../components/book/BookFilterDrawer';
import { Slider } from '../components/ui/slider';
import { Select } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Button, buttonVariants } from '../components/ui/button';
import { Toast } from '../components/ui/toast';
import { cn } from '../lib/utils';
import './BookLosuje.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => CURRENT_YEAR - i);

const DEFAULT_FILTERS: BookLotteryFilters = {
  subject: 'fantasy',
  language: 'pol',
  yearFrom: null,
  yearTo: null,
  minRating: 3,
  minRatingsCount: 5,
  minPopularity: 50,
  minEditions: 0,
  minPages: 0,
  requireCover: true,
};

function formatAuthors(book: LotteryBook): string {
  const names = book.authors?.length ? book.authors : [book.author];
  if (names.length <= 2) return names.join(', ');
  return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
}

function formatLanguages(codes: string[] | undefined, preferred?: string): string | null {
  if (!codes?.length) return null;
  const ordered = preferred
    ? [...codes].sort((a, b) => {
        if (a === preferred) return -1;
        if (b === preferred) return 1;
        return 0;
      })
    : codes;
  const shown = ordered.slice(0, 3).map(languageLabel);
  const extra = ordered.length > 3 ? ` +${ordered.length - 3}` : '';
  return shown.join(', ') + extra;
}

export const BookLosuje: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<BookLotteryFilters>(DEFAULT_FILTERS);
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
  const [drawn, setDrawn] = useState<LotteryBook | null>(null);
  const [spinWinner, setSpinWinner] = useState<LotteryBook | null>(null);
  const [reelBooks, setReelBooks] = useState<LotteryBook[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [poolSize, setPoolSize] = useState<number | null>(null);
  const [poolLoading, setPoolLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [savingToLibrary, setSavingToLibrary] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);

  const ratingApprox = needsClientRatingFilter(filters);
  const advancedCount = countAdvancedBookFilters(filters);
  const busy = drawing || loading;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'LOSUJ KSIĄŻKĘ · Ex Libris';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Fetch user's "Chcę przeczytać" shelf if logged in
  useEffect(() => {
    if (!user?.uid) {
      setWishlistBooks([]);
      return;
    }
    let cancelled = false;
    void getUserBooksData(user.uid)
      .then((books) => {
        if (!cancelled) {
          setWishlistBooks(books.filter((b) => b.read === 'Chcę przeczytać'));
        }
      })
      .catch(() => {
        // ignore background fetch error
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Count pool preview
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setPoolLoading(true);
      void countLotteryBooks(filters)
        .then((count) => {
          if (!cancelled) setPoolSize(count);
        })
        .catch(() => {
          if (!cancelled) setPoolSize(null);
        })
        .finally(() => {
          if (!cancelled) setPoolLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [filters]);

  const applyMoodPreset = (preset: BookMoodPreset) => {
    if (activeMoodId === preset.id) {
      // Toggle off
      setActiveMoodId(null);
      setFilters(DEFAULT_FILTERS);
      return;
    }
    setActiveMoodId(preset.id);
    setFilters((prev) => ({
      ...prev,
      ...preset.filters,
    }));
  };

  const handleClearMood = () => {
    setActiveMoodId(null);
    setFilters(DEFAULT_FILTERS);
  };

  const handleDraw = useCallback(async () => {
    setError(null);
    setDrawn(null);
    setSavedToLibrary(false);
    setIsSynopsisExpanded(false);
    setLoading(true);
    setDrawing(true);
    setSpinWinner(null);
    setReelBooks([]);

    try {
      const { winner, reel, numFound } = await pickRandomLotteryBook(
        filters,
        new Set(recentIds),
      );
      setPoolSize(numFound);
      setReelBooks(reel);
      setSpinWinner(winner);
      setRecentIds((prev) =>
        [winner.id, ...prev.filter((id) => id !== winner.id)].slice(0, 15),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Losowanie nie powiodło się.');
      setDrawing(false);
    } finally {
      setLoading(false);
    }
  }, [filters, recentIds]);

  const handleDrawFromWishlist = useCallback(() => {
    if (wishlistBooks.length === 0) return;
    setError(null);
    setDrawn(null);
    setSavedToLibrary(true);
    setIsSynopsisExpanded(false);
    setDrawing(true);

    const random = wishlistBooks[Math.floor(Math.random() * wishlistBooks.length)];
    const lotteryItem: LotteryBook = {
      id: random.id,
      title: random.title,
      author: random.author,
      authors: [random.author],
      cover: random.cover || undefined,
      pages: random.overallPages || undefined,
      rating: random.rating ? random.rating / 2 : undefined,
      subjects: random.genre ? [random.genre] : [],
      description: 'Ta książka pochodzi z Twojej prywatnej półki „Chcę przeczytać”. Czas po nią sięgnąć!',
      readingTimeMinutes: random.overallPages ? Math.round(random.overallPages * 1.3) : undefined,
    };

    setReelBooks([lotteryItem]);
    setSpinWinner(lotteryItem);
  }, [wishlistBooks]);

  const handleSpinComplete = useCallback(() => {
    if (!spinWinner) return;
    setDrawn(spinWinner);
    setDrawing(false);
    setSpinWinner(null);
    setReelBooks([]);
  }, [spinWinner]);

  const handleAddToLibrary = async () => {
    if (!drawn) return;
    if (!user) {
      setSnackbarMsg('Zaloguj się, aby dodać książkę do swojej biblioteki.');
      return;
    }
    setSavingToLibrary(true);
    try {
      const genre =
        BOOK_LOTTERY_SUBJECTS.find((s) => s.value === filters.subject)?.label ||
        drawn.subjects?.[0] ||
        'Inne';
      const newBook = {
        title: drawn.title,
        author: drawn.author || drawn.authors?.[0] || 'Nieznany autor',
        read: 'Chcę przeczytać' as const,
        overallPages: drawn.pages && drawn.pages > 0 ? Math.min(drawn.pages, 5000) : 300,
        readPages: 0,
        cover: drawn.cover || '',
        genre,
        rating: drawn.rating ? Math.min(10, Math.round(drawn.rating * 20) / 10) : 0,
        createdAt: new Date().toISOString(),
        isFavorite: false,
        userId: user.uid,
      };
      await addBook(newBook);

      setSavedToLibrary(true);
      setSnackbarMsg(`Dodano „${drawn.title}” do Twojej biblioteki!`);
    } catch (err) {
      setSnackbarMsg(err instanceof Error ? err.message : 'Nie udało się dodać książki.');
    } finally {
      setSavingToLibrary(false);
    }
  };

  const resetAdvanced = () => {
    setActiveMoodId(null);
    setFilters((prev) => ({
      ...prev,
      minRatingsCount: 0,
      minEditions: 0,
      minPages: 0,
      yearFrom: null,
      yearTo: null,
    }));
  };

  const ebook = drawn ? ebookLabel(drawn.ebookAccess) : null;
  const langs = drawn ? formatLanguages(drawn.languages, filters.language || undefined) : null;
  const readingTime = drawn?.pages ? formatReadingTime(drawn.pages) : null;
  const subjectLabel =
    BOOK_LOTTERY_SUBJECTS.find((s) => s.value === filters.subject)?.label ?? 'Wszystkie';
  const langLabel =
    BOOK_LOTTERY_LANGUAGES.find((l) => l.code === filters.language)?.label ?? 'Dowolny';
  const popLabel =
    BOOK_POPULARITY_OPTIONS.find((p) => p.value === filters.minPopularity)?.label ?? 'Luźno';

  const lubimyCzytacUrl = drawn
    ? `https://lubimyczytac.pl/szukaj/ksiazki?phrase=${encodeURIComponent(`${drawn.title} ${drawn.author}`)}`
    : null;

  return (
    <main className="book-losuje-page">
      <div className="book-losuje-glow book-losuje-glow--left" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--right" aria-hidden />

      <div className="book-losuje-inner">
        {/* Hero Header — Pure Calligraphy */}
        <motion.header
          className="book-losuje-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="book-losuje-kicker">✦ EX LIBRIS · OPEN LIBRARY ✦</p>
          <h1 className="book-losuje-calligraphy-brand">
            Losuj Książkę
          </h1>
          <p className="book-losuje-tagline">
            Wybierz nastrój lub ustaw gatunek — resztę wyłoni biblioteczny katalog.
          </p>
        </motion.header>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 mb-4 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Literary Mood Presets Carousel */}
        <BookMoodPresets
          activeMoodId={activeMoodId}
          onSelectMood={applyMoodPreset}
          onClearMood={handleClearMood}
          disabled={busy}
        />

        {/* Mobile-Only Compact Controls Bar */}
        <div className="sm:hidden mb-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 items-center overflow-hidden">
              <span className="book-summary-chip truncate max-w-[120px]">{subjectLabel}</span>
              <span className="book-summary-chip">{langLabel}</span>
              {filters.minRating > 0 && (
                <span className="book-summary-chip">{filters.minRating.toFixed(1)}+ ⭐</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              disabled={busy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtry</span>
              {advancedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="book-draw-btn flex-1 h-11 text-xs font-bold gap-1.5 cursor-pointer"
              disabled={busy || poolSize === 0}
              onClick={() => void handleDraw()}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shuffle className="w-4 h-4" />
              )}
              <span>
                {loading
                  ? 'Kartkuję…'
                  : drawing
                    ? 'Losuję…'
                    : drawn
                      ? 'Losuj inną'
                      : `Losuj (~${(poolSize ?? 0).toLocaleString('pl-PL')})`}
              </span>
            </Button>

            {wishlistBooks.length > 0 && (
              <Button
                variant="outline"
                className="h-11 px-3 text-xs font-bold gap-1 border-emerald-300 bg-emerald-50 text-emerald-950 rounded-xl shrink-0"
                disabled={busy}
                onClick={handleDrawFromWishlist}
                title="Losuj z półki 'Chcę przeczytać'"
              >
                <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
                <span>Półka ({wishlistBooks.length})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop-Only Full Controls Section */}
        <motion.section
          className="book-losuje-controls hidden sm:block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="book-losuje-controls-head">
            <div>
              <p className="book-losuje-controls-kicker">parametry katalogu</p>
              <h2 className="book-losuje-controls-title">Kryteria wyboru</h2>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`book-pool-badge${poolSize === 0 && !poolLoading ? ' is-empty' : ''}`}
                aria-live="polite"
              >
                {poolLoading ? (
                  <span className="text-slate-400">Liczenie…</span>
                ) : poolSize != null ? (
                  <>
                    <strong>
                      {ratingApprox ? '~' : ''}
                      {poolSize.toLocaleString('pl-PL')}
                    </strong>
                    <span> w puli</span>
                  </>
                ) : (
                  <span className="text-slate-400">Open Library</span>
                )}
              </div>

              {/* Mobile Filter Drawer Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                disabled={busy}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                title="Wszystkie filtry"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                <span>Filtry</span>
                {advancedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                    {advancedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="book-summary-chips" aria-label="Aktywne filtry">
            <span className="book-summary-chip">{subjectLabel}</span>
            <span className="book-summary-chip">{langLabel}</span>
            <span className="book-summary-chip">
              {filters.minRating <= 0 ? 'ocena dowolna' : `ocena ${filters.minRating.toFixed(1)}+`}
            </span>
            <span className="book-summary-chip">{popLabel}</span>
            {filters.requireCover && <span className="book-summary-chip">okładka</span>}
          </div>

          <div className="book-losuje-grid">
            <label className="book-field">
              <span className="book-field-label">Gatunek</span>
              <Select
                value={filters.subject}
                disabled={busy}
                onChange={(e) => {
                  setActiveMoodId(null);
                  setFilters((prev) => ({ ...prev, subject: String(e.target.value) }));
                }}
              >
                {BOOK_LOTTERY_SUBJECTS.map((s) => (
                  <option key={s.value || 'all'} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </label>

            <label className="book-field">
              <span className="book-field-label">Język edycji</span>
              <Select
                value={filters.language}
                disabled={busy}
                onChange={(e) => {
                  setActiveMoodId(null);
                  setFilters((prev) => ({ ...prev, language: String(e.target.value) }));
                }}
              >
                {BOOK_LOTTERY_LANGUAGES.map((lang) => (
                  <option key={lang.code || 'any'} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </label>

            <div className="book-field book-field--span2">
              <div className="book-field-label-row">
                <span className="book-field-label">Minimalna ocena</span>
                <span className="book-rating-pill">
                  {filters.minRating <= 0 ? 'dowolna' : `${filters.minRating.toFixed(1)}+ ⭐`}
                </span>
              </div>
              <Slider
                value={filters.minRating}
                min={0}
                max={5}
                step={0.5}
                disabled={busy}
                onChange={(val) => {
                  setActiveMoodId(null);
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(val) ? val[0] : val,
                  }));
                }}
              />
            </div>

            <div className="book-field book-field--span2">
              <div className="book-field-label-row">
                <span className="book-field-label">Popularność</span>
                <span className="book-field-hint-inline">„chcę przeczytać” w OL</span>
              </div>
              <div className="book-seg book-seg--joined" role="group" aria-label="Popularność">
                {BOOK_POPULARITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={
                      filters.minPopularity === opt.value
                        ? 'book-seg-btn is-active'
                        : 'book-seg-btn'
                    }
                    disabled={busy}
                    onClick={() => {
                      setActiveMoodId(null);
                      setFilters((prev) => ({ ...prev, minPopularity: opt.value }));
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="book-field book-field--span2 book-cover-row flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Tylko z okładką</span>
              <Switch
                checked={filters.requireCover}
                disabled={busy}
                onChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    requireCover: checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="book-advanced hidden sm:block">
            <button
              type="button"
              className={`book-advanced-toggle${advancedOpen ? ' is-open' : ''}${advancedCount > 0 ? ' has-active' : ''}`}
              disabled={busy}
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((v) => !v)}
            >
              <span className="book-advanced-toggle-start">
                <SlidersHorizontal className="book-advanced-icon w-4 h-4" />
                <span className="book-advanced-toggle-label">Więcej kryteriów</span>
                {advancedCount > 0 && (
                  <span className="book-advanced-count" aria-label={`${advancedCount} aktywne`}>
                    {advancedCount}
                  </span>
                )}
              </span>
              <ChevronDown className="book-advanced-chevron w-4 h-4" />
            </button>

            {advancedOpen && (
              <div className="book-advanced-body space-y-3">
                <div className="book-losuje-grid">
                  <div className="book-field">
                    <span className="book-field-label">Min. liczba ocen</span>
                    <div className="book-seg book-seg--wrap" role="group">
                      {BOOK_RATING_COUNT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={
                            filters.minRatingsCount === opt.value
                              ? 'book-seg-btn is-active'
                              : 'book-seg-btn'
                          }
                          disabled={busy}
                          onClick={() => {
                            setActiveMoodId(null);
                            setFilters((prev) => ({
                              ...prev,
                              minRatingsCount: opt.value,
                            }));
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="book-field">
                    <span className="book-field-label">Min. wydań</span>
                    <div className="book-seg book-seg--wrap" role="group">
                      {BOOK_EDITION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={
                            filters.minEditions === opt.value
                              ? 'book-seg-btn is-active'
                              : 'book-seg-btn'
                          }
                          disabled={busy}
                          onClick={() => {
                            setActiveMoodId(null);
                            setFilters((prev) => ({ ...prev, minEditions: opt.value }));
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="book-field book-field--span2">
                    <span className="book-field-label">Lata pierwszego wydania</span>
                    <div className="book-year-row flex items-center gap-2">
                      <Select
                        value={filters.yearFrom ?? ''}
                        disabled={busy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setActiveMoodId(null);
                          setFilters((prev) => ({
                            ...prev,
                            yearFrom: val === '' ? null : Number(val),
                          }));
                        }}
                      >
                        <option value="">Od zawsze</option>
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                      <span className="book-year-sep" aria-hidden>
                        →
                      </span>
                      <Select
                        value={filters.yearTo ?? ''}
                        disabled={busy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setActiveMoodId(null);
                          setFilters((prev) => ({
                            ...prev,
                            yearTo: val === '' ? null : Number(val),
                          }));
                        }}
                      >
                        <option value="">Do dziś</option>
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="book-field book-field--span2">
                    <span className="book-field-label">Min. stron</span>
                    <div className="book-seg book-seg--joined" role="group">
                      {BOOK_PAGES_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={
                            filters.minPages === opt.value
                              ? 'book-seg-btn is-active'
                              : 'book-seg-btn'
                          }
                          disabled={busy}
                          onClick={() => {
                            setActiveMoodId(null);
                            setFilters((prev) => ({ ...prev, minPages: opt.value }));
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {advancedCount > 0 && (
                  <button
                    type="button"
                    className="book-reset-advanced"
                    disabled={busy}
                    onClick={resetAdvanced}
                  >
                    Wyczyść dodatkowe kryteria
                  </button>
                )}
              </div>
            )}
          </div>

          {poolSize === 0 && !poolLoading && (
            <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-3">
              Pula pusta — obniż ocenę/popularność, odznacz okładkę albo zmień język.
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <Button
              className="book-draw-btn flex-1 w-full h-12 text-sm font-bold gap-2 cursor-pointer"
              disabled={busy || poolSize === 0}
              onClick={() => void handleDraw()}
            >
              {busy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shuffle className="w-5 h-5" />
              )}
              <span>
                {loading
                  ? 'Kartkuję katalog…'
                  : drawing
                    ? 'Losuję dzieło…'
                    : drawn
                      ? 'Losuj inną księgę'
                      : 'Losuj książkę z katalogu'}
              </span>
            </Button>

            {wishlistBooks.length > 0 && (
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-4 text-xs sm:text-sm font-bold gap-2 border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 shadow-2xs cursor-pointer rounded-xl shrink-0"
                disabled={busy}
                onClick={handleDrawFromWishlist}
                title="Wylosuj spośród książek na Twojej półce 'Chcę przeczytać'"
              >
                <BookMarked className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Moja półka ({wishlistBooks.length})</span>
              </Button>
            )}
          </div>
        </motion.section>

        {/* Result Slot */}
        <div className="book-result-slot">
          <AnimatePresence mode="wait">
            {!drawn && !drawing && (
              <motion.div
                key="empty"
                className="book-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="book-empty-icon" aria-hidden>
                  <BookOpen className="w-8 h-8 text-emerald-700" />
                </div>
                <p className="book-empty-title">Księgozbiór czeka na Twój wybór</p>
                <p className="book-empty-text">
                  Wybierz nastrój lub kliknij losuj — wylosowane dzieło z pełnym opisem pojawi się tutaj.
                </p>
              </motion.div>
            )}

            {drawing && !spinWinner && (
              <motion.div
                key="loading"
                className="book-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-2" />
                <p className="book-empty-title">Otwieram wiekowy katalog…</p>
                <p className="book-empty-text">Wybieram najlepsze tomy z Open Library</p>
              </motion.div>
            )}

            {drawing && spinWinner && (
              <BookDrawAnimation
                key={`spin-${spinWinner.id}`}
                reelBooks={reelBooks}
                winner={spinWinner}
                onComplete={handleSpinComplete}
              />
            )}

            {drawn && !drawing && (
              <motion.article
                key={drawn.id}
                className="book-ticket"
                initial={{ opacity: 0, scale: 0.94, y: 22 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ex Libris Seal Badge */}
                <div className="book-ticket-exlibris">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>EX LIBRIS</span>
                  <span className="book-ticket-exlibris-script">· Fortuna</span>
                </div>

                <div className="p-4 sm:p-6 flex flex-col gap-4">
                  {/* Top Header: Cover Left, Details Right */}
                  <div className="flex gap-3.5 sm:gap-6 items-start">
                    <div className="book-ticket-cover-wrap w-24 sm:w-36 shrink-0 aspect-[2/3]">
                      {drawn.cover ? (
                        <img
                          src={drawn.cover}
                          alt={`Okładka: ${drawn.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-emerald-50 text-emerald-800">
                          <BookOpen className="w-8 h-8 text-emerald-700 mb-1" />
                          <span className="text-[10px] font-bold">Księga bez grafiki</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight font-serif">
                        {drawn.title}
                      </h2>
                      <p className="text-xs sm:text-base font-semibold text-emerald-800 mt-0.5 font-serif italic">
                        {formatAuthors(drawn)}
                      </p>

                      {/* Badges / Rating / Reading time */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                        {drawn.rating != null && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{drawn.rating.toFixed(1)}</span>
                          </span>
                        )}

                        {drawn.year != null && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {drawn.year} r.
                          </span>
                        )}

                        {drawn.pages != null && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            ~{drawn.pages} str.
                          </span>
                        )}

                        {readingTime && (
                          <span className="book-reading-time-pill" title="Szacowany czas lektury">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>{readingTime.formatted} ({readingTime.evenings})</span>
                          </span>
                        )}
                      </div>

                      {/* Genres & Languages */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {langs && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {langs}
                          </span>
                        )}
                        {ebook && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            {ebook}
                          </span>
                        )}
                        {drawn.subjects?.slice(0, 3).map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 truncate max-w-[130px]"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Opening Hook / First Sentence Quote */}
                  {drawn.firstSentence && (
                    <div className="book-first-sentence-box">
                      <span className="book-first-sentence-lead">W słowach zapisane…</span>
                      <p className="book-drop-cap">
                        &bdquo;{drawn.firstSentence}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Book Description / Synopsis */}
                  <div className="book-synopsis-box">
                    <div className="book-synopsis-header">
                      <h3 className="book-synopsis-title">
                        <span>❧</span> Zarys fabuły & O czym opowiada
                      </h3>
                    </div>

                    <p
                      className={cn(
                        'book-synopsis-text',
                        !isSynopsisExpanded && 'line-clamp-3',
                      )}
                    >
                      {drawn.description ||
                        'Dzieło z otwartego katalogu Open Library. Wciągająca lektura polecana w wybranym gatunku literackim.'}
                    </p>

                    {drawn.description && drawn.description.length > 240 && (
                      <button
                        type="button"
                        onClick={() => setIsSynopsisExpanded((v) => !v)}
                        className="book-synopsis-toggle"
                      >
                        {isSynopsisExpanded ? 'Zwiń zarys fabuły ↑' : 'Rozwiń pełny opis fabuły ↓'}
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-3 border-t border-slate-200/70 mt-1">
                    <Button
                      disabled={savingToLibrary || savedToLibrary}
                      onClick={() => void handleAddToLibrary()}
                      className={cn(
                        'gap-1.5 h-10 px-3 rounded-xl font-bold text-xs justify-center cursor-pointer',
                        savedToLibrary
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs',
                      )}
                    >
                      {savedToLibrary ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : savingToLibrary ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <BookmarkPlus className="w-3.5 h-3.5" />
                      )}
                      <span className="truncate">
                        {savedToLibrary ? 'W bibliotece' : 'Do biblioteki'}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      disabled={busy || poolSize === 0}
                      onClick={() => void handleDraw()}
                      className="gap-1.5 border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 font-bold h-10 px-3 rounded-xl text-xs justify-center cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="truncate">Losuj inną</span>
                    </Button>

                    {drawn.openLibraryUrl && (
                      <a
                        href={drawn.openLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'col-span-1 gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold h-10 px-3 rounded-xl inline-flex items-center justify-center whitespace-nowrap text-xs no-underline',
                        )}
                      >
                        <span>Open Library</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    )}

                    {lubimyCzytacUrl && (
                      <a
                        href={lubimyCzytacUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'col-span-1 gap-1.5 border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-bold h-10 px-3 rounded-xl inline-flex items-center justify-center whitespace-nowrap text-xs no-underline',
                        )}
                        title="Szukaj opinii na Lubimyczytać.pl"
                      >
                        <Search className="w-3 h-3 text-amber-700 shrink-0" />
                        <span className="truncate">Lubimyczytać</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6 font-medium">
          Dane z Open Library · Wyliczenia czasu lektury na podstawie liczby stron (~220 słów/min)
        </p>
      </div>

      {/* Mobile Bottom Sheet Drawer for Filters */}
      <BookFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={(patch) => {
          setActiveMoodId(null);
          setFilters((prev) => ({ ...prev, ...patch }));
        }}
        onReset={() => {
          setActiveMoodId(null);
          setFilters(DEFAULT_FILTERS);
        }}
        poolSize={poolSize}
        poolLoading={poolLoading}
        disabled={busy}
      />

      {/* Mobile Sticky Thumb Zone Dock */}
      <div className="book-sticky-dock flex items-center gap-2">
        {drawn ? (
          <>
            <Button
              disabled={savingToLibrary || savedToLibrary}
              onClick={() => void handleAddToLibrary()}
              className={cn(
                'flex-1 h-11 rounded-xl font-bold text-xs justify-center cursor-pointer',
                savedToLibrary
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs',
              )}
            >
              {savedToLibrary ? <Check className="w-4 h-4 mr-1" /> : <BookmarkPlus className="w-4 h-4 mr-1" />}
              <span>{savedToLibrary ? 'W bibliotece' : '+ Do biblioteki'}</span>
            </Button>
            <Button
              disabled={busy || poolSize === 0}
              onClick={() => void handleDraw()}
              className="flex-[1.4] h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-md cursor-pointer"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              <span>Losuj kolejną</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              disabled={busy}
              className="h-11 px-3.5 rounded-xl border-slate-200 bg-white font-bold text-xs gap-1.5 text-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filtry</span>
            </Button>
            <Button
              disabled={busy || poolSize === 0}
              onClick={() => void handleDraw()}
              className="flex-1 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-md cursor-pointer"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              <span>
                {loading ? 'Kartkuję…' : `Losuj książkę (~${(poolSize ?? 0).toLocaleString('pl-PL')})`}
              </span>
            </Button>
          </>
        )}
      </div>

      <Toast
        isOpen={Boolean(snackbarMsg)}
        onClose={() => setSnackbarMsg(null)}
        message={snackbarMsg || ''}
      />
    </main>
  );
};

export default BookLosuje;
