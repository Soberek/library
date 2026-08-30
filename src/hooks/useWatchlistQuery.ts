import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as watchlistService from '../services/watchlistService';
import type { Movie } from '../types/Movie';
import type { WatchlistMovie } from '../types/WatchlistMovie';
import { toast } from '../stores';

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
    mutationFn: ({ movie, watched = false }: { movie: Movie; watched?: boolean }) => {
      const input = watchlistService.movieToWatchlistInput(movie, userId);
      input.watched = watched;
      return watchlistService.addToWatchlist(input);
    },
    onSuccess: () => {
      toast.success('Film został dodany do watchlisty!');
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Nie udało się dodać filmu do watchlisty.');
    },
  });

  const toggleWatchedMutation = useMutation({
    mutationFn: ({ entryId, watched }: { entryId: string; watched: boolean }) =>
      watchlistService.setWatchlistWatched(entryId, watched),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Nie udało się zmienić statusu filmu.');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (entryId: string) => watchlistService.removeFromWatchlist(entryId),
    onSuccess: () => {
      toast.success('Film został usunięty z watchlisty.');
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Nie udało się usunąć filmu.');
    },
  });

  return {
    watchlist,
    loading: query.isLoading,
    error: query.error,
    findByTmdbId,
    addToWatchlist: (movie: Movie) => addMutation.mutateAsync({ movie, watched: false }),
    markAsWatched: (movie: Movie) => addMutation.mutateAsync({ movie, watched: true }),
    adding: addMutation.isPending,
    toggleWatched: toggleWatchedMutation.mutateAsync,
    toggling: toggleWatchedMutation.isPending,
    removeFromWatchlist: removeMutation.mutateAsync,
    removing: removeMutation.isPending,
  };
}

export default useWatchlistQuery;
