import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { AnimatePresence, motion } from 'framer-motion';
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

const BookLosuje: React.FC = () => {
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
    <Box className="book-losuje-page" component="main">
      <div className="book-losuje-grain" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--left" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--right" aria-hidden />
      <div className="book-losuje-shelf" aria-hidden />

      <Box className="book-losuje-inner">
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
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
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
                <span className="book-pool-badge-muted">Liczenie…</span>
              ) : poolSize != null ? (
                <>
                  <strong>
                    {ratingApprox ? '~' : ''}
                    {poolSize.toLocaleString('pl-PL')}
                  </strong>
                  <span> w puli</span>
                </>
              ) : (
                <span className="book-pool-badge-muted">Open Library</span>
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
              <FormControl fullWidth size="small" disabled={busy}>
                <Select
                  displayEmpty
                  value={filters.subject}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, subject: String(e.target.value) }))
                  }
                >
                  {BOOK_LOTTERY_SUBJECTS.map((s) => (
                    <MenuItem key={s.value || 'all'} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <label className="book-field">
              <span className="book-field-label">Język edycji</span>
              <FormControl fullWidth size="small" disabled={busy}>
                <Select
                  displayEmpty
                  value={filters.language}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, language: String(e.target.value) }))
                  }
                >
                  {BOOK_LOTTERY_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code || 'any'} value={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                onChange={(_, value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(value) ? value[0] : value,
                  }))
                }
                className="book-rating-slider"
                marks={[
                  { value: 0, label: '0' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                ]}
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

            <div className="book-field book-field--span2 book-cover-row">
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.requireCover}
                    disabled={busy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        requireCover: e.target.checked,
                      }))
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#2f6f5e' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2f6f5e',
                      },
                    }}
                  />
                }
                label="Tylko z okładką"
                sx={{
                  m: 0,
                  color: 'rgba(232, 236, 232, 0.88)',
                  '& .MuiFormControlLabel-label': { fontWeight: 650, fontSize: '0.92rem' },
                }}
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
                <TuneRoundedIcon className="book-advanced-icon" fontSize="small" />
                <span className="book-advanced-toggle-label">Więcej filtrów</span>
                {advancedCount > 0 && (
                  <span className="book-advanced-count" aria-label={`${advancedCount} aktywne`}>
                    {advancedCount}
                  </span>
                )}
              </span>
              <ExpandMoreIcon className="book-advanced-chevron" fontSize="small" />
            </button>

            <Collapse in={advancedOpen}>
              <div className="book-advanced-body">
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
                    <div className="book-year-row">
                      <FormControl fullWidth size="small" disabled={busy}>
                        <Select
                          displayEmpty
                          value={filters.yearFrom ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilters((prev) => ({
                              ...prev,
                              yearFrom: value === '' ? null : Number(value),
                            }));
                          }}
                          inputProps={{ 'aria-label': 'Od roku' }}
                        >
                          <MenuItem value="">Od zawsze</MenuItem>
                          {YEAR_OPTIONS.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <span className="book-year-sep" aria-hidden>
                        →
                      </span>
                      <FormControl fullWidth size="small" disabled={busy}>
                        <Select
                          displayEmpty
                          value={filters.yearTo ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilters((prev) => ({
                              ...prev,
                              yearTo: value === '' ? null : Number(value),
                            }));
                          }}
                          inputProps={{ 'aria-label': 'Do roku' }}
                        >
                          <MenuItem value="">Do dziś</MenuItem>
                          {YEAR_OPTIONS.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
            </Collapse>
          </div>

          {poolSize === 0 && !poolLoading && (
            <Alert severity="warning" sx={{ mb: 1.25, borderRadius: 2 }}>
              Pula pusta — obniż ocenę/popularność, odznacz okładkę albo zmień język.
            </Alert>
          )}

          <Button
            className="book-draw-btn"
            variant="contained"
            size="large"
            disabled={busy || poolSize === 0}
            onClick={() => void handleDraw()}
            startIcon={
              busy ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />
            }
          >
            {loading
              ? 'Szukam w katalogu…'
              : drawing
                ? 'Losuję…'
                : drawn
                  ? 'Losuj ponownie'
                  : 'Losuj książkę'}
          </Button>
        </motion.section>

        <Box className="book-result-slot">
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
                  <MenuBookOutlinedIcon sx={{ fontSize: 36 }} />
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
                <CircularProgress size={34} sx={{ color: '#3d9b7a' }} />
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
                        <MenuBookOutlinedIcon sx={{ fontSize: 40 }} />
                        <span>Brak okładki</span>
                      </div>
                    )}
                  </div>

                  <div className="book-ticket-info">
                    <Typography className="book-ticket-title" component="h2">
                      {drawn.title}
                    </Typography>
                    <Typography className="book-ticket-author" component="p">
                      {formatAuthors(drawn)}
                    </Typography>

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
                            <StarRoundedIcon sx={{ fontSize: 15, verticalAlign: -2 }} />{' '}
                            {drawn.rating.toFixed(1)}
                            {drawn.ratingsCount != null && drawn.ratingsCount > 0 && (
                              <span className="book-meta-sub"> · {drawn.ratingsCount}</span>
                            )}
                          </dd>
                        </div>
                      )}
                      {drawn.wantToReadCount != null && drawn.wantToReadCount > 0 && (
                        <div>
                          <dt>Popularność</dt>
                          <dd>
                            <TrendingUpIcon sx={{ fontSize: 14, verticalAlign: -2, opacity: 0.8 }} />{' '}
                            {drawn.wantToReadCount.toLocaleString('pl-PL')}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <Stack direction="row" flexWrap="wrap" gap={0.85} sx={{ my: 1.2 }}>
                      {langs && (
                        <Chip
                          size="small"
                          label={langs}
                          className="book-chip"
                          title="Języki edycji"
                        />
                      )}
                      {ebook && (
                        <Chip
                          size="small"
                          icon={<AutoStoriesOutlinedIcon />}
                          label={ebook}
                          className="book-chip book-chip--accent"
                        />
                      )}
                      {drawn.subjects?.slice(0, 3).map((subject) => (
                        <Chip key={subject} size="small" label={subject} className="book-chip" />
                      ))}
                    </Stack>

                    {drawn.publishers && drawn.publishers.length > 0 && (
                      <p className="book-publishers">
                        <LibraryBooksOutlinedIcon sx={{ fontSize: 15, opacity: 0.65 }} />
                        <span>{drawn.publishers.slice(0, 3).join(' · ')}</span>
                      </p>
                    )}

                    <div className="book-ticket-actions">
                      <Button
                        className="book-draw-again"
                        variant="contained"
                        size="medium"
                        disabled={busy || poolSize === 0}
                        onClick={() => void handleDraw()}
                        startIcon={<ShuffleIcon />}
                      >
                        Losuj ponownie
                      </Button>
                      {drawn.openLibraryUrl && (
                        <Button
                          className="book-ol-link"
                          component="a"
                          href={drawn.openLibraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="medium"
                          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                        >
                          Open Library
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </Box>

        <Typography className="book-credit" component="p">
          Dane: Open Library · język = edycja w tym języku · ocena ~1–5
        </Typography>
      </Box>
    </Box>
  );
};

export default BookLosuje;
