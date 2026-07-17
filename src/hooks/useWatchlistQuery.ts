import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as watchlistService from '../services/watchlistService';
import type { Movie } from '../types/Movie';
import type { WatchlistMovie } from '../types/WatchlistMovie';

export const watchlistKeys = {
  all: ['watchlist'] as const,
  list: (userId: string) => [...watchlistKeys.all, 'list', userId] as const,
};

export function useWatchlistQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid ?? '';

  const query = useQuery({
    queryKey: watchlistKeys.list(userId),
    queryFn: () => watchlistService.getUserWatchlist(userId),
    enabled: Boolean(userId),
  });

  const watchlist = query.data ?? [];

  const findByTmdbId = (tmdbId: number): WatchlistMovie | undefined =>
    watchlist.find((item) => item.tmdbId === tmdbId);

  const addMutation = useMutation({
    mutationFn: (movie: Movie) =>
      watchlistService.addToWatchlist(
        watchlistService.movieToWatchlistInput(movie, userId),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
  });

  const toggleWatchedMutation = useMutation({
    mutationFn: ({ entryId, watched }: { entryId: string; watched: boolean }) =>
      watchlistService.setWatchlistWatched(entryId, watched),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (entryId: string) => watchlistService.removeFromWatchlist(entryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
  });

  return {
    watchlist,
    loading: query.isLoading,
    error: query.error,
    findByTmdbId,
    addToWatchlist: addMutation.mutateAsync,
    adding: addMutation.isPending,
    toggleWatched: toggleWatchedMutation.mutateAsync,
    toggling: toggleWatchedMutation.isPending,
    removeFromWatchlist: removeMutation.mutateAsync,
    removing: removeMutation.isPending,
  };
}
