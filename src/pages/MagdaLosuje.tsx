import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Link,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AnimatePresence, motion } from 'framer-motion';
import type { Movie, MovieFilters, MovieGenre } from '../types/Movie';
import {
  backdropUrl,
  fetchMovieGenres,
  hasTmdbApiKey,
  pickRandomMovie,
  posterUrl,
  releaseYear,
} from '../services/tmdbService';
import MagdaIcon from '../components/ui/MagdaIcon';
import WatchlistPanel from '../components/magda/WatchlistPanel';
import MagdaAdvancedFilters from '../components/magda/MagdaAdvancedFilters';
import { useWatchlistQuery } from '../hooks/useWatchlistQuery';
import { countAdvancedFilters } from '../services/tmdbService';
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

const MagdaLosuje: React.FC = () => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [drawing, setDrawing] = useState(false);
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

    try {
      const exclude = new Set([
        ...recentIds,
        ...watchlist.map((item) => item.tmdbId),
      ]);
      const picked = await pickRandomMovie(filters, exclude);
      setMovie(picked);
      setRecentIds((prev) => [picked.id, ...prev.filter((id) => id !== picked.id)].slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Losowanie nie powiodło się.');
    } finally {
      setDrawing(false);
    }
  }, [filters, recentIds, watchlist]);

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
    <Box className="magda-page" component="main">
      <div className="magda-grain" aria-hidden />
      <div className="magda-glow magda-glow--left" aria-hidden />
      <div className="magda-glow magda-glow--right" aria-hidden />

      <Box className="magda-inner">
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
            <span className="magda-sprocket" />
          </div>

          <div className="magda-hero-icon">
            <MagdaIcon size={88} />
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
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Brakuje klucza API TMDB. Załóż darmowe konto na{' '}
            <Link
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              themoviedb.org/settings/api
            </Link>
            , dodaj <code>VITE_TMDB_API_KEY=...</code> do pliku <code>.env</code> i zrestartuj{' '}
            <code>npm run dev</code>.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
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
              <FormControl fullWidth size="small" disabled={!apiConfigured || loadingGenres}>
                <Select
                  displayEmpty
                  value={filters.genreId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      genreId: value === '' ? null : Number(value),
                    }));
                  }}
                  inputProps={{ 'aria-label': 'Gatunek' }}
                >
                  <MenuItem value="">Wszystkie gatunki</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <div className="magda-field magda-field--years">
              <span className="magda-field-label">Lata premiery</span>
              <div className="magda-year-row">
                <FormControl fullWidth size="small" disabled={!apiConfigured}>
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
                <span className="magda-year-sep" aria-hidden>
                  →
                </span>
                <FormControl fullWidth size="small" disabled={!apiConfigured}>
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
                onChange={(_, value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(value) ? value[0] : value,
                  }))
                }
                className="magda-rating-slider"
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
            className="magda-draw-btn"
            variant="contained"
            size="large"
            disabled={!apiConfigured || drawing || loadingGenres}
            onClick={handleDraw}
            startIcon={
              drawing ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />
            }
          >
            {drawing ? 'Losuję…' : movie ? 'Losuj ponownie' : 'Losuj film'}
          </Button>
        </motion.section>

        <Box className="magda-result-slot">
          <AnimatePresence mode="wait">
            {!movie && !drawing && (
              <motion.div
                key="empty"
                className="magda-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LocalMoviesOutlinedIcon sx={{ fontSize: 48, opacity: 0.45 }} />
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Tu pojawi się wylosowany film.
                </Typography>
              </motion.div>
            )}

            {drawing && (
              <motion.div
                key="drawing"
                className="magda-drawing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="magda-spinner-ring" />
                <Typography className="magda-drawing-text">Magda miesza kartotekę…</Typography>
              </motion.div>
            )}

            {movie && !drawing && (
              <motion.article
                key={movie.id}
                className="magda-ticket"
                initial={{ opacity: 0, y: 28, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
                        <LocalMoviesOutlinedIcon sx={{ fontSize: 40 }} />
                      </div>
                    )}
                  </div>

                  <div className="magda-ticket-info">
                    <Typography className="magda-movie-title" component="h2">
                      {movie.title}
                    </Typography>

                    {movie.original_title !== movie.title && (
                      <Typography className="magda-original-title" component="p">
                        {movie.original_title}
                      </Typography>
                    )}

                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 1.5 }}>
                      <Chip
                        size="small"
                        icon={<StarRoundedIcon />}
                        label={`${movie.vote_average.toFixed(1)} / 10`}
                        className="magda-chip"
                      />
                      <Chip
                        size="small"
                        label={releaseYear(movie.release_date)}
                        className="magda-chip"
                      />
                      {movie.genre_ids.slice(0, 3).map((id) => {
                        const name = genreName(id);
                        return name ? (
                          <Chip key={id} size="small" label={name} className="magda-chip" />
                        ) : null;
                      })}
                    </Stack>

                    {movie.overview ? (
                      <Typography className="magda-overview">{movie.overview}</Typography>
                    ) : (
                      <Typography className="magda-overview magda-overview--muted">
                        Brak opisu po polsku dla tego tytułu.
                      </Typography>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} flexWrap="wrap" mt={0.5}>
                      {savedEntry ? (
                        <>
                          <Button
                            className="magda-wl-btn magda-wl-btn--saved"
                            variant="outlined"
                            size="small"
                            disabled
                            startIcon={<BookmarkAddedIcon />}
                          >
                            Na watchliście
                          </Button>
                          <Button
                            className={`magda-wl-btn${savedEntry.watched ? ' magda-wl-btn--done' : ''}`}
                            variant="contained"
                            size="small"
                            disabled={toggling}
                            onClick={() => void handleToggleCurrentWatched()}
                            startIcon={
                              toggling ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : savedEntry.watched ? (
                                <CheckCircleIcon />
                              ) : (
                                <CheckCircleOutlineIcon />
                              )
                            }
                          >
                            {savedEntry.watched ? 'Obejrzane' : 'Oznacz jako obejrzane'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="magda-wl-btn"
                          variant="contained"
                          size="small"
                          disabled={adding}
                          onClick={() => void handleAddToWatchlist()}
                          startIcon={
                            adding ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <BookmarkAddOutlinedIcon />
                            )
                          }
                        >
                          Dodaj do watchlisty
                        </Button>
                      )}

                      <Button
                        className="magda-tmdb-link"
                        component="a"
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                      >
                        TMDB
                      </Button>
                    </Stack>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </Box>

        {watchlistActionError && (
          <Alert
            severity="error"
            sx={{ mt: 2, borderRadius: 2 }}
            onClose={() => setWatchlistActionError(null)}
          >
            {watchlistActionError}
          </Alert>
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

        <Typography className="magda-credit" component="p">
          Dane filmów: The Movie Database (TMDB)
        </Typography>
      </Box>
    </Box>
  );
};

export default MagdaLosuje;
