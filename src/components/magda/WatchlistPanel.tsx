import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import type { WatchlistMovie } from '../../types/WatchlistMovie';
import { posterUrl, releaseYear } from '../../services/tmdbService';

type WatchlistFilter = 'all' | 'todo' | 'watched';

interface WatchlistPanelProps {
  items: WatchlistMovie[];
  loading: boolean;
  onToggleWatched: (entryId: string, watched: boolean) => Promise<void>;
  onRemove: (entryId: string) => Promise<void>;
  busy?: boolean;
}

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  items,
  loading,
  onToggleWatched,
  onRemove,
  busy = false,
}) => {
  const [filter, setFilter] = useState<WatchlistFilter>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (filter === 'todo') return !item.watched;
    if (filter === 'watched') return item.watched;
    return true;
  });

  const todoCount = items.filter((i) => !i.watched).length;
  const watchedCount = items.filter((i) => i.watched).length;

  const handleToggle = async (item: WatchlistMovie) => {
    setPendingId(item.id);
    try {
      await onToggleWatched(item.id, !item.watched);
    } finally {
      setPendingId(null);
    }
  };

  const handleRemove = async (item: WatchlistMovie) => {
    setPendingId(item.id);
    try {
      await onRemove(item.id);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="magda-watchlist">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={1.5}
        mb={2}
      >
        <Box>
          <Typography className="magda-watchlist-title" component="h2">
            Watchlista
          </Typography>
          <Typography className="magda-watchlist-sub" component="p">
            {todoCount} do obejrzenia · {watchedCount} obejrzane
          </Typography>
        </Box>

        <Tabs
          value={filter}
          onChange={(_, value: WatchlistFilter) => setFilter(value)}
          className="magda-watchlist-tabs"
          variant="scrollable"
          scrollButtons={false}
        >
          <Tab value="all" label={`Wszystkie (${items.length})`} />
          <Tab value="todo" label={`Do obejrzenia (${todoCount})`} />
          <Tab value="watched" label={`Obejrzane (${watchedCount})`} />
        </Tabs>
      </Stack>

      {loading ? (
        <Box className="magda-watchlist-empty">
          <CircularProgress size={28} sx={{ color: '#f0b429' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box className="magda-watchlist-empty">
          <LocalMoviesOutlinedIcon sx={{ fontSize: 36, opacity: 0.45 }} />
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {items.length === 0
              ? 'Dodaj wylosowany film do watchlisty.'
              : 'Brak filmów w tej zakładce.'}
          </Typography>
        </Box>
      ) : (
        <ul className="magda-watchlist-grid">
          {filtered.map((item) => {
            const poster = posterUrl(item.posterPath, 'w342');
            const isBusy = busy || pendingId === item.id;

            return (
              <li
                key={item.id}
                className={`magda-watch-card${item.watched ? ' magda-watch-card--watched' : ''}`}
              >
                <div className="magda-watch-card-poster">
                  {poster ? (
                    <img src={poster} alt="" loading="lazy" />
                  ) : (
                    <div className="magda-watch-card-fallback">
                      <LocalMoviesOutlinedIcon fontSize="small" />
                    </div>
                  )}
                  {item.watched && (
                    <span className="magda-watch-badge">Obejrzane</span>
                  )}
                </div>

                <div className="magda-watch-card-body">
                  <Typography className="magda-watch-card-title" component="h3">
                    {item.title}
                  </Typography>
                  <Stack direction="row" gap={0.75} flexWrap="wrap" mt={0.75}>
                    <Chip
                      size="small"
                      label={releaseYear(item.releaseDate)}
                      className="magda-chip"
                    />
                    <Chip
                      size="small"
                      label={`${item.voteAverage.toFixed(1)}`}
                      className="magda-chip"
                    />
                  </Stack>

                  <Stack direction="row" gap={0.5} mt={1.25} alignItems="center">
                    <Button
                      size="small"
                      className="magda-watch-action"
                      disabled={isBusy}
                      onClick={() => void handleToggle(item)}
                      startIcon={
                        item.watched ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <CheckCircleOutlineIcon fontSize="small" />
                        )
                      }
                    >
                      {item.watched ? 'Cofnij' : 'Obejrzane'}
                    </Button>

                    <Tooltip title="Usuń z listy">
                      <span>
                        <IconButton
                          size="small"
                          disabled={isBusy}
                          onClick={() => void handleRemove(item)}
                          aria-label={`Usuń ${item.title}`}
                          sx={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                          {pendingId === item.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteOutlineIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default WatchlistPanel;
