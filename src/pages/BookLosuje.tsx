import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AnimatePresence, motion } from 'framer-motion';
import type { BookLotteryFilters, LotteryBook } from '../types/LotteryBook';
import {
  BOOK_LOTTERY_LANGUAGES,
  BOOK_LOTTERY_SUBJECTS,
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
  requireCover: true,
};

const BookLosuje: React.FC = () => {
  const [filters, setFilters] = useState<BookLotteryFilters>(DEFAULT_FILTERS);
  const [drawn, setDrawn] = useState<LotteryBook | null>(null);
  const [spinWinner, setSpinWinner] = useState<LotteryBook | null>(null);
  const [reelBooks, setReelBooks] = useState<LotteryBook[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Losuj książkę';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleDraw = useCallback(async () => {
    setError(null);
    setDrawn(null);
    setLoading(true);
    setDrawing(true);
    setSpinWinner(null);
    setReelBooks([]);

    try {
      const { winner, reel } = await pickRandomLotteryBook(
        filters,
        new Set(recentIds),
      );
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

  return (
    <Box className="book-losuje-page" component="main">
      <div className="book-losuje-grain" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--left" aria-hidden />
      <div className="book-losuje-glow book-losuje-glow--right" aria-hidden />

      <Box className="book-losuje-inner">
        <motion.header
          className="book-losuje-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="book-losuje-kicker">Open Library</p>
          <h1 className="book-losuje-brand">
            <span className="book-losuje-brand-line">LOSUJ</span>
            <span className="book-losuje-brand-line book-losuje-brand-line--accent">
              KSIĄŻKĘ
            </span>
          </h1>
          <p className="book-losuje-tagline">
            Gatunek, język, lata — resztę zostaw katalogowi.
          </p>
        </motion.header>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <motion.section
          className="book-losuje-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
        >
          <div className="book-losuje-controls-head">
            <div>
              <p className="book-losuje-controls-kicker">filtry</p>
              <h2 className="book-losuje-controls-title">Co ma wpaść?</h2>
            </div>
            <p className="book-losuje-controls-hint">Dane: Open Library</p>
          </div>

          <div className="book-losuje-grid">
            <label className="book-field">
              <span className="book-field-label">Gatunek / temat</span>
              <FormControl fullWidth size="small" disabled={drawing || loading}>
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
              <span className="book-field-label">Język</span>
              <FormControl fullWidth size="small" disabled={drawing || loading}>
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
              <span className="book-field-label">Lata wydania</span>
              <div className="book-year-row">
                <FormControl fullWidth size="small" disabled={drawing || loading}>
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
                <FormControl fullWidth size="small" disabled={drawing || loading}>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.requireCover}
                    disabled={drawing || loading}
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
                  color: 'rgba(232, 236, 232, 0.85)',
                  '& .MuiFormControlLabel-label': { fontWeight: 600, fontSize: '0.9rem' },
                }}
              />
            </div>
          </div>

          <Button
            className="book-draw-btn"
            variant="contained"
            size="large"
            disabled={drawing || loading}
            onClick={() => void handleDraw()}
            startIcon={
              drawing || loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ShuffleIcon />
              )
            }
          >
            {loading ? 'Szukam w katalogu…' : drawing ? 'Losuję…' : drawn ? 'Losuj ponownie' : 'Losuj książkę'}
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
                <MenuBookOutlinedIcon sx={{ fontSize: 48, opacity: 0.45 }} />
                <Typography textAlign="center" sx={{ opacity: 0.75 }}>
                  Tu pojawi się wylosowana książka.
                </Typography>
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
                <CircularProgress size={36} sx={{ color: '#3d9b7a' }} />
                <Typography textAlign="center" sx={{ opacity: 0.75 }}>
                  Pobieram książki z Open Library…
                </Typography>
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
                initial={{ opacity: 0, scale: 0.9, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="book-ticket-body">
                  <div className="book-ticket-cover">
                    {drawn.cover ? (
                      <img src={drawn.cover} alt={`Okładka: ${drawn.title}`} />
                    ) : (
                      <div className="book-ticket-cover-fallback">
                        <MenuBookOutlinedIcon sx={{ fontSize: 40 }} />
                      </div>
                    )}
                  </div>

                  <div className="book-ticket-info">
                    <Typography className="book-ticket-title" component="h2">
                      {drawn.title}
                    </Typography>
                    <Typography className="book-ticket-author" component="p">
                      {drawn.author}
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 1.5 }}>
                      {drawn.year != null && (
                        <Chip size="small" label={String(drawn.year)} className="book-chip" />
                      )}
                      {drawn.rating != null && (
                        <Chip
                          size="small"
                          icon={<StarRoundedIcon />}
                          label={drawn.rating.toFixed(1)}
                          className="book-chip"
                        />
                      )}
                      {drawn.subjects?.slice(0, 3).map((subject) => (
                        <Chip key={subject} size="small" label={subject} className="book-chip" />
                      ))}
                    </Stack>

                    {drawn.openLibraryUrl && (
                      <Button
                        className="book-ol-link"
                        component="a"
                        href={drawn.openLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                      >
                        Open Library
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </Box>

        <Typography className="book-credit" component="p">
          Dane książek: Open Library (Internet Archive)
        </Typography>
      </Box>
    </Box>
  );
};

export default BookLosuje;
