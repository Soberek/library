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
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { addBook } from '../services/booksService';
import type { BookLotteryFilters, LotteryBook } from '../types/LotteryBook';
import {
  BOOK_EDITION_OPTIONS,
  BOOK_LOTTERY_LANGUAGES,
  BOOK_LOTTERY_SUBJECTS,
  BOOK_PAGES_OPTIONS,
  BOOK_POPULARITY_OPTIONS,
  BOOK_RATING_COUNT_OPTIONS,
  countAdvancedBookFilters,
  countLotteryBooks,
  ebookLabel,
  languageLabel,
  needsClientRatingFilter,
  pickRandomLotteryBook,
} from '../services/openLibraryService';
import BookDrawAnimation from '../components/book/BookDrawAnimation';
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
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [savingToLibrary, setSavingToLibrary] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  const ratingApprox = needsClientRatingFilter(filters);
  const advancedCount = countAdvancedBookFilters(filters);
  const busy = drawing || loading;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Losuj książkę';
    return () => {
      document.title = previousTitle;
    };
  }, []);

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

  const handleDraw = useCallback(async () => {
    setError(null);
    setDrawn(null);
    setSavedToLibrary(false);
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
        [winner.id, ...prev.filter((id) => id !== winner.id)].slice(0, 12),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Losowanie nie powiodło się.');
      setDrawing(false);
    } finally {
      setLoading(false);
    }
  }, [filters, recentIds]);

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
  const subjectLabel =
    BOOK_LOTTERY_SUBJECTS.find((s) => s.value === filters.subject)?.label ?? 'Wszystkie';
  const langLabel =
    BOOK_LOTTERY_LANGUAGES.find((l) => l.code === filters.language)?.label ?? 'Dowolny';
  const popLabel =
    BOOK_POPULARITY_OPTIONS.find((p) => p.value === filters.minPopularity)?.label ?? 'Luźno';

  return (
    <main className="book-losuje-page">
      <div className="book-losuje-glow book-losuje-glow--left" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--right" aria-hidden />

      <div className="book-losuje-inner">
        <motion.header
          className="book-losuje-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="book-losuje-kicker">katalog · open library</p>
          <h1 className="book-losuje-brand">
            <span className="book-losuje-brand-line">LOSUJ</span>
            <span className="book-losuje-brand-line book-losuje-brand-line--accent">
              KSIĄŻKĘ
            </span>
          </h1>
          <p className="book-losuje-tagline">
            Ustaw gatunek i próg jakości — resztę wybierze katalog.
          </p>
        </motion.header>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 mb-4 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <motion.section
          className="book-losuje-controls"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="book-losuje-controls-head">
            <div>
              <p className="book-losuje-controls-kicker">filtry</p>
              <h2 className="book-losuje-controls-title">Co ma wpaść?</h2>
            </div>
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
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, subject: String(e.target.value) }))
                }
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
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, language: String(e.target.value) }))
                }
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
                  {filters.minRating <= 0 ? 'dowolna' : `${filters.minRating.toFixed(1)}+`}
                </span>
              </div>
              <Slider
                value={filters.minRating}
                min={0}
                max={5}
                step={0.5}
                disabled={busy}
                onChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(val) ? val[0] : val,
                  }))
                }
              />
            </div>

            <div className="book-field book-field--span2">
              <div className="book-field-label-row">
                <span className="book-field-label">Popularność</span>
                <span className="book-field-hint-inline">„chcę przeczytać”</span>
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
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPopularity: opt.value }))
                    }
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

          <div className="book-advanced">
            <button
              type="button"
              className={`book-advanced-toggle${advancedOpen ? ' is-open' : ''}${advancedCount > 0 ? ' has-active' : ''}`}
              disabled={busy}
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((v) => !v)}
            >
              <span className="book-advanced-toggle-start">
                <SlidersHorizontal className="book-advanced-icon w-4 h-4" />
                <span className="book-advanced-toggle-label">Więcej filtrów</span>
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
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              minRatingsCount: opt.value,
                            }))
                          }
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
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, minEditions: opt.value }))
                          }
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
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, minPages: opt.value }))
                          }
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
                    Wyczyść dodatkowe
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

          <Button
            className="book-draw-btn w-full h-12 text-sm font-bold gap-2"
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
                ? 'Szukam w katalogu…'
                : drawing
                  ? 'Losuję…'
                  : drawn
                    ? 'Losuj ponownie'
                    : 'Losuj książkę'}
            </span>
          </Button>
        </motion.section>

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
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="book-empty-title">Półka czeka</p>
                <p className="book-empty-text">
                  Wybierz gatunek i naciśnij losuj — wylosowana pozycja pojawi się tutaj.
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
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="book-empty-title">Kartkuję katalog…</p>
                <p className="book-empty-text">Pobieram próbkę z Open Library</p>
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
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="book-ticket-ribbon">Wylosowano</div>
                <div className="book-ticket-body">
                  <div className="book-ticket-cover">
                    {drawn.cover ? (
                      <img src={drawn.cover} alt={`Okładka: ${drawn.title}`} />
                    ) : (
                      <div className="book-ticket-cover-fallback">
                        <BookOpen className="w-10 h-10 text-emerald-600" />
                        <span>Brak okładki</span>
                      </div>
                    )}
                  </div>

                  <div className="book-ticket-info">
                    <h2 className="book-ticket-title">
                      {drawn.title}
                    </h2>
                    <p className="book-ticket-author">
                      {formatAuthors(drawn)}
                    </p>

                    <dl className="book-meta">
                      {drawn.year != null && (
                        <div>
                          <dt>Rok</dt>
                          <dd>{drawn.year}</dd>
                        </div>
                      )}
                      {drawn.pages != null && (
                        <div>
                          <dt>Strony</dt>
                          <dd>~{drawn.pages}</dd>
                        </div>
                      )}
                      {drawn.editionCount != null && drawn.editionCount > 0 && (
                        <div>
                          <dt>Edycje</dt>
                          <dd>{drawn.editionCount}</dd>
                        </div>
                      )}
                      {drawn.rating != null && (
                        <div>
                          <dt>Ocena</dt>
                          <dd>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline -mt-0.5" />{' '}
                            {drawn.rating.toFixed(1)}
                            {drawn.ratingsCount != null && drawn.ratingsCount > 0 && (
                              <span className="text-xs text-slate-500 font-normal"> · {drawn.ratingsCount}</span>
                            )}
                          </dd>
                        </div>
                      )}
                      {drawn.wantToReadCount != null && drawn.wantToReadCount > 0 && (
                        <div>
                          <dt>Popularność</dt>
                          <dd>
                            <TrendingUp className="w-3.5 h-3.5 inline -mt-0.5 text-emerald-600" />{' '}
                            {drawn.wantToReadCount.toLocaleString('pl-PL')}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="flex flex-wrap gap-1.5 my-3">
                      {langs && (
                        <span className="book-chip" title="Języki edycji">
                          {langs}
                        </span>
                      )}
                      {ebook && (
                        <span className="book-chip book-chip--accent">
                          {ebook}
                        </span>
                      )}
                      {drawn.subjects?.slice(0, 3).map((subject) => (
                        <span key={subject} className="book-chip">
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div className="book-ticket-actions flex flex-wrap items-center gap-2 pt-2">
                      <Button
                        variant="default"
                        disabled={busy || poolSize === 0}
                        onClick={() => void handleDraw()}
                        className="book-draw-again gap-1.5"
                      >
                        <Shuffle className="w-4 h-4" />
                        <span>Losuj ponownie</span>
                      </Button>

                      <Button
                        disabled={savingToLibrary || savedToLibrary}
                        onClick={() => void handleAddToLibrary()}
                        className={cn(
                          "gap-1.5",
                          savedToLibrary ? "bg-emerald-600 text-white" : "bg-emerald-700 text-white hover:bg-emerald-800"
                        )}
                      >
                        {savedToLibrary ? (
                          <Check className="w-4 h-4" />
                        ) : savingToLibrary ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <BookmarkPlus className="w-4 h-4" />
                        )}
                        <span>{savedToLibrary ? 'W Twojej bibliotece' : 'Dodaj do biblioteki'}</span>
                      </Button>

                      {drawn.openLibraryUrl && (
                        <a
                          href={drawn.openLibraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            'book-ol-link gap-1.5 inline-flex items-center justify-center whitespace-nowrap text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 no-underline shrink-0'
                          )}
                        >
                          <span>Open Library</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        <p className="book-credit">
          Dane: Open Library · język = edycja w tym języku · ocena ~1–5
        </p>
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
