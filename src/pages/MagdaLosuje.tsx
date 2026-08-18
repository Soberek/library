import React, { useCallback, useEffect, useState } from 'react';
import {
  Shuffle,
  Film,
  Star,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Movie, MovieFilters, MovieGenre } from '../types/Movie';
import {
  backdropUrl,
  countAdvancedFilters,
  discoverMovies,
  fetchMovieGenres,
  hasTmdbApiKey,
  pickRandomMovie,
  posterUrl,
  releaseYear,
} from '../services/tmdbService';
import MagdaIcon from '../components/ui/MagdaIcon';
import WatchlistPanel from '../components/magda/WatchlistPanel';
import MagdaAdvancedFilters from '../components/magda/MagdaAdvancedFilters';
import MagdaDrawAnimation from '../components/magda/MagdaDrawAnimation';
import { useWatchlistQuery } from '../hooks/useWatchlistQuery';
import { Slider } from '../components/ui/slider';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import './MagdaLosuje.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

const DEFAULT_FILTERS: MovieFilters = {
  genreId: null,
  yearFrom: null,
  yearTo: null,
  minRating: 6,
  minVotes: 100,
  maxRating: null,
  runtimeMin: null,
  runtimeMax: null,
  originalLanguage: null,
  originCountry: null,
  excludeGenreId: null,
  sortBy: 'popularity.desc',
  castId: null,
  castName: null,
  crewId: null,
  crewName: null,
  companyId: null,
  companyName: null,
  watchProviderId: null,
  watchRegion: 'PL',
  certification: null,
  certificationCountry: 'US',
};

