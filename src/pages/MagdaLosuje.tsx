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
  Clock,
  Clapperboard,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Movie, MovieFilters, MovieGenre, MoodPreset } from '../types/Movie';
import {
  backdropUrl,
  countAdvancedFilters,
  discoverMovies,
  fetchMovieGenres,
  formatRuntime,
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
import { Button, buttonVariants } from '../components/ui/button';
import { MOOD_PRESETS, DEFAULT_FILTERS } from '../constants/movieFilters';
import { cn } from '../lib/utils';
import './MagdaLosuje.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

export const MagdaLosuje: React.FC = () => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [filters, setFilters] = useState<MovieFilters>({
    ...DEFAULT_FILTERS,
    minRating: 6.5,
    minVotes: 200,
  });
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
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

  const applyMoodPreset = (preset: MoodPreset) => {
    if (activeMoodId === preset.id) {
      // Toggle off preset
      setActiveMoodId(null);
      setFilters({
        ...DEFAULT_FILTERS,
        minRating: 6.5,
        minVotes: 200,
      });
      return;
    }

    setActiveMoodId(preset.id);
    setFilters((prev) => ({
      ...prev,
      ...preset.filters,
    }));
  };

  const resetFiltersToDefault = () => {
    setActiveMoodId(null);
    setFilters({
      ...DEFAULT_FILTERS,
      minRating: 6.5,
      minVotes: 200,
    });
  };

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
        discoverMovies(filters, 1).catch(() => null),
      ]);

      const reelPool = (reelPage?.results ?? []).filter((m) => m.poster_path);
      const pool =
        reelPool.length > 0
          ? reelPool
          : [picked].filter((m) => m.poster_path);

      setReelMovies(pool);
      setSpinWinner(picked);
      setRecentIds((prev) => [picked.id, ...prev.filter((id) => id !== picked.id)].slice(0, 15));
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
  const runtimeDisplay = movie ? formatRuntime(movie.runtime) : '';

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
            Trafne filmy dopasowane do Twojego nastroju — szybko i bez szukania.
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
              <h2 className="magda-controls-title">Wybierz klimat & losuj</h2>
            </div>
            <div className="flex items-center gap-2">
              {(activeMoodId || advancedCount > 0) && (
                <button
                  type="button"
                  onClick={resetFiltersToDefault}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Domyślne</span>
                </button>
              )}
            </div>
          </div>

          {/* Curated Mood Presets Bar */}
          <div className="mb-4">
            <span className="magda-field-label block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Szybki klimat (Trafne propozycje)</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {MOOD_PRESETS.map((preset) => {
                const isSelected = activeMoodId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={!apiConfigured}
                    onClick={() => applyMoodPreset(preset)}
                    className={cn(
                      "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/25 ring-2 ring-amber-400/30"
                        : "bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80 text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <span className="text-base shrink-0">{preset.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("text-[11px] sm:text-xs font-bold leading-tight line-clamp-1", isSelected ? "text-white" : "text-slate-900")}>
                        {preset.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {activeMoodId && (
              <p className="text-[11px] text-amber-700 font-medium mt-2 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                {MOOD_PRESETS.find((p) => p.id === activeMoodId)?.description}
              </p>
            )}
          </div>

          <div className="magda-controls-grid">
            <label className="magda-field magda-field--genre">
              <span className="magda-field-label">Gatunek</span>
              <Select
                value={filters.genreId ?? ''}
                disabled={!apiConfigured || loadingGenres}
                onChange={(e) => {
                  const value = e.target.value;
                  setActiveMoodId(null);
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
                    setActiveMoodId(null);
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
                    setActiveMoodId(null);
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
                onChange={(value) => {
                  setActiveMoodId(null);
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(value) ? value[0] : value,
                  }));
                }}
              />
              <div className="magda-rating-ends">
                <span>0</span>
                <span>9</span>
              </div>
            </div>

            <div className="magda-field magda-field--votes">
              <span className="magda-field-label">Popularność / Rozpoznawalność</span>
              <div className="magda-seg" role="group" aria-label="Popularność">
                {(
                  [
                    { value: 50, label: 'Niszowe' },
                    { value: 200, label: 'Dobre' },
                    { value: 500, label: 'Znane' },
                    { value: 1500, label: 'Wielkie Hity' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`magda-seg-btn${filters.minVotes === opt.value ? ' is-active' : ''}`}
                    disabled={!apiConfigured}
                    onClick={() => {
                      setActiveMoodId(null);
                      setFilters((prev) => ({
                        ...prev,
                        minVotes: opt.value,
                      }));
                    }}
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
            onChange={(patch) => {
              setActiveMoodId(null);
              setFilters((prev) => ({ ...prev, ...patch }));
            }}
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
            <span>{drawing ? 'Magda losuje film…' : movie ? 'Wylosuj inny film' : 'Losuj film'}</span>
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
                  Wybierz nastrój lub ustaw filtry i kliknij &quot;Losuj film&quot;.
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
                <p className="magda-drawing-text">Dobieram najlepsze propozycje…</p>
              </motion.div>
            )}

            {movie && !drawing && (
              <motion.article
                key={movie.id}
                className="magda-ticket"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {backdrop && (
                  <div
                    className="magda-ticket-backdrop"
                    style={{ backgroundImage: `url(${backdrop})` }}
                  />
                )}
                <div className="magda-ticket-body">
                  {/* Left: Poster */}
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
                        <Film className="w-12 h-12 text-amber-600" />
                      </div>
                    )}
                  </div>

                  {/* Right: Info */}
                  <div className="magda-ticket-info text-center sm:text-left">
                    {/* Title & Tagline */}
                    <div>
                      <h2 className="magda-movie-title text-slate-900 font-extrabold tracking-tight font-display">
                        {movie.title}
                      </h2>

                      {movie.original_title && movie.original_title !== movie.title && (
                        <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                          {movie.original_title}
                        </p>
                      )}

                      {movie.tagline && (
                        <p className="text-xs sm:text-sm font-semibold italic text-amber-800/90 mt-1 mb-1">
                          &bdquo;{movie.tagline}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Badges / Chips */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 my-3">
                      {/* Rating */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                        <span className="text-[10px] text-amber-800/60 font-normal">/ 10</span>
                        {movie.vote_count > 0 && (
                          <span className="text-[10px] text-amber-800/60 font-normal ml-0.5">
                            ({movie.vote_count.toLocaleString()})
                          </span>
                        )}
                      </span>

                      {/* Year */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                        {releaseYear(movie.release_date)}
                      </span>

                      {/* Runtime */}
                      {runtimeDisplay && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{runtimeDisplay}</span>
                        </span>
                      )}

                      {/* Genres */}
                      {movie.genre_ids.slice(0, 4).map((id) => {
                        const name = genreName(id);
                        return name ? (
                          <span
                            key={id}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/70"
                          >
                            {name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Director */}
                    {movie.director && (
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium mb-2.5">
                        <Clapperboard className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          Reżyseria: <strong className="text-slate-900 font-bold">{movie.director}</strong>
                        </span>
                      </div>
                    )}

                    {/* Overview */}
                    <p className="magda-overview text-slate-600 text-left">
                      {movie.overview || "Brak szczegółowego opisu dla tego tytułu."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full pt-4 border-t border-slate-100 mt-4">
                      {savedEntry ? (
                        <>
                          <Button
                            variant="outline"
                            size="default"
                            disabled
                            className="gap-2 border-emerald-300 bg-emerald-50 text-emerald-800 font-bold h-11 sm:h-10 px-4 rounded-xl w-full sm:w-auto justify-center"
                          >
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                            <span>Na watchliście</span>
                          </Button>
                          <Button
                            size="default"
                            disabled={toggling}
                            onClick={() => void handleToggleCurrentWatched()}
                            className={cn(
                              "gap-2 font-bold h-11 sm:h-10 px-4 rounded-xl w-full sm:w-auto justify-center",
                              savedEntry.watched
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
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
                          size="default"
                          disabled={adding}
                          onClick={() => void handleAddToWatchlist()}
                          className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-sm shadow-amber-600/20 h-11 sm:h-10 px-5 rounded-xl cursor-pointer w-full sm:w-auto justify-center"
                        >
                          {adding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4" />
                          )}
                          <span>Dodaj do watchlisty</span>
                        </Button>
                      )}

                      <a
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'default' }),
                          'gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold h-11 sm:h-10 px-4 rounded-xl inline-flex items-center justify-center whitespace-nowrap text-sm no-underline w-full sm:w-auto shrink-0'
                        )}
                      >
                        <span>Profil TMDB</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      </a>
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
          Dane filmów i rekomendacje: The Movie Database (TMDB)
        </p>
      </div>
    </main>
  );
};

export default MagdaLosuje;
