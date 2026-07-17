export interface WatchlistMovie {
  id: string;
  userId: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  genreIds: number[];
  watched: boolean;
  createdAt: string;
  watchedAt: string | null;
}

export type WatchlistMovieInput = Omit<
  WatchlistMovie,
  'id' | 'createdAt' | 'watched' | 'watchedAt' | 'userId'
> & {
  userId: string;
};