export const MagdaLosuje: React.FC = () => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [reelMovies, setReelMovies] = useState<Movie[]>([]);
  const [spinWinner, setSpinWinner] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchlistActionError, setWatchlistActionError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const apiConfigured = hasTmdbApiKey();
  const advancedCount = countAdvancedFilters(filters);

  const {
    watchlist,
    loading: watchlistLoading,
    findByTmdbId,
    addToWatchlist,
    adding,
    toggleWatched,
    toggling,
    removeFromWatchlist,
    removing,
  } = useWatchlistQuery();

  const savedEntry = movie ? findByTmdbId(movie.id) : undefined;

  useEffect(() => {
    if (!apiConfigured) {
      setLoadingGenres(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const list = await fetchMovieGenres();
        if (!cancelled) {
          setGenres(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Nie udało się pobrać gatunków.');
        }
      } finally {
        if (!cancelled) setLoadingGenres(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiConfigured]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'MAGDA LOSUJE';

    const favicon =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      (() => {
        const link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
        return link;
      })();
    const previousHref = favicon.href;
    favicon.href = '/magda-losuje-icon.png';
    favicon.type = 'image/png';

    return () => {
      document.title = previousTitle;
      favicon.href = previousHref;
    };
  }, []);

  const handleDraw = useCallback(async () => {
    setDrawing(true);
    setError(null);
    setWatchlistActionError(null);
    setMovie(null);
    setReelMovies([]);
    setSpinWinner(null);

    try {
      const exclude = new Set([
        ...recentIds,
        ...watchlist.map((item) => item.tmdbId),
      ]);

      const [picked, reelPage] = await Promise.all([
        pickRandomMovie(filters, exclude),
        discoverMovies(filters, Math.floor(Math.random() * 5) + 1).catch(() => null),
      ]);

      const reelPool = (reelPage?.results ?? []).filter((m) => m.poster_path);
      const pool =
        reelPool.length > 0
          ? reelPool
          : [picked].filter((m) => m.poster_path);

      setReelMovies(pool);
      setSpinWinner(picked);
      setRecentIds((prev) => [picked.id, ...prev.filter((id) => id !== picked.id)].slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Losowanie nie powiodło się.');
      setDrawing(false);
      setSpinWinner(null);
      setReelMovies([]);
    }
  }, [filters, recentIds, watchlist]);

  const handleSpinComplete = useCallback(() => {
    if (!spinWinner) return;
    setMovie(spinWinner);
    setDrawing(false);
    setSpinWinner(null);
    setReelMovies([]);
  }, [spinWinner]);

  const handleAddToWatchlist = useCallback(async () => {
    if (!movie) return;
    setWatchlistActionError(null);
    try {
      await addToWatchlist(movie);
    } catch (err) {
      setWatchlistActionError(
        err instanceof Error ? err.message : 'Nie udało się dodać do watchlisty.',
      );
    }
  }, [movie, addToWatchlist]);

  const handleToggleCurrentWatched = useCallback(async () => {
    if (!savedEntry) return;
    setWatchlistActionError(null);
    try {
      await toggleWatched({ entryId: savedEntry.id, watched: !savedEntry.watched });
    } catch (err) {
      setWatchlistActionError(
        err instanceof Error ? err.message : 'Nie udało się zaktualizować statusu.',
      );
    }
  }, [savedEntry, toggleWatched]);

  const genreName = (id: number) => genres.find((g) => g.id === id)?.name ?? '';

  const backdrop = movie ? backdropUrl(movie.backdrop_path) : null;
  const poster = movie ? posterUrl(movie.poster_path, 'w500') : null;

  return (
    <main className="magda-page">
      <div className="magda-glow magda-glow--left" aria-hidden />
      <div className="magda-glow magda-glow--right" aria-hidden />

      <div className="magda-inner">
        <motion.header
          className="magda-hero"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="magda-marquee" aria-hidden>
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
            <span className="magda-sprocket" />
          </div>

          <div className="magda-hero-icon">
            <MagdaIcon size={84} />
          </div>

          <h1 className="magda-brand">
            <span className="magda-brand-line magda-brand-line--name">MAGDA</span>
            <span className="magda-brand-line magda-brand-line--verb">LOSUJE</span>
          </h1>

          <p className="magda-tagline">
            Gatunek, lata, ocena — resztę zostaw Magdzie.
          </p>
        </motion.header>

        {!apiConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-4">
            Brakuje klucza API TMDB. Załóż darmowe konto na{' '}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold"
            >
              themoviedb.org/settings/api
            </a>
            , dodaj <code>VITE_TMDB_API_KEY=...</code> do pliku <code>.env</code> i zrestartuj{' '}
            <code>npm run dev</code>.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 mb-4 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <motion.section
          className="magda-controls"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="magda-controls-head">
            <div>
              <p className="magda-controls-kicker">konsola Magdy</p>
              <h2 className="magda-controls-title">Ustaw i losuj</h2>
            </div>
            <p className="magda-controls-hint">Im ciaśniejsze filtry, tym rzadsze trafienia.</p>
          </div>

          <div className="magda-controls-grid">
            <label className="magda-field magda-field--genre">
              <span className="magda-field-label">Gatunek</span>
              <Select
                value={filters.genreId ?? ''}
                disabled={!apiConfigured || loadingGenres}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    genreId: value === '' ? null : Number(value),
                  }));
                }}
              >
                <option value="">Wszystkie gatunki</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </Select>
            </label>

            <div className="magda-field magda-field--years">
              <span className="magda-field-label">Lata premiery</span>
              <div className="magda-year-row flex items-center gap-2">
                <Select
                  value={filters.yearFrom ?? ''}
                  disabled={!apiConfigured}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      yearFrom: value === '' ? null : Number(value),
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
                <span className="magda-year-sep" aria-hidden>
                  →
                </span>
                <Select
                  value={filters.yearTo ?? ''}
                  disabled={!apiConfigured}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      yearTo: value === '' ? null : Number(value),
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

            <div className="magda-field magda-field--rating">
              <div className="magda-field-label-row">
                <span className="magda-field-label">Minimalna ocena</span>
                <span className="magda-rating-pill">{filters.minRating.toFixed(1)}+</span>
              </div>
              <Slider
                value={filters.minRating}
                min={0}
                max={9}
                step={0.5}
                disabled={!apiConfigured}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(value) ? value[0] : value,
                  }))
                }
              />
              <div className="magda-rating-ends">
                <span>0</span>
                <span>9</span>
              </div>
            </div>

            <div className="magda-field magda-field--votes">
              <span className="magda-field-label">Popularność</span>
              <div className="magda-seg" role="group" aria-label="Popularność">
                {(
                  [
                    { value: 20, label: 'Luźno' },
                    { value: 100, label: 'Środek' },
                    { value: 500, label: 'Znane' },
                    { value: 2000, label: 'Hity' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`magda-seg-btn${filters.minVotes === opt.value ? ' is-active' : ''}`}
                    disabled={!apiConfigured}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minVotes: opt.value,
                      }))
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <MagdaAdvancedFilters
            filters={filters}
            genres={genres}
            disabled={!apiConfigured}
            open={advancedOpen}
            activeCount={advancedCount}
            onToggle={() => setAdvancedOpen((prev) => !prev)}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          />

          <Button
            className="magda-draw-btn w-full h-12 text-sm font-bold gap-2"
            disabled={!apiConfigured || drawing || loadingGenres}
            onClick={handleDraw}
          >
            {drawing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Shuffle className="w-5 h-5" />
            )}
            <span>{drawing ? 'Losuję…' : movie ? 'Losuj ponownie' : 'Losuj film'}</span>
          </Button>
        </motion.section>

        <div className="magda-result-slot">
          <AnimatePresence mode="wait">
            {!movie && !drawing && (
              <motion.div
                key="empty"
                className="magda-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Film className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600 text-center">
                  Tu pojawi się wylosowany film.
                </p>
              </motion.div>
            )}

            {drawing && spinWinner && (
              <MagdaDrawAnimation
                key={`spin-${spinWinner.id}`}
                reelMovies={reelMovies}
                winner={spinWinner}
                onComplete={handleSpinComplete}
              />
            )}

            {drawing && !spinWinner && (
              <motion.div
                key="drawing-load"
                className="magda-drawing magda-drawing--loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="magda-spinner-ring" />
                <p className="magda-drawing-text">Ładuję taśmę…</p>
              </motion.div>
            )}

            {movie && !drawing && (
              <motion.article
                key={movie.id}
                className="magda-ticket"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {backdrop && (
                  <div
                    className="magda-ticket-backdrop"
                    style={{ backgroundImage: `url(${backdrop})` }}
                  />
                )}
                <div className="magda-ticket-body">
                  <div className="magda-poster-wrap">
                    {poster ? (
                      <img
                        className="magda-poster"
                        src={poster}
                        alt={`Plakat: ${movie.title}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="magda-poster magda-poster--fallback">
                        <Film className="w-10 h-10 text-amber-600" />
                      </div>
                    )}
                  </div>

                  <div className="magda-ticket-info">
                    <h2 className="magda-movie-title">
                      {movie.title}
                    </h2>

                    {movie.original_title !== movie.title && (
                      <p className="magda-original-title">
                        {movie.original_title}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 my-3">
                      <span className="magda-chip">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline -mt-0.5" />{' '}
                        {movie.vote_average.toFixed(1)} / 10
                      </span>
                      <span className="magda-chip">
                        {releaseYear(movie.release_date)}
                      </span>
                      {movie.genre_ids.slice(0, 3).map((id) => {
                        const name = genreName(id);
                        return name ? (
                          <span key={id} className="magda-chip">
                            {name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {movie.overview ? (
                      <p className="magda-overview">{movie.overview}</p>
                    ) : (
                      <p className="magda-overview magda-overview--muted">
                        Brak opisu po polsku dla tego tytułu.
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 flex-wrap pt-3">
                      {savedEntry ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800"
                          >
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                            <span>Na watchliście</span>
                          </Button>
                          <Button
                            size="sm"
                            disabled={toggling}
                            onClick={() => void handleToggleCurrentWatched()}
                            className={cn(
                              "gap-1.5",
                              savedEntry.watched
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-amber-600 hover:bg-amber-700 text-white"
                            )}
                          >
                            {toggling ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : savedEntry.watched ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                            <span>{savedEntry.watched ? 'Obejrzane' : 'Oznacz jako obejrzane'}</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          disabled={adding}
                          onClick={() => void handleAddToWatchlist()}
                          className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {adding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4" />
                          )}
                          <span>Dodaj do watchlisty</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        <a
                          href={`https://www.themoviedb.org/movie/${movie.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>TMDB</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        {watchlistActionError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 mt-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{watchlistActionError}</span>
          </div>
        )}

        <WatchlistPanel
          items={watchlist}
          loading={watchlistLoading}
          busy={toggling || removing}
          onToggleWatched={async (entryId, watched) => {
            setWatchlistActionError(null);
            try {
              await toggleWatched({ entryId, watched });
            } catch (err) {
              setWatchlistActionError(
                err instanceof Error ? err.message : 'Nie udało się zaktualizować statusu.',
              );
            }
          }}
          onRemove={async (entryId) => {
            setWatchlistActionError(null);
            try {
              await removeFromWatchlist(entryId);
            } catch (err) {
              setWatchlistActionError(
                err instanceof Error ? err.message : 'Nie udało się usunąć filmu.',
              );
            }
          }}
        />

        <p className="magda-credit">
          Dane filmów: The Movie Database (TMDB)
        </p>
      </div>
    </main>
  );
};

export default MagdaLosuje;
