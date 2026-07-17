import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
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
import './MagdaLosuje.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

const DEFAULT_FILTERS: MovieFilters = {
  genreId: null,
  yearFrom: null,
  yearTo: null,
  minRating: 6,
  minVotes: 100,
};

const MagdaLosuje: React.FC = () => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiConfigured = hasTmdbApiKey();

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

  const handleDraw = useCallback(async () => {
    setDrawing(true);
    setError(null);

    try {
      const exclude = new Set(recentIds);
      const picked = await pickRandomMovie(filters, exclude);
      setMovie(picked);
      setRecentIds((prev) => [picked.id, ...prev.filter((id) => id !== picked.id)].slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Losowanie nie powiodło się.');
    } finally {
      setDrawing(false);
    }
  }, [filters, recentIds]);

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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Typography className="magda-kicker" component="p">
            losowanie filmów
          </Typography>
          <Typography className="magda-brand" component="h1">
            MAGDA LOSUJE
          </Typography>
          <Typography className="magda-tagline" component="p">
            Wybierz gatunek, ustaw ramy — a Magda wylosuje film na wieczór.
          </Typography>
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
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small" disabled={!apiConfigured || loadingGenres}>
              <InputLabel id="magda-genre-label">Gatunek</InputLabel>
              <Select
                labelId="magda-genre-label"
                label="Gatunek"
                value={filters.genreId ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    genreId: value === '' ? null : Number(value),
                  }));
                }}
              >
                <MenuItem value="">Wszystkie gatunki</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth size="small" disabled={!apiConfigured}>
                <InputLabel id="magda-year-from-label">Od roku</InputLabel>
                <Select
                  labelId="magda-year-from-label"
                  label="Od roku"
                  value={filters.yearFrom ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      yearFrom: value === '' ? null : Number(value),
                    }));
                  }}
                >
                  <MenuItem value="">Bez limitu</MenuItem>
                  {YEAR_OPTIONS.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!apiConfigured}>
                <InputLabel id="magda-year-to-label">Do roku</InputLabel>
                <Select
                  labelId="magda-year-to-label"
                  label="Do roku"
                  value={filters.yearTo ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      yearTo: value === '' ? null : Number(value),
                    }));
                  }}
                >
                  <MenuItem value="">Bez limitu</MenuItem>
                  {YEAR_OPTIONS.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Minimalna ocena
                </Typography>
                <Typography variant="body2" fontWeight={700} className="magda-rating-value">
                  {filters.minRating.toFixed(1)}+
                </Typography>
              </Stack>
              <Slider
                value={filters.minRating}
                min={0}
                max={9}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                  { value: 9, label: '9' },
                ]}
                disabled={!apiConfigured}
                onChange={(_, value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: Array.isArray(value) ? value[0] : value,
                  }))
                }
                sx={{
                  color: '#c45c26',
                  '& .MuiSlider-markLabel': { fontSize: '0.7rem' },
                }}
              />
            </Box>

            <FormControl fullWidth size="small" disabled={!apiConfigured}>
              <InputLabel id="magda-votes-label">Popularność</InputLabel>
              <Select
                labelId="magda-votes-label"
                label="Popularność"
                value={filters.minVotes}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minVotes: Number(e.target.value),
                  }))
                }
              >
                <MenuItem value={20}>Luźno (min. 20 głosów)</MenuItem>
                <MenuItem value={100}>Zrównoważone (min. 100)</MenuItem>
                <MenuItem value={500}>Tylko znane (min. 500)</MenuItem>
                <MenuItem value={2000}>Hitowe (min. 2000)</MenuItem>
              </Select>
            </FormControl>

            <Button
              className="magda-draw-btn"
              variant="contained"
              size="large"
              disabled={!apiConfigured || drawing || loadingGenres}
              onClick={handleDraw}
              startIcon={
                drawing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ShuffleIcon />
                )
              }
            >
              {drawing ? 'Losuję…' : movie ? 'Losuj ponownie' : 'Losuj film'}
            </Button>
          </Stack>
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

                    <Button
                      className="magda-tmdb-link"
                      component="a"
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon />}
                      size="small"
                    >
                      Zobacz w TMDB
                    </Button>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </Box>

        <Typography className="magda-credit" component="p">
          Dane filmów: The Movie Database (TMDB)
        </Typography>
      </Box>
    </Box>
  );
};

export default MagdaLosuje;
